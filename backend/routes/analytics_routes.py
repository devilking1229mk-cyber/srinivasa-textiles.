import os
import sys
from pathlib import Path
from flask import Blueprint, jsonify

# Ensure parent directory is in sys.path
PARENT_DIR = str(Path(__file__).resolve().parent.parent)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from database.db import query_db
from middleware.auth import require_admin

analytics_bp = Blueprint("analytics_bp", __name__)

@analytics_bp.route("/kpis", methods=["GET"])
@require_admin
def get_kpis():
    """
    Returns real-time KPI metrics for Owner Dashboard.
    """
    # Net Sales & Orders Count
    sales_data = query_db(
        """SELECT 
            COALESCE(SUM(total_amount), 0) as net_sales,
            COUNT(*) as total_orders
           FROM orders WHERE payment_status != 'Refunded'""",
        one=True
    )
    
    # Active / Pending Orders
    pending_data = query_db(
        "SELECT COUNT(*) as active_orders FROM orders WHERE order_status IN ('Pending Dispatch', 'Packed', 'Dispatched')",
        one=True
    )

    # Low Stock Alerts (< 3 units)
    low_stock = query_db(
        "SELECT COUNT(*) as low_stock_count FROM products WHERE stock <= 2",
        one=True
    )

    # Master SKU count
    sku_count = query_db("SELECT COUNT(*) as total_skus FROM products", one=True)

    net_sales = float(sales_data["net_sales"]) if sales_data else 0.0
    total_orders = int(sales_data["total_orders"]) if sales_data else 0
    aov = round(net_sales / total_orders, 2) if total_orders > 0 else 0.0

    return jsonify({
        "success": True,
        "kpis": {
            "netSales": net_sales,
            "totalOrders": total_orders,
            "activeOrders": int(pending_data["active_orders"]) if pending_data else 0,
            "lowStockCount": int(low_stock["low_stock_count"]) if low_stock else 0,
            "totalSkus": int(sku_count["total_skus"]) if sku_count else 0,
            "averageOrderValue": aov
        }
    })
