import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
# from functools import lru_cache

load_dotenv()

class Settings(BaseSettings):
  PROJECT_NAME: str = "API"
  VERSION: str = "1.0.0"
  JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
  JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM")
  DB_HOST: str = os.getenv("DB_HOST")
  DB_PORT: int = int(os.getenv("DB_PORT"))
  DB_USERNAME: str = os.getenv("DB_USERNAME")
  DB_PASSWORD: str = os.getenv("DB_PASSWORD")
  DB_DATABASE: str = os.getenv("DB_DATABASE")
  # RabbitMQ
  RABBITMQ_HOST: str = os.getenv("RABBITMQ_HOST", "localhost")
  RABBITMQ_PORT: int = int(os.getenv("RABBITMQ_PORT", "5672"))
  RABBITMQ_USER: str = os.getenv("RABBITMQ_USER", "guest")
  RABBITMQ_PASSWORD: str = os.getenv("RABBITMQ_PASSWORD", "guest")
  RABBITMQ_QUEUE: str = os.getenv("RABBITMQ_QUEUE", "notifications")

settings = Settings()