class ResponseDtoPaiement:
    def __init__(self, id: int, facture_id: int, montant: float, mode: str, statut: str, date_paiement):
        self.id = id
        self.facture_id = facture_id
        self.montant = montant
        self.mode = mode
        self.statut = statut
        self.date_paiement = date_paiement

    def to_dict(self):
        return self.__dict__
