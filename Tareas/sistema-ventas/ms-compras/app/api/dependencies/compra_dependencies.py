from fastapi import Depends
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db_session
from app.services.compra_service import CompraService

async def get_compra_service(
  db_session: Annotated[AsyncSession, Depends(get_db_session)]
) -> CompraService:
  return CompraService(db_session)