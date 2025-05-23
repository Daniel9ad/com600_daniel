from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.db.database import Base

class PurchaseStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    CANCELED = "canceled"

class Compra(Base):
    __tablename__ = "compras"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    event_id = Column(Integer, index=True)
    event_name = Column(String)
    quantity = Column(Integer)
    total_price = Column(Float)
    status = Column(Enum(PurchaseStatus), default=PurchaseStatus.PENDING)
    purchase_date = Column(DateTime(timezone=True), server_default=func.now())
    payment_date = Column(DateTime(timezone=True), nullable=True)