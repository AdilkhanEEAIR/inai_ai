"""
backend/chat.py — Replicate + meta/meta-llama-3-70b-instruct
"""

import os
import re
import asyncio
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

REPLICATE_TOKEN = os.getenv("REPLICATE_API_TOKEN", "")

# Используем endpoint /v1/models/{owner}/{name}/predictions
# без фиксированного хеша — берёт последнюю версию
MODEL_OWNER = "meta"
MODEL_NAME  = "meta-llama-3-70b-instruct"

SYSTEM_PROMPT = (
    "Ты — финансовый консультант приложения Кredиtоr (Кыргызстан). "
    "Помогаешь пользователям в вопросах кредитования, финансовой грамотности и кредитного скоринга. "
    "Правила: отвечай на языке вопроса; валюта — сомы; не используй markdown (* ** # ~); "
    "списки через тире или нумерацию; максимум 4 абзаца; "
    "если вопрос не по финансам — вежливо откажи."
)


class ChatMessage(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


def build_prompt(messages: list[ChatMessage]) -> str:
    parts = [
        f"<|begin_of_text|>"
        f"<|start_header_id|>system<|end_header_id|>\n\n{SYSTEM_PROMPT}<|eot_id|>"
    ]
    for msg in messages:
        role = "user" if msg.role == "user" else "assistant"
        parts.append(
            f"<|start_header_id|>{role}<|end_header_id|>\n\n{msg.text}<|eot_id|>"
        )
    parts.append("<|start_header_id|>assistant<|end_header_id|>\n\n")
    return "".join(parts)


def clean_text(text: str) -> str:
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'\*(.+?)\*',     r'\1', text, flags=re.DOTALL)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'`{1,3}[^`]*`{1,3}', '', text)
    text = re.sub(r'<\|.*?\|>', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


async def poll_result(client: httpx.AsyncClient, get_url: str, headers: dict) -> str:
    for attempt in range(40):
        await asyncio.sleep(2)
        r = await client.get(get_url, headers=headers)
        data = r.json()
        status = data.get("status")
        print(f"   [{attempt+1}] {status}")

        if status == "succeeded":
            out = data.get("output", "")
            return "".join(out) if isinstance(out, list) else str(out)

        if status in ("failed", "canceled"):
            raise HTTPException(
                status_code=502,
                detail=f"Replicate: {data.get('error', 'failed')}"
            )

    raise HTTPException(status_code=504, detail="Timeout 80s")


@router.post("/chat")
async def chat(req: ChatRequest):
    if not REPLICATE_TOKEN:
        print("❌ REPLICATE_API_TOKEN не найден в .env")
        raise HTTPException(status_code=500, detail="REPLICATE_API_TOKEN не настроен")

    if not req.messages:
        raise HTTPException(status_code=400, detail="Пустой список сообщений")

    print(f"📨 Запрос ({len(req.messages)} сообщений): '{req.messages[-1].text[:60]}'")

    headers = {
        "Authorization": f"Bearer {REPLICATE_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "wait=60",
    }

    payload = {
        "input": {
            "prompt": build_prompt(req.messages),
            "max_new_tokens": 512,
            "temperature": 0.7,
            "top_p": 0.9,
            "stop_sequences": "<|eot_id|>",
        }
    }

    # /v1/models/{owner}/{name}/predictions — не требует version hash
    url = f"https://api.replicate.com/v1/models/{MODEL_OWNER}/{MODEL_NAME}/predictions"

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            r = await client.post(url, json=payload, headers=headers)

            print(f"🔁 Replicate статус: {r.status_code}")

            if r.status_code not in (200, 201):
                print(f"❌ Ошибка: {r.text[:400]}")
                raise HTTPException(
                    status_code=502,
                    detail=f"Replicate {r.status_code}: {r.text[:200]}"
                )

            data = r.json()
            status = data.get("status")
            output = data.get("output")

            # Prefer:wait сработал
            if status == "succeeded" and output is not None:
                text = "".join(output) if isinstance(output, list) else str(output)
                reply = clean_text(text)
                print(f"✅ Ответ: {reply[:80]}...")
                return {"reply": reply}

            # Polling
            get_url = data.get("urls", {}).get("get")
            if not get_url:
                raise HTTPException(status_code=502, detail="Нет URL для polling")

            print("⏳ Polling...")
            raw = await poll_result(client, get_url, headers)
            reply = clean_text(raw)
            print(f"✅ Ответ: {reply[:80]}...")
            return {"reply": reply}

    except httpx.TimeoutException:
        print("❌ Timeout")
        raise HTTPException(status_code=504, detail="Timeout")
    except httpx.RequestError as e:
        print(f"❌ Сеть: {e}")
        raise HTTPException(status_code=502, detail=str(e))