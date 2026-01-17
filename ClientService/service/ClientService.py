from Repository import ClientRepository
from DTO import RequestDtoClient
from Mapper.ClientMapper import dto_to_entity, entity_to_dto
from entity.Client import Client
from datetime import datetime


class ClientService:
    def __init__(self, repository: ClientRepository):
        self.repository = repository

    def add_client(self, dto: RequestDtoClient):
        """إضافة عميل جديد"""
        client = dto_to_entity(dto)
        self.repository.save(client)
        return entity_to_dto(client)

    def get_by_id(self, id):
        client = self.repository.find_by_id(id)
        if not client:
            raise Exception("Client not found")
        return entity_to_dto(client)

    def create_from_token(self, id, nom, prenom, email):
        if self.repository.find_by_id(id):
            raise Exception("Client already exists")

        client = Client(
            id=id,
            cni="NON-DEFINI",
            nom=nom,
            prenom=prenom,
            email=email,
            tel="",
            dateNaissance=None,
            age=0,
            photo_carte_identity=""
        )

        self.repository.save(client)
        return entity_to_dto(client)

    def get_client(self, id: int):
        client = self.repository.find_by_id(id)
        return entity_to_dto(client) if client else None

    def update_client(self, id: int, data: dict):
        client = self.repository.find_by_id(id)
        if not client:
            return None

        allowed_fields = [
            "nom",
            "prenom",
            "tel",
            "dateNaissance",
            "cni",
            "age",
            "photo_carte_identity"
        ]

        for field in allowed_fields:
            if field in data:
                if field == "dateNaissance" and data[field]:
                    client.dateNaissance = datetime.strptime(
                        data[field], "%Y-%m-%d"
                    ).date()
                else:
                    setattr(client, field, data[field])

        self.repository.save(client)
        return entity_to_dto(client)

    def delete_client(self, id: int):
        client = self.repository.find_by_id(id)
        if not client:
            return False
        self.repository.delete(id)
        return True
