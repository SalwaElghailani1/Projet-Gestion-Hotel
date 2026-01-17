class RequestDtoPaiement:
    def __init__(self, facture_id: int, montant: float, mode: str):
        self.facture_id = facture_id
        self.montant = montant
        self.mode = mode

    @staticmethod
    def from_dict(data: dict):
        return RequestDtoPaiement(
            facture_id=data.get("facture_id"),
            montant=data.get("montant"),
            mode=data.get("mode")
        )
