import os
import asyncio
from aiogram import Router, F, Bot
from aiogram.types import Message
from aiogram.filters import Command

from ai_services import convert_pdf_to_jpg, run_deepseek_ocr, parse_ocr_text, analyze_job_with_llama, check_bki_by_inn
from credit_engine import MLCreditDecisionEngine

router = Router()
engine = MLCreditDecisionEngine()


@router.message(Command("start"))
async def cmd_start(message: Message):
    await message.answer(
        "👋 Отправьте заявление на кредит (PDF или Фото) для запуска двухфакторного скоринга (ML + DTI).")


@router.message(F.document | F.photo)
async def handle_document(message: Message, bot: Bot):
    status_msg = await message.answer("⏳ Скачиваю файл...")

    file_id = message.document.file_id if message.document else message.photo[-1].file_id
    file_name = message.document.file_name if message.document else "photo.jpg"
    file_ext = file_name.split('.')[-1].lower()

    file = await bot.get_file(file_id)
    download_path = f"temp_{message.from_user.id}.{file_ext}"
    jpg_path = f"target_{message.from_user.id}.jpg"

    await bot.download_file(file.file_path, download_path)

    try:
        if file_ext == "pdf":
            await status_msg.edit_text("🔄 Конвертирую PDF...")
            await asyncio.to_thread(convert_pdf_to_jpg, download_path, jpg_path)
        else:
            os.rename(download_path, jpg_path)

        await status_msg.edit_text("👁️ Распознаю текст (DeepSeek OCR)...")
        ocr_text = await asyncio.to_thread(run_deepseek_ocr, jpg_path)
        client_data = parse_ocr_text(ocr_text)

        await status_msg.edit_text(f"🧠 Анализ должности '{client_data['job_position']}'...")
        job_analysis = await asyncio.to_thread(analyze_job_with_llama, client_data['job_position'])
        client_data['role_level'] = job_analysis.get('role_level', 'medium')
        client_data['stability'] = job_analysis.get('stability', 'medium')

        await status_msg.edit_text(f"🏦 Проверка БКИ (ИНН: {client_data.get('inn', 'Нет')})...")
        bki_data = await asyncio.to_thread(check_bki_by_inn, client_data.get('inn'))

        await status_msg.edit_text("⚖️ Выполняю 2 проверки (ML-вероятность + DTI-нагрузка)...")
        decision = engine.evaluate(client_data, bki_data)

        icon = "✅" if decision['status'] == "ОДОБРЕНО" else "⚠️" if "ЧАСТИЧНО" in decision['status'] else "❌"

        # Переводим ставку из 0.26 в 26%
        rate_percent = int(decision.get('applied_rate', 0) * 100)

        # Считаем итоговую сумму с процентами: Платеж * Срок
        total_with_interest = decision['monthly_payment'] * client_data['term_months']

        response = (
            f"🔍 **РЕЗУЛЬТАТ СКОРИНГА** {icon}\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"**СТАТУС:** `{decision['status']}`\n\n"

            f"📊 **АНАЛИЗ РИСКОВ:**\n"
            f"┣ **Надежность (ML):** `{decision['ml_score']}%` \n"
            f"┗ **Лимит нагрузки:** {decision['dti_tier']}\n\n"

            f"💰 **ФИНАНСОВЫЕ УСЛОВИЯ:**\n"
            f"┣ **Ставка по кредиту:** `{rate_percent}%` годовых\n"
            f"┣ **Срок:** `{client_data['term_months']}` мес.\n"
            f"┣ **Одобрено (на руки):** `{decision['approved_amount']:,.0f}` **сом**\n"
            f"┣ **К возврату с %:** `{total_with_interest:,.0f}` **сом**\n"  # <--- НОВАЯ СТРОКА
            f"┗ **Ежемесячный платеж:** `{decision['monthly_payment']:,.0f}` **сом**\n\n"

            f"ℹ️ **ДЕТАЛИ:**\n"
            f"_{decision['reason']}_\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"👤 _Клиент: {client_data.get('job_position', 'Сотрудник')}, {client_data.get('age')} лет_"
        )
        await status_msg.edit_text(response, parse_mode="Markdown")

    except Exception as e:
        await status_msg.edit_text(f"❌ Ошибка: {e}")
    finally:
        if os.path.exists(download_path): os.remove(download_path)
        if os.path.exists(jpg_path): os.remove(jpg_path)