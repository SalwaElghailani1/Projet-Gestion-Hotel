from typing import Optional
from datetime import datetime

class Paiement:
    def __init__(
            self,
            id: int,
            facture_id: int,
            montant: float,
            mode: str,          # carte, cash, paypal...
            statut: str,        # EN_COURS, VALIDE, ECHEC
            date_paiement: Optional[datetime] = None
    ):
        self.id = id
        self.facture_id = facture_id
        self.montant = montant
        self.mode = mode
        self.statut = statut
        self.date_paiement = date_paiement or datetime.utcnow()

    def to_dict(self):
        return {
            "id": self.id,
            "facture_id": self.facture_id,
            "montant": self.montant,
            "mode": self.mode,
            "statut": self.statut,
            "date_paiement": self.date_paiement
        }

    @staticmethod
    def from_dict(data: dict):
        return Paiement(
            id=data.get("id"),
            facture_id=data.get("facture_id"),
            montant=data.get("montant"),
            mode=data.get("mode"),
            statut=data.get("statut"),
            date_paiement=data.get("date_paiement")
        )
