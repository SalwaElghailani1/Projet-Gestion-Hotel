from entity.Client import Client
from DTO.RequestDtoClient import RequestDtoClient
from DTO.ResponseDtoClient import ResponseDtoClient
from datetime import datetime

def dto_to_entity(dto: RequestDtoClient) -> Client:
    return Client(
        cni=dto.cni,
        nom=dto.nom,
        prenom=dto.prenom,
        email=dto.email,
        tel=dto.tel if hasattr(dto, 'tel') else None,
        dateNaissance=datetime.strptime(dto.dateNaissance, "%Y-%m-%d").date() if dto.dateNaissance else None,
        age=dto.age,
        photo_carte_identity=dto.photo_carte_identity
    )

def entity_to_dto(entity: Client) -> ResponseDtoClient:
    return ResponseDtoClient(
        id=entity.id,
        cni=entity.cni,
        nom=entity.nom,
        prenom=entity.prenom,
        email=entity.email,
        tel=entity.tel,  # <-- AJOUTER
        dateNaissance=entity.dateNaissance,  # <-- AJOUTER
        age=entity.age,
        photo_carte_identity=entity.photo_carte_identity
    )
