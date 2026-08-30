// =====================================================================
// SRINIVASA TEXTILES - API SERVICE CLIENT
// Connects Frontend to Python Flask REST Engine with Fallback Support
// =====================================================================

const API_BASE_URL = window.API_BASE_URL || "http://localhost:5000/api";

const API = {
  baseUrl: API_BASE_URL,
  isOnline: false,

  // Helper for fetch requests
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem("st_auth_jwt_token");

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return { ok: response.ok, status: response.status, data };
    } catch (err) {
      console.warn(`[API] Network error connecting to ${endpoint}:`, err.message);
      return { ok: false, status: 0, error: err.message };
    }
  },

  // Check Backend Health
  async checkHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (res.ok) {
        this.isOnline = true;
        return await res.json();
      }
    } catch (e) {
      this.isOnline = false;
    }
    return null;
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await this.request(`/products${query ? `?${query}` : ""}`);
    return res.ok ? res.data.products : null;
  },

  async getProduct(id) {
    const res = await this.request(`/products/${id}`);
    return res.ok ? res.data.product : null;
  },

  async createProduct(product) {
    return await this.request("/products", {
      method: "POST",
      body: JSON.stringify(product)
    });
  },

  async updateProduct(id, product) {
    return await this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product)
    });
  },

  async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: "DELETE"
    });
  },

  // Orders
  async createOrder(orderPayload) {
    return await this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload)
    });
  },

  async getOrders() {
    const res = await this.request("/orders");
    return res.ok ? res.data.orders : null;
  },

  async updateOrderStatus(orderId, status) {
    return await this.request(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
  },

  async trackOrder(lookup) {
    const res = await this.request(`/orders/track/${lookup}`);
    return res.ok ? res.data.tracking : null;
  },

  // Coupons
  async validateCoupon(code, subtotal) {
    return await this.request("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal })
    });
  },

  // Auth
  async login(username, password) {
    const res = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    if (res.ok && res.data.token) {
      localStorage.setItem("st_auth_jwt_token", res.data.token);
      localStorage.setItem("st_current_user", JSON.stringify(res.data.user));
    }
    return res;
  },

  logout() {
    localStorage.removeItem("st_auth_jwt_token");
    localStorage.removeItem("st_current_user");
  },

  // Analytics (Admin)
  async getKPIs() {
    const res = await this.request("/analytics/kpis");
    return res.ok ? res.data.kpis : null;
  },

  // Newsletter Subscribers
  async subscribe(email, phone = "") {
    return await this.request("/subscribers", {
      method: "POST",
      body: JSON.stringify({ email, phone })
    });
  }
};

window.API = API;

// Check backend status on page load
document.addEventListener("DOMContentLoaded", () => {
  API.checkHealth().then(status => {
    if (status) {
      console.log("⚡ [Srinivasa API] Connected to Backend REST Engine (" + status.databaseEngine + ")");
    } else {
      console.info("ℹ️ [Srinivasa API] Operating in Client Fallback Mode (LocalStorage / Supabase).");
    }
  });
});
