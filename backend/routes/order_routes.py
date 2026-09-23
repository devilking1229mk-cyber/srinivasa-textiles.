import os
import sys
import json
import uuid
from pathlib import Path
from flask import Blueprint, request, jsonify

# Ensure parent directory is in sys.path for direct route loading
PARENT_DIR = str(Path(__file__).resolve().parent.parent)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from database.db import query_db, execute_db
from utils.logger import logger

order_bp = Blueprint("order_bp", __name__)

@order_bp.route("", methods=["POST"])
def create_order():
    """
    Places a new customer order and generates tax & tracking records.
    """
    data = request.get_json() or {}
    items = data.get("items", [])
    customer = data.get("customer", {})
    
    if not items or not customer:
        return jsonify({"success": False, "error": "Order items and customer details are required"}), 400

    order_id = data.get("orderId") or data.get("id") or f"ST-ORD-2026-{str(uuid.uuid4())[:6].upper()}"
    order_number = data.get("orderNumber") or order_id

    subtotal = float(data.get("subtotalINR") or data.get("subtotal", 0))
    discount = float(data.get("discountINR") or data.get("discount", 0))
    shipping_fee = float(data.get("shippingINR") or data.get("shippingFee", 0))
    # Calculate 5% GST on silk handloom
    taxable_amount = max(0, subtotal - discount)
    tax = float(data.get("gstINR") or round(taxable_amount * 0.05, 2))
    total_amount = float(data.get("totalAmountINR") or data.get("total_amount") or round(taxable_amount + tax + shipping_fee, 2))

    payment_method = data.get("paymentMethod", "COD")
    payment_status = data.get("paymentStatus") or ("Paid" if ("COD" not in payment_method.upper()) else "Pending COD Collection")
    tracking_number = data.get("trackingNumber") or f"BD-{str(uuid.uuid4())[:9].upper()}"

    # Extract customer fields
    cust_name = customer.get("name", "Valued Customer")
    cust_email = customer.get("email", "")
    cust_phone = customer.get("phone", "")
    cust_addr = customer.get("address", "")
    cust_city = customer.get("city", "Chennai")
    cust_state = customer.get("state", "Tamil Nadu")
    cust_pincode = customer.get("pincode", "600001")

    # Insert master order
    execute_db(
        """INSERT INTO orders (
            id, order_number, customer_name, customer_email, customer_phone,
            shipping_address, city, state, pincode, subtotal, discount, tax,
            shipping_fee, total_amount, currency, payment_method, payment_status,
            order_status, tracking_number
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'Pending Dispatch', %s)""",
        (
            order_id, order_number, cust_name, cust_email, cust_phone,
            cust_addr, cust_city, cust_state, cust_pincode,
            subtotal, discount, tax, shipping_fee, total_amount,
            data.get("currency", "INR"), payment_method, payment_status, tracking_number
        )
    )

    # Insert items and decrement stock
    for item in items:
        item_id = str(uuid.uuid4())
        prod_id = item.get("id") or item.get("productId")
        prod_name = item.get("title") or item.get("name") or item.get("productName", "Textile Product")
        price = float(item.get("unitPriceINR") or item.get("price", 0))
        qty = int(item.get("qty") or item.get("quantity", 1))
        item_total = float(item.get("totalINR") or (price * qty))

        execute_db(
            """INSERT INTO order_items (
                id, order_id, product_id, product_name, price, quantity, color, blouse_option, total_price
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (item_id, order_id, prod_id, prod_name, price, qty, item.get("color") or item.get("selectedColor"), item.get("blouseOption") or item.get("blouseLabel", "Unstitched"), item_total)
        )

        # Decrement product stock safely
        if prod_id:
            execute_db("UPDATE products SET stock = CASE WHEN stock >= %s THEN stock - %s ELSE 0 END WHERE id = %s", (qty, qty, prod_id))

    logger.info(f"New Order Created: {order_number} | Amount: ₹{total_amount} | Customer: {customer.get('name')}")

    return jsonify({
        "success": True,
        "message": "Order placed successfully!",
        "order": {
            "id": order_id,
            "orderNumber": order_number,
            "totalAmount": total_amount,
            "tax": tax,
            "paymentStatus": payment_status,
            "trackingNumber": tracking_number,
            "carrier": "BlueDart Express"
        }
    }), 201

@order_bp.route("", methods=["GET"])
def get_orders():
    """
    Returns list of orders with their items.
    """
    raw_orders = query_db("SELECT * FROM orders ORDER BY created_at DESC")
    orders = []

    for o in raw_orders:
        items = query_db("SELECT * FROM order_items WHERE order_id = %s", (o["id"],))
        orders.append({
            "id": o["id"],
            "orderNumber": o["order_number"],
            "customerName": o["customer_name"],
            "customerEmail": o["customer_email"],
            "customerPhone": o["customer_phone"],
            "shippingAddress": o["shipping_address"],
            "city": o["city"],
            "state": o["state"],
            "pincode": o["pincode"],
            "subtotal": float(o["subtotal"]),
            "discount": float(o["discount"]),
            "tax": float(o["tax"]),
            "shippingFee": float(o["shipping_fee"]),
            "totalAmount": float(o["total_amount"]),
            "currency": o["currency"],
            "paymentMethod": o["payment_method"],
            "paymentStatus": o["payment_status"],
            "orderStatus": o["order_status"],
            "trackingNumber": o["tracking_number"],
            "shippingCarrier": o["shipping_carrier"],
            "createdAt": o["created_at"],
            "items": [
                {
                    "productId": it["product_id"],
                    "productName": it["product_name"],
                    "price": float(it["price"]),
                    "quantity": it["quantity"],
                    "color": it["color"],
                    "blouseOption": it["blouse_option"],
                    "totalPrice": float(it["total_price"])
                }
                for it in items
            ]
        })

    return jsonify({"success": True, "count": len(orders), "orders": orders})

@order_bp.route("/<order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    """
    Updates order fulfillment status (Packed, Dispatched, Delivered).
    """
    data = request.get_json() or {}
    status = data.get("status")

    if not status:
        return jsonify({"success": False, "error": "Status is required"}), 400

    execute_db("UPDATE orders SET order_status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s OR order_number = %s", (status, order_id, order_id))
    logger.info(f"Order {order_id} status updated to {status}")
    return jsonify({"success": True, "message": f"Order status updated to {status}"})

@order_bp.route("/<order_id>/payment-status", methods=["PUT"])
def update_order_payment_status(order_id):
    """
    Updates order payment status (e.g. 'paid', 'pending') and records UTR / UPI reference.
    """
    data = request.get_json() or {}
    payment_status = data.get("paymentStatus") or data.get("status") or "paid"
    utr_number = data.get("utrNumber") or data.get("upiRef") or data.get("transactionId") or ""

    execute_db(
        "UPDATE orders SET payment_status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s OR order_number = %s",
        (payment_status, order_id, order_id)
    )
    logger.info(f"Payment status for order {order_id} updated to {payment_status} | UTR: {utr_number}")
    return jsonify({
        "success": True,
        "message": f"Payment status updated to {payment_status}",
        "orderId": order_id,
        "paymentStatus": payment_status,
        "utrNumber": utr_number
    })

@order_bp.route("/webhook/payment", methods=["POST"])
def payment_gateway_webhook():
    """
    Inbound Webhook Endpoint for Payment Providers (HDFC / Razorpay / PhonePe / UPI).
    Updates order payment status to 'paid' when payment succeeds.
    """
    payload = request.get_json() or {}
    order_id = payload.get("order_id") or payload.get("orderId") or payload.get("order_number")
    utr_number = payload.get("utr_number") or payload.get("utr") or payload.get("transaction_id") or payload.get("upi_ref_no") or f"UPI/HDFC/TXN-{str(uuid.uuid4())[:8].upper()}"
    status = payload.get("status") or payload.get("payment_status") or "paid"

    if not order_id:
        return jsonify({"success": False, "error": "order_id is required"}), 400

    execute_db(
        "UPDATE orders SET payment_status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s OR order_number = %s",
        (status, order_id, order_id)
    )
    logger.info(f"⚡ [Gateway Webhook] Inbound Payment Received for Order {order_id} | Status: {status} | UTR: {utr_number}")

    return jsonify({
        "success": True,
        "message": "Payment webhook processed successfully",
        "orderId": order_id,
        "status": status,
        "utrNumber": utr_number
    })

@order_bp.route("/track/<lookup>", methods=["GET"])
def track_order(lookup):
    """
    Public lookup by tracking number or order number.
    """
    order = query_db(
        "SELECT * FROM orders WHERE tracking_number = %s OR order_number = %s OR id = %s",
        (lookup, lookup, lookup),
        one=True
    )
    if not order:
        return jsonify({"success": False, "error": "Order or Tracking Number not found"}), 404

    return jsonify({
        "success": True,
        "tracking": {
            "orderNumber": order["order_number"],
            "status": order["order_status"],
            "trackingNumber": order["tracking_number"],
            "carrier": order["shipping_carrier"],
            "customerCity": order["city"],
            "createdAt": order["created_at"]
        }
    })

