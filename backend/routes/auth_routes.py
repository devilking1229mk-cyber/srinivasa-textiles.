import os
import sys
import uuid
import bcrypt
from pathlib import Path
from flask import Blueprint, request, jsonify

# Ensure parent directory is in sys.path
PARENT_DIR = str(Path(__file__).resolve().parent.parent)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from database.db import query_db, execute_db
from middleware.auth import generate_token, require_auth
from utils.logger import logger

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticates user and returns JWT token.
    """
    data = request.get_json() or {}
    username_or_email = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username_or_email or not password:
        return jsonify({"success": False, "error": "Username and password are required"}), 400

    user = query_db(
        "SELECT * FROM users WHERE username = %s OR email = %s",
        (username_or_email, username_or_email),
        one=True
    )

    if not user:
        # Fallback for predefined owner accounts for smooth transition
        if username_or_email in ["admin", "owner", "owner@srinivasatextiles.com"] and password in ["1978", "srinivasa1978", "admin", "admin123"]:
            token = generate_token("admin-legacy-id", "admin", "owner")
            return jsonify({
                "success": True,
                "token": token,
                "user": {
                    "id": "admin-legacy-id",
                    "username": "admin",
                    "role": "owner",
                    "fullName": "Srinivasa Textiles Master Admin"
                }
            })
        return jsonify({"success": False, "error": "Invalid username or password"}), 401

    # Verify bcrypt password
    stored_hash = user["password_hash"].encode("utf-8")
    if bcrypt.checkpw(password.encode("utf-8"), stored_hash):
        token = generate_token(user["id"], user["username"], user["role"])
        logger.info(f"User {user['username']} logged in successfully.")
        return jsonify({
            "success": True,
            "token": token,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "role": user["role"],
                "fullName": user["full_name"],
                "phone": user["phone"]
            }
        })
    else:
        return jsonify({"success": False, "error": "Invalid username or password"}), 401

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Registers a new customer account.
    """
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()
    full_name = data.get("fullName", "").strip()
    phone = data.get("phone", "").strip()

    if not username or not email or not password:
        return jsonify({"success": False, "error": "Username, email, and password are required"}), 400

    existing = query_db("SELECT id FROM users WHERE username = %s OR email = %s", (username, email), one=True)
    if existing:
        return jsonify({"success": False, "error": "Username or email already exists"}), 409

    salt = bcrypt.gensalt(10)
    password_hash = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    user_id = str(uuid.uuid4())

    execute_db(
        """INSERT INTO users (id, username, email, password_hash, role, full_name, phone)
           VALUES (%s, %s, %s, %s, 'customer', %s, %s)""",
        (user_id, username, email, password_hash, full_name, phone)
    )

    token = generate_token(user_id, username, "customer")
    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "token": token,
        "user": {"id": user_id, "username": username, "email": email, "role": "customer", "fullName": full_name}
    }), 201

@auth_bp.route("/me", methods=["GET"])
@require_auth
def get_current_user():
    """
    Returns authenticated user's profile.
    """
    current_user = request.current_user
    user = query_db("SELECT id, username, email, role, full_name, phone, created_at FROM users WHERE id = %s", (current_user["user_id"],), one=True)
    if not user:
        return jsonify({"success": True, "user": current_user})
    return jsonify({"success": True, "user": user})
