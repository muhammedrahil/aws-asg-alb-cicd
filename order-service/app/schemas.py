from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models import OrderStatus


class OrderCreate(BaseModel):
    user_id: str
    product_id: str
    quantity: int = 1
    total_price: float


class OrderUpdate(BaseModel):
    quantity: Optional[int] = None
    total_price: Optional[float] = None
    status: Optional[OrderStatus] = None


class OrderResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    quantity: int
    total_price: float
    status: OrderStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
