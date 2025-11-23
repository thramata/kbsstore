from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from config.database import db
from security import hash_password, verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterForm(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(form: OAuth2PasswordRequestForm = Depends()):
    email = form.username
    password = form.password
    existing = await db["utilisateurs"].find_one({"email": email})
    if existing:
        raise HTTPException(400, "Email exists")
    hashed = hash_password(password)
    user = {"email": email, "password": hashed, "role": "client"}
    await db["utilisateurs"].insert_one(user)
    return {"ok": True, "msg": "User created"}

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    email = form.username
    password = form.password
    user = await db["utilisateurs"].find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(400, "Invalid credentials")
    token = create_access_token(user["email"])
    # remove password before returning user
    user_safe = {k:v for k,v in user.items() if k != "password"}
    user_safe["_id"] = str(user_safe.get("_id", ""))
    return {"access_token": token, "token_type": "bearer", "user": user_safe}
