import os
import re
import json
import random
from typing import Dict, Any, Optional
from datetime import datetime
import fitz  # PyMuPDF
import replicate
import config

# Инициализация токена API
os.environ["REPLICATE_API_TOKEN"] = config.REPLICATE_API_TOKEN


def convert_pdf_to_jpg(pdf_path: str, jpg_path: str) -> None:
    """
    Конвертирует первую страницу PDF-файла в изображение формата JPG.
    Используется зум x2 для лучшего качества перед отправкой в OCR.
    """
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)

    matrix = fitz.Matrix(2, 2)
    pix = page.get_pixmap(matrix=matrix)

    pix.save(jpg_path)
    doc.close()


def parse_ocr_text(ocr_text: str) -> Dict[str, Any]:
    """
    Парсит сырой текст, полученный после OCR, и извлекает ключевые сущности
    через регулярные выражения.
    """
    # Дефолтные значения (возраст 21, чтобы не нарушать политику банка при ошибке парсинга)
    data = {
        "age": 21,
        "net_income": 0,
        "requested_amount": 0,
        "term_months": 12,
        "experience_years": 1.0,
        "job_position": "Сотрудник",
        "inn": None
    }

    text_clean = ocr_text.replace('\n', ' ')

    # Поиск ИНН — строго 14 цифр (формат Кыргызстана)
    inn_match = re.search(r'инн[:\s]+(\d{14})(?!\d)', text_clean, re.IGNORECASE)
    if inn_match:
        data["inn"] = inn_match.group(1)

    year_match = re.search(r'рождения.*?(\d{4})\s*г', text_clean, re.IGNORECASE)
    if year_match:
        current_year = datetime.now().year
        data["age"] = current_year - int(year_match.group(1))

    # Поиск стажа работы
    exp_match = re.search(r'стаж\s+составляет\s+(\d+)', text_clean, re.IGNORECASE)
    if exp_match:
        data["experience_years"] = float(exp_match.group(1))

    # Поиск дохода
    income_match = re.search(r'доход[^\d]{1,50}составляет\s+(\d[\d\s]*\d)', text_clean, re.IGNORECASE)
    if income_match:
        data["net_income"] = int(re.sub(r'\s+', '', income_match.group(1)))

    # Поиск запрашиваемой суммы кредита
    # Теперь ищем конкретно запрос кредита, отсекая ежемесячные платежи
    amount_match = re.search(r'кредит\s+в\s+размере\s+(\d[\d\s]*\d)', text_clean, re.IGNORECASE)
    if amount_match:
        data["requested_amount"] = int(re.sub(r'\s+', '', amount_match.group(1)))

    # Поиск срока кредита
    term_match = re.search(r'сроком\s+на\s+(\d+)', text_clean, re.IGNORECASE)
    if term_match:
        data["term_months"] = int(term_match.group(1))

    # Поиск должности
    pos_match = re.search(r'должности\s+([а-яА-Яa-zA-Z\s]+?)(?:,|\.|\sстаж)', text_clean, re.IGNORECASE)
    if pos_match:
        data["job_position"] = pos_match.group(1).strip()

    return data


def run_deepseek_ocr(image_path: str) -> str:
    """
    Отправляет изображение в модель DeepSeek OCR через Replicate API
    и возвращает распознанный сырой текст.
    """
    # Используем контекстный менеджер (with open) для безопасной работы с файлом
    with open(image_path, "rb") as file:
        output = replicate.run(
            "lucataco/deepseek-ocr:cb3b474fbfc56b1664c8c7841550bccecbe7b74c30e45ce938ffca1180b4dff5",
            input={"image": file}
        )
    return "".join(output)


def analyze_job_with_llama(job_position: str) -> Dict[str, str]:
    """
    Анализирует уровень должности и стабильность с помощью LLM (Llama-3).
    """
    if not job_position or job_position == "Сотрудник":
        return {"role_level": "medium", "stability": "medium"}

    prompt = (
        f'Оцени должность: "{job_position}". '
        f'Верни СТРОГО JSON: {{"role_level": "high/medium/low", "stability": "high/medium/low"}}'
    )

    try:
        output = replicate.run(
            "meta/meta-llama-3-8b-instruct",
            input={
                "prompt": prompt,
                "max_tokens": 50,
                "temperature": 0.1
            }
        )
        response_text = "".join(output).strip()
        # Очистка от возможных Markdown-тегов для безопасного парсинга JSON
        response_text = response_text.replace("```json", "").replace("```", "").strip()

        return json.loads(response_text)

    except Exception:
        # Fallback в случае ошибки API или невалидного ответа
        return {"role_level": "medium", "stability": "medium"}


def check_bki_by_inn(inn: str) -> dict:
    if not inn or len(inn) != 14:
        return {"past_due_30d": 0, "inquiries_6m": 0, "active_debts_payment": 0, "status": "no_data"}

    # Берем самую последнюю цифру ИНН для определения "судьбы" клиента
    last_digit = inn[-1]

    # ФЕЙКОВЫЙ ДАТАСЕТ (Mock-профили БКИ)
    if last_digit == '1':
        # 🟢 Идеальный клиент: кредитов нет, просрочек нет.
        return {"past_due_30d": 0, "inquiries_6m": 0, "active_debts_payment": 0, "status": "found"}

    elif last_digit == '2':
        # 🟡 Обычный клиент: есть небольшая кредитка, пару раз подавал заявки.
        return {"past_due_30d": 0, "inquiries_6m": 2, "active_debts_payment": 5000, "status": "found"}

    elif last_digit == '3':
        # 🟠 Закредитованный: платит исправно, но отдает огромную сумму по другим кредитам.
        return {"past_due_30d": 0, "inquiries_6m": 1, "active_debts_payment": 45000, "status": "found"}

    elif last_digit == '8':
        # 🔴 "Искатель" (Подозрение на мошенничество): просрочек нет, но 12 заявок в банки за полгода!
        return {"past_due_30d": 0, "inquiries_6m": 12, "active_debts_payment": 10000, "status": "found"}

    elif last_digit == '9':
        # ☠️ Злостный неплательщик (Дефолт): 2 текущие просрочки. ML должен отказать 100%.
        return {"past_due_30d": 2, "inquiries_6m": 5, "active_debts_payment": 30000, "status": "found"}

    else:
        # Для цифр 4, 5, 6, 7, 0 — легкий случайный фон (стандарт)
        import random
        return {
            "past_due_30d": 0,
            "inquiries_6m": random.randint(0, 2),
            "active_debts_payment": random.randint(0, 10000),
            "status": "found"
        }