import os
import sys
import time
import uuid
from pathlib import Path
from flask import Blueprint, request, jsonify

# Ensure parent directory is in sys.path
PARENT_DIR = str(Path(__file__).resolve().parent.parent)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from database.db import query_db, execute_db, get_db_type

utility_bp = Blueprint("utility_bp", __name__)
START_TIME = time.time()

@utility_bp.route("/health", methods=["GET"])
def health_check():
    """
    Health check and diagnostics endpoint for monitoring and uptime trackers.
    """
    db_status = "healthy"
    try:
        query_db("SELECT 1", one=True)
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    uptime_seconds = int(time.time() - START_TIME)

    return jsonify({
        "status": "online" if db_status == "healthy" else "degraded",
        "service": "Srinivasa Textiles REST Engine",
        "version": "2.4.0",
        "databaseEngine": get_db_type(),
        "databaseStatus": db_status,
        "uptimeSeconds": uptime_seconds,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    })

@utility_bp.route("/coupons/validate", methods=["POST"])
def validate_coupon():
    """
    Validates a promo code against the cart subtotal.
    """
    data = request.get_json() or {}
    code = data.get("code", "").strip().upper()
    subtotal = float(data.get("subtotal", 0))

    if not code:
        return jsonify({"success": False, "error": "Coupon code is required"}), 400

    coupon = query_db("SELECT * FROM coupons WHERE code = %s AND is_active = 1", (code,), one=True)
    if not coupon:
        return jsonify({"success": False, "error": "Invalid or expired promotional coupon code"}), 404

    min_val = float(coupon.get("min_order_value", 0))
    if subtotal < min_val:
        return jsonify({
            "success": False,
            "error": f"Coupon {code} requires a minimum cart value of ₹{min_val:,.0f}"
        }), 400

    discount_percent = float(coupon["discount_percent"])
    discount_amount = (subtotal * discount_percent) / 100.0
    max_discount = float(coupon["max_discount"]) if coupon.get("max_discount") else None

    if max_discount and discount_amount > max_discount:
        discount_amount = max_discount

    return jsonify({
        "success": True,
        "coupon": {
            "code": code,
            "discountPercent": discount_percent,
            "discountAmount": round(discount_amount, 2),
            "maxDiscount": max_discount
        }
    })

@utility_bp.route("/reviews", methods=["GET"])
def get_reviews():
    """
    Returns verified reviews.
    """
    product_id = request.args.get("productId")
    if product_id:
        reviews = query_db("SELECT * FROM reviews WHERE product_id = %s ORDER BY created_at DESC", (product_id,))
    else:
        reviews = query_db("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 50")

    return jsonify({"success": True, "count": len(reviews), "reviews": reviews})

@utility_bp.route("/subscribers", methods=["POST"])
def add_subscriber():
    """
    Adds a new newsletter / restock subscriber.
    """
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    phone = data.get("phone", "").strip()

    if not email:
        return jsonify({"success": False, "error": "Email address is required"}), 400

    existing = query_db("SELECT id FROM subscribers WHERE email = %s", (email,), one=True)
    if not existing:
        sub_id = str(uuid.uuid4())
        execute_db("INSERT INTO subscribers (id, email, phone) VALUES (%s, %s, %s)", (sub_id, email, phone))

    return jsonify({"success": True, "message": "Successfully subscribed to Srinivasa Heritage Circle!"})
