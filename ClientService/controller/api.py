from flask import request, g
from flask_restx import Namespace, Resource, fields
from service.ClientService import ClientService
from Repository.ClientRepository import ClientRepository
from DTO.RequestDtoClient import RequestDtoClient
from Mapper.ClientMapper import entity_to_dto
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from entity.Client import Client
from config.security import require_role

# ----------------- DB Config -----------------
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/gestion_client"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db_session = SessionLocal()

repository = ClientRepository(db_session)
client_service = ClientService(repository)

# ----------------- Namespace -----------------
ns = Namespace('clients', description='Opérations sur les clients')

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

# ----------------- Routes -----------------
@ns.route('/')
class ClientList(Resource):

    @require_role("ADMIN")
    @require_role("RECEPTIONNISTE")
    @ns.marshal_list_with(client_model)
    def get(self):
        print("DEBUG g.user:", g.user)
        clients_entities = db_session.query(Client).all()
        return [entity_to_dto(c).to_dict() for c in clients_entities]

    @ns.expect(client_model)
    @ns.marshal_with(client_model, code=201)
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
            client_dto = client_service.create_from_token(
                client_id, nom, prenom, email
            )

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
    def get(self, id):
        client = client_service.get_by_id(id)
        if not client:
            ns.abort(404, "Client non trouvé")

        return entity_to_dto(client).to_dict()
