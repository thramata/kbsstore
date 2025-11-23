from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
import shutil, os
from bson import ObjectId
from config.database import db
from security import decode_token
from fastapi import Request

router = APIRouter(prefix="/produits", tags=["produits"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def get_current_user_from_header(request: Request):
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

@router.post("/", summary="Create product (admin only)")
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    description: str = Form(""),
    image: UploadFile = File(None),
    request: Request = None
):
    current_user = await get_current_user_from_header(request)
    if not current_user or current_user.get("role") != "admin":
        raise HTTPException(403, "Admin only")
    image_url = None
    if image:
        file_location = f"{UPLOAD_DIR}/{image.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = file_location
    doc = {"name": name, "price": price, "description": description, "image": image_url}
    res = await db["produits"].insert_one(doc)
    return {"ok": True, "id": str(res.inserted_id)}

@router.get("/")
async def list_products():
    out = []
    cursor = db["produits"].find()
    async for p in cursor:
        p["_id"] = str(p["_id"])
        out.append(p)
    return out

@router.get("/{product_id}")
async def get_product(product_id: str):
    p = await db["produits"].find_one({"_id": ObjectId(product_id)})
    if not p:
        raise HTTPException(404, "Not found")
    p["_id"] = str(p["_id"])
    return p
