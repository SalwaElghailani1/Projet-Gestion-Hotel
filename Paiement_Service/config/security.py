import os
import jwt
from functools import wraps
from flask import request

# =====  Public Key =====
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

PUBLIC_KEY_PATH = os.path.join(BASE_DIR, "keys", "publickey.pem")

with open(PUBLIC_KEY_PATH, "r") as f:
    PUBLIC_KEY = f.read()


# ===== Decorator Role =====
def require_role(required_role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization")

            if not auth_header or not auth_header.startswith("Bearer "):
                return {"message": "Authorization header manquant"}, 401

            token = auth_header.replace("Bearer ", "").strip()

            try:
                payload = jwt.decode(
                    token,
                    PUBLIC_KEY,
                    algorithms=["RS256"],
                    options={"verify_aud": False}
                )

                print("JWT PAYLOAD =", payload)

                roles = payload.get("roles", [])
                authorities = payload.get("authorities", "").split(" ")

                if (
                        required_role not in roles
                        and f"ROLE_{required_role}" not in roles
                        and f"ROLE_{required_role}" not in authorities
                ):
                    return {"message": "Accès refusé : rôle insuffisant"}, 403

            except jwt.ExpiredSignatureError:
                return {"message": "Token expiré"}, 401
            except jwt.InvalidTokenError as e:
                print("JWT ERROR:", e)
                return {"message": "Token invalide"}, 401

            return f(*args, **kwargs)

        return wrapper
    return decorator
