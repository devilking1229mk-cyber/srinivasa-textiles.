import sys
import json
import uuid
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from database.db import init_db, query_db, execute_db, get_db_type
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

SEED_PRODUCTS = [
    {
        "id": "ST-KAN-001",
        "name": "Kanchipuram Pure Zari Crimson Bridal Silk Saree",
        "department": "Women",
        "category": "Bridal Silk Sarees",
        "fabric": "Kanchipuram Pure Silk",
        "price": 28500.00,
        "original_price": 34999.00,
        "stock": 4,
        "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
        "images": ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"],
        "colors": ["Crimson Red", "Antique Gold"],
        "weave": "Handloom Korvai Double Warp",
        "zari": "Pure Gold & Silver Zari",
        "occasion": "Bridal & Muhurtham",
        "origin": "Kanchipuram, Tamil Nadu",
        "silk_mark": 1,
        "handloom_mark": 1,
        "hsn_code": "50072010",
        "description": "Authentic master-woven Kanchipuram silk saree with intricate peacock and mango motifs across heavy pallu. Handcrafted by 3rd-generation weavers.",
        "is_featured": 1
    },
    {
        "id": "ST-KAN-002",
        "name": "Temple Emerald Green Kanchipuram Brocade Silk",
        "department": "Women",
        "category": "Bridal Silk Sarees",
        "fabric": "Kanchipuram Pure Silk",
        "price": 22400.00,
        "original_price": 26900.00,
        "stock": 6,
        "image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
        "images": ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"],
        "colors": ["Emerald Green", "Gold Zari"],
        "weave": "Traditional Pitloom Weave",
        "zari": "High Micron Gold Zari",
        "occasion": "Festive & Receptions",
        "origin": "Kanchipuram, Tamil Nadu",
        "silk_mark": 1,
        "handloom_mark": 1,
        "hsn_code": "50072010",
        "description": "Rich jewel-toned green saree featuring dense floral brocade and contrasting ruby-red temple border.",
        "is_featured": 1
    },
    {
        "id": "ST-BAN-001",
        "name": "Varanasi Royal Katan Banarasi Silk Saree",
        "department": "Women",
        "category": "Banarasi Sarees",
        "fabric": "Pure Katan Silk",
        "price": 19800.00,
        "original_price": 24500.00,
        "stock": 5,
        "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
        "images": ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"],
        "colors": ["Royal Blue", "Silver Zari"],
        "weave": "Kadwa Jaal Weaving",
        "zari": "Tested Silver Zari",
        "occasion": "Sangeet & Party",
        "origin": "Varanasi, Uttar Pradesh",
        "silk_mark": 1,
        "handloom_mark": 1,
        "hsn_code": "50072010",
        "description": "Heritage Banarasi masterpiece woven with delicate kadwa florets and antique silver borders.",
        "is_featured": 1
    },
    {
        "id": "ST-MEN-001",
        "name": "Men's Pure Mulberry Silk Kurta & Angavastram Set",
        "department": "Men",
        "category": "Ethnic Wear",
        "fabric": "Pure Mulberry Silk",
        "price": 8900.00,
        "original_price": 11500.00,
        "stock": 8,
        "image_url": "https://images.unsplash.com/photo-1621644825964-b81b1a45ef75?auto=format&fit=crop&w=1000&q=80",
        "images": ["https://images.unsplash.com/photo-1621644825964-b81b1a45ef75?auto=format&fit=crop&w=1000&q=80"],
        "colors": ["Cream Ivory", "Antique Gold"],
        "weave": "Handspun Silk Weave",
        "zari": "Pure Zari Border",
        "occasion": "Groom & Festive",
        "origin": "Kanchipuram, Tamil Nadu",
        "silk_mark": 1,
        "handloom_mark": 1,
        "hsn_code": "50072010",
        "description": "Regal men's traditional silk set with hand-finished collar and matching golden zari border angavastram.",
        "is_featured": 1
    },
    {
        "id": "ST-COT-001",
        "name": "Chettinad 100s Count Heritage Cotton Saree",
        "department": "Women",
        "category": "Handloom Cotton",
        "fabric": "Pure Organic Cotton",
        "price": 3800.00,
        "original_price": 4500.00,
        "stock": 15,
        "image_url": "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
        "images": ["https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"],
        "colors": ["Mustard Yellow", "Maroon Border"],
        "weave": "100s Count Handloom Weave",
        "zari": "Thread Border",
        "occasion": "Daily & Workwear",
        "origin": "Karaikudi, Tamil Nadu",
        "silk_mark": 0,
        "handloom_mark": 1,
        "hsn_code": "52085110",
        "description": "Feather-light breathable organic cotton saree with traditional temple spire borders and geometric pallu.",
        "is_featured": 0
    }
]

SEED_COUPONS = [
    {"id": "c1", "code": "HERITAGE10", "discount_percent": 10.00, "max_discount": 3000.00, "min_order_value": 2999.00},
    {"id": "c2", "code": "WEDDING2026", "discount_percent": 15.00, "max_discount": 5000.00, "min_order_value": 15000.00},
    {"id": "c3", "code": "SRINIVASA5", "discount_percent": 5.00, "max_discount": 1000.00, "min_order_value": 1000.00}
]

def seed_all():
    print("🌱 Initializing Database Schema...")
    init_db()
    
    # 1. Seed Admin User
    existing_admin = query_db("SELECT id FROM users WHERE username = %s", ("admin",), one=True)
    if not existing_admin:
        admin_id = str(uuid.uuid4())
        hashed = hash_password("1978")
        execute_db(
            "INSERT INTO users (id, username, email, password_hash, role, full_name, phone) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (admin_id, "admin", "admin@srinivasatextiles.com", hashed, "owner", "Srinivasa Textiles Master Admin", "+919840054321")
        )
        print("👤 Default Admin user seeded (username: admin, pass: 1978)")
    
    # 2. Seed Products
    for p in SEED_PRODUCTS:
        existing = query_db("SELECT id FROM products WHERE id = %s", (p["id"],), one=True)
        if not existing:
            execute_db(
                """INSERT INTO products (
                    id, name, department, category, fabric, price, original_price, stock, 
                    image_url, images, colors, weave, zari, occasion, origin, silk_mark, 
                    handloom_mark, hsn_code, description, is_featured
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    p["id"], p["name"], p["department"], p["category"], p["fabric"], p["price"],
                    p["original_price"], p["stock"], p["image_url"], json.dumps(p["images"]),
                    json.dumps(p["colors"]), p["weave"], p["zari"], p["occasion"], p["origin"],
                    p["silk_mark"], p["handloom_mark"], p["hsn_code"], p["description"], p["is_featured"]
                )
            )
    print(f"📦 {len(SEED_PRODUCTS)} Products verified/seeded.")

    # 3. Seed Coupons
    for c in SEED_COUPONS:
        existing = query_db("SELECT id FROM coupons WHERE code = %s", (c["code"],), one=True)
        if not existing:
            execute_db(
                "INSERT INTO coupons (id, code, discount_percent, max_discount, min_order_value) VALUES (%s, %s, %s, %s, %s)",
                (c["id"], c["code"], c["discount_percent"], c["max_discount"], c["min_order_value"])
            )
    print(f"🎟️ {len(SEED_COUPONS)} Promotional Coupons seeded.")

    # 4. Seed Sample Orders
    existing_orders = query_db("SELECT COUNT(*) as count FROM orders", one=True)
    count = existing_orders["count"] if existing_orders else 0
    if count == 0:
        order_id = "ORD-2026-8801"
        execute_db(
            """INSERT INTO orders (
                id, order_number, customer_name, customer_email, customer_phone, 
                shipping_address, city, state, pincode, subtotal, discount, tax, 
                shipping_fee, total_amount, currency, payment_method, payment_status, 
                order_status, tracking_number
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                order_id, "ST-8801", "Radha Subramanian", "radha.subramanian@gmail.com", "+91 98410 12345",
                "Flat 4B, Temple View Apartments, Mylapore", "Chennai", "Tamil Nadu", "600004",
                28500.00, 2850.00, 1282.50, 0.00, 26932.50, "INR", "UPI", "Paid", "Pending Dispatch", "BD-778899112"
            )
        )
        execute_db(
            """INSERT INTO order_items (
                id, order_id, product_id, product_name, price, quantity, color, blouse_option, total_price
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            ("item-1", order_id, "ST-KAN-001", "Kanchipuram Pure Zari Crimson Bridal Silk Saree", 28500.00, 1, "Crimson Red", "Custom Hand Aari Blouse", 28500.00)
        )
        print("📑 Sample Order ORD-2026-8801 seeded.")

    print("✨ Database Seeding Complete!")

if __name__ == "__main__":
    seed_all()
