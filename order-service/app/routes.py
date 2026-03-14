from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import httpx
import os

from app.database import get_db
from app.models import Order
from app.schemas import OrderCreate, OrderUpdate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8000")
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8001")


async def verify_user(user_id: str):
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            r = await client.get(f"{USER_SERVICE_URL}/users/{user_id}")
            if r.status_code == 404:
                raise HTTPException(status_code=400, detail=f"User {user_id} not found")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="User service unavailable")


async def verify_product(product_id: str):
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            r = await client.get(f"{PRODUCT_SERVICE_URL}/products/{product_id}")
            if r.status_code == 404:
                raise HTTPException(status_code=400, detail=f"Product {product_id} not found")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Product service unavailable")


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(payload: OrderCreate, db: AsyncSession = Depends(get_db)):
    await verify_user(payload.user_id)
    await verify_product(payload.product_id)
    order = Order(**payload.model_dump())
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order


@router.get("/", response_model=List[OrderResponse])
async def list_orders(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/user/{user_id}", response_model=List[OrderResponse])
async def get_orders_by_user(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.user_id == user_id))
    return result.scalars().all()


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(order_id: str, payload: OrderUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(order, field, value)
    await db.commit()
    await db.refresh(order)
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    await db.delete(order)
    await db.commit()
