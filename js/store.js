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
  FEEDBACK: "st_feedbacks_data_v2",
  BULK_ORDERS: "st_bulk_orders_data_v2",
  BULK_PACKAGES: "st_bulk_packages_data_v2",
  BULK_SETTINGS: "st_bulk_settings_data_v2",
  COUPONS: "st_coupons_data_v2",
  DELETED_COUPONS: "st_deleted_coupons_data_v2",
  FESTIVE_CAMPAIGN: "st_festive_campaign_v1"
};

const DEFAULT_FESTIVE_CAMPAIGN = {
  enabled: true,
  title: "LIMITED TIME FESTIVE SPECIAL 2026",
  badge: "🎉 LIMITED TIME FESTIVE SPECIAL 2026",
  headline: "Grand Festive & Wedding Handloom Offers",
  subtitle: "Celebrate your family milestones with exclusive seasonal vouchers, complimentary silver-tested purity certificates, and festive combo savings up to 22%.",
  countdownEnd: "2026-11-20T23:59:59",
  topBannerEnabled: true,
  topBannerText: "✨ LIMITED TIME FESTIVE SPECIAL 2026: Up to 22% OFF Family Combos + Complimentary Pure Silver Silk Mark Gifts! ✨",
  offers: [
    {
      id: "fo-1",
      code: "FESTIVE20",
      badge: "Family Bundle Special",
      title: "Flat 20% Off Family Combos",
      description: "Valid on all 4-piece and 2-piece synchronized color-matched festive ensembles.",
      discount: "20% OFF",
      isActive: true
    },
    {
      id: "fo-2",
      code: "BRIDAL15",
      badge: "Bridal Trousseau",
      title: "Flat 15% Off Bridal Korvai",
      description: "Exclusive on Pure Kanchipuram 3-ply bridal silks + Complimentary pure muslin saree cover.",
      discount: "15% OFF",
      isActive: true
    },
    {
      id: "fo-3",
      code: "KIDSGIFT",
      badge: "Kids Celebration",
      title: "₹1,000 Off Kids Wear",
      description: "On all scratch-free Girls' Pattu Pavadai & Boys' Dhoti orders over ₹5,000.",
      discount: "₹1,000 OFF",
      isActive: true
    },
    {
      id: "fo-4",
      code: "PREPAID500",
      badge: "Prepaid Privilege",
      title: "Instant ₹500 + Free Air Delivery",
      description: "Instant cashback discount on UPI / Card payments with free insured courier.",
      discount: "₹500 OFF",
      isActive: true
    }
  ],
  deals: [
    {
      id: "fd-1",
      productId: "ST-FAM-010",
      title: "Samanvaya 4-Piece Grand Muhurtham Combo",
      description: "Pure Kanchipuram Crimson & Gold attire for Father, Mother, Son & Daughter in unified dye baths.",
      image: "assets/images/family_matching_combo.jpg",
      originalPrice: 72000,
      festivePrice: 58500,
      badge: "🔥 Save ₹13,500 (19% OFF)",
      department: "Family Combos",
      isActive: true
    },
    {
      id: "fd-2",
      productId: "ST-FAM-012",
      title: "Vatsalya Mother & Daughter Silk Pair",
      description: "Matching Bridal Saree (Mother) & Stitched Silk Pattu Pavadai (Daughter) with soft cotton underside.",
      image: "assets/images/hero_banner.jpg",
      originalPrice: 48000,
      festivePrice: 39900,
      badge: "✨ Save ₹8,100 (17% OFF)",
      department: "Family Combos",
      isActive: true
    },
    {
      id: "fd-3",
      productId: "ST-FAM-013",
      title: "Pithamaha Father & Son Silk Wedding Pair",
      description: "Matching Pure Mulberry Silk Shirt & 8-Muzham Dhoti with Boys' Silk Jacquard Kurta & Elastic Dhoti.",
      image: "assets/images/mens_silk_dhoti.jpg",
      originalPrice: 25000,
      festivePrice: 19900,
      badge: "👔 Save ₹5,100 (20% OFF)",
      department: "Family Combos",
      isActive: true
    },
    {
      id: "fd-4",
      productId: "ST-INF-050",
      title: "GOTS Organic Newborn 3-Piece Festive Hamper",
      description: "100% Organic Muslin Cotton Jhabla, Swaddle Blanket & Cap with hypoallergenic herbal natural dyes.",
      image: "assets/images/infant_organic_jhabla.jpg",
      originalPrice: 3200,
      festivePrice: 2490,
      badge: "🌿 Save ₹710 (22% OFF)",
      department: "Born Babies",
      isActive: true
    }
  ],
  perks: [
    { icon: "✈️", title: "Free Insured Air Delivery", desc: "On all family orders over ₹1,999" },
    { icon: "🎁", title: "Complimentary Festive Gift Box", desc: "Gold-embossed royal keepsake gift boxes" },
    { icon: "🏛️", title: "SMOI Pure Silk Guarantee", desc: "Tested pure silver gold zari certificates" },
    { icon: "🛡️", title: "Scratch-Free Inner Linings", desc: "100% baby-safe cotton underside stitching" }
  ]
};

const DEFAULT_COUPONS = [
  {
    id: "cp-festive20",
    code: "FESTIVE20",
    badge: "Family Bundle Special",
    title: "Flat 20% Off Family Combos",
    discountType: "percent",
    discountPercent: 20,
    discountAmount: 0,
    minOrderValue: 0,
    maxDiscount: 15000,
    validUntil: "2027-12-31",
    isActive: true,
    description: "Valid on all 4-piece and 2-piece synchronized color-matched festive ensembles.",
    usageCount: 42,
    createdAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "cp-bridal15",
    code: "BRIDAL15",
    badge: "Bridal Trousseau",
    title: "Flat 15% Off Bridal Korvai",
    discountType: "percent",
    discountPercent: 15,
    discountAmount: 0,
    minOrderValue: 0,
    maxDiscount: 10000,
    validUntil: "2027-12-31",
    isActive: true,
    description: "Exclusive on Pure Kanchipuram 3-ply bridal silks + Complimentary pure muslin saree cover.",
    usageCount: 38,
    createdAt: "2024-01-20T00:00:00Z"
  },
  {
    id: "cp-kidsgift",
    code: "KIDSGIFT",
    badge: "Kids Celebration",
    title: "₹1,000 Off Kids Wear",
    discountType: "flat",
    discountPercent: 0,
    discountAmount: 1000,
    minOrderValue: 5000,
    maxDiscount: 1000,
    validUntil: "2027-12-31",
    isActive: true,
    description: "On all scratch-free Girls' Pattu Pavadai & Boys' Dhoti orders over ₹5,000.",
    usageCount: 19,
    createdAt: "2024-02-01T00:00:00Z"
  },
  {
    id: "cp-prepaid500",
    code: "PREPAID500",
    badge: "Prepaid Privilege",
    title: "Instant ₹500 + Free Air Delivery",
    discountType: "flat",
    discountPercent: 0,
    discountAmount: 500,
    minOrderValue: 0,
    maxDiscount: 500,
    validUntil: "2027-12-31",
    isActive: true,
    description: "Instant cashback discount on UPI / Card payments with free insured courier.",
    usageCount: 52,
    createdAt: "2024-02-10T00:00:00Z"
  },
  {
    id: "cp-heritage10",
    code: "HERITAGE10",
    badge: "Heritage Welcome",
    title: "Inaugural Heritage Privilege",
    discountType: "percent",
    discountPercent: 10,
    discountAmount: 0,
    minOrderValue: 1000,
    maxDiscount: 2000,
    validUntil: "2027-12-31",
    isActive: true,
    description: "Enjoy 10% privilege discount on all handloom pure silks across master collections.",
    usageCount: 18,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "cp-srinivasa15",
    code: "SRINIVASA15",
    badge: "Festival Grand",
    title: "Srinivasa Festival Grand Offer",
    discountType: "percent",
    discountPercent: 15,
    discountAmount: 0,
    minOrderValue: 3000,
    maxDiscount: 3500,
    validUntil: "2027-12-31",
    isActive: true,
    description: "Special 15% discount for festival celebrations on orders above ₹3,000.",
    usageCount: 32,
    createdAt: "2024-02-15T00:00:00Z"
  },
  {
    id: "cp-family5",
    code: "FAMILY5",
    badge: "Family Savings",
    title: "Family Bundle Privilege",
    discountType: "percent",
    discountPercent: 5,
    discountAmount: 0,
    minOrderValue: 500,
    maxDiscount: 1000,
    validUntil: "2027-12-31",
    isActive: true,
    description: "Instant 5% family bundle discount on any heirloom order.",
    usageCount: 45,
    createdAt: "2024-01-10T00:00:00Z"
  },
  {
    id: "cp-silk20",
    code: "SILK20",
    badge: "Pure Silk Special",
    title: "Pure Kanchipuram Silk Privilege",
    discountType: "percent",
    discountPercent: 20,
    discountAmount: 0,
    minOrderValue: 5000,
    maxDiscount: 5000,
    validUntil: "2027-12-31",
    isActive: true,
    description: "Grand 20% discount on pure wedding silk sarees for orders above ₹5,000.",
    usageCount: 14,
    createdAt: "2024-03-01T00:00:00Z"
  },
  {
    id: "cp-welcome10",
    code: "WELCOME10",
    badge: "New Patron",
    title: "New Customer Welcome Privilege",
    discountType: "percent",
    discountPercent: 10,
    discountAmount: 0,
    minOrderValue: 999,
    maxDiscount: 1500,
    validUntil: "2027-12-31",
    isActive: true,
    description: "10% privilege discount for new customers joining our heritage emporium.",
    usageCount: 27,
    createdAt: "2024-01-05T00:00:00Z"
  },
  {
    id: "cp-flat500",
    code: "FLAT500",
    badge: "Bridal Cashback",
    title: "Grand Bridal Flat ₹500 Off",
    discountType: "flat",
    discountPercent: 0,
    discountAmount: 500,
    minOrderValue: 4000,
    maxDiscount: 500,
    validUntil: "2027-12-31",
    isActive: true,
    description: "Flat ₹500 off on bridal attire and heavy zari silk selections above ₹4,000.",
    usageCount: 9,
    createdAt: "2024-03-10T00:00:00Z"
  }
];

const DEFAULT_SETTINGS = {
  storeName: "Srinivasa Textiles",
  tagline: "Master Weavers & Pure Silk Family Emporium Since 1978",
  phone: "6381265149",
  whatsapp: "6381265149",
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
    this.bulkOrders = this.load(STORE_KEYS.BULK_ORDERS, (typeof INITIAL_BULK_ORDERS !== "undefined" ? INITIAL_BULK_ORDERS : []));
    this.bulkPackages = this.load(STORE_KEYS.BULK_PACKAGES, (typeof DEFAULT_BULK_PACKAGES !== "undefined" ? DEFAULT_BULK_PACKAGES : []));
    if (!Array.isArray(this.bulkPackages) || this.bulkPackages.length === 0) {
      this.bulkPackages = (typeof DEFAULT_BULK_PACKAGES !== "undefined" ? JSON.parse(JSON.stringify(DEFAULT_BULK_PACKAGES)) : []);
      this.save(STORE_KEYS.BULK_PACKAGES, this.bulkPackages);
    }
    this.bulkSettings = this.load(STORE_KEYS.BULK_SETTINGS, (typeof DEFAULT_BULK_SETTINGS !== "undefined" ? DEFAULT_BULK_SETTINGS : { enabled: true }));
    this.cart = this.load(STORE_KEYS.CART, []);
    // Wishlist: Starts strictly at 0 items by default (empty array)
    const storedWishlist = this.load(STORE_KEYS.WISHLIST, []);
    this.wishlist = Array.isArray(storedWishlist) ? storedWishlist : [];
    this.save(STORE_KEYS.WISHLIST, this.wishlist);
    this.subscribers = this.load(STORE_KEYS.SUBSCRIBERS, INITIAL_SUBSCRIBERS);
    this.feedbacks = this.load(STORE_KEYS.FEEDBACK, (typeof INITIAL_REVIEWS !== "undefined" ? INITIAL_REVIEWS : []));
    this.coupons = this.load(STORE_KEYS.COUPONS, DEFAULT_COUPONS);
    if (!Array.isArray(this.coupons) || this.coupons.length === 0) {
      this.coupons = DEFAULT_COUPONS;
      this.save(STORE_KEYS.COUPONS, this.coupons);
    }
    this.deletedCoupons = this.load(STORE_KEYS.DELETED_COUPONS, []);

    // Ensure all default festive coupons exist unless explicitly deleted by store owner
    let couponsUpdated = false;
    DEFAULT_COUPONS.forEach(defCp => {
      const isDeleted = (this.deletedCoupons || []).some(d => (d.code || "").toUpperCase() === defCp.code.toUpperCase());
      const exists = (this.coupons || []).some(c => (c.code || "").toUpperCase() === defCp.code.toUpperCase());
      if (!isDeleted && !exists) {
        this.coupons.push(defCp);
        couponsUpdated = true;
      }
    });
    if (couponsUpdated) {
      this.save(STORE_KEYS.COUPONS, this.coupons);
    }

    this.lastUnavailableCoupon = null;
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
    this.setupRealtimeSync();
  }

  setupRealtimeSync() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.broadcastChannel = new BroadcastChannel("st_inventory_channel_v2");
        this.broadcastChannel.onmessage = (event) => {
          const data = event.data;
          if (data && (data.type === "STOCK_UPDATED" || data.type === "CATALOG_UPDATED")) {
            this.reloadCatalog();
            window.dispatchEvent(new CustomEvent("catalogUpdated", { detail: data }));
            window.dispatchEvent(new CustomEvent("stockUpdated", { detail: data }));
            window.dispatchEvent(new CustomEvent("productsUpdated", { detail: data }));
          } else if (data && data.type === "COUPONS_UPDATED") {
            this.coupons = this.load(STORE_KEYS.COUPONS, DEFAULT_COUPONS);
            this.deletedCoupons = this.load(STORE_KEYS.DELETED_COUPONS, []);
            this.validateActiveCoupon();
            window.dispatchEvent(new CustomEvent("couponsUpdated", { detail: { coupons: this.coupons, deletedCoupons: this.deletedCoupons, ...(data.payload || {}) } }));
          }
        };
      } catch (e) {
        console.warn("[BroadcastChannel] Sync init:", e);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === STORE_KEYS.COUPONS || e.key === STORE_KEYS.DELETED_COUPONS) {
          this.coupons = this.load(STORE_KEYS.COUPONS, DEFAULT_COUPONS);
          this.deletedCoupons = this.load(STORE_KEYS.DELETED_COUPONS, []);
          this.validateActiveCoupon();
          window.dispatchEvent(new CustomEvent("couponsUpdated", { detail: { coupons: this.coupons, deletedCoupons: this.deletedCoupons } }));
        }
      });
    }
  }

  reloadCatalog() {
    this.catalog = this.load(STORE_KEYS.CATALOG, INITIAL_CATALOG);
    return this.catalog;
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
      const parsedVal = Math.max(0, isNaN(parseInt(newStock, 10)) ? 0 : parseInt(newStock, 10));
      product.stock = parsedVal;
      this.save(STORE_KEYS.CATALOG, this.catalog);

      if (typeof window !== "undefined" && window.supabaseService) {
        try { window.supabaseService.upsertProduct(product); } catch (e) { }
      }
      if (typeof window !== "undefined" && window.API && window.API.isOnline) {
        try { window.API.updateProduct(id, { stock: parsedVal }); } catch (e) { }
      }

      const detail = { productId: id, stock: parsedVal, product, timestamp: Date.now() };
      window.dispatchEvent(new CustomEvent("catalogUpdated", { detail }));
      window.dispatchEvent(new CustomEvent("stockUpdated", { detail }));
      window.dispatchEvent(new CustomEvent("productsUpdated", { detail }));

      // Broadcast across all other open browser windows/tabs
      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage({
            type: "STOCK_UPDATED",
            productId: id,
            stock: parsedVal,
            title: product.title,
            timestamp: Date.now()
          });
        } catch (e) {
          console.warn("[BroadcastChannel] postMessage error:", e);
        }
      }

      return product;
    }
    return null;
  }

  getInventoryStats() {
    const catalog = this.getAllProducts();
    const totalSKUs = catalog.length;
    let totalStockUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let inStockCount = 0;

    catalog.forEach(p => {
      const stock = parseInt(p.stock, 10) || 0;
      totalStockUnits += stock;
      const threshold = p.lowStockThreshold || 2;
      if (stock <= 0) {
        outOfStockCount++;
      } else if (stock <= threshold) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    });

    return { totalSKUs, totalStockUnits, inStockCount, lowStockCount, outOfStockCount };
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

  // --- Dynamic Coupon Management Engine ---
  getCoupons() {
    if (!this.coupons || !Array.isArray(this.coupons)) {
      this.coupons = this.load(STORE_KEYS.COUPONS, DEFAULT_COUPONS);
    }
    return this.coupons;
  }

  getDeletedCoupons() {
    if (!this.deletedCoupons || !Array.isArray(this.deletedCoupons)) {
      this.deletedCoupons = this.load(STORE_KEYS.DELETED_COUPONS, []);
    }
    return this.deletedCoupons;
  }

  clearUnavailableNotice() {
    this.lastUnavailableCoupon = null;
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  getCouponById(id) {
    return (this.getCoupons()).find(c => c.id === id);
  }

  getCouponByCode(code) {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    return (this.getCoupons()).find(c => (c.code || "").toUpperCase() === clean);
  }

  saveCoupons(couponsList) {
    this.coupons = Array.isArray(couponsList) ? couponsList : [];
    this.save(STORE_KEYS.COUPONS, this.coupons);
    this.notifyCouponsUpdated();
  }

  addCoupon(data) {
    const code = (data.code || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!code) {
      return { success: false, message: "Coupon code cannot be empty. Use uppercase letters/numbers." };
    }

    const existing = this.getCouponByCode(code);
    if (existing) {
      return { success: false, message: `Coupon code "${code}" already exists! Please use Alter/Edit or choose a new code.` };
    }

    const discountType = data.discountType === "flat" ? "flat" : "percent";
    const discountPercent = discountType === "percent" ? Math.max(1, Math.min(100, parseFloat(data.discountPercent) || 10)) : 0;
    const discountAmount = discountType === "flat" ? Math.max(1, parseFloat(data.discountAmount) || 100) : 0;
    const minOrderValue = Math.max(0, parseFloat(data.minOrderValue) || 0);
    const maxDiscount = data.maxDiscount && parseFloat(data.maxDiscount) > 0 ? parseFloat(data.maxDiscount) : null;

    const newCoupon = {
      id: data.id || `cp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code,
      badge: (data.badge || "").trim(),
      title: (data.title || `${code} Promotional Privilege`).trim(),
      discountType,
      discountPercent,
      discountAmount,
      minOrderValue,
      maxDiscount,
      validUntil: data.validUntil || "",
      isActive: data.isActive !== false,
      description: (data.description || "").trim(),
      usageCount: 0,
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(this.coupons)) this.coupons = [];
    this.coupons.unshift(newCoupon);
    this.save(STORE_KEYS.COUPONS, this.coupons);
    this.notifyCouponsUpdated();
    return { success: true, message: `🎉 Coupon "${code}" created successfully!`, coupon: newCoupon };
  }

  updateCoupon(id, updatedData) {
    if (!Array.isArray(this.coupons)) this.coupons = [];
    const idx = this.coupons.findIndex(c => c.id === id);
    if (idx === -1) {
      return { success: false, message: "Coupon not found." };
    }

    const current = this.coupons[idx];
    const newCode = (updatedData.code || current.code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");

    if (newCode !== current.code) {
      const duplicate = this.coupons.find(c => c.id !== id && (c.code || "").toUpperCase() === newCode);
      if (duplicate) {
        return { success: false, message: `Coupon code "${newCode}" is already in use by another coupon.` };
      }
    }

    const discountType = updatedData.discountType ? (updatedData.discountType === "flat" ? "flat" : "percent") : current.discountType;
    const discountPercent = discountType === "percent"
      ? (updatedData.discountPercent !== undefined ? Math.max(1, Math.min(100, parseFloat(updatedData.discountPercent) || 0)) : current.discountPercent)
      : 0;
    const discountAmount = discountType === "flat"
      ? (updatedData.discountAmount !== undefined ? Math.max(1, parseFloat(updatedData.discountAmount) || 0) : (current.discountAmount || 100))
      : 0;
    const minOrderValue = updatedData.minOrderValue !== undefined ? Math.max(0, parseFloat(updatedData.minOrderValue) || 0) : current.minOrderValue;
    const maxDiscount = updatedData.maxDiscount !== undefined
      ? (updatedData.maxDiscount && parseFloat(updatedData.maxDiscount) > 0 ? parseFloat(updatedData.maxDiscount) : null)
      : current.maxDiscount;
    const isActive = updatedData.isActive !== undefined ? Boolean(updatedData.isActive) : current.isActive;

    const updated = {
      ...current,
      code: newCode,
      badge: updatedData.badge !== undefined ? updatedData.badge.trim() : (current.badge || ""),
      title: updatedData.title !== undefined ? updatedData.title.trim() : current.title,
      discountType,
      discountPercent,
      discountAmount,
      minOrderValue,
      maxDiscount,
      validUntil: updatedData.validUntil !== undefined ? updatedData.validUntil : current.validUntil,
      isActive,
      description: updatedData.description !== undefined ? updatedData.description.trim() : current.description,
      updatedAt: new Date().toISOString()
    };

    this.coupons[idx] = updated;

    this.save(STORE_KEYS.COUPONS, this.coupons);
    this.validateActiveCoupon();
    this.notifyCouponsUpdated({ action: "ALTER", coupon: updated });
    return { success: true, message: `✅ Coupon "${newCode}" updated successfully!`, coupon: updated };
  }

  deleteCoupon(id) {
    if (!Array.isArray(this.coupons)) this.coupons = [];
    const idx = this.coupons.findIndex(c => c.id === id);
    if (idx === -1) {
      return { success: false, message: "Coupon not found." };
    }
    const removed = this.coupons.splice(idx, 1)[0];
    removed.isDeleted = true;
    removed.isActive = false;

    if (!Array.isArray(this.deletedCoupons)) this.deletedCoupons = [];
    this.deletedCoupons = this.deletedCoupons.filter(c => (c.code || "").toUpperCase() !== (removed.code || "").toUpperCase());
    this.deletedCoupons.unshift(removed);
    if (this.deletedCoupons.length > 8) this.deletedCoupons.pop();

    this.save(STORE_KEYS.DELETED_COUPONS, this.deletedCoupons);
    this.save(STORE_KEYS.COUPONS, this.coupons);

    // If removed coupon was active in cart, mark as unavailable
    if (this.activeCoupon && this.activeCoupon.code === removed.code) {
      this.lastUnavailableCoupon = { code: removed.code, reason: "deleted" };
      if (this.usedCoupons) {
        this.usedCoupons.delete(removed.code);
      }
      this.activeCoupon = null;
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { unavailable: removed.code, reason: "deleted" } }));
    }

    this.notifyCouponsUpdated({ action: "DELETE", coupon: removed });
    return { success: true, message: `🗑️ Coupon "${removed.code}" removed successfully!` };
  }

  toggleCouponStatus(id) {
    const coupon = this.getCouponById(id);
    if (!coupon) return { success: false, message: "Coupon not found." };
    coupon.isActive = !coupon.isActive;
    coupon.updatedAt = new Date().toISOString();
    this.save(STORE_KEYS.COUPONS, this.coupons);

    if (!coupon.isActive && this.activeCoupon && this.activeCoupon.code === coupon.code) {
      this.lastUnavailableCoupon = { code: coupon.code, reason: "inactive" };
      if (this.usedCoupons) {
        this.usedCoupons.delete(coupon.code);
      }
      this.activeCoupon = null;
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { unavailable: coupon.code, reason: "inactive" } }));
    } else {
      this.validateActiveCoupon();
    }

    this.notifyCouponsUpdated({ action: coupon.isActive ? "ACTIVATE" : "DEACTIVATE", coupon });
    return {
      success: true,
      message: `Coupon "${coupon.code}" turned ${coupon.isActive ? "ON 🟢 (Visible on website)" : "OFF ⚫ (Removed from website & session)"}!`,
      isActive: coupon.isActive
    };
  }

  notifyCouponsUpdated(payload = {}) {
    try {
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: "COUPONS_UPDATED", coupons: this.coupons, deletedCoupons: this.deletedCoupons, payload });
      }
    } catch (e) { }
    window.dispatchEvent(new CustomEvent("couponsUpdated", { detail: { coupons: this.coupons, deletedCoupons: this.deletedCoupons, ...payload } }));
  }

  validateActiveCoupon() {
    if (!this.activeCoupon) return null;
    const currentCode = this.activeCoupon.code;
    const liveCoupon = this.getCouponByCode(currentCode);

    if (!liveCoupon) {
      this.activeCoupon = null;
      this.lastUnavailableCoupon = { code: currentCode, reason: "deleted" };
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { unavailable: currentCode, reason: "deleted" } }));
      return { status: "deleted", code: currentCode };
    }

    if (!liveCoupon.isActive) {
      this.activeCoupon = null;
      this.lastUnavailableCoupon = { code: currentCode, reason: "inactive" };
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { unavailable: currentCode, reason: "inactive" } }));
      return { status: "inactive", code: currentCode };
    }

    if (liveCoupon.validUntil) {
      const expDate = new Date(liveCoupon.validUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expDate < today) {
        this.activeCoupon = null;
        this.lastUnavailableCoupon = { code: currentCode, reason: "expired" };
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { unavailable: currentCode, reason: "expired" } }));
        return { status: "expired", code: currentCode };
      }
    }

    // Check if altered!
    const wasAltered = (
      this.activeCoupon.discountType !== liveCoupon.discountType ||
      this.activeCoupon.discountPercent !== liveCoupon.discountPercent ||
      this.activeCoupon.discountAmount !== liveCoupon.discountAmount ||
      this.activeCoupon.minOrderValue !== liveCoupon.minOrderValue ||
      this.activeCoupon.maxDiscount !== liveCoupon.maxDiscount ||
      this.activeCoupon.title !== liveCoupon.title
    );

    this.activeCoupon.discountType = liveCoupon.discountType;
    this.activeCoupon.discountPercent = liveCoupon.discountPercent;
    this.activeCoupon.discountAmount = liveCoupon.discountAmount;
    this.activeCoupon.minOrderValue = liveCoupon.minOrderValue;
    this.activeCoupon.maxDiscount = liveCoupon.maxDiscount;
    this.activeCoupon.title = liveCoupon.title;
    this.activeCoupon.label = liveCoupon.title || `${liveCoupon.code} Privilege`;

    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: wasAltered ? { altered: liveCoupon } : {} }));
    return { status: wasAltered ? "altered" : "valid", coupon: liveCoupon };
  }

  applyCoupon(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Please enter a valid promo code." };
    }

    // Check if coupon is in deletedCoupons
    const isDeleted = (this.deletedCoupons || []).some(c => (c.code || "").toUpperCase() === cleanCode);
    if (isDeleted) {
      return {
        success: false,
        isUnavailable: true,
        message: `⚠️ Promo code "${cleanCode}" is Not Available (Removed by Store Management)!`
      };
    }

    if (this.usedCoupons && this.usedCoupons.has(cleanCode) && (!this.activeCoupon || this.activeCoupon.code !== cleanCode)) {
      return {
        success: false,
        message: `⚠️ Promo code "${cleanCode}" is Unavailable (Already Used in this order)!`
      };
    }

    const match = this.getCouponByCode(cleanCode);

    if (match) {
      if (!match.isActive) {
        return {
          success: false,
          isUnavailable: true,
          message: `⚠️ Promo code "${cleanCode}" is currently turned OFF by store management!`
        };
      }

      if (match.validUntil) {
        const expDate = new Date(match.validUntil);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (expDate < today) {
          return {
            success: false,
            isUnavailable: true,
            message: `⚠️ Promo code "${cleanCode}" is Not Available (Expired on ${new Date(match.validUntil).toLocaleDateString("en-IN")})!`
          };
        }
      }

      const cartSubtotal = this.cart.reduce((acc, item) => acc + (item.unitPriceINR + (item.blouseExtraINR || 0)) * item.qty, 0);
      if (match.minOrderValue && cartSubtotal < match.minOrderValue) {
        return {
          success: false,
          message: `⚠️ Code "${cleanCode}" requires a minimum order of ₹${match.minOrderValue.toLocaleString("en-IN")}. Your subtotal: ₹${cartSubtotal.toLocaleString("en-IN")}.`
        };
      }

      const discountLabel = match.discountType === "flat"
        ? `₹${match.discountAmount} Flat OFF`
        : `${match.discountPercent}% OFF`;

      this.activeCoupon = {
        code: cleanCode,
        title: match.title,
        discountType: match.discountType,
        discountPercent: match.discountPercent || 0,
        discountAmount: match.discountAmount || 0,
        minOrderValue: match.minOrderValue || 0,
        maxDiscount: match.maxDiscount || null,
        label: match.title || `${cleanCode} (${discountLabel})`
      };

      // Clear unavailable notice
      this.lastUnavailableCoupon = null;

      if (this.usedCoupons) {
        this.usedCoupons.add(cleanCode);
      }
      match.usageCount = (match.usageCount || 0) + 1;
      this.save(STORE_KEYS.COUPONS, this.coupons);

      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return {
        success: true,
        message: `🎉 Success! Promo code "${cleanCode}" applied (${discountLabel})!`
      };
    }

    // Fallback: Check if code has a % number pattern like BALA10 or SAVE15
    const pctMatch = cleanCode.match(/(\d{1,2})$/);
    if (pctMatch) {
      const num = parseInt(pctMatch[1], 10);
      if (num > 0 && num <= 50) {
        this.activeCoupon = {
          code: cleanCode,
          title: `Special ${num}% Promo Privilege`,
          discountType: "percent",
          discountPercent: num,
          discountAmount: 0,
          label: `Special ${num}% Promo Privilege`
        };
        this.lastUnavailableCoupon = null;
        if (this.usedCoupons) {
          this.usedCoupons.add(cleanCode);
        }
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        return {
          success: true,
          message: `🎉 Success! Promo code "${cleanCode}" applied (${num}% OFF)!`
        };
      }
    }

    return {
      success: false,
      isUnavailable: true,
      message: `⚠️ Promo code "${cleanCode}" is Not Available!`
    };
  }

  removeCoupon() {
    if (this.activeCoupon && this.usedCoupons) {
      this.usedCoupons.delete(this.activeCoupon.code);
    }
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
      if (this.activeCoupon.discountType === "flat") {
        discountINR = Math.min(subtotalINR, this.activeCoupon.discountAmount || this.activeCoupon.discountValue || 0);
      } else {
        const pct = this.activeCoupon.discountPercent || 0;
        discountINR = Math.round((subtotalINR * pct) / 100);
        if (this.activeCoupon.maxDiscount && discountINR > this.activeCoupon.maxDiscount) {
          discountINR = this.activeCoupon.maxDiscount;
        }
      }
    }
    const giftWrapINR = this.includeGiftWrap ? this.settings.giftWrapPriceINR : 0;
    const discountedSubtotal = Math.max(0, subtotalINR - discountINR);
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
  // B2B WHOLESALE & BULK ORDERS MANAGEMENT
  // ==========================================
  getBulkOrders() {
    return this.bulkOrders || [];
  }

  getBulkOrderById(orderId) {
    if (!orderId) return null;
    return (this.bulkOrders || []).find(o => o.bulkOrderId === orderId || o.id === orderId);
  }

  addBulkOrder(orderData) {
    if (!orderData) return null;
    const year = new Date().getFullYear();
    const id = orderData.bulkOrderId || `ST-BLK-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const pieces = parseInt(orderData.totalPieces, 10) || 1;
    const subtotal = parseFloat(orderData.subtotalINR) || (parseFloat(orderData.totalAmountINR) ? Math.round(parseFloat(orderData.totalAmountINR) / 1.05) : 100000);
    const gst = parseFloat(orderData.gstINR) || Math.round(subtotal * 0.05);
    const total = parseFloat(orderData.totalAmountINR) || (subtotal + gst);
    const advance = parseFloat(orderData.advancePaidINR) || 0;
    const balance = Math.max(0, total - advance);

    const newOrder = {
      bulkOrderId: id,
      clientCompany: orderData.clientCompany || "Wholesale Partner",
      contactPerson: orderData.contactPerson || "Proprietor",
      phone: orderData.phone || "",
      email: orderData.email || "",
      gstin: orderData.gstin || "URP-WHOLESALE",
      address: orderData.address || "Tamil Nadu, India",
      orderType: orderData.orderType || "Wholesale",
      itemsDescription: orderData.itemsDescription || "Handloom Silk Sets & Pure Sarees",
      totalPieces: pieces,
      subtotalINR: subtotal,
      gstINR: gst,
      totalAmountINR: total,
      advancePaidINR: advance,
      balanceDueINR: balance,
      paymentStatus: orderData.paymentStatus || (balance <= 0 ? "Fully Paid" : advance > 0 ? "Advance Received" : "Pending Payment"),
      orderStatus: orderData.orderStatus || "Under Production",
      orderDate: orderData.orderDate || new Date().toISOString().split("T")[0],
      deliveryDeadline: orderData.deliveryDeadline || new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0],
      priority: orderData.priority || "Standard",
      productionUnit: orderData.productionUnit || "Kanchipuram Loom Sheds",
      notes: orderData.notes || "B2B Wholesale contract order"
    };

    if (!Array.isArray(this.bulkOrders)) this.bulkOrders = [];
    this.bulkOrders.unshift(newOrder);
    this.save(STORE_KEYS.BULK_ORDERS, this.bulkOrders);
    window.dispatchEvent(new CustomEvent("bulkOrdersUpdated", { detail: newOrder }));
    return newOrder;
  }

  updateBulkOrderStatus(bulkOrderId, newStatus) {
    const order = this.getBulkOrderById(bulkOrderId);
    if (!order) return false;
    order.orderStatus = newStatus;
    this.save(STORE_KEYS.BULK_ORDERS, this.bulkOrders);
    window.dispatchEvent(new CustomEvent("bulkOrdersUpdated", { detail: order }));
    return true;
  }

  updateBulkPaymentStatus(bulkOrderId, newPaymentStatus) {
    const order = this.getBulkOrderById(bulkOrderId);
    if (!order) return false;
    order.paymentStatus = newPaymentStatus;
    if (newPaymentStatus === "Fully Paid") {
      order.advancePaidINR = order.totalAmountINR;
      order.balanceDueINR = 0;
    }
    this.save(STORE_KEYS.BULK_ORDERS, this.bulkOrders);
    window.dispatchEvent(new CustomEvent("bulkOrdersUpdated", { detail: order }));
    return true;
  }

  deleteBulkOrder(bulkOrderId) {
    if (!this.bulkOrders) return false;
    const initialLen = this.bulkOrders.length;
    this.bulkOrders = this.bulkOrders.filter(o => o.bulkOrderId !== bulkOrderId && o.id !== bulkOrderId);
    if (this.bulkOrders.length !== initialLen) {
      this.save(STORE_KEYS.BULK_ORDERS, this.bulkOrders);
      window.dispatchEvent(new CustomEvent("bulkOrdersUpdated"));
      return true;
    }
    return false;
  }

  resetSampleBulkOrders() {
    this.bulkOrders = (typeof INITIAL_BULK_ORDERS !== "undefined") ? JSON.parse(JSON.stringify(INITIAL_BULK_ORDERS)) : [];
    this.save(STORE_KEYS.BULK_ORDERS, this.bulkOrders);
    window.dispatchEvent(new CustomEvent("bulkOrdersUpdated"));
    return this.bulkOrders;
  }

  getBulkOrderStats() {
    const orders = this.bulkOrders || [];
    let totalPieces = 0;
    let totalValue = 0;
    let advanceCollected = 0;
    let pendingBalance = 0;
    let activeProduction = 0;
    let readyToShip = 0;
    let dispatched = 0;

    orders.forEach(o => {
      totalPieces += parseInt(o.totalPieces, 10) || 0;
      totalValue += parseFloat(o.totalAmountINR) || 0;
      advanceCollected += parseFloat(o.advancePaidINR) || 0;
      pendingBalance += parseFloat(o.balanceDueINR) || 0;

      if (o.orderStatus === "Under Production") activeProduction++;
      else if (o.orderStatus === "Ready to Ship") readyToShip++;
      else if (o.orderStatus === "Dispatched") dispatched++;
    });

    return {
      totalOrders: orders.length,
      totalPieces,
      totalValue,
      advanceCollected,
      pendingBalance,
      activeProduction,
      readyToShip,
      dispatched
    };
  }

  // ==========================================
  // BULK STOREFRONT SETTINGS & ON/OFF ENGINE
  // ==========================================
  getBulkSettings() {
    if (!this.bulkSettings) {
      this.bulkSettings = this.load(STORE_KEYS.BULK_SETTINGS, (typeof DEFAULT_BULK_SETTINGS !== "undefined" ? DEFAULT_BULK_SETTINGS : { enabled: true }));
    }
    return this.bulkSettings;
  }

  saveBulkSettings(newSettings) {
    this.bulkSettings = { ...this.getBulkSettings(), ...newSettings };
    this.save(STORE_KEYS.BULK_SETTINGS, this.bulkSettings);
    window.dispatchEvent(new CustomEvent("bulkSettingsUpdated", { detail: this.bulkSettings }));
    return this.bulkSettings;
  }

  setBulkEnabled(enabled) {
    return this.saveBulkSettings({ enabled: Boolean(enabled) });
  }

  // ==========================================
  // WEBSITE BULK PACKAGES & OFFERINGS (CATALOG)
  // ==========================================
  getBulkPackages() {
    return this.bulkPackages || [];
  }

  getBulkPackageById(id) {
    return (this.bulkPackages || []).find(p => p.id === id);
  }

  addBulkPackage(data) {
    if (!data) return null;
    const id = data.id || `BLK-PKG-${Date.now().toString().slice(-4)}`;
    const wholesalePrice = parseFloat(data.wholesalePrice) || 3500;
    const retailMrp = parseFloat(data.retailMrp) || (wholesalePrice ? Math.round(wholesalePrice * 2) : 7000);
    const discountPercent = data.discountPercent || (retailMrp && wholesalePrice ? Math.round(((retailMrp - wholesalePrice) / retailMrp) * 100) : 50);

    const newPkg = {
      id,
      title: data.title || "Custom Handloom Bulk Lot",
      category: data.category || "Wholesale Lot",
      badge: data.badge || "✨ Verified Bulk Lot",
      moq: parseInt(data.moq, 10) || 15,
      unitLabel: data.unitLabel || "Pieces",
      wholesalePrice,
      retailMrp,
      discountPercent,
      timeline: data.timeline || "10-14 Working Days",
      fabric: data.fabric || "Pure Handloom Silk with Certified Silk Mark",
      description: data.description || "Direct pitloom woven authentic handloom collection for bulk buyers and wedding troupes.",
      inclusions: data.inclusions || "Matching unstitched blouses + Silk Mark authenticity tags + Insured shipping",
      image: data.image || "assets/images/family_matching_combo.jpg",
      isActive: data.isActive !== false,
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(this.bulkPackages)) this.bulkPackages = [];
    this.bulkPackages.unshift(newPkg);
    this.save(STORE_KEYS.BULK_PACKAGES, this.bulkPackages);
    window.dispatchEvent(new CustomEvent("bulkPackagesUpdated", { detail: newPkg }));
    return newPkg;
  }

  updateBulkPackage(id, updatedData) {
    const idx = (this.bulkPackages || []).findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.bulkPackages[idx] = { ...this.bulkPackages[idx], ...updatedData };
    this.save(STORE_KEYS.BULK_PACKAGES, this.bulkPackages);
    window.dispatchEvent(new CustomEvent("bulkPackagesUpdated", { detail: this.bulkPackages[idx] }));
    return true;
  }

  deleteBulkPackage(id) {
    if (!this.bulkPackages) return false;
    const initialLen = this.bulkPackages.length;
    this.bulkPackages = this.bulkPackages.filter(p => p.id !== id);
    if (this.bulkPackages.length !== initialLen) {
      this.save(STORE_KEYS.BULK_PACKAGES, this.bulkPackages);
      window.dispatchEvent(new CustomEvent("bulkPackagesUpdated"));
      return true;
    }
    return false;
  }

  toggleBulkPackageStatus(id) {
    const pkg = this.getBulkPackageById(id);
    if (!pkg) return false;
    pkg.isActive = !pkg.isActive;
    this.save(STORE_KEYS.BULK_PACKAGES, this.bulkPackages);
    window.dispatchEvent(new CustomEvent("bulkPackagesUpdated", { detail: pkg }));
    return pkg.isActive;
  }

  exportBulkOrdersToCSV() {
    const headers = [
      "Bulk_Order_ID", "Client_Company", "Contact_Person", "Phone_WhatsApp", "Email",
      "GSTIN", "Billing_Shipping_Address", "Order_Type", "Items_Description",
      "Total_Pieces", "Total_Amount_INR", "Advance_Paid_INR", "Balance_Due_INR",
      "Payment_Status", "Order_Status", "Order_Date", "Delivery_Deadline", "Priority", "Production_Unit", "Notes"
    ];

    const rows = (this.bulkOrders || []).map(o => [
      `"${(o.bulkOrderId || '').replace(/"/g, '""')}"`,
      `"${(o.clientCompany || '').replace(/"/g, '""')}"`,
      `"${(o.contactPerson || '').replace(/"/g, '""')}"`,
      `"${(o.phone || '').replace(/"/g, '""')}"`,
      `"${(o.email || '').replace(/"/g, '""')}"`,
      `"${(o.gstin || '').replace(/"/g, '""')}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${(o.orderType || 'Wholesale').replace(/"/g, '""')}"`,
      `"${(o.itemsDescription || '').replace(/"/g, '""')}"`,
      o.totalPieces || 0,
      o.totalAmountINR || 0,
      o.advancePaidINR || 0,
      o.balanceDueINR || 0,
      `"${(o.paymentStatus || 'Pending').replace(/"/g, '""')}"`,
      `"${(o.orderStatus || 'Under Production').replace(/"/g, '""')}"`,
      `"${(o.orderDate || '').replace(/"/g, '""')}"`,
      `"${(o.deliveryDeadline || '').replace(/"/g, '""')}"`,
      `"${(o.priority || 'Standard').replace(/"/g, '""')}"`,
      `"${(o.productionUnit || '').replace(/"/g, '""')}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }

  importBulkOrdersFromCSV(csvText) {
    try {
      const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) return { success: false, message: "CSV file is empty or does not contain data rows." };

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

        if (values.length >= 4) {
          const bulkOrderId = values[0] || `ST-BLK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const clientCompany = values[1] || "Wholesale Partner";
          const contactPerson = values[2] || "Proprietor";
          const phone = values[3] || "";
          const email = values[4] || "";
          const gstin = values[5] || "URP-WHOLESALE";
          const address = values[6] || "Tamil Nadu, India";
          const orderType = values[7] || "Wholesale";
          const itemsDescription = values[8] || "Handloom Silk Sets & Sarees";
          const totalPieces = parseInt(values[9], 10) || 10;
          const totalAmountINR = parseFloat(values[10]) || 150000;
          const advancePaidINR = parseFloat(values[11]) || Math.round(totalAmountINR * 0.5);
          const balanceDueINR = parseFloat(values[12]) || Math.max(0, totalAmountINR - advancePaidINR);
          const paymentStatus = values[13] || (balanceDueINR <= 0 ? "Fully Paid" : advancePaidINR > 0 ? "Advance Received" : "Pending Payment");
          const orderStatus = values[14] || "Under Production";
          const orderDate = values[15] || new Date().toISOString().split("T")[0];
          const deliveryDeadline = values[16] || new Date(Date.now() + 20 * 86400000).toISOString().split("T")[0];
          const priority = values[17] || "Standard";
          const productionUnit = values[18] || "Loom Sheds";
          const notes = values[19] || "CSV Imported bulk order";

          const subtotalINR = Math.round(totalAmountINR / 1.05);
          const gstINR = totalAmountINR - subtotalINR;

          const existingIndex = (this.bulkOrders || []).findIndex(o => o.bulkOrderId === bulkOrderId);
          const parsedOrder = {
            bulkOrderId,
            clientCompany,
            contactPerson,
            phone,
            email,
            gstin,
            address,
            orderType,
            itemsDescription,
            totalPieces,
            subtotalINR,
            gstINR,
            totalAmountINR,
            advancePaidINR,
            balanceDueINR,
            paymentStatus,
            orderStatus,
            orderDate,
            deliveryDeadline,
            priority,
            productionUnit,
            notes
          };

          if (existingIndex >= 0) {
            this.bulkOrders[existingIndex] = { ...this.bulkOrders[existingIndex], ...parsedOrder };
          } else {
            if (!Array.isArray(this.bulkOrders)) this.bulkOrders = [];
            this.bulkOrders.unshift(parsedOrder);
          }
          importedCount++;
        }
      }

      this.save(STORE_KEYS.BULK_ORDERS, this.bulkOrders);
      window.dispatchEvent(new CustomEvent("bulkOrdersUpdated"));
      return { success: true, count: importedCount };
    } catch (err) {
      console.error("Bulk CSV Import Error:", err);
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

  // ==========================================================================
  // FESTIVE CAMPAIGN 2026 OPERATIONS (REAL-TIME ENGINE)
  // ==========================================================================
  getFestiveCampaign() {
    try {
      const raw = localStorage.getItem(STORE_KEYS.FESTIVE_CAMPAIGN);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Object.assign({}, DEFAULT_FESTIVE_CAMPAIGN, parsed);
      }
    } catch (e) {
      console.warn("[Store] Error reading festive campaign:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_FESTIVE_CAMPAIGN));
  }

  saveFestiveCampaign(data, notify = true) {
    const current = this.getFestiveCampaign();
    const updated = Object.assign({}, current, data, { updatedAt: new Date().toISOString() });
    try {
      localStorage.setItem(STORE_KEYS.FESTIVE_CAMPAIGN, JSON.stringify(updated));
    } catch (e) {
      console.warn("[Store] Error saving festive campaign to localStorage:", e);
    }

    if (notify) {
      this.broadcastFestiveCampaign(updated);
    }
    return updated;
  }

  toggleFestiveCampaign(enabled) {
    const targetState = (enabled === undefined) ? !this.getFestiveCampaign().enabled : Boolean(enabled);
    return this.saveFestiveCampaign({ enabled: targetState });
  }

  broadcastFestiveCampaign(campaign) {
    // 1. In-window custom event
    try {
      window.dispatchEvent(new CustomEvent("festiveCampaignUpdated", { detail: campaign }));
    } catch (e) {}

    // 2. Cross-tab BroadcastChannel (instant 0ms synchronization)
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const ch = new BroadcastChannel("st_festive_channel_v1");
        ch.postMessage({ type: "FESTIVE_CAMPAIGN_UPDATED", campaign: campaign });
        ch.close();
      } catch (e) {}
    }

    // 3. Cloud Supabase Sync if active
    if (window.supabaseService && typeof window.supabaseService.syncFestiveCampaign === "function") {
      window.supabaseService.syncFestiveCampaign(campaign).catch(err => {
        console.warn("[Supabase] Festive sync note:", err);
      });
    }
  }

  resetFestiveCampaign() {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_FESTIVE_CAMPAIGN));
    return this.saveFestiveCampaign(fresh);
  }

  addFestiveOffer(offer) {
    const campaign = this.getFestiveCampaign();
    const offers = Array.isArray(campaign.offers) ? [...campaign.offers] : [];
    const newOffer = Object.assign({
      id: "fo-" + Date.now(),
      code: "FESTIVE" + Math.floor(10 + Math.random() * 90),
      badge: "Festive Special",
      title: "Festive Discount",
      description: "Special celebratory voucher for family handlooms.",
      discount: "15% OFF",
      isActive: true
    }, offer);
    offers.unshift(newOffer);
    return this.saveFestiveCampaign({ offers });
  }

  updateFestiveOffer(id, updatedFields) {
    const campaign = this.getFestiveCampaign();
    const offers = (campaign.offers || []).map(o => o.id === id ? Object.assign({}, o, updatedFields) : o);
    return this.saveFestiveCampaign({ offers });
  }

  deleteFestiveOffer(id) {
    const campaign = this.getFestiveCampaign();
    const offers = (campaign.offers || []).filter(o => o.id !== id);
    return this.saveFestiveCampaign({ offers });
  }

  addFestiveDeal(deal) {
    const campaign = this.getFestiveCampaign();
    const deals = Array.isArray(campaign.deals) ? [...campaign.deals] : [];
    const newDeal = Object.assign({
      id: "fd-" + Date.now(),
      productId: "ST-FAM-010",
      title: "Handloom Festive Ensemble",
      description: "Pure heirloom silk handloom woven for festival celebrations.",
      image: "assets/images/family_matching_combo.jpg",
      originalPrice: 10000,
      festivePrice: 8000,
      badge: "Festive Deal",
      department: "Family Combos",
      isActive: true
    }, deal);
    deals.unshift(newDeal);
    return this.saveFestiveCampaign({ deals });
  }

  updateFestiveDeal(id, updatedFields) {
    const campaign = this.getFestiveCampaign();
    const deals = (campaign.deals || []).map(d => d.id === id ? Object.assign({}, d, updatedFields) : d);
    return this.saveFestiveCampaign({ deals });
  }

  deleteFestiveDeal(id) {
    const campaign = this.getFestiveCampaign();
    const deals = (campaign.deals || []).filter(d => d.id !== id);
    return this.saveFestiveCampaign({ deals });
  }
}

// Global Store Singleton
window.store = new TextileStore();
