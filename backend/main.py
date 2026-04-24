"""
backend/main.py

Vite proxy config:
  '/api' → target: 'http://localhost:8000', rewrite: strip '/api'

Значит фронт шлёт:  POST /api/chat
Vite перенаправляет: POST http://localhost:8000/chat
FastAPI слушает:     POST /chat  ✅

Поэтому prefix="/api" НЕ нужен — он был причиной 404.
"""
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from chat import router as chat_router

try:
    from scoring import router as scoring_router
    HAS_SCORING = True
except ImportError:
    HAS_SCORING = False

app = FastAPI(title="Кredиtоr API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# БЕЗ prefix — Vite уже убрал /api до того как запрос дошёл до FastAPI
app.include_router(chat_router)

if HAS_SCORING:
    app.include_router(scoring_router)


@app.get("/health")
def health():
    return {"status": "ok"}