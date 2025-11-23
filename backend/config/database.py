from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

# Connexion MongoDB
client = AsyncIOMotorClient(MONGO_URL)

# IMPORTANT : choisir explicitement la base (sinon erreur)
db = client["kbsstore"]
