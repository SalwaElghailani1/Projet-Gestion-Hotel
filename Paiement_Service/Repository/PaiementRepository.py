from Entity.Paiement import Paiement

class PaiementRepository:
    def __init__(self, db):
        self.collection = db["paiements"]

    def save(self, paiement: Paiement):
        self.collection.insert_one(paiement.to_dict())

    def find_by_id(self, id: int):
        data = self.collection.find_one({"id": id})
        return Paiement.from_dict(data) if data else None

    def update_status(self, id: int, statut: str):
        self.collection.update_one(
            {"id": id},
            {"$set": {"statut": statut}}
        )
