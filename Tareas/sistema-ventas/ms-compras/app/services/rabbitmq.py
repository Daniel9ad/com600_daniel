import json
import aio_pika
from aio_pika.abc import AbstractConnection, AbstractChannel
from app.core.config import settings

# Variables globales para la conexión y el canal
connection: AbstractConnection = None
channel: AbstractChannel = None

async def init_rabbitmq():
    global connection, channel
    
    # Establecer conexión con RabbitMQ
    connection = await aio_pika.connect_robust(
        host=settings.RABBITMQ_HOST,
        port=settings.RABBITMQ_PORT,
        login=settings.RABBITMQ_USER,
        password=settings.RABBITMQ_PASSWORD,
    )
    
    # Crear canal
    channel = await connection.channel()
    
    # Declarar cola
    await channel.declare_queue(
        settings.RABBITMQ_QUEUE,
        durable=True
    )

async def close_rabbitmq():
    global connection
    
    if connection:
        await connection.close()

async def publish_message(message: dict):
    if not channel:
        await init_rabbitmq()
    
    # Publicar mensaje en la cola
    await channel.default_exchange.publish(
        aio_pika.Message(
            body=json.dumps(message).encode(),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT
        ),
        routing_key=settings.RABBITMQ_QUEUE
    )
