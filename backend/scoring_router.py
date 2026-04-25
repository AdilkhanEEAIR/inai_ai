"""
backend/scoring_router.py

FastAPI роутер для кредитного скоринга.
Принимает данные с фронта (Scoring.tsx → /api/predict),
прогоняет через CatBoost + DTI движок (credit_engine.py),
возвращает результат в формате который ожидает ResultPanel.
"""

import sys
import os
import tempfile
import asyncio

# Загружаем .env файл из папки bot_tg
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), "bot_tg", ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

# Добавляем папку bot_tg в путь, чтобы импортировать credit_engine и ai_services
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "bot_tg"))

from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Устанавливаем токены для replicate из переменных окружения
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN", "")
if REPLICATE_API_TOKEN:
    os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_TOKEN


# Ленивая инициализация движка (грузим модель один раз при старте)
_engine = None

def get_engine():
    global _engine
    if _engine is None:
        from credit_engine import MLCreditDecisionEngine
        model_path = os.path.join(os.path.dirname(__file__), "bot_tg", "catboost_final.cbm")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Модель не найдена: {model_path}")
        _engine = MLCreditDecisionEngine(model_path=model_path)
    return _engine


# ─── Схема запроса (то что шлёт Scoring.tsx) ─────────────────
class ScoringRequest(BaseModel):
    # Данные из формы фронта
    age: int
    monthly_income: float
    employment_years: float
    loan_amount: float
    loan_term_months: int = 24
    interest_rate: float = 25.0
    past_due_30d: int = 0
    inquiries_6m: int = 1
    down_payment: float = 0.0

    # Дополнительные поля которые передаёт фронт (если есть)
    inn: Optional[str] = None
    position: Optional[str] = None


def map_status_to_risk(status: str, p_default: float) -> str:
    """Переводит статус движка в risk_level для фронта."""
    if status == "ОДОБРЕНО":
        return "low"
    elif "ЧАСТИЧНО" in status:
        return "medium"
    else:
        if p_default < 0.45:
            return "medium"
        return "high"


def get_top_factors(client_data: dict, bki_data: dict) -> list:
    """Формирует топ-факторы влияния для отображения на фронте."""
    factors = []

    income = client_data.get("net_income", 0)
    exp = client_data.get("experience_years", 0)
    amount = client_data.get("requested_amount", 0)
    past_due = bki_data.get("past_due_30d", 0)
    inquiries = bki_data.get("inquiries_6m", 0)
    active_debts = bki_data.get("active_debts_payment", 0)

    if past_due > 0:
        factors.append({"name": "Просрочки 30+ дней", "contribution": 0.45 * past_due})

    if inquiries > 3:
        factors.append({"name": "Запросы в кредитное бюро", "contribution": 0.08 * inquiries})
    elif inquiries > 0:
        factors.append({"name": "Запросы в кредитное бюро", "contribution": 0.03 * inquiries})

    if income >= 100000:
        factors.append({"name": "Высокий доход", "contribution": -0.18})
    elif income >= 50000:
        factors.append({"name": "Доход", "contribution": -0.08})
    else:
        factors.append({"name": "Низкий доход", "contribution": 0.12})

    if exp >= 5:
        factors.append({"name": "Большой стаж работы", "contribution": -0.14})
    elif exp >= 1:
        factors.append({"name": "Стаж работы", "contribution": -0.06})
    else:
        factors.append({"name": "Малый стаж", "contribution": 0.10})

    ratio = amount / max(income, 1)
    if ratio > 30:
        factors.append({"name": "Высокая сумма кредита", "contribution": 0.16})
    elif ratio > 15:
        factors.append({"name": "Сумма кредита", "contribution": 0.07})

    if active_debts > 0:
        debt_ratio = active_debts / max(income, 1)
        if debt_ratio > 0.4:
            factors.append({"name": "Высокая долговая нагрузка", "contribution": 0.20})
        else:
            factors.append({"name": "Текущие кредитные обязательства", "contribution": 0.08})

    factors.sort(key=lambda x: abs(x["contribution"]), reverse=True)
    return factors[:5]


@router.post("/predict")
async def predict(req: ScoringRequest):
    try:
        engine = get_engine()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))

    client_data = {
        "age": req.age,
        "net_income": req.monthly_income,
        "experience_years": req.employment_years,
        "requested_amount": req.loan_amount,
        "term_months": req.loan_term_months,
        "position": req.position or "Сотрудник",
        "inn": req.inn,
    }

    bki_data = {
        "past_due_30d": req.past_due_30d,
        "inquiries_6m": req.inquiries_6m,
        "active_debts_payment": 0,
        "status": "no_data"
    }

    # Проверка по ИНН (если есть и длиной 14)
    if req.inn and len(req.inn) == 14:
        try:
            from ai_services import check_bki_by_inn
            bki_data = await asyncio.to_thread(check_bki_by_inn, req.inn)
        except Exception:
            pass

    # Анализ должности через LLM (если не дефолтная)
    if req.position and req.position != "Сотрудник":
        try:
            from ai_services import analyze_job_with_llama
            job_info = await asyncio.to_thread(analyze_job_with_llama, req.position)
            client_data["role_level"] = job_info.get("role_level", "medium")
            client_data["stability"] = job_info.get("stability", "medium")
        except Exception:
            client_data["role_level"] = "medium"
            client_data["stability"] = "medium"
    else:
        client_data["role_level"] = "medium"
        client_data["stability"] = "medium"

    try:
        decision = await asyncio.to_thread(engine.evaluate, client_data, bki_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка движка: {str(e)}")

    ml_score = decision.get("ml_score", 50.0)
    p_default = round(1.0 - ml_score / 100.0, 4)
    p_default = max(0.01, min(0.99, p_default))

    status = decision.get("status", "ОТКАЗ")
    risk_level = map_status_to_risk(status, p_default)

    rate = decision.get("applied_rate", 0.25)
    recommended_rate = round(rate * 100, 1)

    top_factors = get_top_factors(client_data, bki_data)

    approved = decision.get("approved_amount", 0)
    max_loan = int(approved) if approved > 0 else int(req.loan_amount * (1 - p_default))

    return {
        "p_default": p_default,
        "risk_level": risk_level,
        "decision_ru": status,
        "maxLoanAmount": max_loan,
        "recommendedRate": recommended_rate,
        "top_factors": top_factors,
        "metrics": {
            "roc_auc": 0.882,
            "pr_auc": 0.794,
            "accuracy": 0.847,
        },
        "status": status,
        "dti_tier": decision.get("dti_tier", "—"),
        "ml_score": ml_score,
        "monthly_payment": decision.get("monthly_payment", 0),
        "approved_amount": decision.get("approved_amount", 0),
        "reason": decision.get("reason", ""),
    }


# ─── Анализ документа (фото/PDF) с OCR и скорингом ───────────
@router.post("/analyze-document")
async def analyze_document(file: UploadFile = File(...)):
    """
    Принимает PDF или изображение, распознаёт текст через DeepSeek OCR,
    парсит данные и возвращает результат скоринга.
    """
    from ai_services import convert_pdf_to_jpg, run_deepseek_ocr, parse_ocr_text, analyze_job_with_llama, check_bki_by_inn
    
    filename = file.filename or "file"
    ext = filename.split('.')[-1].lower() if '.' in filename else 'jpg'
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    jpg_path = None
    try:
        if ext == 'pdf':
            jpg_path = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg").name
            convert_pdf_to_jpg(tmp_path, jpg_path)
            image_path = jpg_path
        else:
            image_path = tmp_path
        
        ocr_text = run_deepseek_ocr(image_path)
        client_data = parse_ocr_text(ocr_text)
        
        job_position = client_data.get('job_position', 'Сотрудник')
        job_analysis = analyze_job_with_llama(job_position)
        client_data['role_level'] = job_analysis.get('role_level', 'medium')
        client_data['stability'] = job_analysis.get('stability', 'medium')
        
        inn = client_data.get('inn')
        if inn and len(str(inn)) == 14:
            bki_data = check_bki_by_inn(str(inn))
        else:
            bki_data = {
                "past_due_30d": 0,
                "inquiries_6m": 0,
                "active_debts_payment": 0,
                "status": "no_data"
            }
        
        engine = get_engine()
        decision = engine.evaluate(client_data, bki_data)
        
        return {
            "client_data": client_data,
            "bki_data": bki_data,
            "decision": decision
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки документа: {str(e)}")
        
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        if jpg_path and os.path.exists(jpg_path):
            os.remove(jpg_path)