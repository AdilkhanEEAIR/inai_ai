import os
import numpy as np
import pandas as pd
from catboost import CatBoostClassifier
from typing import Dict, Any, Tuple


class MLCreditDecisionEngine:
    """
    Движок принятия решений по кредитному скорингу.
    Объединяет ML-модель CatBoost и бизнес-правила (DTI, возраст).
    """

    def __init__(self, model_path: str = "catboost_final.cbm", base_rate_annual: float = 0.18):
        self.base_rate_annual = base_rate_annual
        self.target_threshold = 0.4544

        # Загрузка обученной модели CatBoost
        if os.path.exists(model_path):
            self.model = CatBoostClassifier()
            self.model.load_model(model_path)
        else:
            raise FileNotFoundError(f"Файл {model_path} не найден! Поместите его в корень проекта.")

    def _get_dynamic_rate(self, months: int) -> float:
        """Ступенчатая система: чем дольше срок, тем выше ставка"""
        if months <= 12:
            return 0.18  # 18% до 1 года
        elif months <= 24:
            return 0.22  # 22% до 2 лет
        elif months <= 36:
            return 0.26  # 26% до 3 лет
        else:
            return 0.30  # 30% свыше 3 лет

    def calculate_annuity(self, amount: float, months: int, annual_rate: float) -> float:
        """Рассчитывает аннуитетный ежемесячный платеж."""
        if amount <= 0 or months <= 0: return 0.0
        monthly_rate = annual_rate / 12
        return amount * (monthly_rate * (1 + monthly_rate) ** months) / ((1 + monthly_rate) ** months - 1)

    def _extract_features(self, client_data, bki_data, current_rate):
        return [
            0.0,  
            float(client_data.get('age', 21)),
            float(client_data.get('net_income', 0)),
            float(client_data.get('experience_years', 0)),
            float(client_data.get('requested_amount', 0)),
            float(client_data.get('term_months', 12)),
            float(current_rate * 100),
            float(bki_data.get('past_due_30d', 0)),
            float(bki_data.get('inquiries_6m', 0))
        ]

    def predict(self, client_data: Dict[str, Any], bki_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # 1. Получаем текущую ставку
            current_rate = self.get_current_interest_rate()
            # 2. Формируем список признаков СТРОГО по порядку
            features = [
                float(client_data.get('age', 21)),
                float(client_data.get('net_income', 0)),
                float(client_data.get('experience_years', 0)),
                float(client_data.get('requested_amount', 0)),
                float(client_data.get('term_months', 12)),
                float(current_rate * 100),  
                float(bki_data.get('past_due_30d', 0)),
                float(bki_data.get('inquiries_6m', 0))
            ]
            
            # 3. название колонок
            feature_names = [
                "age", "monthly_income", "employment_years",
                "loan_amount", "loan_term_months", "interest_rate",
                "past_due_30d", "inquiries_6m"
            ]

            # 4. Передаем данные модели (через имена колонок)
            import pandas as pd
            X_input = pd.DataFrame([features], columns=feature_names)

            # Предсказание само
            prob = self.model.predict_proba(X_input)[0][1]

            # Логика решения (порог 0.45)
            is_approved = prob < 0.4544

            # Ограничение по DTI
            dti_limit = self._calculate_dti_limit(client_data)
            if client_data.get('requested_amount', 0) > dti_limit:
                is_approved = False

            return {
                "is_approved": is_approved,
                "probability": float(prob),
                "limit": dti_limit,
                "rate": current_rate
            }

        except Exception as e:
            print(f"❌ Ошибка в движке: {e}")
            return {"is_approved": False, "error": str(e)}

    def _calculate_dti_limit(self, client_data: Dict[str, Any], bki_data: Dict[str, Any]) -> Tuple[float, str]:
        """Определяет максимально допустимую долговую нагрузку (DTI)."""
        income = client_data.get('net_income', 0)
        exp = client_data.get('experience_years', 0)
        stability = client_data.get('stability', 'medium')
        past_due = bki_data.get('past_due_30d', 0)

        if past_due > 0: return 0.30, "🔴 30% (Штраф за просрочки)"
        if income >= 200000 and exp >= 5.0: return 0.70, "🔴 70% (VIP уровень)"
        if income >= 100000 and stability == 'high' and exp >= 3.0: return 0.60, "🟠 60% (Высокий доход)"
        if income >= 60000 and stability in ['medium', 'high'] and exp >= 1.0: return 0.50, "🟡 50% (Средний плюс)"

        return 0.40, "🟢 40% (Стандарт)"

    def evaluate(self, client_data: dict, bki_data: dict) -> dict:
        # Определение базовых параметров для возврата при отказе
        term = client_data.get('term_months', 12)
        current_rate = self._get_dynamic_rate(term)

        # --- БЛОК ХАРД-СТОПОВ (Бизнес-правила) ---

        # 1. Проверка на просрочки
        if bki_data.get('past_due_30d', 0) > 0:
            return {
                "status": "ОТКАЗ",
                "dti_tier": "Risk",
                "ml_score": 0,
                "approved_amount": 0,
                "monthly_payment": 0,  # ДОБАВЛЕНО, чтобы не было ошибки KeyError
                "applied_rate": current_rate,
                "reason": "🔴 ОТКАЗ: Наличие активных просрочек. Банк требует идеальной дисциплины."
            }

        # 2. Проверка на количество кредитов
        active_loans = bki_data.get('active_loans_count', 0)
        if active_loans > 3:
            return {
                "status": "ОТКАЗ",
                "dti_tier": "Overloan",
                "ml_score": 0,
                "approved_amount": 0,
                "monthly_payment": 0,  # ДОБАВЛЕНО
                "applied_rate": current_rate,
                "reason": f"🔴 ОТКАЗ: У вас уже {active_loans} активных кредитов. Риск перекредитованности."
            }

        # 3. Анти-фрод: Несоответствие должности и дохода
        income = client_data.get('net_income', 0)
        job = client_data.get('position', '').lower()
        if 'уборщик' in job and income > 100000:
            return {
                "status": "ОТКАЗ",
                "dti_tier": "Fraud Risk",
                "ml_score": 0,
                "approved_amount": 0,
                "monthly_payment": 0,  # ДОБАВЛЕНО
                "applied_rate": current_rate,
                "reason": "🔴 ОТКАЗ: Несоответствие уровня дохода указанной должности (Compliance Risk)."
            }

        # 4. Хард-стоп: возраст
        if client_data.get('age', 0) < 21:
            return {
                "status": "ОТКАЗ",
                "dti_tier": "Age Risk",
                "ml_score": 0,
                "approved_amount": 0,
                "monthly_payment": 0,
                "applied_rate": 0,
                "reason": "Возраст менее 21 года."
            }

        # --- ДАЛЕЕ ТВОЙ РАБОЧИЙ ML КОД ---
        # (Оставляем как есть, там все ключи на месте)

        dti_limit, dti_tier = self._calculate_dti_limit(client_data, bki_data)
        features = self._extract_features(client_data, bki_data, current_rate)
        feature_names = ["credit_id", "age", "monthly_income", "employment_years", "loan_amount", "loan_term_months",
                         "interest_rate", "past_due_30d", "inquiries_6m"]

        X_input = pd.DataFrame([features], columns=feature_names)
        probs = self.model.predict_proba(X_input)[0]
        p_default = probs[1]

        ml_score = round((1 - p_default) * 100, 2)
        ml_passed = p_default < self.target_threshold

        active_debts = bki_data.get('active_debts_payment', 0)
        req_amount = client_data.get('requested_amount', 0)
        max_total_payment = income * dti_limit
        max_allowed_for_new_loan = max_total_payment - active_debts
        requested_payment = self.calculate_annuity(req_amount, term, current_rate)

        dti_passed = requested_payment <= max_allowed_for_new_loan

        if not ml_passed:
            return {
                "status": "ОТКАЗ", "dti_tier": dti_tier, "ml_score": ml_score,
                "approved_amount": 0, "monthly_payment": 0, "applied_rate": current_rate,
                "reason": f"Низкий ML-скоринг ({ml_score}). Риск дефолта слишком высок."
            }

        if dti_passed:
            return {
                "status": "ОДОБРЕНО", "dti_tier": dti_tier, "ml_score": ml_score,
                "approved_amount": req_amount, "monthly_payment": requested_payment,
                "applied_rate": current_rate, "reason": "Все проверки пройдены."
            }

        if max_allowed_for_new_loan <= 0:
            return {
                "status": "ОТКАЗ", "dti_tier": dti_tier, "ml_score": ml_score,
                "approved_amount": 0, "monthly_payment": 0, "applied_rate": current_rate,
                "reason": "Превышена долговая нагрузка (нет свободных средств)."
            }

        # Частичное одобрение
        monthly_rate = current_rate / 12
        num = ((1 + monthly_rate) ** term) - 1
        den = monthly_rate * ((1 + monthly_rate) ** term)
        safe_amount = max_allowed_for_new_loan * (num / den)
        safe_amount = int(safe_amount // 1000) * 1000

        return {
            "status": "ЧАСТИЧНО ОДОБРЕНО", "dti_tier": dti_tier, "ml_score": ml_score,
            "approved_amount": safe_amount, "monthly_payment": max_allowed_for_new_loan,
            "applied_rate": current_rate, "reason": f"Сумма снижена по лимиту DTI ({int(dti_limit * 100)}%)."
        }