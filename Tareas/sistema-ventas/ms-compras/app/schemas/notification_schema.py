from pydantic import BaseModel

class NotificationMessage(BaseModel):
    email: str
    subject: str
    message: str
    purchase_id: int
    event_name: str
    quantity: int
    total_price: float