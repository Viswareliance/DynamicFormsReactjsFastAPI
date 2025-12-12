from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="Gateway Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCT_SERVICE = "http://localhost:8001"
ORDER_SERVICE = "http://localhost:8002"


# ---------------------- PRODUCTS ----------------------
@app.get("/products")
async def get_products():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{PRODUCT_SERVICE}/products")
        return res.json()


@app.post("/products")
async def create_product(product: dict):
    async with httpx.AsyncClient() as client:
        res = await client.post(f"{PRODUCT_SERVICE}/products", json=product)
        return res.json()


# ---------------------- ORDERS ----------------------
@app.get("/orders")
async def get_orders():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{ORDER_SERVICE}/order")
        return res.json()


@app.post("/orders")
async def create_order(order: dict):
    async with httpx.AsyncClient() as client:
        res = await client.post(f"{ORDER_SERVICE}/order", json=order)
        return res.json()


@app.get("/")
def root():
    return {"message": "Gateway Running"}
