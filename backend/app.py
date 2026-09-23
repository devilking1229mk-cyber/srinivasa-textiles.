import os
import sys
from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Ensure backend root is always on sys.path
BACKEND_DIR = Path(__file__).resolve().parent
WORKSPACE_DIR = BACKEND_DIR.parent
for p in [str(BACKEND_DIR), str(WORKSPACE_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Load environment
env_path = BACKEND_DIR / ".env"
load_dotenv(dotenv_path=env_path)

# Database & Seed
from database.db import init_db
from utils.logger import logger

# Import Route Blueprints
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from routes.analytics_routes import analytics_bp
from routes.utility_routes import utility_bp

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "srinivasa_super_secret_jwt_key_since_1978")

    # Enable CORS for all origins and headers
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(utility_bp, url_prefix="/api")

    # Error Handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"success": False, "error": "Bad Request", "message": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Resource Not Found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        logger.error(f"Internal Server Error: {str(e)}")
        return jsonify({"success": False, "error": "Internal Server Error"}), 500

    # Root welcome route
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "brand": "Srinivasa Textiles",
            "tagline": "Master Weavers & Pure Silk Handloom Emporium Since 1978",
            "apiDocumentation": "/api/health",
            "status": "operational"
        })

    # Auto-initialize database on launch
    with app.app_context():
        try:
            init_db()
        except Exception as err:
            logger.warning(f"Database startup check: {err}")

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "True").lower() in ("true", "1")
    logger.info(f"✨ Srinivasa Textiles REST API running on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
