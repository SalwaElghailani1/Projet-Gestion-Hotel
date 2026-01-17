from flask import Flask, request
from flask_restx import Namespace, Resource, fields, Api
from service.ClientService import ClientService
from Repository.ClientRepository import ClientRepository
from DTO.RequestDtoClient import RequestDtoClient
from Mapper.ClientMapper import dto_to_entity, entity_to_dto
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from entity.Client import Client
from config.security import require_role
from flask import g

# ----------------- App & DB Config -----------------
app = Flask(__name__)

DATABASE_URL = "mysql+pymysql://root:@localhost:3306/gestion_client"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db_session = SessionLocal()

repository = ClientRepository(db_session)
client_service = ClientService(repository)

# ----------------- Swagger JWT Security -----------------
authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "JWT Token. Format: 'Bearer <token>'"
    }
}

api = Api(
    app,
    version="1.0",
    title="Client API",
    description="API gestion des clients",
    authorizations=authorizations,
    security='Bearer Auth'
)

# ----------------- Namespace -----------------
ns = Namespace('clients', description='Opérations sur les clients')
api.add_namespace(ns, path='/clients')

# ----------------- Swagger Model -----------------
client_model = ns.model('Client', {
    'id': fields.Integer(readOnly=True),
    'cni': fields.String(required=True),
    'nom': fields.String(required=True),
    'prenom': fields.String(required=True),
    'email': fields.String(required=True),
    'tel': fields.String(),
    'dateNaissance': fields.Date(),
    'age': fields.Integer(),
    'photo_carte_identity': fields.String(),
    'reservation_ids': fields.List(fields.Integer)
})
# health check
@app.route("/health")
def health():
    return "UP", 200

# ----------------- Routes -----------------
@ns.route('/')
class ClientList(Resource):

    @require_role("ADMIN")
    @require_role("RECEPTIONNISTE")
    @ns.marshal_list_with(client_model)
    @ns.doc(security='Bearer Auth')
    def get(self):
        print("DEBUG g.user:", g.user)
        clients_entities = db_session.query(Client).all()
        clients = [entity_to_dto(c).to_dict() for c in clients_entities]
        return clients

    @ns.expect(client_model)
    @ns.marshal_with(client_model, code=201)
    @ns.doc(security=[])
    def post(self):
        data = request.json
        dto = RequestDtoClient(**data)
        client = client_service.add_client(dto)
        return client.to_dict(), 201

@ns.route('/me')
class ClientMe(Resource):

    @require_role("CLIENT")
    @ns.marshal_with(client_model)
    def get(self):
        user = g.user
        client_id = user["userId"]
        nom = user.get("nom", "Inconnu")
        prenom = user.get("prenom", "Inconnu")
        email = user.get("email")

        try:
            client_dto = client_service.get_by_id(client_id)
        except Exception:
            client_dto = client_service.create_from_token(client_id, nom, prenom, email)

        return client_dto.to_dict()

@ns.route('/update')
class ClientUpdate(Resource):

    @require_role("CLIENT")
    @ns.expect(client_model)
    @ns.marshal_with(client_model)
    def put(self):
        user = g.user
        client_id = user["userId"]
        data = request.json
        updated_client = client_service.update_client(client_id, data)
        if not updated_client:
            ns.abort(404, "Client non trouvé")
        return updated_client.to_dict()

@ns.route('/<int:id>')
class ClientById(Resource):

    @require_role("ADMIN", "CLIENT", "RECEPTIONNISTE")
    @ns.marshal_with(client_model)
    @ns.doc(security='Bearer Auth')
    def get(self, id):
        client = client_service.get_by_id(id)
        if not client:
            ns.abort(404, "Client non trouvé")
        client_dto = entity_to_dto(client)
        return client_dto.to_dict()

# ----------------- Main -----------------
if __name__ == "__main__":
    app.run(debug=True, port=8088)
