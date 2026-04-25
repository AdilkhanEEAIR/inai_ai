import os
from dotenv import load_dotenv

# Загружаем переменные из .env файла
load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")

if not TELEGRAM_TOKEN or not REPLICATE_API_TOKEN:
    raise ValueError("❌ ОШИБКА: Убедитесь, что TELEGRAM_TOKEN и REPLICATE_API_TOKEN указаны в файле .env")