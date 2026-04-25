# Кredиtоr — AI кредитный скоринг

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![CatBoost](https://img.shields.io/badge/CatBoost-ML-FF6B35)](https://catboost.ai/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Кredиtоr** — это интеллектуальная платформа для кредитного скоринга, использующая машинное обучение (CatBoost), LLM для анализа должностей и DTI-правила для оценки кредитоспособности заёмщиков.

## 🚀 Возможности

| Фича | Описание |
|------|----------|
| 🤖 **Кредитный скоринг** | ML-модель CatBoost предсказывает вероятность дефолта (P-default) с точностью ROC-AUC 0.882 |
| 💬 **Чат-консультант** | AI-ассистент на базе Llama 3 от Replicate (70B) отвечает на финансовые вопросы |
| 📄 **Анализ документов** | OCR через DeepSeek распознаёт паспорта/справки (фото или PDF) и автоматически заполняет форму |
| 🌍 **7 языков** | Полная локализация: русский, английский, кыргызский, немецкий, французский, китайский, арабский |
| 🏦 **Интеграция с БКИ** | Фейковое БКИ по ИНН возвращает реалистичные скоринговые профили (просрочки, запросы, долговая нагрузка) |
| 📊 **Анализ должности** | Llama 3 анализирует должность клиента и определяет уровень стабильности (high/medium/low) |
| 💰 **DTI-лимиты** | Динамические лимиты долговой нагрузки в зависимости от дохода, стажа и просрочек |
| 🎨 **Анимированный UI** | Современный дизайн с частицами, видеофоном, анимированными градиентными рамками и адаптивом под мобильные |

## 🧠 Технологии

### Фронтенд
- React 18 + TypeScript
- Vite
- SCSS модули
- Zustand (управление состоянием)
- React Router DOM
- i18next (интернационализация)

### Бэкенд
- FastAPI (Python 3.10+)
- CatBoost (ML модель)
- Replicate API (Llama 3 70B + DeepSeek OCR)
- PyMuPDF (конвертация PDF)
- Асинхронная обработка




## 🛠️ Установка и запуск

### Требования
- Node.js 18+
- Python 3.10+
- npm или yarn

### 1. Клонирование репозитория

```bash
git clone https://github.com/AdilkhanEEAIR/inai_ai
cd inai-ai
```

### 2. Настройка API-ключей. 

# ⚠️ ВАЖНО: Настройка API ключей (2 файла .env)

Для успешного запуска бэкенда необходимо создать **ДВА** файла `.env` в разных папках.

---

## 📁 Файл №1: `backend/bot_tg/.env`

В папке `bot_tg` и `backend` создайте по одному файлу .env, затем внутри создайте файл `.env` со следующим содержимым:

```env внутри папки bot_tg:
TELEGRAM_TOKEN=8572187967:AAF3VXfFbXP5e_k8kK9jWSnln9owQCoEaLI
REPLICATE_API_TOKEN=r8_JZnbF2RdRZnD1v9iY19cacBVpVhjjPv3P7qWO
```

```env внутри папки backend:
REPLICATE_API_TOKEN = r8_JZnbF2RdRZnD1v9iY19cacBVpVhjjPv3P7qWO
```


### 3. # 🚀 Запуск проекта: бэкенд + фронтенд

### Запуск бекенда
# 1. Перейти в папку backend
cd backend

# 2. Создать виртуальное окружение
python -m venv venv

# 3. Активировать виртуальное окружение
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Установить основные зависимости бэкенда
pip install -r requirements.txt

# 5. Перейти в папку bot_tg и установить зависимости
cd bot_tg
pip install -r requirements.txt

# 6. Вернуться в папку backend
cd ..

# 7. Запустить сервер
uvicorn main:app --reload --port 8000

### Запуск фронтенда:
# 1. Открыть новый терминал (не закрывая бэкенд)

# 2. Перейти в папку frontend
cd frontend

# 3. Установить зависимости
npm install

# 4. Запустить dev-сервер
npm run dev


✅ Фронтенд запустится на http://localhost:5173
