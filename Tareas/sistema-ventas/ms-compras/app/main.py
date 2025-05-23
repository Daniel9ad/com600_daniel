from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.schemas.response_schema import ResponseSchema
from app.db.database import sessionmanager, Base
from app.api.v1 import router as api_router
from app.services.rabbitmq import init_rabbitmq, close_rabbitmq

@asynccontextmanager
async def lifespan(app: FastAPI):
  """Function that handles startup and shutdown events."""
  if sessionmanager._engine is not None:
    async with sessionmanager._engine.begin() as conn:
      # Ejecuta la creación de tablas
      await conn.run_sync(Base.metadata.create_all)
  yield
  if sessionmanager._engine is not None:
    await sessionmanager.close()

app = FastAPI(
  title=settings.PROJECT_NAME,
  version=settings.VERSION,
  lifespan=lifespan,
  docs_url="/docs",
  redoc_url="/redoc",
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Eventos de inicio y cierre
@app.on_event("startup")
async def startup_event():
  # Inicializar RabbitMQ
  await init_rabbitmq()

@app.on_event("shutdown")
async def shutdown_event():
  # Cerrar conexión con RabbitMQ
  await close_rabbitmq()

@app.get("/", status_code=200, response_model=ResponseSchema)
async def read_root() -> ResponseSchema:
  return ResponseSchema(
    status=True,
    status_code=200,
    message="MS-COMPRAS",
    data={}
  )

app.include_router(api_router, prefix="/api/v1")