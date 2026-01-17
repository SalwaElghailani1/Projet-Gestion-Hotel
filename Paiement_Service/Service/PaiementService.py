from Mapper.PaiementMapper import dto_to_entity, entity_to_dto
from DTO.RequestDtoPaiement import RequestDtoPaiement
from Repository.PaiementRepository import PaiementRepository
class PaiementService:
    def __init__(self, repository: PaiementRepository):
        self.repository = repository

    def effectuer_paiement(self, dto: RequestDtoPaiement):
        new_id = self.repository.collection.count_documents({}) + 1
        paiement = dto_to_entity(dto, new_id)

        # simulation paiement réussi
        paiement.statut = "VALIDE"

        self.repository.save(paiement)
        return entity_to_dto(paiement)

    def get_paiement(self, id: int):
        paiement = self.repository.find_by_id(id)
        return entity_to_dto(paiement) if paiement else None
