/**
 * Srinivasa Textiles - Supabase Client & Cloud Sync Engine
 * Real-time cloud sync for products, orders, feedbacks, and subscribers.
 */

class SupabaseService {
  constructor() {
    this.client = null;
    this.initialized = false;
    this.init();
  }

  init() {
    const config = window.SUPABASE_CONFIG;
    if (
      config &&
      config.SUPABASE_URL &&
      config.SUPABASE_ANON_KEY &&
      !config.SUPABASE_URL.includes("your-project-ref") &&
      typeof window.supabase !== "undefined"
    ) {
      try {
        this.client = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
        this.initialized = true;
        console.info("⚡ [Srinivasa Cloud] Supabase Database Connected Successfully to " + config.SUPABASE_URL);
      } catch (err) {
        console.warn("⚠️ [Srinivasa Cloud] Supabase Init Warning:", err.message);
      }
    }
  }

  isConfigured() {
    return this.initialized && this.client !== null;
  }

  // ==========================================
  // PRODUCTS SYNC (Catalog)
  // ==========================================
  async getProducts() {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await this.client.from("products").select("*");
      if (error) throw error;
      if (!data || data.length === 0) return null;

      // Transform DB row into frontend product format
      return data.map(row => {
        const primaryImg = (Array.isArray(row.images) && row.images.length > 0) 
          ? row.images[0] 
          : (row.image_url || row.image || row.mainImage || "");
        const imageList = Array.isArray(row.images) && row.images.length > 0 
          ? row.images 
          : (primaryImg ? [primaryImg] : []);

        return {
          id: row.id,
          title: row.name || row.title,
          department: row.department,
          category: row.category,
          fabric: row.fabric,
          priceINR: Number(row.price || row.priceINR || 0),
          originalPriceINR: Number(row.original_price || row.originalPriceINR || 0),
          rating: row.rating || 4.9,
          reviewsCount: row.reviews_count || 128,
          inStock: (row.stock !== undefined ? row.stock > 0 : true),
          stockCount: row.stock || 10,
          stock: row.stock || 10,
          mainImage: primaryImg,
          image: primaryImg,
          images: imageList,
          gallery: imageList,
          colors: Array.isArray(row.colors) ? row.colors : [],
          weave: row.weave || "Traditional Pit-Loom Weave",
          zariType: row.zari || "Pure Gold Zari",
          occasion: row.occasion || "Wedding & Muhurtham",
          origin: row.origin || "Kanchipuram, Tamil Nadu",
          silkMarkCertified: row.silk_mark ?? true,
          handloomMarkCertified: row.handloom_mark ?? true,
          hsnCode: row.hsn_code || "50072010",
          description: row.description || ""
        };
      });
    } catch (err) {
      console.warn("Supabase getProducts error:", err.message);
      return null;
    }
  }

  async upsertProduct(product) {
    if (!this.isConfigured()) return null;
    try {
      const primaryImg = product.mainImage || product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image_url || ""));
      const imgList = Array.isArray(product.images) && product.images.length > 0 
        ? product.images 
        : (Array.isArray(product.gallery) && product.gallery.length > 0 ? product.gallery : [primaryImg]);

      const dbProduct = {
        id: product.id,
        name: product.title || product.name,
        department: product.department || "Women",
        category: product.category || "Silk Sarees",
        fabric: product.fabric || "Kanchipuram Silk",
        price: Number(product.priceINR || product.price || 0),
        original_price: Number(product.originalPriceINR || product.original_price || 0),
        stock: product.stockCount ?? product.stock ?? 10,
        image_url: primaryImg,
        images: imgList,
        colors: Array.isArray(product.colors) ? product.colors : [],
        weave: product.weave || "Traditional Pit-Loom Weave",
        zari: product.zariType || product.zari || "Pure Gold Zari",
        occasion: product.occasion || "Wedding & Muhurtham",
        origin: product.origin || "Kanchipuram, Tamil Nadu",
        silk_mark: product.silkMarkCertified ?? true,
        handloom_mark: product.handloomMarkCertified ?? true,
        hsn_code: product.hsnCode || "50072010",
        description: product.description || ""
      };

      const { data, error } = await this.client.from("products").upsert([dbProduct], { onConflict: "id" });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase upsertProduct error:", err.message);
      return null;
    }
  }

  async deleteProduct(id) {
    if (!this.isConfigured()) return null;
    try {
      const { error } = await this.client.from("products").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Supabase deleteProduct error:", err.message);
      return false;
    }
  }

  async seedInitialCatalog(catalogList) {
    if (!this.isConfigured()) {
      return { success: false, message: "Supabase not configured. Please check your credentials in js/supabase-config.js." };
    }
    try {
      const formatted = catalogList.map(product => ({
        id: product.id,
        name: product.title || product.name,
        department: product.department || "Women",
        category: product.category || "Silk Sarees",
        fabric: product.fabric || "Kanchipuram Silk",
        price: Number(product.priceINR || product.price || 0),
        original_price: Number(product.originalPriceINR || product.original_price || 0),
        stock: product.stockCount ?? product.stock ?? 10,
        image_url: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || product.image_url || ""),
        images: Array.isArray(product.images) ? product.images : [product.image || product.image_url],
        colors: Array.isArray(product.colors) ? product.colors : [],
        weave: product.weave || "Traditional Pit-Loom Weave",
        zari: product.zariType || product.zari || "Pure Gold Zari",
        occasion: product.occasion || "Wedding & Muhurtham",
        origin: product.origin || "Kanchipuram, Tamil Nadu",
        silk_mark: product.silkMarkCertified ?? true,
        handloom_mark: product.handloomMarkCertified ?? true,
        hsn_code: product.hsnCode || "50072010",
        description: product.description || ""
      }));

      const { data, error } = await this.client.from("products").upsert(formatted, { onConflict: "id" });
      if (error) throw error;
      return { success: true, count: formatted.length, data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  // ==========================================
  // ORDERS SYNC & DIRECT UPI VERIFICATION WITH REALTIME
  // ==========================================
  async getOrders() {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await this.client.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return null;

      return data.map(row => ({
        orderId: row.order_id || row.id || row.orderId,
        id: row.id || row.order_id,
        date: row.date || (row.created_at ? row.created_at.replace("T", " ").slice(0, 16) : new Date().toISOString().slice(0, 16)),
        customer: row.customer || {
          name: row.customer_name || row.customer?.name || "Valued Patron",
          email: row.email || row.customer_email || row.customer?.email || "",
          phone: row.mobile_number || row.customer_phone || row.customer?.phone || "",
          address: row.shipping_address || row.customer?.address || ""
        },
        items: Array.isArray(row.cart_items) ? row.cart_items : (Array.isArray(row.items) ? row.items : []),
        cart_items: Array.isArray(row.cart_items) ? row.cart_items : (Array.isArray(row.items) ? row.items : []),
        totalAmountINR: Number(row.total_amount ?? row.amount ?? row.total_amount_inr ?? row.totalAmountINR ?? 0),
        total_amount: Number(row.total_amount ?? row.amount ?? row.total_amount_inr ?? row.totalAmountINR ?? 0),
        paymentMethod: row.payment_method || row.paymentMethod || "UPI",
        payment_method: row.payment_method || row.paymentMethod || "UPI",
        upi_ref_no: row.upi_ref_no || row.utr_number || row.transactionId || "",
        utr_number: row.utr_number || row.upi_ref_no || "",
        transactionId: row.upi_ref_no || row.utr_number || row.transactionId || "",
        status: row.status || (row.payment_status === "paid" ? "paid" : "pending"),
        paymentStatus: row.payment_status || row.paymentStatus || "pending",
        payment_status: row.payment_status || row.paymentStatus || "pending",
        fulfillmentStatus: row.fulfillment_status || row.fulfillmentStatus || "Pending Dispatch",
        courier: row.courier || "BlueDart Express",
        trackingNumber: row.tracking_number || row.trackingNumber || ("TRK" + Math.floor(10000000 + Math.random() * 90000000)),
        notes: row.notes || ""
      }));
    } catch (err) {
      console.warn("Supabase getOrders error:", err.message);
      return null;
    }
  }

  /**
   * Step 1: Create a Pending Order in Supabase when opening checkout
   * Status starts as 'pending' with locked checkout button.
   */
  async createPendingOrder(orderData) {
    const orderId = orderData.order_id || orderData.orderId || ("ST-ORD-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
    const customerName = orderData.customer_name || orderData.customer?.name || "Valued Patron";
    const mobileNumber = orderData.mobile_number || orderData.customer?.phone || "";
    const shippingAddress = orderData.shipping_address || orderData.customer?.address || "";
    const email = orderData.email || orderData.customer?.email || "";
    const totalAmount = Number(orderData.total_amount ?? orderData.amount ?? orderData.totalAmountINR ?? orderData.totalINR ?? 0);
    const cartItems = Array.isArray(orderData.cart_items) ? orderData.cart_items : (Array.isArray(orderData.items) ? orderData.items : []);

    const dbPayload = {
      order_id: orderId,
      customer_name: customerName,
      mobile_number: mobileNumber,
      shipping_address: shippingAddress,
      email: email,
      amount: totalAmount,
      total_amount: totalAmount,
      payment_method: "UPI",
      status: "pending",
      payment_status: "pending",
      utr_number: "",
      upi_ref_no: "",
      cart_items: cartItems,
      fulfillment_status: "Pending Dispatch",
      courier: "BlueDart Express",
      tracking_number: "TRK" + Math.floor(10000000 + Math.random() * 90000000)
    };

    if (!this.isConfigured()) {
      console.info("⚡ [Local Mode] Supabase not connected. Created pending order locally:", orderId);
      return { success: true, localOnly: true, data: dbPayload, orderId };
    }

    try {
      const { data, error } = await this.client
        .from("orders")
        .upsert([dbPayload], { onConflict: "order_id" })
        .select();

      if (error) throw error;
      console.info("⚡ [Supabase Cloud] Pending Order created for Realtime monitoring:", orderId);
      return { success: true, data: data ? data[0] : dbPayload, orderId };
    } catch (err) {
      console.warn("⚠️ Supabase createPendingOrder warning:", err.message);
      return { success: true, error: err.message, data: dbPayload, orderId };
    }
  }

  /**
   * Step 2: Supabase Realtime Listener (postgres_changes on orders table)
   * Broadcasts directly to client as soon as status becomes 'paid'.
   */
  subscribeToOrderPayment(orderId, onPaidCallback) {
    if (!this.isConfigured()) {
      console.info("⚡ [Supabase Realtime] Local simulation mode for order:", orderId);
      return null;
    }

    try {
      console.info(`⚡ [Supabase Realtime] Initializing channel listener for Order: ${orderId}`);
      
      const channel = this.client
        .channel(`order-status-${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `order_id=eq.${orderId}`
          },
          (payload) => {
            console.info("⚡ [Supabase Realtime] postgres_changes UPDATE received:", payload);
            const newRow = payload.new || {};
            const isPaid = (newRow.status === "paid" || newRow.payment_status === "paid" || newRow.payment_status === "VERIFIED");
            if (isPaid && typeof onPaidCallback === "function") {
              onPaidCallback(newRow);
            }
          }
        )
        .subscribe((status) => {
          console.info(`⚡ [Supabase Realtime] Channel status for order ${orderId}: ${status}`);
        });

      return channel;
    } catch (err) {
      console.warn("⚠️ Supabase Realtime subscription error:", err.message);
      return null;
    }
  }

  /**
   * Step 3: Payment Gateway Webhook / Simulated Settlement Trigger
   * Updates order status to 'paid' in Supabase -> Immediately triggers Realtime WebSocket broadcast!
   */
  async updateOrderToPaid(orderId, customUtr = null) {
    const utr = customUtr || `UPI/HDFC/TXN-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    if (!this.isConfigured()) {
      console.info("⚡ [Local Mode] Order marked as paid:", orderId, utr);
      return { success: true, localOnly: true, orderId, utrNumber: utr };
    }

    try {
      const { data, error } = await this.client
        .from("orders")
        .update({
          status: "paid",
          payment_status: "paid",
          utr_number: utr,
          upi_ref_no: utr
        })
        .eq("order_id", orderId)
        .select();

      if (error) throw error;
      console.info("⚡ [Supabase Webhook] Successfully updated order to 'paid' in Supabase:", orderId, utr);
      return { success: true, data: data ? data[0] : null, utrNumber: utr };
    } catch (err) {
      console.warn("⚠️ Supabase updateOrderToPaid error:", err.message);
      return { success: false, error: err.message, utrNumber: utr };
    }
  }

  unsubscribeChannel(channel) {
    if (channel && this.client) {
      try {
        this.client.removeChannel(channel);
      } catch (e) {
        console.warn("Channel cleanup:", e.message);
      }
    }
  }

  async verifyAndSaveUpiOrder(orderData) {
    return this.createPendingOrder(orderData);
  }

  async saveOrder(order) {
    return this.createPendingOrder(order);
  }

  async updatePaymentStatus(orderId, newPaymentStatus) {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await this.client
        .from("orders")
        .update({ payment_status: newPaymentStatus, status: newPaymentStatus })
        .eq("order_id", orderId);
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase updatePaymentStatus error:", err.message);
      return null;
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await this.client
        .from("orders")
        .update({ fulfillment_status: newStatus })
        .eq("order_id", orderId);
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase updateOrderStatus error:", err.message);
      return null;
    }
  }

  // ==========================================
  // FEEDBACKS & REVIEWS SYNC
  // ==========================================
  async getFeedbacks() {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await this.client.from("feedbacks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(f => ({
        id: f.id,
        name: f.customer_name,
        location: f.customer_location || "Chennai, Tamil Nadu",
        rating: f.rating || 5,
        comment: f.comment,
        verified: f.verified ?? true,
        date: f.created_at ? f.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
      }));
    } catch (err) {
      console.warn("Supabase getFeedbacks error:", err.message);
      return null;
    }
  }

  async saveFeedback(feedback) {
    if (!this.isConfigured()) return null;
    try {
      const dbFeedback = {
        customer_name: feedback.name || feedback.customer_name || "Patron",
        customer_location: feedback.location || feedback.customer_location || "Chennai, Tamil Nadu",
        rating: Number(feedback.rating || 5),
        comment: feedback.comment || feedback.message || "Exceptional silk quality",
        verified: true
      };

      const { data, error } = await this.client.from("feedbacks").insert([dbFeedback]);
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase saveFeedback error:", err.message);
      return null;
    }
  }

  // ==========================================
  // SUBSCRIBERS SYNC
  // ==========================================
  async saveSubscriber(email) {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await this.client.from("subscribers").upsert([{ email }]);
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase saveSubscriber error:", err.message);
      return null;
    }
  }
}

// Global initialization
window.supabaseService = new SupabaseService();
