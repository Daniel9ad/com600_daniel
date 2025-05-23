import logging
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

# Configuración de logging
logger = logging.getLogger(__name__)

async def send_email(to_email: str, subject: str, html_content: str):
    """
    Envía un email con contenido HTML utilizando SMTP
    """
    # Crear mensaje
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = settings.EMAIL_FROM
    message["To"] = to_email
    
    # Agregar contenido HTML
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)
    
    try:
        # Crear conexión segura con el servidor SMTP
        context = ssl.create_default_context()
        print("email: ", settings.EMAIL_USERNAME)
        print("password: ", settings.EMAIL_PASSWORD)
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
            server.sendmail(
                settings.EMAIL_FROM,
                to_email,
                message.as_string()
            )
            
        logger.info(f"Email enviado a {to_email}")
        return True
    except Exception as e:
        logger.error(f"Error enviando email: {str(e)}")
        return False