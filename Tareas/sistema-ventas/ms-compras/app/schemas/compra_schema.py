from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.db.models.compra_model import PurchaseStatus

# Schema base con campos comunes
class CompraBase(BaseModel):
    user_id: str
    event_id: int
    event_name: str
    quantity: int
    total_price: float
    status: Optional[PurchaseStatus] = PurchaseStatus.PENDING
    payment_date: Optional[datetime] = None

# Schema para crear una compra (sin id)
class CompraCreate(CompraBase):
    purchase_date: Optional[datetime] = None

# Schema para actualizar una compra (sin id, todos los campos opcionales)
class CompraUpdate(BaseModel):
    user_id: Optional[str] = None
    event_id: Optional[int] = None
    event_name: Optional[str] = None
    quantity: Optional[int] = None
    total_price: Optional[float] = None
    status: Optional[PurchaseStatus] = None
    payment_date: Optional[datetime] = None

# Schema completo para respuestas (con id)
class CompraSchema(CompraBase):
    id: int
    purchase_date: datetime
    
    class Config:
        from_attributes = True

# Schema para actualizar solo el estado
class PurchaseUpdate(BaseModel):
    status: PurchaseStatus