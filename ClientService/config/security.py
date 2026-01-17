import jwt
from functools import wraps
from flask import request, g

PUBLIC_KEY_PATH = "keys/publickey.pem"
ALGORITHM = "RS256"

def load_public_key():
    with open(PUBLIC_KEY_PATH, "r") as f:
        return f.read()

PUBLIC_KEY = load_public_key()

def require_role(*allowed_roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"message": "Token manquant"}, 401

            token = auth_header.split(" ")[1]

            try:
                payload = jwt.decode(
                    token,
                    PUBLIC_KEY,
                    algorithms=[ALGORITHM]
                )

                # ⚠ Ici on sauvegarde le payload dans g.user
                g.user = payload

                roles = payload.get("roles", [])
                if not roles:
                    return {"message": "Aucun rôle trouvé dans le token"}, 403

                if not any(role in allowed_roles for role in roles):
                    return {
                        "message": "Accès refusé : rôle incorrect",
                        "roles_reçus": roles,
                        "roles_autorisés": allowed_roles
                    }, 403

            except jwt.ExpiredSignatureError:
                return {"message": "Token expiré"}, 401
            except jwt.InvalidTokenError as e:
                return {"message": f"Token invalide: {str(e)}"}, 401

            return func(*args, **kwargs)
        return wrapper
    return decorator
