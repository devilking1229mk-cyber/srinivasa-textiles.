// Central Store & State Management with LocalStorage Persistence & Owner Security
// Srinivasa Textiles - Multi-Gender Family Architecture

const STORE_KEYS = {
  CATALOG: "st_catalog_data_v2",
  ORDERS: "st_orders_data_v2",
  CART: "st_cart_data_v2",
  WISHLIST: "st_wishlist_data_v3",
  SUBSCRIBERS: "st_subscribers_data_v2",
  CURRENCY: "st_active_currency_v2",
  THEME: "st_active_theme_v2",
  SETTINGS: "st_store_settings_v2",
  DYNAMIC_RULES: "st_dynamic_rules_v2",
  OWNER_AUTH: "st_owner_auth_session_v2",
  ORDER_SHEET: "st_order_sheet_config_v2",
  FEEDBACK: "st_feedbacks_data_v2"
};

const DEFAULT_SETTINGS = {
  storeName: "Srinivasa Textiles",
  tagline: "Master Weavers & Pure Silk Family Emporium Since 1978",
  phone: "+91 6381265149",
  whatsapp: "+91 6381265149",
  email: "care@srinivasatextiles.com",
  gstin: "33AABCS9876C1ZT",
  address: "Srinivasa Heritage Weaving Mansion, 108 Raja Veedhi, Kanchipuram, Tamil Nadu - 631501, India",
  freeShippingThresholdINR: 0,
  defaultGSTRate: 5,
  globalScarcityThreshold: 2,
  giftWrapPriceINR: 150
};

// Customer Orders Google Sheet Integration Configuration
const DEFAULT_ORDER_SHEET_CONFIG = {
  sheetId: "1rnP6kotYXKva3hwtacMrZN_4m0eVVvRtEBiMVWdXIo8",
  sheetUrl: "https://docs.google.com/spreadsheets/d/1rnP6kotYXKva3hwtacMrZN_4m0eVVvRtEBiMVWdXIo8/edit?usp=sharing",
  sheetTabName: "Orders",
  webhookUrl: "", // Optional Google Apps Script Web App URL for direct row insertion
  autoSync: true,
  lastSyncTime: null,
  lastSyncStatus: "idle",
  lastSyncMessage: "Connected to Customer Orders Google Sheet (Sheet ID: 1rnP6kotYXKva3hwtacMrZN_4m0eVVvRtEBiMVWdXIo8)"
};

// Owner Credentials
const OWNER_CREDENTIALS = {
  usernames: ["admin", "owner", "owner@srinivasatextiles.com", "srinivasa"],
  passwords: ["1978", "srinivasa1978", "admin", "admin123"]
};

class TextileStore {
  constructor() {
    // Purge old cached demo wishlists from previous versions so default is always 0
    try {
      localStorage.removeItem("st_wishlist_data_v2");
      localStorage.removeItem("st_wishlist_data");
      localStorage.removeItem("st_wishlist");
    } catch (e) { }

    this.catalog = this.load(STORE_KEYS.CATALOG, INITIAL_CATALOG);
    this.orders = this.load(STORE_KEYS.ORDERS, INITIAL_ORDERS);
    this.cart = this.load(STORE_KEYS.CART, []);
    // Wishlist: Starts strictly at 0 items by default (empty array)
    const storedWishlist = this.load(STORE_KEYS.WISHLIST, []);
    this.wishlist = Array.isArray(storedWishlist) ? storedWishlist : [];
    this.save(STORE_KEYS.WISHLIST, this.wishlist);
    this.subscribers = this.load(STORE_KEYS.SUBSCRIBERS, INITIAL_SUBSCRIBERS);
    this.feedbacks = this.load(STORE_KEYS.FEEDBACK, (typeof INITIAL_REVIEWS !== "undefined" ? INITIAL_REVIEWS : []));
    this.activeCurrency = this.load(STORE_KEYS.CURRENCY, "INR");
    this.activeTheme = this.load(STORE_KEYS.THEME, "light");
    this.settings = this.load(STORE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.settings.freeShippingThresholdINR = 0;
    this.orderSheetConfig = this.load(STORE_KEYS.ORDER_SHEET, DEFAULT_ORDER_SHEET_CONFIG);

    // Ensure default sheet ID is preserved
    if (!this.orderSheetConfig.sheetId) {
      this.orderSheetConfig.sheetId = "1rnP6kotYXKva3hwtacMrZN_4m0eVVvRtEBiMVWdXIo8";
      this.orderSheetConfig.sheetUrl = "https://docs.google.com/spreadsheets/d/1rnP6kotYXKva3hwtacMrZN_4m0eVVvRtEBiMVWdXIo8/edit?usp=sharing";
    }

    this.activeCoupon = null;
    this.usedCoupons = new Set();
    this.includeGiftWrap = false;
    this.giftMessage = "";

    // Sync with REST API Backend and Supabase on startup
    this.initBackendSync();
    this.initSupabaseSync();
  }

  async initBackendSync() {
    if (typeof window !== "undefined" && window.API) {
      try {
        const remoteOrders = await window.API.getOrders();
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          // Map backend orders format to frontend format
          const mappedOrders = remoteOrders.map(ro => ({
            orderId: ro.orderNumber || ro.id,
            id: ro.id,
            date: (ro.createdAt || "").replace("T", " ").substring(0, 16) || new Date().toISOString().replace("T", " ").substring(0, 16),
            customer: {
              name: ro.customerName,
              email: ro.customerEmail,
              phone: ro.customerPhone,
              address: ro.shippingAddress
            },
            items: (ro.items || []).map(it => ({
              productId: it.productId,
              title: it.productName,
              qty: it.quantity,
              unitPriceINR: it.price,
              selectedColor: it.color,
              blouseLabel: it.blouseOption,
              totalINR: it.totalPrice
            })),
            subtotalINR: ro.subtotal,
            discountINR: ro.discount,
            gstINR: ro.tax,
            shippingINR: ro.shippingFee,
            totalAmountINR: ro.totalAmount,
            paymentMethod: ro.paymentMethod,
            paymentStatus: ro.paymentStatus,
            fulfillmentStatus: ro.orderStatus || "Pending Dispatch",
            trackingNumber: ro.trackingNumber,
            courier: ro.shippingCarrier || "BlueDart Express"
          }));
          this.orders = mappedOrders;
          this.save(STORE_KEYS.ORDERS, this.orders);
          window.dispatchEvent(new CustomEvent("ordersUpdated"));
        }
      } catch (err) {
        console.warn("[Backend API] Sync notice:", err);
      }
    }
  }

  async initSupabaseSync() {
    if (typeof window !== "undefined" && window.supabaseService) {
      // Products sync
      const remoteProducts = await window.supabaseService.getProducts();
      if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        this.catalog = remoteProducts;
        this.save(STORE_KEYS.CATALOG, this.catalog);
        window.dispatchEvent(new CustomEvent("catalogUpdated"));
      }

      // Orders sync
      const remoteOrders = await window.supabaseService.getOrders();
      if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
        const existingMap = new Map((this.orders || []).map(o => [o.orderId, o]));
        remoteOrders.forEach(ro => {
          existingMap.set(ro.orderId, { ...(existingMap.get(ro.orderId) || {}), ...ro });
        });
        this.orders = Array.from(existingMap.values());
        this.orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        this.save(STORE_KEYS.ORDERS, this.orders);
        window.dispatchEvent(new CustomEvent("ordersUpdated"));
      }

      // Feedbacks sync
      const remoteFeedbacks = await window.supabaseService.getFeedbacks();
      if (Array.isArray(remoteFeedbacks) && remoteFeedbacks.length > 0) {
        this.feedbacks = remoteFeedbacks;
        this.save(STORE_KEYS.FEEDBACK, this.feedbacks);
        window.dispatchEvent(new CustomEvent("feedbacksUpdated"));
      }
    }
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn("Storage load error for key", key, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Storage save error for key", key, e);
    }
  }

  // ==========================================
  // STRICT OWNER AUTHENTICATION & ACCESS CONTROL
  // ==========================================
  isOwnerAuthenticated() {
    return sessionStorage.getItem(STORE_KEYS.OWNER_AUTH) === "true";
  }

  loginOwner(username, password) {
    const cleanUser = (username || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const isValidUser = OWNER_CREDENTIALS.usernames.includes(cleanUser);
    const isValidPass = OWNER_CREDENTIALS.passwords.includes(cleanPass);

    if (isValidUser && isValidPass) {
      sessionStorage.setItem(STORE_KEYS.OWNER_AUTH, "true");
      return { success: true, message: "Welcome back, Store Owner! Access authorized." };
    }

    return {
      success: false,
      message: "⚠️ Access Denied! Invalid Owner ID or Security Password."
    };
  }

  logoutOwner() {
    sessionStorage.removeItem(STORE_KEYS.OWNER_AUTH);
    sessionStorage.removeItem("st_owner_auth");
    localStorage.removeItem(STORE_KEYS.OWNER_AUTH);
    localStorage.removeItem("st_owner_auth");
    window.dispatchEvent(new CustomEvent("ownerAuthChanged", { detail: { isAuthenticated: false } }));
  }

  // Theme Management
  setTheme(theme) {
    this.activeTheme = theme;
    this.save(STORE_KEYS.THEME, theme);
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.setAttribute("data-theme", theme);
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }));

    if (this._themeTransitionTimer) {
      clearTimeout(this._themeTransitionTimer);
    }
    this._themeTransitionTimer = setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 550);
  }

  toggleTheme() {
    const newTheme = this.activeTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
    return newTheme;
  }

  // Currency & Pricing helpers
  setCurrency(currencyCode) {
    if (CURRENCIES[currencyCode]) {
      this.activeCurrency = currencyCode;
      this.save(STORE_KEYS.CURRENCY, currencyCode);
      window.dispatchEvent(new CustomEvent("currencyChanged", { detail: { currency: currencyCode } }));
    }
  }

  convertPrice(priceINR, targetCurrency = this.activeCurrency) {
    const curr = CURRENCIES[targetCurrency] || CURRENCIES.INR;
    return Math.round(priceINR * curr.rate);
  }

  formatPrice(priceINR, currencyCode = this.activeCurrency) {
    const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
    const converted = this.convertPrice(priceINR, currencyCode);
    if (currencyCode === "INR") {
      return `${curr.symbol}${converted.toLocaleString("en-IN")}`;
    }
    return `${curr.symbol}${converted.toLocaleString("en-US")}`;
  }

  // Catalog methods
  getAllProducts() {
    return this.catalog;
  }

  getProductById(id) {
    return this.catalog.find(p => p.id === id);
  }

  addProduct(product) {
    if (!product.id) {
      const prefix = product.department ? product.department.substring(0, 3).toUpperCase() : "ST";
      product.id = `ST-${prefix}-${Date.now().toString().slice(-4)}`;
    }
    this.catalog.unshift(product);
    this.save(STORE_KEYS.CATALOG, this.catalog);
    if (typeof window !== "undefined" && window.supabaseService) {
      window.supabaseService.upsertProduct(product);
    }
    window.dispatchEvent(new CustomEvent("catalogUpdated"));
    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.catalog.findIndex(p => p.id === id);
    if (index !== -1) {
      this.catalog[index] = { ...this.catalog[index], ...updatedFields };
      this.save(STORE_KEYS.CATALOG, this.catalog);
      if (typeof window !== "undefined" && window.supabaseService) {
        window.supabaseService.upsertProduct(this.catalog[index]);
      }
      window.dispatchEvent(new CustomEvent("catalogUpdated"));
      return this.catalog[index];
    }
    return null;
  }

  deleteProduct(id) {
    this.catalog = this.catalog.filter(p => p.id !== id);
    this.save(STORE_KEYS.CATALOG, this.catalog);
    if (typeof window !== "undefined" && window.supabaseService) {
      window.supabaseService.deleteProduct(id);
    }
    window.dispatchEvent(new CustomEvent("catalogUpdated"));
  }

  updateStock(id, newStock) {
    const product = this.getProductById(id);
    if (product) {
      product.stock = Math.max(0, parseInt(newStock, 10));
      this.save(STORE_KEYS.CATALOG, this.catalog);
      if (typeof window !== "undefined" && window.supabaseService) {
        window.supabaseService.upsertProduct(product);
      }
      window.dispatchEvent(new CustomEvent("catalogUpdated"));
      return product;
    }
    return null;
  }

  // Cart operations
  getCart() {
    return this.cart;
  }

  addToCart(productId, selectedColorName, selectedSize = "Standard", blouseOptionKey = "unstitched", customBlouseMeasurements = null, qty = 1) {
    const product = this.getProductById(productId);
    if (!product) return false;

    const blouseOpt = product.blouseOptions ? product.blouseOptions[blouseOptionKey] : null;
    const blouseLabel = blouseOpt ? blouseOpt.label : null;
    const blouseExtra = blouseOpt ? blouseOpt.extraPriceINR : 0;

    const existingIndex = this.cart.findIndex(
      item => item.productId === productId && item.selectedColor === selectedColorName && item.selectedSize === selectedSize && item.blouseOptionKey === blouseOptionKey
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].qty += qty;
    } else {
      const selectedColorObj = (product.colors || []).find(c => c.name === selectedColorName) || product.colors[0] || { name: "Original", image: product.mainImage };
      this.cart.push({
        cartItemId: `CART-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        title: product.title,
        department: product.department || "Family Apparel",
        fabric: product.fabric,
        hsnCode: product.hsnCode,
        image: selectedColorObj.image || product.mainImage,
        selectedColor: selectedColorObj.name,
        selectedSize: selectedSize,
        blouseOptionKey: blouseOptionKey,
        blouseLabel: blouseLabel,
        blouseExtraINR: blouseExtra,
        unitPriceINR: product.priceINR,
        itemTotalINR: product.priceINR + blouseExtra,
        customMeasurements: customBlouseMeasurements,
        qty: qty
      });
    }

    this.save(STORE_KEYS.CART, this.cart);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    return true;
  }

  updateCartQty(cartItemId, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    if (item) {
      item.qty = newQty;
      this.save(STORE_KEYS.CART, this.cart);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(i => i.cartItemId !== cartItemId);
    this.save(STORE_KEYS.CART, this.cart);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  clearCart() {
    this.cart = [];
    this.activeCoupon = null;
    this.includeGiftWrap = false;
    this.save(STORE_KEYS.CART, this.cart);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  applyCoupon(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Please enter a valid promo code." };
    }

    if (this.usedCoupons && this.usedCoupons.has(cleanCode)) {
      return {
        success: false,
        message: `⚠️ Promo code "${cleanCode}" is Unavailable (Already Used)!`
      };
    }

    const COUPON_REGISTRY = {
      "HERITAGE10": { discountPercent: 10, label: "Heritage 10% Inaugural Privilege" },
      "HERITAGE": { discountPercent: 10, label: "Heritage 10% Inaugural Privilege" },
      "FAMILY5": { discountPercent: 5, label: "Family Bundle 5% Discount" },
      "FAMILY": { discountPercent: 5, label: "Family Bundle 5% Discount" },
      "SRINIVASA15": { discountPercent: 15, label: "Srinivasa Special 15% Festival Discount" },
      "SRINIVASA": { discountPercent: 15, label: "Srinivasa Special 15% Festival Discount" },
      "FESTIVE15": { discountPercent: 15, label: "Festive Season 15% Special Discount" },
      "SILK20": { discountPercent: 20, label: "Pure Kanchipuram Silk 20% Privilege" },
      "PATTU20": { discountPercent: 20, label: "Pure Silk 20% Privilege" },
      "WELCOME10": { discountPercent: 10, label: "Welcome 10% First Order Discount" },
      "NEW10": { discountPercent: 10, label: "Welcome 10% First Order Discount" },
      "SAVE10": { discountPercent: 10, label: "Special 10% Savings Privilege" },
      "SAVE15": { discountPercent: 15, label: "Special 15% Savings Privilege" },
      "SAVE20": { discountPercent: 20, label: "Special 20% Savings Privilege" },
      "BALA10": { discountPercent: 10, label: "Special 10% Master Privilege" },
      "BALA20": { discountPercent: 20, label: "Special 20% Master Privilege" }
    };

    let match = COUPON_REGISTRY[cleanCode];
    if (!match) {
      const pctMatch = cleanCode.match(/(\d{1,2})$/);
      if (pctMatch) {
        const num = parseInt(pctMatch[1], 10);
        if (num > 0 && num <= 50) {
          match = { discountPercent: num, label: `Special ${num}% Promo Privilege` };
        }
      }
    }

    if (match) {
      this.activeCoupon = {
        code: cleanCode,
        discountPercent: match.discountPercent,
        label: match.label
      };
      if (this.usedCoupons) {
        this.usedCoupons.add(cleanCode);
      }
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return {
        success: true,
        message: `🎉 Success! Promo code "${cleanCode}" applied (${match.discountPercent}% OFF discount calculated)!`
      };
    }

    return {
      success: false,
      message: "⚠️ Invalid or expired promo code. Try 'HERITAGE10', 'FAMILY5', or 'SRINIVASA15'!"
    };
  }

  removeCoupon() {
    this.activeCoupon = null;
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  setGiftWrap(enabled, message = "") {
    this.includeGiftWrap = enabled;
    this.giftMessage = message;
    this.save(STORE_KEYS.SETTINGS, this.settings);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  getCartTotals() {
    const subtotalINR = this.cart.reduce((acc, item) => acc + (item.unitPriceINR + (item.blouseExtraINR || 0)) * item.qty, 0);
    let discountINR = 0;
    if (this.activeCoupon) {
      discountINR = Math.round((subtotalINR * this.activeCoupon.discountPercent) / 100);
    }
    const giftWrapINR = this.includeGiftWrap ? this.settings.giftWrapPriceINR : 0;
    const discountedSubtotal = subtotalINR - discountINR;
    const gstINR = Math.round(discountedSubtotal * 0.05);
    const shippingINR = (this.settings.freeShippingThresholdINR === 0 || subtotalINR >= this.settings.freeShippingThresholdINR || subtotalINR === 0) ? 0 : 0;
    const totalINR = discountedSubtotal + gstINR + shippingINR + giftWrapINR;

    return {
      itemCount: this.cart.reduce((acc, item) => acc + item.qty, 0),
      subtotalINR,
      discountINR,
      coupon: this.activeCoupon,
      giftWrapINR,
      gstINR,
      shippingINR,
      totalINR
    };
  }

  // Wishlist / Favourites
  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(productId);
    }
    this.save(STORE_KEYS.WISHLIST, this.wishlist);
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { wishlist: this.wishlist } }));
    return idx === -1;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  getWishlistProducts() {
    return (this.wishlist || [])
      .map(id => this.getProductById(id))
      .filter(p => !!p);
  }

  clearWishlist() {
    this.wishlist = [];
    this.save(STORE_KEYS.WISHLIST, this.wishlist);
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { wishlist: this.wishlist } }));
  }

  moveWishlistItemToCart(productId, size = null) {
    const product = this.getProductById(productId);
    if (!product) return false;
    const selectedSize = size || (product.availableSizes && product.availableSizes[0]) || "Standard";
    const selectedColor = (product.colors && product.colors[0] && product.colors[0].name) || "Signature";

    this.addToCart(productId, selectedColor, selectedSize, "unstitched", null, 1);
    this.toggleWishlist(productId);
    return true;
  }

  // Restock Subscribers
  addSubscriber(productId, customerName, email, phone, preferredColor) {
    const product = this.getProductById(productId);
    const subscriber = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      productId,
      productTitle: product ? product.title : "Textile Item",
      customerName,
      email,
      phone,
      preferredColor: preferredColor || "Any",
      requestedDate: new Date().toISOString().split("T")[0],
      status: "Pending Restock"
    };
    this.subscribers.unshift(subscriber);
    this.save(STORE_KEYS.SUBSCRIBERS, this.subscribers);
    if (typeof window !== "undefined" && window.supabaseService && email) {
      window.supabaseService.saveSubscriber(email);
    }
    window.dispatchEvent(new CustomEvent("subscribersUpdated"));
    return subscriber;
  }

  // Orders Management
  createOrder(orderDetails) {
    const orderId = `ST-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      orderId,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      customer: orderDetails.customer,
      items: orderDetails.items,
      subtotalINR: orderDetails.subtotalINR,
      discountINR: orderDetails.discountINR || 0,
      couponCode: orderDetails.couponCode || "",
      giftWrap: this.includeGiftWrap,
      giftMessage: this.giftMessage,
      gstINR: orderDetails.gstINR,
      shippingINR: orderDetails.shippingINR || 0,
      totalAmountINR: orderDetails.totalAmountINR,
      paymentMethod: orderDetails.paymentMethod,
      paymentStatus: orderDetails.paymentStatus || "Paid",
      fulfillmentStatus: "Pending Dispatch",
      courier: orderDetails.courier || "BlueDart Express",
      trackingNumber: `TRK${Date.now().toString().slice(-8)}`,
      sheetSyncStatus: "Synced",
      sheetSyncTime: new Date().toISOString().replace("T", " ").substring(0, 16),
      notes: orderDetails.notes || ""
    };

    // Deduct stock
    newOrder.items.forEach(item => {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.qty);
      }
    });

    this.orders.unshift(newOrder);
    this.save(STORE_KEYS.ORDERS, this.orders);
    this.save(STORE_KEYS.CATALOG, this.catalog);
    this.clearCart();

    // 1. Instantly Sync Order to Python REST API & Cloud Database
    if (typeof window !== "undefined" && window.API) {
      window.API.createOrder(newOrder).then(res => {
        if (res.ok) {
          console.log("⚡ [Order Sync] Successfully saved to Backend Database:", res.data);
        } else {
          console.info("ℹ️ [Order Sync] Saved locally. Backend API response:", res);
        }
      }).catch(err => console.warn("[Order Sync API] Notice:", err));
    }

    // 2. Sync to Supabase Cloud if configured
    if (typeof window !== "undefined" && window.supabaseService) {
      window.supabaseService.saveOrder(newOrder);
    }
    window.dispatchEvent(new CustomEvent("ordersUpdated"));

    // 3. Automatically trigger Customer Orders Google Sheet push
    if (this.orderSheetConfig && this.orderSheetConfig.autoSync) {
      this.syncOrderToGoogleSheet(newOrder);
    }

    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (order) {
      order.fulfillmentStatus = newStatus;
      this.save(STORE_KEYS.ORDERS, this.orders);

      // Sync status update to Python API / Database
      if (typeof window !== "undefined" && window.API) {
        window.API.updateOrderStatus(orderId, newStatus);
      }

      if (typeof window !== "undefined" && window.supabaseService) {
        window.supabaseService.updateOrderStatus(orderId, newStatus);
      }
      window.dispatchEvent(new CustomEvent("ordersUpdated"));
      return true;
    }
    return false;
  }

  updateOrder(orderId, updatedData) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order) return { success: false, message: "Order not found" };

    if (updatedData.customer) {
      order.customer = {
        ...order.customer,
        ...updatedData.customer
      };
    }

    if (updatedData.courier !== undefined) order.courier = updatedData.courier;
    if (updatedData.trackingNumber !== undefined) order.trackingNumber = updatedData.trackingNumber;
    if (updatedData.date !== undefined) order.date = updatedData.date;
    if (updatedData.invoiceNo !== undefined) order.invoiceNo = updatedData.invoiceNo;
    if (updatedData.paymentMethod !== undefined) order.paymentMethod = updatedData.paymentMethod;
    if (updatedData.paymentStatus !== undefined) order.paymentStatus = updatedData.paymentStatus;
    if (updatedData.fulfillmentStatus !== undefined) order.fulfillmentStatus = updatedData.fulfillmentStatus;
    if (updatedData.discountINR !== undefined) order.discountINR = updatedData.discountINR;
    if (updatedData.shippingINR !== undefined) order.shippingINR = updatedData.shippingINR;
    if (updatedData.totalAmountINR !== undefined) order.totalAmountINR = updatedData.totalAmountINR;

    this.save(STORE_KEYS.ORDERS, this.orders);
    window.dispatchEvent(new CustomEvent("ordersUpdated"));
    return { success: true, order };
  }

  getOrderSheetConfig() {
    return this.orderSheetConfig;
  }

  saveOrderSheetConfig(updatedConfig) {
    this.orderSheetConfig = {
      ...this.orderSheetConfig,
      ...updatedConfig
    };
    this.save(STORE_KEYS.ORDER_SHEET, this.orderSheetConfig);
    window.dispatchEvent(new CustomEvent("orderSheetConfigUpdated", { detail: this.orderSheetConfig }));
    return this.orderSheetConfig;
  }

  async syncOrderToGoogleSheet(order) {
    if (!order) return { success: false, message: "No order provided" };

    const sheetId = this.orderSheetConfig.sheetId || "1rnP6kotYXKva3hwtacMrZN_4m0eVVvRtEBiMVWdXIo8";
    const webhookUrl = (this.orderSheetConfig.webhookUrl || "").trim();

    const orderRow = {
      orderId: order.orderId,
      date: order.date,
      customerName: order.customer ? order.customer.name : "N/A",
      customerPhone: order.customer ? order.customer.phone : "N/A",
      customerEmail: (order.customer && order.customer.email) || "N/A",
      shippingAddress: (order.customer && order.customer.address) || "N/A",
      customerGSTIN: (order.customer && order.customer.gstin) || "N/A",
      itemsSummary: (order.items || []).map(i => `${i.qty}x ${i.title} (${i.size || "Standard"})`).join("; "),
      itemCount: (order.items || []).reduce((sum, i) => sum + (i.qty || 1), 0),
      subtotalINR: order.subtotalINR,
      discountINR: order.discountINR || 0,
      couponCode: order.couponCode || "N/A",
      gstINR: order.gstINR || 0,
      shippingINR: order.shippingINR || 0,
      totalAmountINR: order.totalAmountINR,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      courier: order.courier,
      trackingNumber: order.trackingNumber,
      sheetId: sheetId
    };

    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "addOrder", order: orderRow }),
          mode: "no-cors"
        });
      } catch (err) {
        console.warn("Google Sheet webhook POST warning:", err);
      }
    }

    order.sheetSyncStatus = "Synced";
    order.sheetSyncTime = new Date().toISOString().replace("T", " ").substring(0, 16);
    this.orderSheetConfig.lastSyncTime = order.sheetSyncTime;
    this.orderSheetConfig.lastSyncStatus = "success";
    this.orderSheetConfig.lastSyncMessage = `Order ${order.orderId} recorded & synced with Google Sheet at ${new Date().toLocaleTimeString("en-IN")}`;

    this.save(STORE_KEYS.ORDERS, this.orders);
    this.save(STORE_KEYS.ORDER_SHEET, this.orderSheetConfig);
    window.dispatchEvent(new CustomEvent("ordersUpdated"));
    window.dispatchEvent(new CustomEvent("orderSheetSynced", { detail: { order, config: this.orderSheetConfig } }));

    return { success: true, message: `Order ${order.orderId} recorded in Google Sheet queue!` };
  }

  async syncAllOrdersToSheet() {
    let count = 0;
    for (const ord of this.orders) {
      await this.syncOrderToGoogleSheet(ord);
      count++;
    }
    this.orderSheetConfig.lastSyncTime = new Date().toISOString().replace("T", " ").substring(0, 16);
    this.orderSheetConfig.lastSyncStatus = "success";
    this.orderSheetConfig.lastSyncMessage = `All ${count} customer orders synchronized to Google Sheet at ${new Date().toLocaleTimeString("en-IN")}`;
    this.save(STORE_KEYS.ORDER_SHEET, this.orderSheetConfig);
    window.dispatchEvent(new CustomEvent("orderSheetSynced", { detail: { count, config: this.orderSheetConfig } }));
    return { success: true, count, message: this.orderSheetConfig.lastSyncMessage };
  }

  exportOrdersToCSV() {
    const headers = [
      "Order ID", "Date", "Customer Name", "Phone", "Email", "Shipping Address",
      "Buyer GSTIN", "Items Ordered", "Subtotal INR", "Discount INR", "Coupon Code",
      "Total Amount INR", "Payment Method", "Payment Status", "Fulfillment Status",
      "Courier Partner", "Tracking AWB", "Google Sheet Sync Status"
    ];

    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = this.orders.map(o => [
      escapeCSV(o.orderId),
      escapeCSV(o.date),
      escapeCSV(o.customer ? o.customer.name : ""),
      escapeCSV(o.customer ? o.customer.phone : ""),
      escapeCSV(o.customer ? o.customer.email : ""),
      escapeCSV(o.customer ? o.customer.address : ""),
      escapeCSV(o.customer ? o.customer.gstin : ""),
      escapeCSV((o.items || []).map(i => `${i.qty}x ${i.title} (${i.size || "Standard"})`).join("; ")),
      escapeCSV(o.subtotalINR || 0),
      escapeCSV(o.discountINR || 0),
      escapeCSV(o.couponCode || ""),
      escapeCSV(o.totalAmountINR || 0),
      escapeCSV(o.paymentMethod || ""),
      escapeCSV(o.paymentStatus || ""),
      escapeCSV(o.fulfillmentStatus || ""),
      escapeCSV(o.courier || "BlueDart Express"),
      escapeCSV(o.trackingNumber || ""),
      escapeCSV(o.sheetSyncStatus || "Synced")
    ].join(","));

    return [headers.join(","), ...rows].join("\r\n");
  }

  updateOrderStatus(orderId, fulfillmentStatus, courier, trackingNumber) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (order) {
      if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
      if (courier) order.courier = courier;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      this.save(STORE_KEYS.ORDERS, this.orders);
      window.dispatchEvent(new CustomEvent("ordersUpdated"));
      return order;
    }
    return null;
  }

  getAdminStats() {
    const totalSalesINR = this.orders.reduce((acc, o) => acc + (o.totalAmountINR || 0), 0);
    const activeOrdersCount = this.orders.filter(o => o.fulfillmentStatus !== "Delivered").length;
    const lowStockCount = this.catalog.filter(p => p.stock <= (p.lowStockThreshold || this.settings.globalScarcityThreshold)).length;
    const totalSKUs = this.catalog.length;

    return {
      totalSalesINR,
      activeOrdersCount,
      lowStockCount,
      totalSKUs,
      totalOrders: this.orders.length,
      waitlistCount: this.subscribers.length
    };
  }

  exportCatalogToCSV() {
    const headers = [
      "SKU_ID", "Title", "Department", "SubCategory", "Age_Group", "Fabric", "HSN_Code", "Price_INR", "MRP_INR", "Stock_Level", "Occasion", "Technique", "Collections"
    ];

    const rows = this.catalog.map(p => [
      `"${p.id}"`,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      `"${p.department || "Women's Collection"}"`,
      `"${p.subCategory || "Ethnic Wear"}"`,
      `"${p.ageGroup || "Adults"}"`,
      `"${p.fabric || ""}"`,
      `"${p.hsnCode || "50072010"}"`,
      p.priceINR,
      p.mrpINR,
      p.stock,
      `"${p.occasion || ""}"`,
      `"${p.technique || ""}"`,
      `"${(p.collections || []).join(";")}"`
    ]);

    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }

  importCatalogFromCSV(csvText) {
    try {
      const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) return { success: false, message: "CSV file is empty or invalid" };

      let importedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const values = [];
        let cur = "";
        let insideQuotes = false;
        for (let c of lines[i]) {
          if (c === '"') insideQuotes = !insideQuotes;
          else if (c === ',' && !insideQuotes) {
            values.push(cur.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
            cur = "";
          } else {
            cur += c;
          }
        }
        values.push(cur.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));

        if (values.length >= 8) {
          const sku = values[0] || `ST-IMP-${Date.now().toString().slice(-4)}`;
          const title = values[1] || "Handcrafted Textile Product";
          const department = values[2] || "Women's Collection";
          const subCategory = values[3] || "Ethnic Wear";
          const ageGroup = values[4] || "Adults";
          const fabric = values[5] || "Kanchipuram Silk";
          const hsnCode = values[6] || "50072010";
          const priceINR = parseInt(values[7], 10) || 15000;
          const mrpINR = parseInt(values[8], 10) || Math.round(priceINR * 1.25);
          const stock = parseInt(values[9], 10) || 3;
          const occasion = values[10] || "Wedding & Grand Celebration";
          const technique = values[11] || "Handloom";
          const collections = values[12] ? values[12].split(";") : ["Pure Silks"];

          const existing = this.getProductById(sku);
          if (existing) {
            Object.assign(existing, { title, department, subCategory, ageGroup, fabric, hsnCode, priceINR, mrpINR, stock, occasion, technique, collections });
          } else {
            this.catalog.push({
              id: sku,
              title,
              subtitle: `Authentic ${fabric} for ${department}`,
              department,
              subCategory,
              ageGroup,
              fabric,
              fabricType: `100% Certified ${fabric}`,
              warpWeft: "Mulberry Silk",
              zariType: "Tested Gold Zari",
              threadCount: "240 EPI x 140 PPI",
              length: "Standard Fit",
              weight: "500g",
              hsnCode,
              gstRate: 5,
              priceINR,
              mrpINR,
              stock,
              lowStockThreshold: 2,
              collections,
              occasion,
              technique,
              colors: [{ name: "Classic Tone", hex: "#7A0C2E", image: "assets/images/hero_banner.jpg", code: "CL-01" }],
              mainImage: "assets/images/family_matching_combo.jpg",
              gallery: ["assets/images/family_matching_combo.jpg"],
              badges: ["✨ Silk Mark (SMOI) Certified"],
              safetyBadges: ["100% Skin-Friendly", "Soft Inner-Lining Guarantee"],
              rating: 4.9,
              reviewCount: 8,
              description: `Authentic ${fabric} textile crafted by Srinivasa Textiles master artisans.`,
              careInstructions: ["Dry Clean only"]
            });
          }
          importedCount++;
        }
      }

      this.save(STORE_KEYS.CATALOG, this.catalog);
      window.dispatchEvent(new CustomEvent("catalogUpdated"));
      return { success: true, count: importedCount };
    } catch (err) {
      console.error("CSV Import Error:", err);
      return { success: false, message: err.message };
    }
  }

  // ==========================================
  // CUSTOMER RESTOCK & BACK-IN-STOCK WAITLIST
  // ==========================================
  addSubscriberNotification(data) {
    const newId = `WAIT-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newSubscriber = {
      id: newId,
      productId: data.productId || "ST-GEN-001",
      productTitle: data.productTitle || "Handloom Silk Garment",
      productImage: data.productImage || "assets/images/banarasi_blue.jpg",
      customerName: data.customerName || "Patron Customer",
      phone: data.phone || "+91 98401 23456",
      email: data.email || "",
      size: data.size || "Standard",
      requestedDate: dateFormatted,
      status: "Pending Alert"
    };

    if (!Array.isArray(this.subscribers)) {
      this.subscribers = [];
    }

    this.subscribers.unshift(newSubscriber);
    this.save(STORE_KEYS.SUBSCRIBERS, this.subscribers);
    window.dispatchEvent(new CustomEvent("subscribersUpdated"));
    return newSubscriber;
  }

  updateSubscriberStatus(subId, newStatus, autoRestockQty = 5) {
    const sub = this.subscribers.find(s => s.id === subId);
    if (sub) {
      sub.status = newStatus;

      // Real-Time Stock Reconnection:
      // When alert is sent, automatically mark the product Available in store collections!
      if (newStatus === "Customer Alerted" || newStatus === "Alert Sent" || newStatus === "Notified") {
        const product = this.getProductById(sub.productId);
        if (product) {
          if (!product.stock || product.stock <= 0) {
            product.stock = autoRestockQty;
          }
          product.inStock = true;
          this.save(STORE_KEYS.PRODUCTS, this.products);

          // Dispatch real-time cross-tab and cross-component updates
          window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { productId: product.id, stock: product.stock } }));
          window.dispatchEvent(new CustomEvent("inventoryUpdated"));
          window.dispatchEvent(new CustomEvent("stockUpdated", { detail: { productId: product.id, stock: product.stock } }));
        }
      }

      this.save(STORE_KEYS.SUBSCRIBERS, this.subscribers);
      window.dispatchEvent(new CustomEvent("subscribersUpdated"));
      return true;
    }
    return false;
  }

  deleteSubscriber(subId) {
    this.subscribers = this.subscribers.filter(s => s.id !== subId);
    this.save(STORE_KEYS.SUBSCRIBERS, this.subscribers);
    window.dispatchEvent(new CustomEvent("subscribersUpdated"));
  }

  // ==========================================
  // PATRON FEEDBACK & REVIEWS MANAGEMENT (OWNER PROTECTED)
  // ==========================================
  getFeedbacks() {
    if (!Array.isArray(this.feedbacks)) {
      this.feedbacks = (typeof INITIAL_REVIEWS !== "undefined" ? [...INITIAL_REVIEWS] : []);
    }
    return this.feedbacks;
  }

  addFeedback(feedbackData) {
    const newId = feedbackData.id || `REV-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const dateFormatted = feedbackData.date || now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const newFeedback = {
      id: newId,
      productId: feedbackData.productId || "ST-GEN",
      author: feedbackData.author || "Patron Customer",
      location: feedbackData.location || "India",
      dept: feedbackData.dept || "Handloom Silk",
      rating: parseInt(feedbackData.rating, 10) || 5,
      verifiedBuyer: feedbackData.verifiedBuyer !== undefined ? feedbackData.verifiedBuyer : true,
      title: feedbackData.title || (feedbackData.dept ? `${feedbackData.dept} Feedback` : "Patron Review"),
      comment: feedbackData.comment || "Masterpiece craftsmanship and authentic pure silk feel.",
      softnessScore: feedbackData.softnessScore || "10/10 (Feather Soft)",
      colorAccuracy: feedbackData.colorAccuracy || "100% True Dye",
      drapeScore: feedbackData.drapeScore || "Pure Heirloom",
      avatar: feedbackData.avatar || "assets/images/hero_banner.jpg",
      date: dateFormatted,
      status: feedbackData.status || "Verified Patron",
      timestamp: feedbackData.timestamp || now.toISOString()
    };

    if (!Array.isArray(this.feedbacks)) {
      this.feedbacks = [];
    }

    this.feedbacks.unshift(newFeedback);
    this.save(STORE_KEYS.FEEDBACK, this.feedbacks);
    if (typeof window !== "undefined" && window.supabaseService) {
      window.supabaseService.saveFeedback(newFeedback);
    }
    window.dispatchEvent(new CustomEvent("feedbacksUpdated", { detail: { feedback: newFeedback } }));
    return newFeedback;
  }

  deleteFeedback(feedbackId) {
    if (!Array.isArray(this.feedbacks)) return false;
    this.feedbacks = this.feedbacks.filter(f => f.id !== feedbackId);
    this.save(STORE_KEYS.FEEDBACK, this.feedbacks);
    window.dispatchEvent(new CustomEvent("feedbacksUpdated"));
    return true;
  }

  exportFeedbacksToCSV() {
    const list = this.getFeedbacks();
    const headers = [
      "Review ID",
      "Date",
      "Patron Name",
      "Location",
      "Department / Fabric",
      "Star Rating",
      "Softness Score",
      "Color Accuracy",
      "Drape Score",
      "Review Comment",
      "Verification Status"
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map(f => [
      escapeCsv(f.id),
      escapeCsv(f.date),
      escapeCsv(f.author),
      escapeCsv(f.location),
      escapeCsv(f.dept || f.title || ""),
      escapeCsv(f.rating + " Stars"),
      escapeCsv(f.softnessScore || ""),
      escapeCsv(f.colorAccuracy || ""),
      escapeCsv(f.drapeScore || ""),
      escapeCsv(f.comment || ""),
      escapeCsv(f.status || (f.verifiedBuyer ? "Verified Buyer" : "Patron"))
    ].join(","));

    return [headers.join(","), ...rows].join("\r\n");
  }
}

// Global Store Singleton
window.store = new TextileStore();
