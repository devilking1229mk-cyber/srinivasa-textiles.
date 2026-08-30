import os
import sqlite3
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).resolve().parent.parent / '.env')

DB_TYPE = "sqlite"

def get_db_connection():
    """
    Returns a database connection. Connects to PostgreSQL/Supabase if configured,
    or smoothly defaults to SQLite for local operations.
    """
    global DB_TYPE
    
    # Try PostgreSQL / Supabase if psycopg2 is installed and DB_TYPE is postgres
    db_type_env = os.getenv("DB_TYPE", "sqlite").lower()
    if db_type_env in ("postgres", "postgresql"):
        try:
            import psycopg2
            import psycopg2.extras
            db_url = os.getenv("DATABASE_URL")
            if db_url and "your_database_password" not in db_url:
                conn = psycopg2.connect(db_url)
                DB_TYPE = "postgres"
                return conn
            else:
                host = os.getenv("DB_HOST", "127.0.0.1")
                port = int(os.getenv("DB_PORT", 5432))
                user = os.getenv("DB_USER", "postgres")
                password = os.getenv("DB_PASSWORD", "")
                database = os.getenv("DB_NAME", "postgres")
                conn = psycopg2.connect(
                    host=host,
                    port=port,
                    user=user,
                    password=password,
                    dbname=database,
                    connect_timeout=3
                )
                DB_TYPE = "postgres"
                return conn
        except Exception as e:
            pass

    # Default Portable SQLite Engine
    DB_TYPE = "sqlite"
    db_dir = Path(__file__).resolve().parent
    db_dir.mkdir(exist_ok=True)
    sqlite_file = db_dir / "srinivasa.db"
    conn = sqlite3.connect(str(sqlite_file), timeout=10)
    conn.row_factory = sqlite3.Row
    return conn

def get_db_type():
    return DB_TYPE

EMBEDDED_SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    full_name VARCHAR(150),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    fabric VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    stock INT DEFAULT 10,
    image_url TEXT NOT NULL,
    images JSON,
    colors JSON,
    weave VARCHAR(100),
    zari VARCHAR(100),
    occasion VARCHAR(100),
    origin VARCHAR(150) DEFAULT 'Kanchipuram, Tamil Nadu',
    silk_mark BOOLEAN DEFAULT TRUE,
    handloom_mark BOOLEAN DEFAULT TRUE,
    hsn_code VARCHAR(50) DEFAULT '50072010',
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(25) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0.00,
    tax DECIMAL(12, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(12, 2) DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method VARCHAR(50) DEFAULT 'UPI',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    order_status VARCHAR(50) DEFAULT 'Pending Dispatch',
    tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(100) DEFAULT 'BlueDart Express',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    color VARCHAR(100),
    blouse_option VARCHAR(100) DEFAULT 'Unstitched Fabric',
    blouse_measurements JSON,
    total_price DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent DECIMAL(5, 2) NOT NULL,
    max_discount DECIMAL(10, 2),
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO coupons (id, code, discount_percent, max_discount, min_order_value, is_active)
VALUES 
    ('cp-1', 'HERITAGE10', 10.0, 1000.0, 1000.0, 1),
    ('cp-2', 'SRINIVASA20', 20.0, 2500.0, 3000.0, 1),
    ('cp-3', 'BRIDAL15', 15.0, 5000.0, 10000.0, 1);

INSERT OR IGNORE INTO users (id, username, email, password_hash, role, full_name)
VALUES 
    ('usr-admin', 'admin', 'admin@srinivasatextiles.com', '$2b$10$lhouF5ajx3njWvHQIQaBteTDFagw45sBWOtQdua1FEh7J4FZIk1p2', 'admin', 'Master Weaver Admin');
"""

def init_db():
    """
    Initializes database schema.
    """
    conn = get_db_connection()
    try:
        if DB_TYPE == "postgres":
            import psycopg2
            cursor = conn.cursor()
            cursor.execute(EMBEDDED_SCHEMA)
            conn.commit()
            cursor.close()
        else:
            cursor = conn.cursor()
            cursor.executescript(EMBEDDED_SCHEMA)
            conn.commit()
            cursor.close()
        print(f"✅ Database initialized successfully using {DB_TYPE.upper()} engine.")
    except Exception as err:
        print(f"⚠️ Database initialization notice: {err}")
    finally:
        conn.close()

def query_db(query, args=(), one=False):
    """
    Helper function to query database and return dictionary objects.
    """
    conn = get_db_connection()
    try:
        if DB_TYPE == "postgres":
            import psycopg2.extras
            cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cursor.execute(query, args)
            rv = cursor.fetchall()
            cursor.close()
            return (dict(rv[0]) if rv else None) if one else [dict(r) for r in rv]
        else:
            sqlite_query = query.replace("%s", "?")
            cursor = conn.cursor()
            cursor.execute(sqlite_query, args)
            rv = [dict(row) for row in cursor.fetchall()]
            cursor.close()
            return (rv[0] if rv else None) if one else rv
    finally:
        conn.close()

def execute_db(query, args=()):
    """
    Helper function to execute INSERT/UPDATE/DELETE queries.
    """
    conn = get_db_connection()
    try:
        if DB_TYPE == "postgres":
            cursor = conn.cursor()
            cursor.execute(query, args)
            conn.commit()
            affected = cursor.rowcount
            cursor.close()
            return affected
        else:
            sqlite_query = query.replace("%s", "?")
            cursor = conn.cursor()
            cursor.execute(sqlite_query, args)
            conn.commit()
            affected = cursor.rowcount
            cursor.close()
            return affected
    finally:
        conn.close()
