from pymongo import MongoClient
import os

# Use environment variables from Deployment
MONGO_HOST = os.environ.get("DB_HOST", "mongodb")  # 'mongodb' service name f K8s
MONGO_PORT = int(os.environ.get("DB_PORT", 27017))

MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/"

client = MongoClient(MONGO_URI)

# Database
db = client["payment_db"]

# Collection
paiements_collection = db["paiements"]
