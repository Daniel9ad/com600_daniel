import asyncio
import logging
# from app.config import settings
from app.services.rabbitmq_consumer import start_consuming

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

async def main():
    logger.info("Iniciando servicio de notificaciones...")
    await start_consuming()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Servicio de notificaciones detenido")