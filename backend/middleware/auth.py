import os
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify

SECRET_KEY = os.getenv("SECRET_KEY", "srinivasa_super_secret_jwt_key_since_1978")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def generate_token(user_id: str, username: str, role: str) -> str:
    """
    Generates a cryptographically signed JWT token for the authenticated user.
    """
    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_token(token: str):
    """
    Decodes and validates a JWT token.
    """
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    """
    Decorator to protect endpoints with valid JWT token authentication.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"success": False, "error": "Missing Authorization header"}), 401
        
        parts = auth_header.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            return jsonify({"success": False, "error": "Invalid Authorization header format"}), 401
        
        token = parts[1]
        payload = decode_token(token)
        if not payload:
            return jsonify({"success": False, "error": "Invalid or expired token"}), 401
        
        request.current_user = payload
        return f(*args, **kwargs)
    return decorated

def require_admin(f):
    """
    Decorator to protect endpoints strictly for 'admin' or 'owner' roles.
    """
    @wraps(f)
    @require_auth
    def decorated(*args, **kwargs):
        user = getattr(request, "current_user", None)
        if not user or user.get("role") not in ["admin", "owner"]:
            return jsonify({"success": False, "error": "Forbidden: Administrative privilege required"}), 403
        return f(*args, **kwargs)
    return decorated
