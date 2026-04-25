"""
backend/main.py

FastAPI — кредитный скоринг + Gemini/Replicate чат.

Структура проекта:
  backend/
    main.py               ← этот файл
    chat.py               ← Replicate чат-бот
    scoring_router.py     ← CatBoost скоринг
    bot_tg/
      credit_engine.py    ← движок ML + DTI
      ai_services.py      ← OCR, BKI, LLM
      catboost_final.cbm  ← обученная модель
      config.py
      handlers.py
      bot.py

Vite proxy:
  /api/* → http://localhost:8000/*  (strip /api)
  Фронт шлёт POST /api/predict → FastAPI слушает POST /predict ✅
  Фронт шлёт POST /api/chat    → FastAPI слушает POST /chat    ✅
"""

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Чат-роутер (Replicate LLM)
from chat import router as chat_router

# Скоринг-роутер (CatBoost + DTI)
from scoring_router import router as scoring_router

app = FastAPI(title="Кredиtоr API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# БЕЗ prefix — Vite уже убрал /api
app.include_router(chat_router)
app.include_router(scoring_router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "services": ["chat", "scoring"],
    }