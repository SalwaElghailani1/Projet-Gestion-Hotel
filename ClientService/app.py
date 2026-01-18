from flask import Flask
from flask_restx import Api
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from entity.base import Base

from flask_cors import CORS

from entity.Client import Client
from controller.api import ns  # Routes dyalek

# Connection string corrected for XAMPP MySQL
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/gestion_client"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

app = Flask(__name__)


api = Api(app, version="1.0", title="Client API", description="API gestion des clients")
api.add_namespace(ns, path='/clients')
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})
if __name__ == "__main__":
    app.run(debug=True, port=8088)