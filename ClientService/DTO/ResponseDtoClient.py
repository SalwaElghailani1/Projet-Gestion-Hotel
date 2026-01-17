from typing import Optional, List

class ResponseDtoClient:
    def __init__(self, id: int, cni: str, nom: str, prenom: str, email: str,
                 tel: Optional[str] = None,  # <-- AJOUTER
                 dateNaissance: Optional[str] = None,  # <-- AJOUTER (string pour JSON)
                 age: Optional[int] = None, photo_carte_identity: Optional[str] = None,
                 reservation_ids: Optional[List[int]] = None):
        self.id = id
        self.cni = cni
        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.tel = tel  # <-- AJOUTER
        self.dateNaissance = dateNaissance  # <-- AJOUTER
        self.age = age
        self.photo_carte_identity = photo_carte_identity
        self.reservation_ids = reservation_ids or []  # relation avec les réservations

    def to_dict(self):
        return {
            "id": self.id,
            "cni": self.cni,
            "nom": self.nom,
            "prenom": self.prenom,
            "email": self.email,
            "tel": self.tel,  # <-- AJOUTER
            "dateNaissance": self.dateNaissance,  # <-- AJOUTER
            "age": self.age,
            "photo_carte_identity": self.photo_carte_identity,
            "reservation_ids": self.reservation_ids,
        }
