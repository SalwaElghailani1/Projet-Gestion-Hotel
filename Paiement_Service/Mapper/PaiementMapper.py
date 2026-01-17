from Entity.Paiement import Paiement
from DTO.RequestDtoPaiement import RequestDtoPaiement
from DTO.ResponseDtoPaiement import ResponseDtoPaiement

def dto_to_entity(dto: RequestDtoPaiement, new_id: int) -> Paiement:
    return Paiement(
        id=new_id,
        facture_id=dto.facture_id,
        montant=dto.montant,
        mode=dto.mode,
        statut="EN_COURS"
    )

def entity_to_dto(entity: Paiement) -> ResponseDtoPaiement:
    return ResponseDtoPaiement(
        id=entity.id,
        facture_id=entity.facture_id,
        montant=entity.montant,
        mode=entity.mode,
        statut=entity.statut,
        date_paiement=entity.date_paiement
    )
