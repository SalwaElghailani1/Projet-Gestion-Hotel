from flask import Flask
from flask_restx import Api
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from entity.base import Base
import os
from flask_cors import CORS

from entity.Client import Client
from controller.api import ns  # Routes dyalek

# Connection string corrected for XAMPP MySQL
DATABASE_URL = "mysql+pymysql://root:root@mysql:3306/gestion_client"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

app = Flask(__name__)


api = Api(app, version="1.0", title="Client API", description="API gestion des clients")
api.add_namespace(ns, path='/clients')
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})
@app.route("/health")
def health():
    return "OK", 200

# other routes...

if __name__ == "__main__":
    # Bind 0.0.0.0 bach Kubernetes y9dr yreach container
    app.run(host="0.0.0.0", port=int(os.environ.get("APP_PORT", 8088)))