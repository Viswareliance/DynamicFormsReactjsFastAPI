from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Product Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- Model --------
class Product(BaseModel):
    id: int
    name: str
    price: float
    category_id: int


# -------- Fake DB --------
products_db = [
    {"id": 1, "name": "Laptop", "price": 75000.0, "category_id": 10},
    {"id": 2, "name": "Phone", "price": 25000.0, "category_id": 11},
]


# -------- Routes --------
@app.get("/products")
async def get_products():
    return products_db


@app.get("/products/{product_id}")
async def get_product(product_id: int):
    for p in products_db:
        if p["id"] == product_id:
            return p
    raise HTTPException(status_code=404, detail="Product not found")


@app.post("/products")
async def create_product(product: Product):
    products_db.append(product.dict())
    return {"message": "Product added", "product": product}


@app.get("/")
def root():
    return {"message": "Product Service Running"}
