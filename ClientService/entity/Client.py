from sqlalchemy import Column, Integer, Date, String
from entity.base import Base

class Client(Base):
    __tablename__ = 'clients'
    id = Column(Integer, primary_key=True)
    cni = Column(String(50))
    tel = Column(String(20))
    dateNaissance = Column(Date)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    age = Column(Integer)
    photo_carte_identity = Column(String(255), nullable=True)
