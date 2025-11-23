from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
import os, uuid, logging, hmac, hashlib
import requests
from bson import ObjectId
from config.database import db
from security import decode_token

router = APIRouter(prefix="/paiements", tags=["paiements"])

PAYTECH_API_KEY = os.getenv("PAYTECH_API_KEY", "")
PAYTECH_API_SECRET = os.getenv("PAYTECH_API_SECRET", "")
PAYTECH_IPN_URL = os.getenv("PAYTECH_IPN_URL", "")
FRONTEND_SUCCESS_URL = os.getenv("FRONTEND_SUCCESS_URL", "http://localhost:3000/success")
FRONTEND_CANCEL_URL = os.getenv("FRONTEND_CANCEL_URL", "http://localhost:3000/cancel")
PAYTECH_REQUEST_URL = os.getenv("PAYTECH_REQUEST_URL", "https://paytech.sn/api/payment/request-payment")

logger = logging.getLogger("paiements")
logging.basicConfig(level=logging.INFO)

class PaymentRequest(BaseModel):
    items: list
    amount: int

async def get_user_from_header(request: Request):
    auth = request.headers.get("authorization") or request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return None
    token = auth.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        return None
    email = payload.get("sub")
    user = await db["utilisateurs"].find_one({"email": email})
    return user

@router.post("/create")
async def create_payment(data: PaymentRequest, request: Request):
    user = await get_user_from_header(request)
    if not user:
        raise HTTPException(401, "Login required")
    if not data.items:
        raise HTTPException(400, "Empty cart")
    # simple verification and create order
    total = 0
    cleaned = []
    for it in data.items:
        pid = it.get("product_id")
        qty = int(it.get("quantity") or 0)
        if not pid or qty <= 0:
            raise HTTPException(400, "Invalid item")
        try:
            prod = await db["produits"].find_one({"_id": ObjectId(pid)})
        except:
            raise HTTPException(400, "Invalid product id")
        if not prod:
            raise HTTPException(404, "Product not found")
        price = int(prod.get("price") or 0)
        total += price * qty
        cleaned.append({"product_id": pid, "name": prod["name"], "price": price, "quantity": qty})
    if total != int(data.amount):
        raise HTTPException(400, "Amount mismatch")
    ref = str(uuid.uuid4())
    order = {"user": user["email"], "ref": ref, "items": cleaned, "amount": total, "status": "pending"}
    res = await db["orders"].insert_one(order)
    order_id = str(res.inserted_id)
    payload = {"item_name": "KBS Order", "item_price": total, "ref_command": ref, "currency": "XOF", "success_url": FRONTEND_SUCCESS_URL, "cancel_url": FRONTEND_CANCEL_URL, "ipn_url": PAYTECH_IPN_URL}
    headers = {"API_KEY": PAYTECH_API_KEY, "API_SECRET": PAYTECH_API_SECRET}
    try:
        resp = requests.post(PAYTECH_REQUEST_URL, json=payload, headers=headers, timeout=10)
    except Exception as e:
        await db["orders"].update_one({"_id": ObjectId(order_id)}, {"$set": {"status":"error","error":str(e)}})
        raise HTTPException(502, "PayTech error")
    if resp.status_code != 200:
        await db["orders"].update_one({"_id": ObjectId(order_id)}, {"$set": {"status":"error","paytech_response": resp.text}})
        raise HTTPException(502, "PayTech error")
    data_resp = resp.json()
    payment_url = data_resp.get("payment_url") or data_resp.get("redirect_url") or data_resp.get("url")
    await db["orders"].update_one({"_id": ObjectId(order_id)}, {"$set": {"payment_url": payment_url, "paytech_response": data_resp}})
    return {"ok": True, "payment_url": payment_url, "order_id": order_id}
