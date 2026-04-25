"""
backend/chat.py — Replicate + meta/meta-llama-3-70b-instruct

Этот модуль отвечает за обработку запросов к чат-боту.
Использует модель Llama 3 70B от Meta через Replicate API.
"""

import os
import re
import asyncio
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Создаём роутер для регистрации эндпоинтов в основном приложении FastAPI
router = APIRouter()

# Загружаем API-токен Replicate из переменных окружения (.env файл)
REPLICATE_TOKEN = os.getenv("REPLICATE_API_TOKEN", "")

# Параметры модели: владелец "meta", модель "meta-llama-3-70b-instruct"
# Используем endpoint без фиксированного хеша — берётся последняя версия
MODEL_OWNER = "meta"
MODEL_NAME  = "meta-llama-3-70b-instruct"

# Системный промпт — задаёт роль, правила поведения и ограничения для ИИ
# Все ответы должны быть на языке вопроса, валюта — сомы, без markdown-разметки
SYSTEM_PROMPT = (
    "Ты — финансовый консультант приложения Кredиtоr (Кыргызстан). "
    "Помогаешь пользователям в вопросах кредитования, финансовой грамотности и кредитного скоринга. "
    "Правила: отвечай на языке вопроса; валюта — сомы; не используй markdown (* ** # ~); "
    "списки через тире или нумерацию; максимум 4 абзаца; "
    "если вопрос не по финансам — вежливо откажи."
)


# ─── Pydantic модели для валидации запросов и ответов ─────────

class ChatMessage(BaseModel):
    """Одно сообщение в чате: либо от пользователя, либо от ассистента"""
    role: str   # 'user' или 'assistant'
    text: str


class ChatRequest(BaseModel):
    """Структура запроса к чат-боту: список сообщений (история диалога)"""
    messages: list[ChatMessage]


# ─── Вспомогательные функции ───────────────────────────────────

def build_prompt(messages: list[ChatMessage]) -> str:
    """
    Собирает промпт для Llama 3 в правильном формате.
    Llama 3 ожидает специальные токены: <|begin_of_text|>, <|start_header_id|>, <|eot_id|>
    Формат: system → user → assistant → user → assistant ...
    
    Аргументы:
        messages: список сообщений из запроса
        
    Возвращает:
        строку с полным промптом для отправки в модель
    """
    # Начинаем с системного промпта (роль и правила бота)
    parts = [
        f"<|begin_of_text|>"
        f"<|start_header_id|>system<|end_header_id|>\n\n{SYSTEM_PROMPT}<|eot_id|>"
    ]
    
    # Добавляем историю диалога (чередование user и assistant)
    for msg in messages:
        # Преобразуем role: 'user' → 'user', 'bot' → 'assistant'
        role = "user" if msg.role == "user" else "assistant"
        parts.append(
            f"<|start_header_id|>{role}<|end_header_id|>\n\n{msg.text}<|eot_id|>"
        )
    
    # Завершаем промпт, указывая, что следующий ответ должен быть от assistant
    parts.append("<|start_header_id|>assistant<|end_header_id|>\n\n")
    
    return "".join(parts)


def clean_text(text: str) -> str:
    """
    Очищает текст ответа от markdown-разметки и лишних символов.
    Llama 3 иногда выдаёт **жирный текст**, *курсив*, # заголовки, `код`.
    Удаляем всё это, оставляя только чистый текст.
    
    Аргументы:
        text: сырой текст от модели
        
    Возвращает:
        очищенный текст без markdown
    """
    # Удаляем **жирный текст** → жирный текст
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text, flags=re.DOTALL)
    
    # Удаляем *курсив* → курсив
    text = re.sub(r'\*(.+?)\*', r'\1', text, flags=re.DOTALL)
    
    # Удаляем markdown-заголовки (# Заголовок → Заголовок)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    
    # Удаляем блоки кода `code` → пусто
    text = re.sub(r'`{1,3}[^`]*`{1,3}', '', text)
    
    # Удаляем оставшиеся специальные токены Llama (если вдруг просочились)
    text = re.sub(r'<\|.*?\|>', '', text)
    
    # Заменяем 3 и более переносов строк на 2 (нормализуем отступы)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Удаляем лишние пробелы в начале и конце
    return text.strip()


async def poll_result(client: httpx.AsyncClient, get_url: str, headers: dict) -> str:
    """
    Опрашивает Replicate API для получения результата асинхронной генерации.
    Replicate возвращает статус 'processing', 'succeeded', 'failed'.
    Функция опрашивает каждые 2 секунды, пока не получит успешный результат.
    
    Аргументы:
        client: HTTP клиент (httpx.AsyncClient)
        get_url: URL для получения статуса предсказания
        headers: заголовки с Authorization Bearer токеном
        
    Возвращает:
        строку с сгенерированным ответом
        
    Исключения:
        HTTPException 502 — если предсказание провалилось
        HTTPException 504 — если превышено время ожидания (80 секунд)
    """
    # Максимум 40 попыток × 2 секунды = 80 секунд ожидания
    for attempt in range(40):
        await asyncio.sleep(2)  # Ждём 2 секунды перед каждым опросом
        
        # Запрашиваем статус
        r = await client.get(get_url, headers=headers)
        data = r.json()
        status = data.get("status")
        print(f"   [{attempt+1}] {status}")

        # Если готово — возвращаем результат
        if status == "succeeded":
            out = data.get("output", "")
            # Результат может быть списком строк или одной строкой
            return "".join(out) if isinstance(out, list) else str(out)

        # Если ошибка или отмена — выбрасываем исключение
        if status in ("failed", "canceled"):
            raise HTTPException(
                status_code=502,
                detail=f"Replicate: {data.get('error', 'failed')}"
            )

    # Таймаут — 80 секунд истекло
    raise HTTPException(status_code=504, detail="Timeout 80s")


# ─── Основной эндпоинт чат-бота ───────────────────────────────

@router.post("/chat")
async def chat(req: ChatRequest):
    """
    POST /chat — основной эндпоинт для общения с AI-консультантом.
    
    Принимает JSON с историей сообщений, отправляет запрос в Replicate API,
    дожидается ответа от Llama 3 70B и возвращает очищенный ответ.
    
    Аргументы:
        req: ChatRequest с полем messages (история диалога)
        
    Возвращает:
        JSON вида {'reply': 'текст ответа'}
        
    Исключения:
        HTTPException 400 — пустой список сообщений
        HTTPException 500 — не настроен REPLICATE_API_TOKEN
        HTTPException 502 — ошибка Replicate API
        HTTPException 504 — таймаут ожидания ответа
    """
    
    # Проверяем, что API токен установлен в .env
    if not REPLICATE_TOKEN:
        print("❌ REPLICATE_API_TOKEN не найден в .env")
        raise HTTPException(status_code=500, detail="REPLICATE_API_TOKEN не настроен")

    # Проверяем, что есть хотя бы одно сообщение
    if not req.messages:
        raise HTTPException(status_code=400, detail="Пустой список сообщений")

    # Логируем входящий запрос (последнее сообщение пользователя)
    print(f"📨 Запрос ({len(req.messages)} сообщений): '{req.messages[-1].text[:60]}'")

    # Заголовки для запроса к Replicate
    # Prefer: wait=60 — просим Replicate подождать до 60 секунд перед ответом
    # Если модель успеет за 60 секунд — получим ответ сразу, иначе идём в polling
    headers = {
        "Authorization": f"Bearer {REPLICATE_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "wait=60",
    }

    # Полезная нагрузка для Replicate API
    payload = {
        "input": {
            "prompt": build_prompt(req.messages),   # Собранный промпт в формате Llama 3
            "max_new_tokens": 512,                  # Максимум новых токенов в ответе
            "temperature": 0.7,                     # Креативность (0.7 — сбалансировано)
            "top_p": 0.9,                           # Сэмплирование ядра (разнообразие)
            "stop_sequences": "<|eot_id|>",        # Стоп-последовательность — конец ответа
        }
    }

    # URL для создания предсказания (без указания версии — берётся последняя)
    url = f"https://api.replicate.com/v1/models/{MODEL_OWNER}/{MODEL_NAME}/predictions"

    try:
        # Отправляем асинхронный запрос к Replicate (таймаут 90 секунд)
        async with httpx.AsyncClient(timeout=90.0) as client:
            r = await client.post(url, json=payload, headers=headers)

            print(f"🔁 Replicate статус: {r.status_code}")

            # Проверяем, что запрос успешно принят (200 OK или 201 Created)
            if r.status_code not in (200, 201):
                print(f"❌ Ошибка: {r.text[:400]}")
                raise HTTPException(
                    status_code=502,
                    detail=f"Replicate {r.status_code}: {r.text[:200]}"
                )

            # Парсим ответ
            data = r.json()
            status = data.get("status")
            output = data.get("output")

            # ── Случай 1: уже готовый ответ (Prefer:wait сработал) ──
            if status == "succeeded" and output is not None:
                text = "".join(output) if isinstance(output, list) else str(output)
                reply = clean_text(text)  # Очищаем от markdown
                print(f"✅ Ответ: {reply[:80]}...")
                return {"reply": reply}

            # ── Случай 2: ответ ещё генерируется → идём в polling ──
            get_url = data.get("urls", {}).get("get")
            if not get_url:
                raise HTTPException(status_code=502, detail="Нет URL для polling")

            print("⏳ Polling...")
            raw = await poll_result(client, get_url, headers)
            reply = clean_text(raw)
            print(f"✅ Ответ: {reply[:80]}...")
            return {"reply": reply}

    # ── Обработка ошибок ─────────────────────────────────────────
    except httpx.TimeoutException:
        # Таймаут HTTP-клиента
        print("❌ Timeout")
        raise HTTPException(status_code=504, detail="Timeout")
        
    except httpx.RequestError as e:
        # Ошибка сети (DNS, соединение и т.д.)
        print(f"❌ Сеть: {e}")
        raise HTTPException(status_code=502, detail=str(e))