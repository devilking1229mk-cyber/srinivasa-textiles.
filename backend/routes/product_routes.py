import os
import sys
import json
import uuid
from pathlib import Path
from flask import Blueprint, request, jsonify

# Ensure parent directory is in sys.path
PARENT_DIR = str(Path(__file__).resolve().parent.parent)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from database.db import query_db, execute_db
from middleware.auth import require_admin
from utils.logger import logger

product_bp = Blueprint("product_bp", __name__)

def format_product(p):
    """Helper to convert JSON database fields to lists/objects"""
    if not p:
        return None
    images = []
    if p.get("images"):
        try:
            images = json.loads(p["images"]) if isinstance(p["images"], str) else p["images"]
        except Exception:
            images = [p.get("image_url")] if p.get("image_url") else []
    elif p.get("image_url"):
        images = [p["image_url"]]

    colors = []
    if p.get("colors"):
        try:
            colors = json.loads(p["colors"]) if isinstance(p["colors"], str) else p["colors"]
        except Exception:
            colors = []

    return {
        "id": p["id"],
        "name": p["name"],
        "department": p.get("department", "Women"),
        "category": p.get("category", ""),
        "fabric": p.get("fabric", ""),
        "price": float(p["price"]),
        "originalPrice": float(p["original_price"]) if p.get("original_price") is not None else None,
        "stock": int(p.get("stock", 0)),
        "image": p.get("image_url") or (images[0] if images else ""),
        "images": images,
        "colors": colors,
        "weave": p.get("weave", ""),
        "zari": p.get("zari", ""),
        "occasion": p.get("occasion", ""),
        "origin": p.get("origin", "Kanchipuram, Tamil Nadu"),
        "silkMark": bool(p.get("silk_mark")),
        "handloomMark": bool(p.get("handloom_mark")),
        "hsnCode": p.get("hsn_code", "50072010"),
        "description": p.get("description", ""),
        "isFeatured": bool(p.get("is_featured")),
        "createdAt": p.get("created_at")
    }

@product_bp.route("", methods=["GET"])
def get_products():
    """
    Returns list of products with support for query filters:
    department, category, fabric, occasion, min_price, max_price, search, sort.
    """
    department = request.args.get("department")
    category = request.args.get("category")
    fabric = request.args.get("fabric")
    occasion = request.args.get("occasion")
    search = request.args.get("search")
    sort = request.args.get("sort", "newest")  # 'price_asc', 'price_desc', 'newest'

    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if department and department.lower() != "all":
        query += " AND LOWER(department) = LOWER(%s)"
        params.append(department)

    if category and category.lower() != "all":
        query += " AND LOWER(category) = LOWER(%s)"
        params.append(category)

    if fabric:
        query += " AND LOWER(fabric) LIKE LOWER(%s)"
        params.append(f"%{fabric}%")

    if occasion:
        query += " AND LOWER(occasion) LIKE LOWER(%s)"
        params.append(f"%{occasion}%")

    if search:
        query += " AND (LOWER(name) LIKE LOWER(%s) OR LOWER(description) LIKE LOWER(%s) OR LOWER(fabric) LIKE LOWER(%s))"
        search_pattern = f"%{search}%"
        params.extend([search_pattern, search_pattern, search_pattern])

    if sort == "price_asc":
        query += " ORDER BY price ASC"
    elif sort == "price_desc":
        query += " ORDER BY price DESC"
    else:
        query += " ORDER BY created_at DESC"

    raw_products = query_db(query, tuple(params))
    products = [format_product(p) for p in raw_products]

    return jsonify({
        "success": True,
        "count": len(products),
        "products": products
    })

@product_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):
    """
    Returns details for a single product.
    """
    p = query_db("SELECT * FROM products WHERE id = %s", (product_id,), one=True)
    if not p:
        return jsonify({"success": False, "error": "Product not found"}), 404
    return jsonify({"success": True, "product": format_product(p)})

@product_bp.route("", methods=["POST"])
@require_admin
def create_product():
    """
    Creates a new product SKU in the catalog (Admin only).
    """
    data = request.get_json() or {}
    name = data.get("name")
    price = data.get("price")

    if not name or price is None:
        return jsonify({"success": False, "error": "Name and price are required"}), 400

    product_id = data.get("id") or f"ST-SKU-{str(uuid.uuid4())[:8].upper()}"
    images = data.get("images", [data.get("image", "")])
    image_url = data.get("image") or (images[0] if images else "")

    execute_db(
        """INSERT INTO products (
            id, name, department, category, fabric, price, original_price, stock,
            image_url, images, colors, weave, zari, occasion, origin, silk_mark,
            handloom_mark, hsn_code, description, is_featured
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
        (
            product_id, name, data.get("department", "Women"), data.get("category", "Sarees"),
            data.get("fabric", "Pure Silk"), price, data.get("originalPrice"),
            data.get("stock", 10), image_url, json.dumps(images), json.dumps(data.get("colors", [])),
            data.get("weave", ""), data.get("zari", ""), data.get("occasion", ""),
            data.get("origin", "Kanchipuram, Tamil Nadu"), 1 if data.get("silkMark", True) else 0,
            1 if data.get("handloomMark", True) else 0, data.get("hsnCode", "50072010"),
            data.get("description", ""), 1 if data.get("isFeatured") else 0
        )
    )

    logger.info(f"Admin created product: {product_id} - {name}")
    return jsonify({"success": True, "message": "Product created successfully", "id": product_id}), 201

@product_bp.route("/<product_id>", methods=["PUT"])
@require_admin
def update_product(product_id):
    """
    Updates an existing product SKU or inventory level (Admin only).
    """
    data = request.get_json() or {}
    existing = query_db("SELECT * FROM products WHERE id = %s", (product_id,), one=True)
    if not existing:
        return jsonify({"success": False, "error": "Product not found"}), 404

    # Allow inline stock update or full update
    name = data.get("name", existing["name"])
    price = data.get("price", existing["price"])
    stock = data.get("stock", existing["stock"])
    original_price = data.get("originalPrice", existing["original_price"])
    fabric = data.get("fabric", existing["fabric"])
    category = data.get("category", existing["category"])
    department = data.get("department", existing["department"])

    execute_db(
        """UPDATE products SET 
            name = %s, price = %s, original_price = %s, stock = %s, 
            fabric = %s, category = %s, department = %s
           WHERE id = %s""",
        (name, price, original_price, stock, fabric, category, department, product_id)
    )

    logger.info(f"Admin updated product: {product_id}")
    return jsonify({"success": True, "message": "Product updated successfully"})

@product_bp.route("/<product_id>", methods=["DELETE"])
@require_admin
def delete_product(product_id):
    """
    Deletes a product from the catalog (Admin only).
    """
    execute_db("DELETE FROM products WHERE id = %s", (product_id,))
    logger.info(f"Admin deleted product: {product_id}")
    return jsonify({"success": True, "message": "Product deleted successfully"})
