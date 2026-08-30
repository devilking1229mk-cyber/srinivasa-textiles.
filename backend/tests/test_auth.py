import sys
import json
import pytest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

try:
    from app import create_app
except ImportError:
    from backend.app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_admin_login_success(client):
    """Test login with valid admin credentials returns JWT token"""
    response = client.post("/api/auth/login", json={"username": "admin", "password": "1978"})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["role"] in ["admin", "owner"]

def test_admin_login_invalid(client):
    """Test login with wrong password fails with 401"""
    response = client.post("/api/auth/login", json={"username": "admin", "password": "wrongpassword999"})
    assert response.status_code == 401
    data = json.loads(response.data)
    assert data["success"] is False

def test_protected_analytics_unauthorized(client):
    """Test that KPI endpoint rejects requests without JWT token"""
    response = client.get("/api/analytics/kpis")
    assert response.status_code == 401
