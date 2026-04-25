import asyncio
from aiogram import Bot, Dispatcher
import config
from handlers import router


async def main():
    print("🤖 Запуск Telegram бота...")

    # Инициализация бота
    bot = Bot(token=config.TELEGRAM_TOKEN)
    dp = Dispatcher()

    # Подключаем наши обработчики из handlers.py
    dp.include_router(router)

    # Удаляем вебхуки и начинаем поллинг (опрос серверов Telegram)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())