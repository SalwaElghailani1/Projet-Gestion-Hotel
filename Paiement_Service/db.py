from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"

client = MongoClient(MONGO_URI)

# Database
db = client["payment_db"]

# Collection
paiements_collection = db["paiements"]
