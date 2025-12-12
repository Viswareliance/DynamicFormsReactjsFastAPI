from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Order Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- Model --------
class Order(BaseModel):
    id: int
    customer_id: int
    product_ids: List[int]
    total_amount: float


# -------- Fake DB --------
orders_db = [
    {"id": 100, "customer_id": 1, "product_ids": [1, 2], "total_amount": 100000.0},
    {"id": 101, "customer_id": 2, "product_ids": [2], "total_amount": 25000.0},
]


# -------- Routes --------
@app.get("/order")
async def get_orders():
    return orders_db


@app.get("/order/{order_id}")
async def get_order(order_id: int):
    for order in orders_db:
        if order["id"] == order_id:
            return order
    raise HTTPException(status_code=404, detail="Order not found")


@app.post("/order")
async def create_order(order: Order):
    orders_db.append(order.dict())
    return {"message": "Order created", "order": order}


@app.get("/")
def root():
    return {"message": "Order Service Running"}
