from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from controller.api import ns
from config.eureka_client import start_eureka

app = Flask(__name__)

authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

api = Api(
    app,
    version="1.0",
    title="Client API",
    authorizations=authorizations,
    security='Bearer Auth'
)

api.add_namespace(ns, path="/clients")

CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

@app.route("/health")
def health():
    return "UP", 200

if __name__ == "__main__":

    start_eureka()
    app.run(debug=True, host="0.0.0.0", port=8088)
