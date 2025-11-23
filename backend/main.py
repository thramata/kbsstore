from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="KBS Store Backend")

origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
from routes.auth import router as auth_router
from routes.produits import router as produits_router
from routes.paiements import router as paiements_router

app.include_router(auth_router)
app.include_router(produits_router)
app.include_router(paiements_router)

@app.get("/")
def root():
    return {"ok": True, "msg": "KBS Store backend running"}
