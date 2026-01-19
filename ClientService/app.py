# app.py
import os
from flask import Flask
from flask_restx import Api
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from entity.base import Base
from flask_cors import CORS

from entity.Client import Client
from controller.api import ns

# Eureka registration: automatic f import
import config.eureka_client

# Database connection
import os

DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_HOST = os.environ.get("DB_HOST", "mysql")
DB_PORT = os.environ.get("DB_PORT", "3306")
DB_NAME = os.environ.get("DB_NAME", "gestion_client")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# Flask app
app = Flask(__name__)

authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

api = Api(
    app,
    version="1.0",
    title="Client API",
    authorizations=authorizations,
    security='Bearer Auth'
)

api.add_namespace(ns, path="/clients")

CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

@app.route("/health")
def health():
    return "OK", 200


if __name__ == "__main__":
    # Kubernetes needs host=0.0.0.0
    app.run(host="0.0.0.0", port=int(os.environ.get("APP_PORT", 8088)))
