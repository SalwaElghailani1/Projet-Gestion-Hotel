from flask import Flask, request
from flask_restx import Api, Resource, fields

from db import paiements_collection
from DTO.RequestDtoPaiement import RequestDtoPaiement
from Service.PaiementService import PaiementService
from Repository.PaiementRepository import PaiementRepository
from config.security import require_role
from flask_cors import CORS
from config.eureka_client import eureka_client

try:
    import eureka_client
except Exception as e:
    print("⚠️ Eureka not started:", e)
# ================= Flask App =================
app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# ================= Swagger Security =================
authorizations = {
    "BearerAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization",
        "description": "Entrer: Bearer <JWT>"
    }
}

api = Api(
    app,
    title="Paiement API",
    version="1.0",
    description="Microservice de gestion des paiements",
    authorizations=authorizations,
    security="BearerAuth"
)

ns = api.namespace("paiements", description="Gestion des paiements")

# ================= Swagger Model =================
paiement_model = api.model("Paiement", {
    "id": fields.Integer,
    "facture_id": fields.Integer(required=True),
    "montant": fields.Float(required=True),
    "mode": fields.String(required=True),
    "statut": fields.String
})

# ================= Service =================
repo = PaiementRepository(paiements_collection.database)
service = PaiementService(repo)
@app.route("/health")
def health():
    return "UP", 200
# ================= Endpoints =================

@ns.route("/")
class PaiementList(Resource):

    @ns.expect(paiement_model)
    @ns.marshal_with(paiement_model)
    @ns.doc(security="BearerAuth")
    @require_role("CLIENT")
    def post(self):
        """
        Effectuer un paiement (CLIENT uniquement)
        """
        dto = RequestDtoPaiement.from_dict(request.json)
        return service.effectuer_paiement(dto).to_dict()


@ns.route("/<int:id>")
class PaiementResource(Resource):

    @ns.marshal_with(paiement_model)
    @ns.doc(security="BearerAuth")
    @require_role("CLIENT")
    def get(self, id):
        """
        Consulter un paiement par ID (CLIENT uniquement)
        """
        paiement = service.get_paiement(id)
        if paiement:
            return paiement.to_dict()
        api.abort(404, "Paiement non trouvé")


# ================= Run =================
if __name__ == "__main__":
    #start_eureka()
    app.run(debug=True, port=8090)
