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

def test_health_endpoint(client):
    """Test health check returns operational status"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["service"] == "Srinivasa Textiles REST Engine"
    assert "databaseStatus" in data

def test_get_products(client):
    """Test catalog retrieval returns list of products"""
    response = client.get("/api/products")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
    assert isinstance(data["products"], list)

def test_product_filter_by_department(client):
    """Test department filtering returns only Women items"""
    response = client.get("/api/products?department=Women")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
    for p in data["products"]:
        assert p["department"].lower() == "women"

def test_coupon_validation(client):
    """Test coupon validation gives correct percentage and amount"""
    payload = {"code": "HERITAGE10", "subtotal": 5000}
    response = client.post("/api/coupons/validate", json=payload)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
    assert data["coupon"]["code"] == "HERITAGE10"
    assert data["coupon"]["discountPercent"] == 10.0
    assert data["coupon"]["discountAmount"] == 500.0

def test_create_order(client):
    """Test full order placement lifecycle"""
    payload = {
        "items": [
            {
                "id": "ST-KAN-001",
                "name": "Kanchipuram Pure Zari Crimson Bridal Silk Saree",
                "price": 28500,
                "quantity": 1,
                "color": "Crimson Red"
            }
        ],
        "customer": {
            "name": "Ananya Krishnan",
            "email": "ananya@example.com",
            "phone": "+91 98401 99887",
            "address": "12 Gandhi Road",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600004"
        },
        "subtotal": 28500,
        "discount": 0,
        "shippingFee": 0,
        "paymentMethod": "UPI"
    }
    response = client.post("/api/orders", json=payload)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["success"] is True
    assert "trackingNumber" in data["order"]
    assert data["order"]["paymentStatus"] == "Paid"
