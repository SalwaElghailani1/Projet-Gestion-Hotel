from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from entity.Client import Client

class ClientRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    # ----------------- CRUD -----------------
    def save(self, client: Client):
        """إضافة عميل جديد أو تحديث موجود"""
        try:
            self.db_session.add(client)
            self.db_session.commit()
            return client
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise e

    def find_by_id(self, id: int):
        """جلب عميل حسب id"""
        try:
            return self.db_session.query(Client).filter_by(id=id).first()
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise e

    def update(self, id: int, client_data: dict):
        """تحديث بيانات العميل حسب id"""
        try:
            client = self.find_by_id(id)
            if client:
                for key, value in client_data.items():
                    setattr(client, key, value)
                self.db_session.commit()
            return client
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise e

    def delete(self, id: int):
        """حذف العميل حسب id"""
        try:
            client = self.find_by_id(id)
            if client:
                self.db_session.delete(client)
                self.db_session.commit()
            return client
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise e