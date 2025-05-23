import json
import logging
import aio_pika
import asyncio
from aio_pika.abc import AbstractIncomingMessage
from app.config import settings
from app.schemas.notification_schema import EmailNotification
from app.services.email_service import send_email

# Configuración de logging
logger = logging.getLogger(__name__)

async def process_message(message: AbstractIncomingMessage):
    """
    Procesa los mensajes recibidos de RabbitMQ y envía emails correspondientes
    """
    async with message.process():
        try:
            # Decodificar el mensaje
            message_body = message.body.decode()
            data = json.loads(message_body)
            
            logger.info(f"Mensaje recibido: {data}")
            
            # Crear objeto de notificación
            notification = EmailNotification(**data)
            
            # Generar contenido HTML del email
            html_content = generate_email_template(notification)
            
            # Enviar email
            await send_email(
                to_email=notification.email,
                subject=notification.subject,
                html_content=html_content
            )
            
            logger.info(f"Email enviado a {notification.email} para la compra {notification.purchase_id}")
            
        except Exception as e:
            logger.error(f"Error procesando mensaje: {str(e)}")
            # No reencolar el mensaje si hay error para evitar loops infinitos
            # En un sistema real, se implementaría una estrategia de reintentos o dead-letter queue

def generate_email_template(notification: EmailNotification) -> str:
    """
    Genera una plantilla HTML para el email de confirmación
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Confirmación de Compra</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4CAF50; color: white; padding: 10px; text-align: center; }}
            .content {{ padding: 20px; border: 1px solid #ddd; }}
            .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #777; }}
            .details {{ margin: 20px 0; }}
            .details table {{ width: 100%; border-collapse: collapse; }}
            .details table th, .details table td {{ padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Confirmación de Compra</h1>
            </div>
            <div class="content">
                <p>Estimado/a Cliente,</p>
                <p>¡Gracias por tu compra! Nos complace confirmarte que tu compra ha sido procesada correctamente.</p>
                
                <div class="details">
                    <h3>Detalles de la compra:</h3>
                    <table>
                        <tr>
                            <th>Evento:</th>
                            <td>{notification.event_name}</td>
                        </tr>
                        <tr>
                            <th>Cantidad:</th>
                            <td>{notification.quantity} entradas</td>
                        </tr>
                        <tr>
                            <th>Precio total:</th>
                            <td>${notification.total_price:.2f}</td>
                        </tr>
                        <tr>
                            <th>ID de compra:</th>
                            <td>{notification.purchase_id}</td>
                        </tr>
                    </table>
                </div>
                
                <p>Este email sirve como confirmación de tu compra. Guárdalo para futura referencia.</p>
                <p>Si tienes alguna pregunta sobre tu compra, no dudes en contactarnos.</p>
                
                <p>Saludos cordiales,<br>El equipo de Sistema de Eventos</p>
            </div>
        </div>
    </body>
    </html>
    """

async def start_consuming():
    """
    Inicia el consumo de mensajes desde RabbitMQ
    """
    # Establecer conexión con RabbitMQ
    connection = await aio_pika.connect_robust(
        host=settings.RABBITMQ_HOST,
        port=settings.RABBITMQ_PORT,
        login=settings.RABBITMQ_USER,
        password=settings.RABBITMQ_PASSWORD,
    )
    
    # Crear canal
    channel = await connection.channel()
    
    # Configurar prefetch_count para controlar la cantidad de mensajes procesados simultáneamente
    await channel.set_qos(prefetch_count=10)
    
    # Declarar cola
    queue = await channel.declare_queue(
        settings.RABBITMQ_QUEUE,
        durable=True
    )
    
    logger.info(f"Esperando mensajes en la cola '{settings.RABBITMQ_QUEUE}'...")
    
    # Empezar a consumir mensajes
    await queue.consume(process_message)
    
    try:
        # Mantener el servicio en ejecución
        while True:
            await asyncio.sleep(3600)  # Espera de 1 hora (para evitar finalización)
    finally:
        # Cerrar conexión cuando se detenga el servicio
        await connection.close()