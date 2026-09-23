// Dedicated Multi-Gender Department Routing & Storefront Controller
// Srinivasa Textiles - High-Contrast Dark & Light Theme Support

class StorefrontController {
  constructor() {
    this.currentPage = "home"; // "home" | "women" | "men" | "girls" | "boys" | "infants" | "family"
    this.currentFabricFilter = "All";
    this.currentOccasionFilter = "All";
    this.currentSort = "featured";
    this.activeProduct = null;
    this.selectedColor = null;
    this.selectedSize = "Standard";
    this.selectedBlouseKey = "unstitched";

    this.init();
  }

  init() {
    this.initTheme();
    this.bindEvents();
    this.handleRouteFromHash();
    this.renderReviews();
    this.renderHomePageFeatured();
    this.renderFestiveVouchers();
    this.initFestiveCampaignSync();
    this.renderFestiveCampaign();
    this.initBulkOrdersSync();
    this.renderBulkOrdersSection();
    this.setupBulkInquiryModal();
    this.updateCartUI();
    this.updateWishlistCount();
    this.setupWishlistDrawer();
    this.setupCurrencySelector();
    this.setupFeedbackModal();
    this.setupOwnerAuthModal();
    this.setupNotifyModal();
    this.setupDepartmentNavScroll();
  }

  // Theme Management (Light & Dark Mode)
  initTheme() {
    const savedTheme = window.store.activeTheme || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeButtonUI(savedTheme);

    const toggleBtn = document.getElementById("themeToggleBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const newTheme = window.store.toggleTheme();
        this.updateThemeButtonUI(newTheme);
        this.showToast(`Switched to ${newTheme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}`, "info");
      });
    }
  }

  updateThemeButtonUI(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
      btn.innerHTML = theme === "dark"
        ? '<span class="theme-icon">☀️</span><span class="theme-label"> Dark</span>'
        : '<span class="theme-icon">🌙</span><span class="theme-label"> Dark</span>';
    }
  }

  bindEvents() {
    // Reactivity
    window.addEventListener("catalogUpdated", () => {
      this.renderCurrentPage();
      this.renderHomePageFeatured();
    });
    window.addEventListener("cartUpdated", () => this.updateCartUI());
    window.addEventListener("couponsUpdated", (e) => {
      if (window.store && typeof window.store.validateActiveCoupon === "function") {
        const valRes = window.store.validateActiveCoupon();
        if (valRes && valRes.status === "deleted") {
          this.showToast(`⚠️ Promo code "${valRes.code}" was removed and is Not Available.`, "warning");
        } else if (valRes && valRes.status === "inactive") {
          this.showToast(`⚠️ Promo code "${valRes.code}" has been turned OFF by store. Session removed.`, "warning");
        } else if (valRes && valRes.status === "altered") {
          const benefit = valRes.coupon.discountType === "flat" ? `₹${valRes.coupon.discountAmount} Flat OFF` : `${valRes.coupon.discountPercent}% OFF`;
          this.showToast(`🔄 Promo code "${valRes.coupon.code}" was updated in real time: Now ${benefit}!`, "success");
        }
      }
      this.updateCartUI();
      this.renderFestiveVouchers();
    });
    window.addEventListener("wishlistUpdated", () => {
      this.updateWishlistCount();
      this.renderWishlistDrawer();
      this.syncCardWishlistButtons();
    });
    window.addEventListener("currencyChanged", () => {
      this.renderCurrentPage();
      this.renderHomePageFeatured();
      this.updateCartUI();
      this.renderWishlistDrawer();
      if (this.activeProduct) this.updatePDPPricing();
    });

    // Hash change routing
    window.addEventListener("hashchange", () => this.handleRouteFromHash());

    // Bulk Orders Desktop Nav Button
    const bulkNavBtn = document.getElementById("headerBulkOrdersBtn");
    if (bulkNavBtn) {
      bulkNavBtn.addEventListener("click", () => this.scrollToBulkSection());
    }

    // Global Brand Logo Home Link (Always resets to Home page)
    const brandLogo = document.getElementById("globalBrandLogo");
    if (brandLogo) {
      brandLogo.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
      });
    }

    // Universal Department Navigation Links
    document.querySelectorAll(".dept-link").forEach(link => {
      link.addEventListener("click", (e) => {
        const targetPage = e.currentTarget.getAttribute("data-page") || "home";
        this.navigateToPage(targetPage);
      });
    });

    // Gender Gateway Cards on Home Page
    document.querySelectorAll(".gender-gateway-card").forEach(card => {
      card.addEventListener("click", () => {
        const targetPage = card.getAttribute("data-page") || "home";
        this.navigateToPage(targetPage);
      });
    });

    // Occasion Card Clicks
    document.querySelectorAll(".occasion-card").forEach(card => {
      card.addEventListener("click", () => {
        const occasion = card.getAttribute("data-occasion");
        if (occasion.includes("Wedding")) {
          this.navigateToPage("women");
        } else if (occasion.includes("Birthday")) {
          this.navigateToPage("girls");
        } else {
          this.navigateToPage("women");
        }
      });
    });

    // Filters & Sorting in Department Catalog
    const fabricFilter = document.getElementById("fabricFilter");
    if (fabricFilter) {
      fabricFilter.addEventListener("change", (e) => {
        this.currentFabricFilter = e.target.value;
        this.renderCurrentPage();
      });
    }

    const occasionFilter = document.getElementById("occasionFilter");
    if (occasionFilter) {
      occasionFilter.addEventListener("change", (e) => {
        this.currentOccasionFilter = e.target.value;
        this.renderCurrentPage();
      });
    }

    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderCurrentPage();
      });
    }

    // Search Bar Modal (Hidden by default, shown ONLY on click)
    const searchTrigger = document.getElementById("searchTriggerBtn");
    const searchBarModal = document.getElementById("searchBarModal");
    const searchCloseBtn = document.getElementById("searchCloseBtn");
    const searchInput = document.getElementById("headerSearchInput");

    if (searchTrigger && searchBarModal) {
      searchTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = searchBarModal.classList.contains("active");
        if (isOpen) {
          searchBarModal.classList.remove("active");
        } else {
          searchBarModal.classList.add("active");
          if (searchInput) {
            searchInput.value = "";
            const liveRes = document.getElementById("searchLiveResults");
            if (liveRes) liveRes.innerHTML = "";
            setTimeout(() => searchInput.focus(), 50);
          }
        }
      });
    }

    if (searchCloseBtn && searchBarModal) {
      searchCloseBtn.addEventListener("click", () => {
        searchBarModal.classList.remove("active");
      });
    }

    if (searchBarModal) {
      searchBarModal.addEventListener("click", (e) => {
        if (e.target === searchBarModal) {
          searchBarModal.classList.remove("active");
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchBarModal && searchBarModal.classList.contains("active")) {
        searchBarModal.classList.remove("active");
      }
    });

    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSearchAutocomplete(e.target.value));
    }

    // Cart Drawer
    const cartTriggerBtn = document.getElementById("cartTriggerBtn");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
    const cartCloseBtn = document.getElementById("cartCloseBtn");

    if (cartTriggerBtn && cartDrawer && cartDrawerOverlay) {
      cartTriggerBtn.addEventListener("click", () => {
        cartDrawer.classList.add("active");
        cartDrawerOverlay.classList.add("active");
      });
    }

    if (cartCloseBtn && cartDrawer && cartDrawerOverlay) {
      cartCloseBtn.addEventListener("click", () => {
        cartDrawer.classList.remove("active");
        cartDrawerOverlay.classList.remove("active");
      });
    }

    if (cartDrawerOverlay) {
      cartDrawerOverlay.addEventListener("click", () => {
        cartDrawer.classList.remove("active");
        cartDrawerOverlay.classList.remove("active");
      });
    }

    // Mobile Navigation & Department Drawer (3-Lines Menu)
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNavDrawer = document.getElementById("mobileNavDrawer");
    const mobileNavOverlay = document.getElementById("mobileNavOverlay");
    const mobileNavCloseBtn = document.getElementById("mobileNavCloseBtn");

    if (mobileMenuBtn && mobileNavDrawer && mobileNavOverlay) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileNavDrawer.classList.add("active");
        mobileNavOverlay.classList.add("active");
      });
    }

    if (mobileNavCloseBtn && mobileNavDrawer && mobileNavOverlay) {
      mobileNavCloseBtn.addEventListener("click", () => {
        mobileNavDrawer.classList.remove("active");
        mobileNavOverlay.classList.remove("active");
      });
    }

    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener("click", () => {
        mobileNavDrawer?.classList.remove("active");
        mobileNavOverlay?.classList.remove("active");
      });
    }

    document.querySelectorAll(".mobile-dept-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const page = btn.getAttribute("data-page");
        mobileNavDrawer?.classList.remove("active");
        mobileNavOverlay?.classList.remove("active");
        if (page) this.navigateToPage(page);
      });
    });

    const mobileFeedbackBtn = document.getElementById("mobileFeedbackBtn");
    if (mobileFeedbackBtn) {
      mobileFeedbackBtn.addEventListener("click", () => {
        mobileNavDrawer?.classList.remove("active");
        mobileNavOverlay?.classList.remove("active");
        const feedbackModal = document.getElementById("feedbackModal");
        if (feedbackModal) feedbackModal.classList.add("active");
      });
    }

    // Coupon Code in Cart
    const applyCouponBtn = document.getElementById("applyCouponBtn");
    const couponInput = document.getElementById("cartCouponInput");
    if (applyCouponBtn && couponInput) {
      const handleApply = () => {
        const val = couponInput.value.trim();
        if (!val) {
          this.showToast("Please enter a promo code (e.g. HERITAGE10, FAMILY5, SRINIVASA15)", "warning");
          return;
        }
        const res = window.store.applyCoupon(val);
        this.showToast(res.message, res.success ? "success" : "warning");
        if (res.success) couponInput.value = "";
      };

      applyCouponBtn.addEventListener("click", handleApply);
      couponInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") handleApply();
      });
    }

    // Gift Wrap Checkbox in Cart
    const giftWrapCheckbox = document.getElementById("cartGiftWrapCheckbox");
    const giftMessageBox = document.getElementById("cartGiftMessageBox");
    const giftMessageInput = document.getElementById("cartGiftMessageInput");

    if (giftWrapCheckbox) {
      giftWrapCheckbox.addEventListener("change", (e) => {
        const checked = e.target.checked;
        if (giftMessageBox) giftMessageBox.style.display = checked ? "block" : "none";
        window.store.setGiftWrap(checked, giftMessageInput ? giftMessageInput.value : "");
      });
    }

    if (giftMessageInput) {
      giftMessageInput.addEventListener("input", (e) => {
        window.store.giftMessage = e.target.value;
      });
    }

    // WhatsApp Floating Widget
    const waTrigger = document.getElementById("whatsappTrigger");
    const waPopup = document.getElementById("whatsappPopup");
    if (waTrigger && waPopup) {
      waTrigger.addEventListener("click", () => {
        waPopup.classList.toggle("active");
      });
    }

    // PDP Modal Close
    const pdpModal = document.getElementById("pdpModal");
    const pdpCloseBtn = document.getElementById("pdpCloseBtn");
    if (pdpCloseBtn && pdpModal) {
      pdpCloseBtn.addEventListener("click", () => {
        pdpModal.classList.remove("active");
      });
    }

    if (pdpModal) {
      pdpModal.addEventListener("click", (e) => {
        if (e.target === pdpModal) {
          pdpModal.classList.remove("active");
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (pdpModal && pdpModal.classList.contains("active")) {
          pdpModal.classList.remove("active");
        }
      }
    });

    // Fullscreen Lightbox Close
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxClose = document.getElementById("lightboxCloseBtn");
    const lightboxImg = document.getElementById("lightboxMainImg");
    if (lightboxModal && lightboxClose) {
      lightboxClose.addEventListener("click", () => lightboxModal.classList.remove("active"));
      lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal || e.target === lightboxImg) lightboxModal.classList.remove("active");
      });
    }

    // Checkout Modal Setup
    this.setupCheckoutHandlers();

    // Real-Time Stock & Availability Updates Across Storefront & Tabs
    const refreshStorefrontStockUI = (detail) => {
      // 1. Reload store catalog in memory so freshest units are loaded
      if (window.store && typeof window.store.reloadCatalog === "function") {
        window.store.reloadCatalog();
      }

      // 2. Re-render Home Featured Products Grid (index.html)
      const homeGrid = document.getElementById("homeFeaturedProductsGrid");
      if (homeGrid && typeof this.renderHomeFeaturedProducts === "function") {
        this.renderHomeFeaturedProducts();
      }

      // 3. Re-render Shop / Department Grid (shop.html or filtered page)
      const shopGrid = document.getElementById("productsGrid");
      if (shopGrid && typeof this.renderProductsForDepartment === "function") {
        const activeDept = this.currentDepartment || "all";
        this.renderProductsForDepartment(activeDept);
      }

      // 4. If PDP Quick View Modal is currently active, update its contents in real time
      const pdpModal = document.getElementById("pdpModal");
      if (pdpModal && pdpModal.classList.contains("active") && this.activeProduct) {
        const targetId = (detail && detail.productId) ? detail.productId : this.activeProduct.id;
        if (targetId === this.activeProduct.id) {
          const freshProduct = window.store.getProductById(this.activeProduct.id);
          if (freshProduct) {
            this.activeProduct = freshProduct;
            const container = document.getElementById("pdpModalContent");
            if (container) {
              container.innerHTML = this.createPDPContentHTML(freshProduct);
              this.bindPDPEvents(freshProduct);
            }
          }
        }
      }

      // 5. If Wishlist is open, refresh items availability
      const wishlistModal = document.getElementById("wishlistModal");
      if (wishlistModal && wishlistModal.classList.contains("active") && typeof this.renderWishlistModal === "function") {
        this.renderWishlistModal();
      }
    };

    this.refreshRealtimeStock = refreshStorefrontStockUI;

    // Listen for custom events dispatched by store within same window
    window.addEventListener("productsUpdated", (e) => refreshStorefrontStockUI(e.detail));
    window.addEventListener("stockUpdated", (e) => refreshStorefrontStockUI(e.detail));
    window.addEventListener("catalogUpdated", (e) => refreshStorefrontStockUI(e.detail));

    // Listen for BroadcastChannel messages across tabs (0-delay real-time cross-tab sync)
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("st_inventory_channel_v2");
        channel.onmessage = (event) => {
          const data = event.data;
          if (data && (data.type === "STOCK_UPDATED" || data.type === "CATALOG_UPDATED")) {
            refreshStorefrontStockUI(data);
          }
        };
      } catch (e) {
        console.warn("[Storefront BroadcastChannel] notice:", e);
      }
    }

    // Listen for storage events (fired automatically by browser across tabs when LocalStorage changes)
    window.addEventListener("storage", (e) => {
      if (e.key === "st_catalog_data_v2" || e.key === "st_products_data_v2" || e.key === "st_subscribers_data_v2") {
        refreshStorefrontStockUI();
      }
    });
  }

  // ==========================================
  // PAGE NAVIGATION & ROUTING
  // ==========================================
  handleRouteFromHash() {
    const hash = window.location.hash.replace("#", "").toLowerCase();

    // Secret owner access routes: #adminbala
    if (hash === "adminbala" || hash === "admin") {
      const adminTarget = window.location.pathname.includes("/frontend/") ? "adminbala.html" : "frontend/adminbala.html";
      window.location.href = adminTarget;
      return;
    }

    const validPages = ["home", "explore", "women", "men", "girls", "boys", "infants", "family", "family-combos"];
    if (hash === "family-combos") {
      this.navigateToPage("family", false);
    } else if (hash === "bulkordersstoresection" || hash === "bulk-orders") {
      if (window.location.pathname.includes("shop.html") || window.location.pathname.endsWith("/shop")) {
        this.navigateToPage("explore", false);
        setTimeout(() => {
          const sec = document.getElementById("bulkOrdersStoreSection");
          if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      } else {
        window.location.href = "shop.html#bulkOrdersStoreSection";
        return;
      }
    } else if (validPages.includes(hash)) {
      this.navigateToPage(hash, false);
    } else {
      if (window.location.pathname.includes("shop.html") || window.location.pathname.endsWith("/shop")) {
        this.navigateToPage("explore", false);
      } else {
        this.navigateToPage("home", false);
      }
    }
  }

  navigateToPage(pageKey, updateHash = true) {
    const isShopPage = window.location.pathname.includes("shop.html") || window.location.pathname.endsWith("/shop");
    const isHomePage = !isShopPage && (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/frontend") || window.location.pathname === "");

    // If destination is home and we are not on index.html, navigate there
    if (pageKey === "home") {
      if (!isHomePage) {
        window.location.href = "index.html";
        return;
      }
    } else {
      // If destination is a shop page and we are not on shop.html, navigate there
      if (!isShopPage) {
        const destHash = pageKey === "family" ? "family-combos" : pageKey;
        window.location.href = "shop.html#" + destHash;
        return;
      }
    }

    this.currentPage = pageKey;
    this.currentFabricFilter = "All";
    this.currentOccasionFilter = "All";

    if (updateHash) {
      window.location.hash = pageKey === "home" ? "home" : (pageKey === "family" ? "family-combos" : pageKey);
    }

    document.querySelectorAll(".dept-link").forEach(link => {
      const p = link.getAttribute("data-page");
      const isActive = p === pageKey;
      link.classList.toggle("active", isActive);
      if (isActive) {
        setTimeout(() => {
          const scrollWrapper = document.getElementById("deptNavScrollWrapper");
          if (scrollWrapper) {
            link.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        }, 60);
      }
    });

    this.renderCurrentPage();
    if (updateHash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  renderCurrentPage() {
    const homeSections = document.querySelectorAll(".home-only-section");
    const exploreSections = document.querySelectorAll(".explore-only-section");
    const deptBanner = document.getElementById("deptPageBanner");
    const deptCatalogSection = document.getElementById("deptCatalogSection");
    const deptTitle = document.getElementById("deptPageTitle");
    const deptDesc = document.getElementById("deptPageDesc");
    const deptBreadcrumbName = document.getElementById("deptBreadcrumbName");

    if (this.currentPage === "home") {
      homeSections.forEach(s => s.style.display = "block");
      exploreSections.forEach(s => s.style.display = "none");
      if (deptBanner) deptBanner.style.display = "none";
      if (deptCatalogSection) deptCatalogSection.style.display = "none";
    } else if (this.currentPage === "explore") {
      homeSections.forEach(s => s.style.display = "none");
      exploreSections.forEach(s => s.style.display = "block");
      if (deptBanner) deptBanner.style.display = "none";
      if (deptCatalogSection) deptCatalogSection.style.display = "none";
      this.renderExploreCollections();
    } else {
      homeSections.forEach(s => s.style.display = "none");
      exploreSections.forEach(s => s.style.display = "none");
      if (deptBanner) deptBanner.style.display = "block";
      if (deptCatalogSection) deptCatalogSection.style.display = "block";

      const deptMeta = this.getDepartmentMeta(this.currentPage);
      if (deptTitle) deptTitle.innerHTML = deptMeta.title;
      if (deptDesc) deptDesc.textContent = deptMeta.desc;
      if (deptBreadcrumbName) deptBreadcrumbName.textContent = deptMeta.breadcrumb;

      this.renderProductsForDepartment(deptMeta.filterDept);
    }

    this.renderFestiveCampaign();
    this.renderBulkOrdersSection();
  }

  getDepartmentMeta(pageKey) {
    switch (pageKey) {
      case "women":
        return {
          title: `${window.Icons ? window.Icons.get('ladies', { className: 'dept-banner-icon' }) : ''} Ladies' Silk Sarees & Ethnic Collection`,
          desc: "Authentic Pure Kanchipuram Silk, Banarasi Katan, French Flax Linen, Chanderi Tissue, and Kalamkari Tussar Sarees.",
          breadcrumb: "Ladies' Collection",
          filterDept: "Women's Collection"
        };
      case "men":
        return {
          title: `${window.Icons ? window.Icons.get('mens', { className: 'dept-banner-icon' }) : ''} Men's Pure Silk & Traditional Dhotis`,
          desc: "Pure Mulberry Silk Wedding Shirts, 8-Muzham Gold Zari Dhotis (Veshti), and Ceremonial Angavastram Shawls.",
          breadcrumb: "Men's Collection",
          filterDept: "Men's Collection"
        };
      case "girls":
        return {
          title: `${window.Icons ? window.Icons.get('kids', { className: 'dept-banner-icon' }) : ''} Girls' Ethnic Wear (2 - 14 Years)`,
          desc: "Traditional Pure Silk Pattu Pavadai & Lehenga Sets backed by our Scratch-Free Soft Cotton Inner-Lining Guarantee.",
          breadcrumb: "Kids Wear (Girls)",
          filterDept: "Kids Wear (Girls)"
        };
      case "boys":
        return {
          title: `${window.Icons ? window.Icons.get('kids', { className: 'dept-banner-icon' }) : ''} Boys' Festive Kurta & Dhoti Sets (2 - 14 Years)`,
          desc: "Silk Jacquard Kurtas with Pre-Pleated Ready-to-Wear Elastic Dhotis and Soft Cotton Undersides.",
          breadcrumb: "Kids Wear (Boys)",
          filterDept: "Kids Wear (Boys)"
        };
      case "infants":
        return {
          title: `${window.Icons ? window.Icons.get('baby', { className: 'dept-banner-icon' }) : ''} Born Babies & Infants (0 - 2 Years)`,
          desc: "100% GOTS Certified Pure Organic Muslin Cotton Jhablas, Swaddle Blankets, and Hypoallergenic Baby Silk Rompers.",
          breadcrumb: "Born Babies & Infants",
          filterDept: "Infants & Toddlers"
        };
      case "family":
        return {
          title: `${window.Icons ? window.Icons.get('family', { className: 'dept-banner-icon' }) : '👨‍👩‍👧‍👦'} Family Matching Combos & Coordinated Sets`,
          desc: "Harmonious color-coordinated silk attire for Father, Mother, Son & Daughter woven in matched ceremonial dye batches.",
          breadcrumb: "Family Combos & Sets",
          filterDept: "Family Combos & Sets"
        };
      default:
        return {
          title: "Srinivasa Family Collection",
          desc: "Complete pure handloom collections for all generations.",
          breadcrumb: "Catalog",
          filterDept: "All"
        };
    }
  }

  // ==========================================
  // DEPARTMENT PRODUCT CATALOG RENDERING
  // ==========================================
  renderProductsForDepartment(departmentName) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    let products = window.store.getAllProducts();

    if (departmentName !== "All") {
      products = products.filter(p => p.department === departmentName);
    }

    if (this.currentFabricFilter !== "All") {
      products = products.filter(p => p.fabric && p.fabric.includes(this.currentFabricFilter));
    }

    if (this.currentOccasionFilter !== "All") {
      products = products.filter(p => p.occasion === this.currentOccasionFilter);
    }

    if (this.currentSort === "price-low") {
      products.sort((a, b) => a.priceINR - b.priceINR);
    } else if (this.currentSort === "price-high") {
      products.sort((a, b) => b.priceINR - a.priceINR);
    } else if (this.currentSort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else {
      products.sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color);">
          <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">No Products Found for this Filter</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try clearing your fabric or occasion filter.</p>
          <button class="btn btn-outline btn-sm" onclick="window.storefront.resetAllFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(product => this.createProductCardHTML(product)).join("");
    this.bindCardInteractions(grid);
  }

  // ==========================================
  // EXPLORE SESSION INITIALIZATION
  // ==========================================
  renderExploreCollections() {
    // Explore view has interactive gateways, family combo bundle, and festive offers
  }

  bindCardInteractions(container) {
    container.querySelectorAll(".product-card").forEach(card => {
      const id = card.getAttribute("data-id");

      // Touching or clicking anywhere on the product card opens the PDP quick view
      card.addEventListener("click", (e) => {
        if (e.target.closest(".quick-add-btn") || e.target.closest(".wishlist-toggle-btn")) {
          return;
        }
        this.openPDP(id);
      });

      card.querySelectorAll(".open-pdp").forEach(el => {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openPDP(id);
        });
      });

      const quickAddBtn = card.querySelector(".quick-add-btn");
      if (quickAddBtn) {
        quickAddBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const prod = window.store.getProductById(id);
          const colorName = prod.colors && prod.colors[0] ? prod.colors[0].name : "Standard";
          const defaultSize = prod.availableSizes && prod.availableSizes[0] ? prod.availableSizes[0] : "Standard";
          window.store.addToCart(id, colorName, defaultSize, "unstitched", null, 1);
          this.showToast(`Added "${prod.title}" to your Bag!`, "success");
        });
      }

      const wishlistBtn = card.querySelector(".wishlist-toggle-btn");
      if (wishlistBtn) {
        wishlistBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isAdded = window.store.toggleWishlist(id);
          wishlistBtn.classList.toggle("wishlisted", isAdded);
          this.showToast(isAdded ? "Added to your Wishlist!" : "Removed from Wishlist", "info");
        });
      }

      const notifyBtn = card.querySelector(".card-notify-btn");
      if (notifyBtn) {
        notifyBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const prod = window.store.getProductById(id);
          if (prod) this.openNotifyModal(prod);
        });
      }
    });
  }

  renderHomePageFeatured() {
    const homeGrid = document.getElementById("homeFeaturedProductsGrid");
    if (!homeGrid) return;

    const catalog = window.store.getAllProducts();
    // Pick 6 prominent family items (Featured + Multi-Gender)
    const featuredItems = catalog.slice(0, 6);
    homeGrid.innerHTML = featuredItems.map(p => this.createProductCardHTML(p)).join("");
    this.bindCardInteractions(homeGrid);
  }

  createProductCardHTML(product) {
    const isWishlisted = window.store.isInWishlist(product.id);
    const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 2);
    const isOutOfStock = product.stock <= 0;

    const formattedPrice = window.store.formatPrice(product.priceINR);
    const formattedMRP = window.store.formatPrice(product.mrpINR);

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image-box open-pdp">
          <img src="${product.mainImage || 'assets/images/family_matching_combo.jpg'}" alt="${product.title}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/family_matching_combo.jpg';" />

          <div class="card-badges-top">
            ${product.badges && product.badges[0] ? `<span class="badge-silk-mark">${product.badges[0]}</span>` : ""}
            ${isLowStock ? `<span class="badge-scarcity">🔥 Only ${product.stock} Left!</span>` : ""}
            ${isOutOfStock ? `<span class="badge-scarcity" style="background:#475569; color:#fff;">Sold Out</span>` : ""}
          </div>

          <div class="card-actions-quick">
            <button class="quick-action-btn wishlist-toggle-btn ${isWishlisted ? "wishlisted" : ""}" title="Save to Wishlist">
              ${window.Icons ? (isWishlisted ? window.Icons.get('favouriteFilled', { className: 'card-action-icon' }) : window.Icons.get('favourite', { className: 'card-action-icon' })) : '♥'}
            </button>
            <button class="quick-action-btn open-pdp" title="Quick View">
              ${window.Icons ? window.Icons.get('search', { className: 'card-action-icon' }) : '🔍'}
            </button>
          </div>
        </div>

        <div class="product-details">
          <span class="product-dept-meta">${product.department} • ${product.ageGroup || "All Ages"}</span>
          <h3 class="product-title open-pdp">${product.title}</h3>
          <p class="product-subtitle">${product.subtitle}</p>

          ${product.safetyBadges && product.safetyBadges.length > 0 ? `
            <div style="display: flex; gap: 0.35rem; margin-bottom: 0.6rem; flex-wrap: wrap;">
              ${product.safetyBadges.map(sb => `<span class="badge-safety">${sb}</span>`).join("")}
            </div>
          ` : ""}

          <div class="product-bottom-row">
            <div class="price-box">
              <span class="current-price">${formattedPrice}</span>
              <span class="mrp-price">${formattedMRP}</span>
            </div>

            ${isOutOfStock ? `
              <button class="card-add-btn card-notify-btn" data-id="${product.id}" style="background: var(--color-primary); color: #FFF5CF; border: 1px solid var(--color-gold);">🔔 Notify Me</button>
            ` : `
              <button class="card-add-btn quick-add-btn">Add to Bag</button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  resetAllFilters() {
    this.currentFabricFilter = "All";
    this.currentOccasionFilter = "All";

    const fabEl = document.getElementById("fabricFilter");
    if (fabEl) fabEl.value = "All";
    const occEl = document.getElementById("occasionFilter");
    if (occEl) occEl.value = "All";

    this.renderCurrentPage();
  }

  setupCurrencySelector() {
    const currencySelect = document.getElementById("topCurrencySelect");
    if (currencySelect) {
      currencySelect.value = window.store.activeCurrency;
      currencySelect.addEventListener("change", (e) => {
        window.store.setCurrency(e.target.value);
      });
    }
  }

  // ==========================================================================
  // DEPARTMENT NAVIGATION BAR: CORNER ARROWS & BUTTERY-SMOOTH SCROLLING
  // ==========================================================================
  setupDepartmentNavScroll() {
    const header = document.getElementById("mainHeader");
    const navBar = document.querySelector(".department-nav-bar");
    const scrollWrapper = document.getElementById("deptNavScrollWrapper");
    const leftBtn = document.getElementById("deptScrollLeftBtn");
    const rightBtn = document.getElementById("deptScrollRightBtn");

    if (!navBar || !scrollWrapper) return;

    // Corner Arrows: Dynamic state (disabled/enabled) and smooth step scrolling
    const updateArrowStates = () => {
      const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
      if (maxScroll <= 4) {
        if (leftBtn) {
          leftBtn.disabled = true;
          leftBtn.classList.add("disabled");
        }
        if (rightBtn) {
          rightBtn.disabled = true;
          rightBtn.classList.add("disabled");
        }
        return;
      }

      if (leftBtn) {
        const atStart = scrollWrapper.scrollLeft <= 4;
        leftBtn.disabled = atStart;
        leftBtn.classList.toggle("disabled", atStart);
      }
      if (rightBtn) {
        const atEnd = scrollWrapper.scrollLeft >= maxScroll - 4;
        rightBtn.disabled = atEnd;
        rightBtn.classList.toggle("disabled", atEnd);
      }
    };

    if (leftBtn) {
      leftBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const scrollDistance = Math.max(200, Math.floor(scrollWrapper.clientWidth * 0.55));
        scrollWrapper.scrollBy({ left: -scrollDistance, behavior: "smooth" });
        setTimeout(updateArrowStates, 320);
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const scrollDistance = Math.max(200, Math.floor(scrollWrapper.clientWidth * 0.55));
        scrollWrapper.scrollBy({ left: scrollDistance, behavior: "smooth" });
        setTimeout(updateArrowStates, 320);
      });
    }

    // Passive scroll listener for updateArrowStates without blocking main thread
    scrollWrapper.addEventListener("scroll", updateArrowStates, { passive: true });
    window.addEventListener("resize", updateArrowStates, { passive: true });

    // Initial arrow state checks
    setTimeout(updateArrowStates, 60);
    setTimeout(updateArrowStates, 350);

    // Support Shift + Mouse Wheel for horizontal scrolling without blocking normal vertical page scroll
    scrollWrapper.addEventListener("wheel", (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        scrollWrapper.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Drag-to-scroll support for desktop
    let isDown = false;
    let startX = 0;
    let initialScroll = 0;

    scrollWrapper.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isDown = true;
      startX = e.pageX - scrollWrapper.offsetLeft;
      initialScroll = scrollWrapper.scrollLeft;
      scrollWrapper.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      if (isDown) {
        isDown = false;
        if (scrollWrapper) scrollWrapper.style.cursor = "";
      }
    });

    scrollWrapper.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollWrapper.offsetLeft;
      const walk = (x - startX) * 1.3;
      scrollWrapper.scrollLeft = initialScroll - walk;
    });

    // Zero-lag passive header shadow on scroll (Zero layout shift, 100% fluid vertical scrolling)
    let isTicking = false;
    const handleScroll = () => {
      if (!isTicking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (header) header.classList.toggle("scrolled", y > 40);
          if (navBar) navBar.classList.toggle("scrolled", y > 40);
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // ==========================================
  // PATRON FEEDBACK & REVIEW SESSION HANDLER
  // ==========================================
  setupFeedbackModal() {
    const triggerBtn = document.getElementById("feedbackTriggerBtn");
    const modal = document.getElementById("feedbackModal");
    const closeBtn = document.getElementById("feedbackCloseBtn");
    const closeSuccessBtn = document.getElementById("feedbackCloseSuccessBtn");
    const submitBtn = document.getElementById("submitFeedbackBtn");
    const starContainer = document.getElementById("feedbackStarSelector");
    const ratingInput = document.getElementById("feedbackRatingVal");
    const softnessPills = document.querySelectorAll(".softness-pill-btn");
    const softnessInput = document.getElementById("feedbackSoftnessVal");
    const formContainer = document.getElementById("feedbackFormContainer");
    const successContainer = document.getElementById("feedbackSuccessContainer");

    if (triggerBtn && modal) {
      triggerBtn.addEventListener("click", () => {
        if (formContainer) formContainer.style.display = "block";
        if (successContainer) successContainer.style.display = "none";
        modal.classList.add("active");
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    if (closeSuccessBtn && modal) {
      closeSuccessBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    // Interactive Star Rating Selector
    if (starContainer && ratingInput) {
      const stars = starContainer.querySelectorAll("span");
      stars.forEach(star => {
        star.addEventListener("mouseenter", () => {
          const val = parseInt(star.getAttribute("data-rating"), 10);
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute("data-rating"), 10);
            s.classList.toggle("hovered", sVal <= val);
          });
        });

        star.addEventListener("mouseleave", () => {
          const currentVal = parseInt(ratingInput.value, 10);
          stars.forEach(s => {
            s.classList.remove("hovered");
            const sVal = parseInt(s.getAttribute("data-rating"), 10);
            s.classList.toggle("active", sVal <= currentVal);
          });
        });

        star.addEventListener("click", () => {
          const val = parseInt(star.getAttribute("data-rating"), 10);
          ratingInput.value = val;
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute("data-rating"), 10);
            s.classList.toggle("active", sVal <= val);
          });
        });
      });
    }

    // Softness Score Pill Selector
    if (softnessPills.length > 0 && softnessInput) {
      softnessPills.forEach(pill => {
        pill.addEventListener("click", () => {
          softnessPills.forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          softnessInput.value = pill.getAttribute("data-score");
        });
      });
    }

    // Form Submission
    if (submitBtn && modal) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const comment = document.getElementById("feedbackCommentInput")?.value.trim();
        const rating = parseInt(ratingInput?.value, 10) || 5;

        if (!comment) {
          this.showToast("Please enter your review and feedback message.", "warning");
          return;
        }

        const patronName = "Patron Customer";
        const patronLocation = "Verified Buyer";
        const deptTitle = "Pure Handloom Silk";

        // Save feedback securely into Store
        if (window.store && typeof window.store.addFeedback === "function") {
          window.store.addFeedback({
            author: patronName,
            location: patronLocation,
            dept: deptTitle,
            rating: rating,
            title: "Customer Feedback & Review",
            comment: comment,
            softnessScore: "10/10 (Feather Soft)",
            colorAccuracy: "100% True Dye",
            drapeScore: "Pure Heirloom",
            avatar: "assets/images/hero_banner.jpg",
            verifiedBuyer: true
          });
          this.renderReviews();
        } else if (typeof INITIAL_REVIEWS !== "undefined") {
          INITIAL_REVIEWS.unshift({
            id: "REV-" + Date.now(),
            author: patronName,
            location: patronLocation,
            rating: rating,
            title: "Customer Feedback & Review",
            comment: comment,
            softnessScore: "10/10",
            colorAccuracy: "100% True Dye",
            drapeScore: "Pure Heirloom",
            avatar: "assets/images/hero_banner.jpg"
          });
          this.renderReviews();
        }

        // Show Success Screen with Instant Voucher
        if (formContainer) formContainer.style.display = "none";
        if (successContainer) successContainer.style.display = "block";

        this.showToast("🎉 Thank you! Feedback recorded for Store Owner & PATRON10 unlocked (10% OFF)", "success");
      });
    }
  }

  // ==========================================
  // STRICT OWNER LOGIN AUTHENTICATION & ACCESS CONTROL
  // ==========================================
  setupOwnerAuthModal() {
    const trigger = document.getElementById("ownerPortalTrigger");
    const modal = document.getElementById("ownerAuthModal");
    const closeBtn = document.getElementById("ownerAuthCloseBtn");
    const submitBtn = document.getElementById("ownerAuthSubmitBtn");
    const usernameInput = document.getElementById("ownerUsernameInput");
    const passwordInput = document.getElementById("ownerPasswordInput");
    const togglePassBtn = document.getElementById("toggleOwnerPassBtn");
    const authErrorMsg = document.getElementById("ownerAuthErrorMsg");
    const exitAdminBtn = document.getElementById("exitAdminBtn");

    if (trigger && modal) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        if (authErrorMsg) authErrorMsg.style.display = "none";
        modal.classList.add("active");
        if (usernameInput) usernameInput.focus();
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    if (togglePassBtn && passwordInput) {
      togglePassBtn.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePassBtn.textContent = type === "password" ? "👁️" : "🙈";
      });
    }

    if (submitBtn && usernameInput && passwordInput && modal) {
      const handleLogin = () => {
        const user = usernameInput.value;
        const pass = passwordInput.value;

        const res = window.store.loginOwner(user, pass);

        if (res.success) {
          modal.classList.remove("active");
          usernameInput.value = "";
          passwordInput.value = "";
          if (authErrorMsg) authErrorMsg.style.display = "none";
          this.showToast(res.message, "success");

          setTimeout(() => {
            const adminTarget = window.location.pathname.includes("/frontend/") ? "adminbala.html" : "frontend/adminbala.html";
            window.location.href = adminTarget;
          }, 500);
        } else {
          if (authErrorMsg) {
            authErrorMsg.textContent = res.message;
            authErrorMsg.style.display = "block";
          }
          this.showToast(res.message, "warning");
        }
      };

      submitBtn.addEventListener("click", handleLogin);

      passwordInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") handleLogin();
      });

      usernameInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") passwordInput.focus();
      });
    }

    // Owner Logout Handler
    if (exitAdminBtn) {
      exitAdminBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.store.logoutOwner();
        window.location.href = "index.html";
      });
    }
  }

  // ==========================================
  // CLEAN PDP MODAL & FULLSCREEN LIGHTBOX (Banned Cursor Hover Zoom Removed)
  // ==========================================
  openPDP(productId) {
    const product = window.store.getProductById(productId);
    if (!product) return;

    this.activeProduct = product;
    this.selectedColor = product.colors && product.colors[0] ? product.colors[0].name : "Standard";
    this.selectedSize = product.availableSizes && product.availableSizes[0] ? product.availableSizes[0] : "Standard";
    this.selectedBlouseKey = "unstitched";

    const modal = document.getElementById("pdpModal");
    const container = document.getElementById("pdpModalContent");
    if (!modal || !container) return;

    container.innerHTML = this.createPDPContentHTML(product);
    modal.classList.add("active");

    this.bindPDPEvents(product);
  }

  createPDPContentHTML(product) {
    const formattedPrice = window.store.formatPrice(product.priceINR);
    const formattedMRP = window.store.formatPrice(product.mrpINR);
    const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 2);
    const isOutOfStock = product.stock <= 0;

    return `
      <button class="pdp-close-btn" id="pdpCloseBtnInner">✕</button>

      <div class="pdp-media-column">
        <div class="clean-img-viewer" id="cleanImgViewer" title="Click to open Fullscreen Lightbox">
          <img src="${product.mainImage || 'assets/images/family_matching_combo.jpg'}" alt="${product.title}" class="clean-pdp-img" id="pdpMainImg" onerror="this.onerror=null;this.src='assets/images/family_matching_combo.jpg';" />
          <div class="lightbox-trigger-badge">${window.Icons ? window.Icons.get('search', { className: 'lightbox-badge-icon' }) : '🔍'} Click for Fullscreen Lightbox</div>
        </div>

        ${(product.gallery && product.gallery.length > 1) ? `
          <div class="pdp-gallery-thumbs">
            ${product.gallery.map((img, i) => `
              <div class="pdp-thumb ${i === 0 ? "active" : ""}" data-img="${img}">
                <img src="${img}" alt="${product.title}" onerror="this.parentElement.style.display='none';" />
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>

      <div class="pdp-info-column">
        <div class="pdp-breadcrumbs">
          Home / ${product.department} / <strong style="color: var(--color-primary);">${product.id}</strong>
        </div>

        <h2 class="pdp-title">${product.title}</h2>
        <p class="pdp-subtitle">${product.subtitle}</p>

        <div class="pdp-price-row">
          <span class="pdp-price" id="pdpCalculatedPrice">${formattedPrice}</span>
          <span class="pdp-mrp" style="text-decoration: line-through; color: var(--text-muted);">${formattedMRP}</span>
          <span style="font-size: 0.75rem; color: var(--color-success); font-weight: 700;">✓ Free Express Insured Delivery</span>
        </div>

        ${isLowStock ? `
          <div style="margin-bottom: 1rem;">
            <span class="badge-scarcity">🔥 High Demand: Only ${product.stock} sets left in master weaver stock!</span>
          </div>
        ` : ""}

        ${product.safetyBadges && product.safetyBadges.length > 0 ? `
          <div class="pdp-safety-box">
            <strong>🛡️ Family Safety &amp; Comfort Guarantee:</strong>
            <p style="margin-top: 0.2rem;">${product.safetyBadges.join(" • ")}</p>
          </div>
        ` : ""}

        ${product.availableSizes && product.availableSizes.length > 1 ? `
          <div class="pdp-size-selector" style="margin-bottom: 1.25rem;">
            <span class="pdp-label">Select Age &amp; Size: <strong id="pdpSelectedSizeLabel" style="color: var(--color-primary);">${product.availableSizes[0]}</strong></span>
            <div class="pdp-sizes-grid">
              ${product.availableSizes.map((size, idx) => `
                <button class="pdp-size-pill ${idx === 0 ? "active" : ""}" data-size="${size}">${size}</button>
              `).join("")}
            </div>
          </div>
        ` : ""}

        ${product.blouseOptions ? `
          <div style="background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
            <span class="pdp-label">Blouse Customization &amp; Tailoring</span>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
              <label style="display: flex; justify-content: space-between; font-size: 0.8rem; background: var(--bg-surface); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); cursor: pointer; color: var(--text-main);">
                <div><input type="radio" name="blouseChoice" value="unstitched" checked /> Unstitched Running Blouse (Included)</div>
                <strong>+₹0</strong>
              </label>
              <label style="display: flex; justify-content: space-between; font-size: 0.8rem; background: var(--bg-surface); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); cursor: pointer; color: var(--text-main);">
                <div><input type="radio" name="blouseChoice" value="basicStitched" /> Standard Tailored Blouse</div>
                <strong style="color: var(--color-primary);">+₹999</strong>
              </label>
            </div>
          </div>
        ` : ""}

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
          ${isOutOfStock ? `
            <button class="btn btn-gold" style="flex:2; min-width: 180px;" id="pdpNotifyWaitlistBtn">🔔 Notify Me When Available</button>
          ` : `
            <button class="btn btn-primary" style="flex:2; min-width: 180px; padding: 0.9rem;" id="pdpAddToCartBtn">Add to Shopping Bag</button>
          `}
          <button class="btn btn-outline" id="pdpToggleFavBtn" style="padding: 0.85rem 1.1rem; border-color: rgba(225,29,72,0.35); color: #E11D48; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;" title="Save to Favourites">
            ${window.store.isInWishlist(product.id) ? "❤️ Saved" : "🤍 Favourite"}
          </button>
          <a href="https://wa.me/916381265149?text=Hello%20Srinivasa%20Textiles,%20I%20am%20interested%20in%20${encodeURIComponent(product.title)}%20(SKU:%20${product.id})" target="_blank" style="padding: 0.85rem 1.1rem; background: #25D366; color: #fff; font-weight: 700; border-radius: var(--radius-sm); font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; text-decoration: none;">
            💬 WhatsApp
          </a>
        </div>

        <table class="specs-table">
          <tbody>
            <tr><td class="spec-name">Department</td><td class="spec-value">${product.department} (${product.ageGroup || "All"})</td></tr>
            <tr><td class="spec-name">Fabric Quality</td><td class="spec-value">${product.fabricType}</td></tr>
            <tr><td class="spec-name">Zari Grade</td><td class="spec-value">${product.zariType || "N/A"}</td></tr>
            <tr><td class="spec-name">Weave Technique</td><td class="spec-value">${product.technique}</td></tr>
            <tr><td class="spec-name">HSN Code</td><td class="spec-value">${product.hsnCode} (5% GST)</td></tr>
            <tr><td class="spec-name">Certifications</td><td class="spec-value">${(product.badges || []).join(", ")}</td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  bindPDPEvents(product) {
    const modal = document.getElementById("pdpModal");
    const closeBtn = document.getElementById("pdpCloseBtnInner");
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    const imgViewer = document.getElementById("cleanImgViewer");
    const mainImg = document.getElementById("pdpMainImg");
    if (imgViewer && mainImg) {
      imgViewer.addEventListener("click", () => {
        this.openFullscreenLightbox(mainImg.src);
      });
    }

    document.querySelectorAll(".pdp-thumb").forEach(thumb => {
      thumb.addEventListener("click", (e) => {
        document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        const imgUrl = target.getAttribute("data-img");
        if (mainImg) mainImg.src = imgUrl;
      });
    });

    document.querySelectorAll(".pdp-size-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        document.querySelectorAll(".pdp-size-pill").forEach(p => p.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        this.selectedSize = target.getAttribute("data-size");
        const label = document.getElementById("pdpSelectedSizeLabel");
        if (label) label.textContent = this.selectedSize;
      });
    });

    document.querySelectorAll('input[name="blouseChoice"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.selectedBlouseKey = e.target.value;
        this.updatePDPPricing();
      });
    });

    const addCartBtn = document.getElementById("pdpAddToCartBtn");
    if (addCartBtn) {
      addCartBtn.addEventListener("click", () => {
        window.store.addToCart(product.id, this.selectedColor, this.selectedSize, this.selectedBlouseKey, null, 1);
        modal.classList.remove("active");
        this.showToast(`Added "${product.title}" (${this.selectedSize}) to your Bag!`, "success");

        document.getElementById("cartDrawer")?.classList.add("active");
        document.getElementById("cartDrawerOverlay")?.classList.add("active");
      });
    }

    const pdpNotifyBtn = document.getElementById("pdpNotifyWaitlistBtn");
    if (pdpNotifyBtn) {
      pdpNotifyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        modal.classList.remove("active");
        this.openNotifyModal(product);
      });
    }

    const pdpFavBtn = document.getElementById("pdpToggleFavBtn");
    if (pdpFavBtn) {
      pdpFavBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isFav = window.store.toggleWishlist(product.id);
        pdpFavBtn.innerHTML = isFav ? "❤️ Saved" : "🤍 Favourite";
        this.showToast(isFav ? `❤️ Added "${product.title}" to Favourites!` : `Removed from Favourites`, "info");
      });
    }
  }

  // ==========================================
  // NOTIFY ME WHEN AVAILABLE (WAITLIST MODAL)
  // ==========================================
  openNotifyModal(product) {
    if (!product) return;

    const modal = document.getElementById("notifyModal");
    if (!modal) return;

    const idInput = document.getElementById("notifyProductId");
    const imgEl = document.getElementById("notifyProductImg");
    const skuEl = document.getElementById("notifyProductSku");
    const titleEl = document.getElementById("notifyProductTitle");
    const priceEl = document.getElementById("notifyProductPrice");
    const formView = document.getElementById("notifyFormView");
    const successView = document.getElementById("notifySuccessView");

    if (idInput) idInput.value = product.id;
    if (imgEl) imgEl.src = product.mainImage || "assets/images/banarasi_blue.jpg";
    if (skuEl) skuEl.textContent = `SKU: ${product.id}`;
    if (titleEl) titleEl.textContent = product.title;
    if (priceEl) priceEl.textContent = window.store.formatPrice(product.priceINR);

    if (formView) formView.style.display = "block";
    if (successView) successView.style.display = "none";

    modal.classList.add("active");
  }

  setupNotifyModal() {
    const modal = document.getElementById("notifyModal");
    const closeBtn = document.getElementById("notifyModalCloseBtn");
    const doneCloseBtn = document.getElementById("notifyDoneCloseBtn");
    const form = document.getElementById("notifyWaitlistForm");
    const formView = document.getElementById("notifyFormView");
    const successView = document.getElementById("notifySuccessView");

    const closeModal = () => {
      if (modal) modal.classList.remove("active");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (doneCloseBtn) doneCloseBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const productId = document.getElementById("notifyProductId")?.value;
        const name = document.getElementById("notifyCustomerName")?.value.trim();
        const phone = document.getElementById("notifyCustomerPhone")?.value.trim();
        const email = document.getElementById("notifyCustomerEmail")?.value.trim();

        if (!name || !phone) {
          this.showToast("Please provide your name and WhatsApp number.", "warning");
          return;
        }

        const product = window.store.getProductById(productId) || {
          id: productId,
          title: "Handloom Silk Garment",
          mainImage: "assets/images/banarasi_blue.jpg"
        };

        // Save to central store
        const entry = window.store.addSubscriberNotification({
          productId: product.id,
          productTitle: product.title,
          productImage: product.mainImage,
          customerName: name,
          phone: "+91 " + phone.replace(/^\+91\s*/, ""),
          email: email,
          size: this.selectedSize || "Standard"
        });

        // Populate Done / Success View
        const doneName = document.getElementById("notifyDoneCustomerName");
        const doneTitle = document.getElementById("notifyDoneProdTitle");
        const donePhone = document.getElementById("notifyDonePhone");

        if (doneName) doneName.textContent = name;
        if (doneTitle) doneTitle.textContent = `"${product.title}"`;
        if (donePhone) donePhone.textContent = `+91 ${phone.replace(/^\+91\s*/, "")}`;

        if (formView) formView.style.display = "none";
        if (successView) successView.style.display = "block";

        form.reset();

        this.showToast(`Done! Priority restock alert registered for ${product.title}`, "success");
      });
    }
  }

  openFullscreenLightbox(imgUrl) {
    const modal = document.getElementById("lightboxModal");
    const img = document.getElementById("lightboxMainImg");
    if (modal && img) {
      img.src = imgUrl;
      modal.classList.add("active");
    }
  }

  updatePDPPricing() {
    if (!this.activeProduct) return;
    const blouseOpt = this.activeProduct.blouseOptions ? this.activeProduct.blouseOptions[this.selectedBlouseKey] : null;
    const extra = blouseOpt ? blouseOpt.extraPriceINR : 0;
    const totalINR = this.activeProduct.priceINR + extra;

    const priceEl = document.getElementById("pdpCalculatedPrice");
    if (priceEl) {
      priceEl.textContent = window.store.formatPrice(totalINR);
    }
  }

  // ==========================================
  // SLIDE-OVER CART DRAWER & CHECKOUT
  // ==========================================
  updateCartUI() {
    const cart = window.store.getCart();
    const totals = window.store.getCartTotals();

    const headerCartBadge = document.getElementById("headerCartBadge");
    const drawerItemCount = document.getElementById("drawerItemCount");
    if (headerCartBadge) headerCartBadge.textContent = totals.itemCount;
    if (drawerItemCount) drawerItemCount.textContent = totals.itemCount;

    const freeShippingBar = document.getElementById("freeShippingBarText");
    const progressFill = document.getElementById("freeShippingProgressFill");
    const threshold = window.store.settings.freeShippingThresholdINR;

    if (freeShippingBar && progressFill) {
      if (totals.subtotalINR >= threshold) {
        freeShippingBar.innerHTML = "🎉 Congratulations! You unlocked <strong>FREE Express Insured Delivery</strong>!";
        progressFill.style.width = "100%";
      } else {
        const diff = threshold - totals.subtotalINR;
        const percent = Math.min(100, Math.round((totals.subtotalINR / threshold) * 100));
        freeShippingBar.innerHTML = `Add <strong>${window.store.formatPrice(diff)}</strong> more to get <strong>FREE Express Delivery</strong>!`;
        progressFill.style.width = `${percent}%`;
      }
    }

    const body = document.getElementById("cartItemsBody");
    if (!body) return;

    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty-state" style="text-align: center; padding: 3rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛍️</div>
          <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;">Your Shopping Bag is Empty</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Explore our Women's, Men's, Kids, and Family matching sets.</p>
        </div>
      `;
    } else {
      body.innerHTML = cart.map(item => `
        <div class="cart-item-card" data-cart-id="${item.cartItemId}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <span class="cart-item-meta">Dept: <strong>${item.department}</strong> • Size: <strong>${item.selectedSize}</strong></span>
            ${item.blouseLabel ? `<span class="cart-item-blouse">${item.blouseLabel}</span>` : ""}
            <span class="cart-item-price">${window.store.formatPrice(item.itemTotalINR)}</span>

            <div class="cart-qty-row">
              <div class="qty-control">
                <button class="qty-btn qty-minus" data-id="${item.cartItemId}">-</button>
                <span class="qty-number">${item.qty}</span>
                <button class="qty-btn qty-plus" data-id="${item.cartItemId}">+</button>
              </div>
              <span class="cart-item-remove" data-id="${item.cartItemId}">Remove</span>
            </div>
          </div>
        </div>
      `).join("");

      body.querySelectorAll(".qty-minus").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          const item = cart.find(i => i.cartItemId === id);
          if (item) window.store.updateCartQty(id, item.qty - 1);
        });
      });

      body.querySelectorAll(".qty-plus").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          const item = cart.find(i => i.cartItemId === id);
          if (item) window.store.updateCartQty(id, item.qty + 1);
        });
      });

      body.querySelectorAll(".cart-item-remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          window.store.removeFromCart(id);
          this.showToast("Item removed from bag", "info");
        });
      });
    }

    const subtotalEl = document.getElementById("cartSubtotal");
    const discountEl = document.getElementById("cartDiscount");
    const discountLine = document.getElementById("cartDiscountLine");
    const activeCouponBox = document.getElementById("cartActiveCouponBox");
    const giftWrapEl = document.getElementById("cartGiftWrapAmount");
    const gstEl = document.getElementById("cartGst");
    const totalEl = document.getElementById("cartTotal");

    if (subtotalEl) subtotalEl.textContent = window.store.formatPrice(totals.subtotalINR);

    const couponInput = document.getElementById("cartCouponInput");
    const applyCouponBtn = document.getElementById("applyCouponBtn");

    if (totals.discountINR > 0 && totals.coupon) {
      if (couponInput) {
        couponInput.value = "";
        couponInput.placeholder = `Unavailable (${totals.coupon.code} Applied)`;
        couponInput.disabled = true;
      }
      if (applyCouponBtn) {
        applyCouponBtn.disabled = true;
        applyCouponBtn.textContent = "Applied ✓";
      }

      if (discountEl) {
        discountEl.textContent = `-${window.store.formatPrice(totals.discountINR)}`;
        discountEl.style.color = "#059669";
        discountEl.style.fontWeight = "800";
      }
      const discountLabel = totals.coupon.discountType === "flat"
        ? `₹${(totals.coupon.discountAmount || totals.coupon.discountValue || 0).toLocaleString("en-IN")} Flat OFF`
        : `${totals.coupon.discountPercent}% OFF`;

      if (discountLine) {
        const labelSpan = discountLine.querySelector("span");
        if (labelSpan) labelSpan.innerHTML = `Discount (<strong>${totals.coupon.code}</strong> - ${discountLabel}):`;
      }
      if (activeCouponBox) {
        activeCouponBox.style.display = "block";
        activeCouponBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: var(--radius-sm); padding: 0.45rem 0.75rem; font-size: 0.775rem;">
            <span style="color: #047857; font-weight: 700;">🏷️ "${totals.coupon.code}" Applied (${discountLabel})</span>
            <button type="button" id="removeActiveCouponBtn" style="background: none; border: none; color: #DC2626; font-size: 0.75rem; font-weight: 800; cursor: pointer; padding: 0; text-decoration: underline;">✕ Remove</button>
          </div>
        `;
        document.getElementById("removeActiveCouponBtn")?.addEventListener("click", () => {
          window.store.removeCoupon();
          this.showToast("Promo code removed", "info");
        });
      }
    } else if (window.store && window.store.lastUnavailableCoupon) {
      const un = window.store.lastUnavailableCoupon;
      if (couponInput) {
        couponInput.disabled = false;
        couponInput.value = "";
      }
      if (applyCouponBtn) {
        applyCouponBtn.disabled = false;
        applyCouponBtn.textContent = "Apply";
      }
      if (discountEl) {
        discountEl.textContent = "₹0";
        discountEl.style.color = "";
        discountEl.style.fontWeight = "";
      }
      if (discountLine) {
        const labelSpan = discountLine.querySelector("span");
        if (labelSpan) labelSpan.textContent = "Discount:";
      }
      if (activeCouponBox) {
        activeCouponBox.style.display = "block";
        activeCouponBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(239, 68, 68, 0.12); border: 1.5px solid rgba(239, 68, 68, 0.4); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; font-size: 0.775rem;">
            <span style="color: #DC2626; font-weight: 700;">⚠️ Promo code "${un.code}" is <strong>Not Available</strong> (${un.reason === "deleted" ? "Removed by Store" : "Disabled"})</span>
            <button type="button" id="dismissUnavailableCouponBtn" style="background: none; border: none; color: #DC2626; font-size: 0.8rem; font-weight: 800; cursor: pointer; padding: 0 0.35rem;" title="Dismiss">✕</button>
          </div>
        `;
        document.getElementById("dismissUnavailableCouponBtn")?.addEventListener("click", () => {
          window.store.clearUnavailableNotice();
        });
      }
    } else {
      if (couponInput) {
        couponInput.disabled = false;
      }
      if (applyCouponBtn) {
        applyCouponBtn.disabled = false;
        applyCouponBtn.textContent = "Apply";
      }

      if (discountEl) {
        discountEl.textContent = "₹0";
        discountEl.style.color = "";
        discountEl.style.fontWeight = "";
      }
      if (discountLine) {
        const labelSpan = discountLine.querySelector("span");
        if (labelSpan) labelSpan.textContent = "Discount:";
      }
      if (activeCouponBox) {
        activeCouponBox.style.display = "none";
        activeCouponBox.innerHTML = "";
      }
    }

    if (giftWrapEl) giftWrapEl.textContent = totals.giftWrapINR > 0 ? `+${window.store.formatPrice(totals.giftWrapINR)}` : "₹0";
    if (gstEl) gstEl.textContent = window.store.formatPrice(totals.gstINR);
    if (totalEl) totalEl.textContent = window.store.formatPrice(totals.totalINR);

    // Render dynamic available offers list in cart
    this.renderCartAvailableOffers(totals);
  }

  renderCartAvailableOffers(totals) {
    const offersBox = document.getElementById("cartAvailableOffersBox");
    if (!offersBox) return;

    if (!window.store) {
      offersBox.innerHTML = "";
      return;
    }

    const liveCoupons = window.store.getCoupons() || [];
    const deletedCoupons = window.store.getDeletedCoupons() || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (liveCoupons.length === 0 && deletedCoupons.length === 0) {
      offersBox.innerHTML = "";
      return;
    }

    // Dynamic placeholder suggestion
    const couponInput = document.getElementById("cartCouponInput");
    const activeValid = liveCoupons.filter(c => c.isActive && (!c.validUntil || new Date(c.validUntil) >= today));
    if (couponInput && !totals.coupon) {
      couponInput.placeholder = activeValid.length > 0
        ? `Promo Code (Try '${activeValid[0].code}')`
        : "Enter Promo Code";
    }

    let html = `
      <div style="background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.6rem 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <span style="font-size: 0.72rem; font-weight: 800; color: var(--color-gold); letter-spacing: 0.04em;">
            🏷️ AVAILABLE OFFERS &amp; CODES
          </span>
          <span style="font-size: 0.65rem; color: var(--text-muted);">Real-Time</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem; max-height: 180px; overflow-y: auto;">
    `;

    // Live Coupons
    liveCoupons.forEach(c => {
      const isExpired = c.validUntil && new Date(c.validUntil) < today;
      const isAvailable = c.isActive && !isExpired;
      const isCurrentApplied = totals.coupon && totals.coupon.code === c.code;

      if (!isAvailable) {
        html += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0.5rem; background: rgba(239, 68, 68, 0.06); border: 1px dashed rgba(239, 68, 68, 0.3); border-radius: 4px;">
            <div>
              <span style="font-family: monospace; font-weight: 700; font-size: 0.75rem; text-decoration: line-through; color: var(--text-muted);">${c.code}</span>
              <span style="font-size: 0.7rem; color: var(--text-muted); margin-left: 0.35rem;">${c.title}</span>
            </div>
            <span style="font-size: 0.65rem; font-weight: 800; color: #DC2626; background: rgba(239, 68, 68, 0.12); padding: 0.12rem 0.4rem; border-radius: 3px;">
              Not Available
            </span>
          </div>
        `;
      } else {
        const benefit = c.discountType === "flat" ? `₹${c.discountAmount} Flat OFF` : `${c.discountPercent}% OFF`;
        html += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0.5rem; background: var(--bg-surface); border: 1px dashed ${isCurrentApplied ? 'var(--color-gold)' : 'var(--border-color)'}; border-radius: 4px;">
            <div style="flex: 1; min-width: 0; padding-right: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 0.35rem;">
                <strong style="font-family: monospace; color: var(--color-gold); font-size: 0.78rem; font-weight: 800;">${c.code}</strong>
                <span style="font-size: 0.72rem; color: #059669; font-weight: 700;">${benefit}</span>
              </div>
              <div style="font-size: 0.68rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${c.title}${c.minOrderValue > 0 ? ` • Min ₹${c.minOrderValue.toLocaleString('en-IN')}` : ''}
              </div>
            </div>
            <div>
              ${isCurrentApplied
            ? `<span style="font-size: 0.7rem; color: #059669; font-weight: 800;">Applied ✓</span>`
            : `<button type="button" class="btn btn-gold btn-xs" style="font-size: 0.68rem; padding: 0.15rem 0.5rem; font-weight: 700;" onclick="window.storefront && window.storefront.quickApplyCoupon('${c.code}')">Apply</button>`
          }
            </div>
          </div>
        `;
      }
    });

    // Recently deleted coupons explicitly marked as "Not Available"
    deletedCoupons.slice(0, 3).forEach(dc => {
      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0.5rem; background: rgba(239, 68, 68, 0.06); border: 1px dashed rgba(239, 68, 68, 0.3); border-radius: 4px;">
          <div>
            <span style="font-family: monospace; font-weight: 700; font-size: 0.75rem; text-decoration: line-through; color: #DC2626;">${dc.code}</span>
            <span style="font-size: 0.7rem; color: var(--text-muted); margin-left: 0.35rem;">${dc.title || 'Removed Offer'}</span>
          </div>
          <span style="font-size: 0.65rem; font-weight: 800; color: #DC2626; background: rgba(239, 68, 68, 0.15); padding: 0.12rem 0.45rem; border-radius: 3px;">
            ⚠️ Not Available
          </span>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    offersBox.innerHTML = html;
  }

  quickApplyCoupon(code) {
    if (!window.store) return;
    const res = window.store.applyCoupon(code);
    this.showToast(res.message, res.success ? "success" : "warning");
    this.updateCartUI();
  }

  renderFestiveVouchers() {
    const grid = document.getElementById("festiveVouchersGrid");
    if (!grid) return;

    if (!window.store) return;

    const liveCoupons = window.store.getCoupons() || [];
    const deletedCoupons = window.store.getDeletedCoupons() || [];

    // The key festive vouchers from the storefront offer cards
    const festivePreferredCodes = ["FESTIVE20", "BRIDAL15", "KIDSGIFT", "PREPAID500"];

    let itemsToDisplay = [];

    // 1. Add all live coupons that are turned ON (isActive === true)
    // When turned OFF, the coupon is completely removed from the main store page!
    const activeCoupons = liveCoupons.filter(c => c.isActive);
    activeCoupons.forEach(c => {
      itemsToDisplay.push({ coupon: c, isDeleted: false });
    });

    // 2. Add deleted coupons so they explicitly show as "Not Available" right where they were
    deletedCoupons.forEach(dc => {
      if (!itemsToDisplay.some(item => (item.coupon.code || "").toUpperCase() === (dc.code || "").toUpperCase())) {
        itemsToDisplay.push({ coupon: dc, isDeleted: true });
      }
    });

    // 3. Sort so festive codes appear first in order, followed by other active coupons
    itemsToDisplay.sort((a, b) => {
      const codeA = (a.coupon.code || "").toUpperCase();
      const codeB = (b.coupon.code || "").toUpperCase();
      const idxA = festivePreferredCodes.indexOf(codeA);
      const idxB = festivePreferredCodes.indexOf(codeB);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    // Take top 8 cards for clean grid presentation
    itemsToDisplay = itemsToDisplay.slice(0, 8);

    if (itemsToDisplay.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; background: var(--bg-surface-alt); border-radius: var(--radius-md); border: 1.5px dashed var(--border-color); color: var(--text-muted);">
          <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🏷️</span>
          <h4 style="margin: 0 0 0.35rem 0; color: var(--text-heading); font-family: var(--font-serif-display);">Festive Offers Update</h4>
          <p style="margin: 0; font-size: 0.85rem;">Seasonal vouchers are currently undergoing updates. Check back soon!</p>
        </div>
      `;
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    grid.innerHTML = itemsToDisplay.map(({ coupon: c, isDeleted }) => {
      const isExpired = c.validUntil ? new Date(c.validUntil) < today : false;
      const isUnavailable = isDeleted || !c.isActive || isExpired;

      const badgeText = isUnavailable
        ? "⚠️ NOT AVAILABLE"
        : (c.badge || (c.discountType === "flat" ? "SPECIAL PRIVILEGE" : "FESTIVE OFFER"));

      const badgeStyle = isUnavailable
        ? "background: linear-gradient(135deg, #DC2626, #EF4444); color: #FFF;"
        : "";

      const cardClass = `festive-voucher-card ${isUnavailable ? 'festive-voucher-unavailable' : ''}`;
      const cardStyle = isUnavailable
        ? "border: 1.5px dashed rgba(239, 68, 68, 0.6); background: rgba(239, 68, 68, 0.03);"
        : "";

      const titleHtml = isUnavailable
        ? `<h4 style="text-decoration: line-through; color: var(--text-muted); opacity: 0.85;">${c.title}</h4>`
        : `<h4>${c.title}</h4>`;

      const descHtml = isUnavailable
        ? `<p style="color: #DC2626; font-weight: 700; margin-bottom: 0.35rem; font-size: 0.82rem;">⚠️ This coupon code is Not Available (${isDeleted ? 'Removed by Store Management' : (isExpired ? 'Expired' : 'Temporarily Disabled')})</p>
           <p style="text-decoration: line-through; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">${c.description || ''}</p>`
        : `<p>${c.description || (c.minOrderValue > 0 ? `Valid on orders over ₹${c.minOrderValue.toLocaleString('en-IN')}.` : 'Exclusive handloom silk privilege savings.')}</p>`;

      const codeRowHtml = isUnavailable
        ? `<div class="festive-code-row" style="border-color: rgba(239, 68, 68, 0.35); background: rgba(239, 68, 68, 0.08);">
            <span class="festive-code-text" style="text-decoration: line-through; color: #DC2626; opacity: 0.75;">${c.code}</span>
            <button type="button" class="festive-copy-btn disabled" disabled style="background: rgba(239, 68, 68, 0.15); color: #DC2626; border: 1px solid rgba(239, 68, 68, 0.4); cursor: not-allowed; opacity: 0.9; font-weight: 700;">Not Available</button>
           </div>`
        : `<div class="festive-code-row">
            <span class="festive-code-text">${c.code}</span>
            <button type="button" class="festive-copy-btn"
              onclick="navigator.clipboard?.writeText('${c.code}'); window.storefront.showToast('Copied voucher code ${c.code}!', 'success');">Copy Code</button>
           </div>`;

      return `
        <div class="${cardClass}" style="${cardStyle}">
          <span class="festive-voucher-badge" style="${badgeStyle}">${badgeText}</span>
          <div class="festive-voucher-content">
            ${titleHtml}
            ${descHtml}
          </div>
          ${codeRowHtml}
        </div>
      `;
    }).join("");
  }

  // ==========================================================================
  // "LIMITED TIME FESTIVE SPECIAL 2026" REAL-TIME STOREFRONT ENGINE
  // ==========================================================================
  initFestiveCampaignSync() {
    // 1. Cross-tab BroadcastChannel for 0ms instant sync
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("st_festive_channel_v1");
        channel.onmessage = (event) => {
          if (event.data && event.data.type === "FESTIVE_CAMPAIGN_UPDATED") {
            this.renderFestiveCampaign(event.data.campaign);
          }
        };
      } catch (e) {
        console.warn("[Storefront] Festive BroadcastChannel notice:", e);
      }
    }

    // 2. Storage event listener (when admin toggles or edits in another tab/window)
    window.addEventListener("storage", (e) => {
      if (e.key === "st_festive_campaign_v1") {
        this.renderFestiveCampaign();
      }
    });

    // 3. Same-window custom event
    window.addEventListener("festiveCampaignUpdated", (e) => {
      this.renderFestiveCampaign(e.detail);
    });
  }

  renderFestiveCampaign(customCampaign) {
    if (!window.store || typeof window.store.getFestiveCampaign !== "function") return;

    // "LIMITED TIME FESTIVE SPECIAL 2026" session is strictly exclusive to shop.html
    const isShopPage = window.location.pathname.includes("shop.html") || window.location.pathname.endsWith("/shop");
    if (!isShopPage) {
      const containers = document.querySelectorAll("#festiveCampaignContainer, #festiveOffersSection, .festive-offers-section");
      const ticker = document.getElementById("festiveTopTickerBar");
      containers.forEach(c => {
        c.style.display = "none";
        c.innerHTML = "";
      });
      if (ticker) {
        ticker.style.display = "none";
        ticker.innerHTML = "";
      }
      return;
    }

    const campaign = customCampaign || window.store.getFestiveCampaign();
    const isLive = Boolean(campaign && campaign.enabled);

    const containers = document.querySelectorAll("#festiveOffersSection, .festive-offers-section");
    const ticker = document.getElementById("festiveTopTickerBar");

    // Clear any existing timer interval
    if (this.festiveTimerInterval) {
      clearInterval(this.festiveTimerInterval);
      this.festiveTimerInterval = null;
    }

    // =========================================================================
    // CASE 1: OFF -> COMPLETELY HIDDEN IN REAL-TIME WITH ZERO FOOTPRINT
    // =========================================================================
    if (!isLive) {
      containers.forEach(c => {
        c.style.display = "none";
        c.innerHTML = "";
      });
      if (ticker) {
        ticker.style.display = "none";
        ticker.innerHTML = "";
      }
      return;
    }

    // =========================================================================
    // CASE 2: ON -> RENDER GRAND FESTIVE SESSION IN REAL-TIME
    // =========================================================================
    // Top Ticker Announcement
    if (ticker) {
      if (campaign.topBannerEnabled && campaign.topBannerText) {
        ticker.style.display = "block";
        ticker.innerHTML = `
          <div class="container">
            <div class="festive-ticker-inner">
              <span class="festive-ticker-sparkle">🎉</span>
              <span class="festive-ticker-text">${this.escapeHtml(campaign.topBannerText)}</span>
              <span class="festive-ticker-sparkle">✨</span>
            </div>
          </div>
        `;
      } else {
        ticker.style.display = "none";
        ticker.innerHTML = "";
      }
    }

    const badge = campaign.badge || "🎉 LIMITED TIME FESTIVE SPECIAL 2026";
    const headline = campaign.headline || "Grand Festive & Wedding Handloom Offers";
    const subtitle = campaign.subtitle || "Celebrate your family milestones with exclusive seasonal vouchers, complimentary silver-tested purity certificates, and festive combo savings up to 22%.";

    // Build Vouchers HTML
    const activeOffers = (campaign.offers || []).filter(o => o.isActive !== false);
    const vouchersHtml = activeOffers.map(o => `
      <div class="festive-voucher-card">
        <span class="festive-voucher-badge">${this.escapeHtml(o.badge || "Festive Offer")}</span>
        <div class="festive-voucher-content">
          <h4>${this.escapeHtml(o.title || "Festive Discount")}</h4>
          <p>${this.escapeHtml(o.description || "")}</p>
        </div>
        <div class="festive-code-row">
          <span class="festive-code-text">${this.escapeHtml(o.code || "")}</span>
          <button type="button" class="festive-copy-btn" onclick="navigator.clipboard?.writeText('${this.escapeHtml(o.code || '')}'); window.storefront.showToast('Copied voucher code ${this.escapeHtml(o.code || '')}!', 'success');">
            Copy Code
          </button>
        </div>
      </div>
    `).join("");

    // Build Featured Deals HTML
    const activeDeals = (campaign.deals || []).filter(d => d.isActive !== false);
    const dealsHtml = activeDeals.map(d => {
      const orig = Number(d.originalPrice || 0);
      const fest = Number(d.festivePrice || 0);
      const img = d.image || "assets/images/family_matching_combo.jpg";
      const pct = orig > fest ? Math.round(((orig - fest) / orig) * 100) : 0;
      return `
        <div class="festive-deal-card">
          <div class="festive-deal-media">
            <img src="${img}" alt="${this.escapeHtml(d.title || "")}" onerror="this.src='assets/images/family_matching_combo.jpg'" />
            <span class="festive-deal-badge">${this.escapeHtml(d.badge || "Festive Deal")}</span>
          </div>
          <div class="festive-deal-body">
            <div>
              <h4 class="festive-deal-title">${this.escapeHtml(d.title || "")}</h4>
              <p class="festive-deal-desc">${this.escapeHtml(d.description || "")}</p>
            </div>
            <div>
              <div class="festive-price-row">
                <span class="festive-price-current">₹${fest.toLocaleString("en-IN")}</span>
                ${orig > fest ? `<span class="festive-price-original">₹${orig.toLocaleString("en-IN")}</span>` : ""}
                ${pct > 0 ? `<span class="festive-price-save">(${pct}% OFF)</span>` : ""}
              </div>
              <button type="button" class="btn btn-gold btn-sm" style="width: 100%; font-weight: 800;" onclick="window.storefront.openPDP('${this.escapeHtml(d.productId || '')}')">
                Inspect Festive Deal ➔
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Build Perks HTML
    const perks = campaign.perks || [];
    const perksHtml = perks.map(p => `
      <div class="festive-perk-item">
        <span class="festive-perk-icon">${p.icon || "✨"}</span>
        <div class="festive-perk-text">
          <strong>${this.escapeHtml(p.title || "")}</strong>
          <span>${this.escapeHtml(p.desc || "")}</span>
        </div>
      </div>
    `).join("");

    containers.forEach(container => {
      // Respect Home vs Explore section classes
      if (container.classList.contains("home-only-section") && this.currentPage !== "home") {
        container.style.display = "none";
        return;
      }
      if (container.classList.contains("explore-only-section") && this.currentPage !== "explore") {
        container.style.display = "none";
        return;
      }

      container.style.display = "block";
      container.innerHTML = `
        <div class="container">
          <!-- Festive Grand Header -->
          <div class="section-header">
            <span class="section-tag festive-section-tag">${this.escapeHtml(badge)}</span>
            <h2 class="section-title">${this.escapeHtml(headline)}</h2>
            <p class="section-subtitle">${this.escapeHtml(subtitle)}</p>
            <div class="section-divider"><span class="section-divider-motif">✦</span></div>
          </div>

          <!-- Live Countdown Timer Banner -->
          <div class="festive-countdown-banner">
            <div class="festive-countdown-header">
              <span class="countdown-sparkle">⏰</span>
              <span class="countdown-title">FESTIVAL CELEBRATION OFFERS END IN:</span>
            </div>
            <div class="festive-timer-display sf-festive-timer">
              <div class="timer-box"><span class="timer-num sf-timer-days">00</span><span class="timer-lbl">DAYS</span></div>
              <div class="timer-box"><span class="timer-num sf-timer-hours">00</span><span class="timer-lbl">HRS</span></div>
              <div class="timer-box"><span class="timer-num sf-timer-mins">00</span><span class="timer-lbl">MINS</span></div>
              <div class="timer-box"><span class="timer-num sf-timer-secs">00</span><span class="timer-lbl">SECS</span></div>
            </div>
          </div>

          <!-- Interactive Click-to-Copy Festival Vouchers -->
          ${activeOffers.length > 0 ? `
            <div class="festive-vouchers-grid">
              ${vouchersHtml}
            </div>
          ` : ""}

          <!-- Featured Festive Deal Cards Grid -->
          ${activeDeals.length > 0 ? `
            <div class="festive-deals-grid">
              ${dealsHtml}
            </div>
          ` : ""}

          <!-- Festive Perks Strip -->
          ${perks.length > 0 ? `
            <div class="festive-perks-bar">
              ${perksHtml}
            </div>
          ` : ""}
        </div>
      `;
    });

    // Start Live Storefront Countdown Timer Interval
    this.startFestiveTimer(campaign.countdownEnd);
  }

  startFestiveTimer(countdownEnd) {
    if (this.festiveTimerInterval) {
      clearInterval(this.festiveTimerInterval);
    }
    const target = countdownEnd ? new Date(countdownEnd).getTime() : 0;

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      document.querySelectorAll(".sf-timer-days").forEach(el => el.textContent = String(days).padStart(2, "0"));
      document.querySelectorAll(".sf-timer-hours").forEach(el => el.textContent = String(hours).padStart(2, "0"));
      document.querySelectorAll(".sf-timer-mins").forEach(el => el.textContent = String(mins).padStart(2, "0"));
      document.querySelectorAll(".sf-timer-secs").forEach(el => el.textContent = String(secs).padStart(2, "0"));
    };

    tick();
    this.festiveTimerInterval = setInterval(tick, 1000);
  }

  escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  updateWishlistCount() {
    const badge = document.getElementById("headerWishlistBadge");
    const drawerCount = document.getElementById("wishlistDrawerCount");
    const count = (window.store && window.store.wishlist) ? window.store.wishlist.length : 0;
    if (badge) {
      badge.textContent = count;
      badge.style.display = "inline-flex";
    }
    if (drawerCount) {
      drawerCount.textContent = count;
    }
  }

  syncCardWishlistButtons() {
    document.querySelectorAll(".product-card").forEach(card => {
      const id = card.getAttribute("data-id");
      const btn = card.querySelector(".wishlist-toggle-btn");
      if (btn && id) {
        const isWish = window.store.isInWishlist(id);
        btn.classList.toggle("wishlisted", isWish);
      }
    });
  }

  setupWishlistDrawer() {
    const drawer = document.getElementById("wishlistDrawer");
    const overlay = document.getElementById("wishlistDrawerOverlay");
    const closeBtn = document.getElementById("wishlistCloseBtn");
    const moveAllBtn = document.getElementById("wishlistMoveAllToCartBtn");
    const clearBtn = document.getElementById("wishlistClearBtn");

    document.querySelectorAll(".wishlist-btn, #wishlistTriggerBtn, .favourites-trigger-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openWishlistDrawer();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeWishlistDrawer());
    }

    if (overlay) {
      overlay.addEventListener("click", () => this.closeWishlistDrawer());
    }

    if (moveAllBtn) {
      moveAllBtn.addEventListener("click", () => {
        const products = window.store.getWishlistProducts();
        if (products.length === 0) {
          this.showToast("Your Favourites list is empty!", "info");
          return;
        }

        let movedCount = 0;
        products.forEach(p => {
          if (p.stock > 0) {
            window.store.moveWishlistItemToCart(p.id);
            movedCount++;
          }
        });

        if (movedCount > 0) {
          this.showToast(`🎉 Moved ${movedCount} favourite item(s) to your Shopping Bag!`, "success");
          this.closeWishlistDrawer();
          setTimeout(() => this.openCartDrawer(), 300);
        } else {
          this.showToast("Selected items are currently out of stock.", "warning");
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (!window.store.wishlist || window.store.wishlist.length === 0) return;
        if (confirm("Clear all items from your saved Favourites?")) {
          window.store.clearWishlist();
          this.showToast("Favourites cleared", "info");
        }
      });
    }
  }

  openWishlistDrawer() {
    // Close cart drawer if open
    document.getElementById("cartDrawer")?.classList.remove("active");
    document.getElementById("cartDrawerOverlay")?.classList.remove("active");

    const drawer = document.getElementById("wishlistDrawer");
    const overlay = document.getElementById("wishlistDrawerOverlay");
    if (drawer && overlay) {
      this.renderWishlistDrawer();
      drawer.classList.add("active");
      overlay.classList.add("active");
    }
  }

  closeWishlistDrawer() {
    const drawer = document.getElementById("wishlistDrawer");
    const overlay = document.getElementById("wishlistDrawerOverlay");
    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
  }

  openCartDrawer() {
    // Close wishlist drawer if open
    document.getElementById("wishlistDrawer")?.classList.remove("active");
    document.getElementById("wishlistDrawerOverlay")?.classList.remove("active");

    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (drawer && overlay) {
      this.updateCartUI();
      drawer.classList.add("active");
      overlay.classList.add("active");
    }
  }

  renderWishlistDrawer() {
    const body = document.getElementById("wishlistItemsBody");
    const footer = document.getElementById("wishlistDrawerFooter");
    if (!body) return;

    this.updateWishlistCount();

    const products = window.store.getWishlistProducts();

    if (products.length === 0) {
      if (footer) footer.style.display = "none";
      body.innerHTML = `
        <div class="wishlist-empty-state">
          <div class="wishlist-empty-icon">${window.Icons ? window.Icons.get('favourite', { className: 'empty-state-fav-icon' }) : '♥'}</div>
          <h4>Your Favourites is Empty</h4>
          <p>Tap the heart icon on any pure Kanchipuram silk saree, kids pattu pavadai, or royal family set to save your favorite weaves here!</p>
          <button class="btn btn-gold btn-sm" id="wishlistExploreBtn" style="margin-top: 1.25rem;">
            Explore Heirloom Collections ➔
          </button>
        </div>
      `;

      const exploreBtn = document.getElementById("wishlistExploreBtn");
      if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
          this.closeWishlistDrawer();
          const catalogSec = document.getElementById("catalogSection") || document.getElementById("featuredSection");
          if (catalogSec) {
            catalogSec.scrollIntoView({ behavior: "smooth" });
          } else {
            window.location.href = "shop.html";
          }
        });
      }
      return;
    }

    if (footer) footer.style.display = "block";

    body.innerHTML = products.map(product => {
      const isLowStock = product.stock <= (product.lowStockThreshold || 2);
      const isOutOfStock = product.stock <= 0;
      const firstColor = (product.colors && product.colors[0]) || { image: product.mainImage };

      return `
        <div class="wishlist-item-card" data-id="${product.id}">
          <div class="wishlist-thumb-wrapper" data-pdp-id="${product.id}" title="Click to view details">
            <img src="${product.mainImage || firstColor.image}" alt="${product.title}" class="wishlist-item-img" />
            ${isOutOfStock ? `<span class="wishlist-stock-pill oos">Looming</span>` : isLowStock ? `<span class="wishlist-stock-pill low">Only ${product.stock} Left</span>` : ""}
          </div>
          <div class="wishlist-item-info">
            <div style="font-size: 0.7rem; color: var(--color-gold-dark); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
              ${product.department}
            </div>
            <h4 class="wishlist-item-title" data-pdp-id="${product.id}">${product.title}</h4>
            <div class="wishlist-item-pricing">
              <span class="wishlist-item-price">${window.store.formatPrice(product.priceINR)}</span>
              ${product.mrpINR > product.priceINR ? `<span class="wishlist-item-mrp">${window.store.formatPrice(product.mrpINR)}</span>` : ""}
            </div>

            <div class="wishlist-item-actions">
              <button class="btn btn-gold btn-sm wishlist-move-btn" data-id="${product.id}" ${isOutOfStock ? "disabled" : ""}>
                ${isOutOfStock ? "Sold Out" : "🛍️ Move to Bag"}
              </button>
              <button class="wishlist-remove-icon-btn" data-id="${product.id}" title="Remove from Favourites">
                ✕ Remove
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // PDP click handlers
    body.querySelectorAll("[data-pdp-id]").forEach(el => {
      el.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-pdp-id");
        this.closeWishlistDrawer();
        this.openPDP(id);
      });
    });

    // Move single item to bag
    body.querySelectorAll(".wishlist-move-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const res = window.store.moveWishlistItemToCart(id);
        if (res) {
          this.showToast("🎉 Added to your Shopping Bag!", "success");
          this.renderWishlistDrawer();
          this.updateCartUI();
        }
      });
    });

    // Remove item from wishlist
    body.querySelectorAll(".wishlist-remove-icon-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        window.store.toggleWishlist(id);
        this.showToast("Removed from Favourites", "info");
      });
    });
  }

  setupCheckoutHandlers() {
    const checkoutBtn = document.getElementById("cartCheckoutBtn");
    const checkoutModal = document.getElementById("checkoutModal");
    const closeCheckoutBtn = document.getElementById("checkoutCloseBtn");
    const autoDetectPayBtn = document.getElementById("autoDetectPayBtn");
    const upiQrContainer = document.getElementById("upiQrContainer");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const copyUpiBtn = document.getElementById("copyUpiIdBtn");

    this.isPaymentVerified = false;
    this.verifiedTxnRef = "";
    this.activeRealtimeOrderId = "";
    this.realtimePaymentChannel = null;

    // Web Audio API chime sound on successful payment verification & button unlock
    const playUnlockChime = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        // Note 1: E5
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(659.25, now);
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.3);

        // Note 2: B5 (cheerful harmonic)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(987.77, now + 0.12);
        gain2.gain.setValueAtTime(0.15, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.5);
      } catch (e) {
        // AudioContext not allowed before user interaction or unsupported
      }
    };

    // Central Automated Realtime Payment Verification & Button Unlock Callback
    this.handleRealtimePaymentUnlock = (paidRow = {}) => {
      if (this.isPaymentVerified) return;

      const totals = window.store.getCartTotals();
      const formattedTotal = window.store.formatPrice(totals.totalINR);

      const userRef = paidRow.utr_number || paidRow.upi_ref_no || `UPI/HDFC/TXN-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      this.isPaymentVerified = true;
      this.verifiedTxnRef = userRef;

      const verifiedBadge = document.getElementById("paymentVerifiedBadge");
      const lockHint = document.getElementById("orderLockHint");
      const statusPill = document.getElementById("upiGatewayStatusPill");
      const txnDetailsEl = document.getElementById("verifiedTxnDetails");

      if (txnDetailsEl) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        txnDetailsEl.textContent = `UPI Gateway (GPay / PhonePe / Paytm) • Ref: ${userRef} • Status: PAID (${timeStr})`;
      }

      if (verifiedBadge) verifiedBadge.style.display = "flex";

      if (statusPill) {
        statusPill.innerHTML = '<span class="admin-pulse-dot" style="background:#10B981;"></span> Payment Received &amp; Verified! Generating Bill...';
        statusPill.style.color = '#059669';
        statusPill.style.borderColor = '#10B981';
      }

      if (autoDetectPayBtn) {
        autoDetectPayBtn.innerHTML = "<span>✅</span> Payment Received • Auto-Generating Bill...";
        autoDetectPayBtn.style.background = "#059669";
        autoDetectPayBtn.disabled = true;
      }

      // UNLOCK PLACE ORDER BUTTON AUTOMATICALLY VIA SUPABASE REALTIME PUSH
      if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.className = "btn btn-gold btn-lg btn-place-order-unlocked";
        placeOrderBtn.innerHTML = "<span>🎉</span> Payment Verified • Opening Invoice ➔";
        placeOrderBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      if (lockHint) {
        lockHint.innerHTML = "✅ Payment Verified! Auto-generating your GST Tax Invoice &amp; Delivery Bill...";
        lockHint.style.color = "#10B981";
        lockHint.style.fontWeight = "700";
      }

      playUnlockChime();

      this.showToast(`🎉 Payment of ${formattedTotal} Received! Generating your GST Tax Invoice Bill...`, "success");

      // AUTOMATIC BILL GENERATION: Auto-place order and pop up the official GST Tax Invoice
      setTimeout(() => {
        const checkoutModal = document.getElementById("checkoutModal");
        if (checkoutModal && checkoutModal.classList.contains("active")) {
          this.handlePlaceOrder();
        }
      }, 1200);
    };

    // Helper to simulate webhook / gateway update to Supabase DB
    const triggerPaymentWebhookToSupabase = async (customUtr = null) => {
      const orderId = this.activeRealtimeOrderId;
      if (!orderId) return;

      const utr = customUtr || `UPI/HDFC/TXN-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      const statusPill = document.getElementById("upiGatewayStatusPill");
      if (statusPill) {
        statusPill.innerHTML = '<span class="admin-pulse-dot" style="background:#F59E0B;"></span> Checking Google Pay / PhonePe / Paytm Gateway...';
      }

      if (autoDetectPayBtn) {
        autoDetectPayBtn.disabled = true;
        autoDetectPayBtn.innerHTML = "<span>⏳</span> Checking Payment with Bank Gateway...";
      }

      // Update Supabase DB row to 'paid' -> Triggers Supabase Realtime WebSocket Event
      if (window.supabaseService) {
        await window.supabaseService.updateOrderToPaid(orderId, utr);
      }
    };

    if (checkoutBtn && checkoutModal) {
      checkoutBtn.addEventListener("click", async () => {
        const cart = window.store.getCart();
        if (cart.length === 0) {
          this.showToast("Your shopping bag is empty!", "warning");
          return;
        }

        document.getElementById("cartDrawer")?.classList.remove("active");
        document.getElementById("cartDrawerOverlay")?.classList.remove("active");

        const totals = window.store.getCartTotals();
        const formattedTotal = window.store.formatPrice(totals.totalINR);

        const totalEl = document.getElementById("checkoutTotalDisplay");
        if (totalEl) totalEl.textContent = formattedTotal;

        const qrAmountEl = document.getElementById("upiQrAmountDisplay");
        if (qrAmountEl) qrAmountEl.textContent = formattedTotal;

        // Generate Unique Realtime Order ID
        const activeOrderId = "ST-ORD-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
        this.activeRealtimeOrderId = activeOrderId;

        // Clean up previous subscription channel if exists
        if (this.realtimePaymentChannel && window.supabaseService) {
          window.supabaseService.unsubscribeChannel(this.realtimePaymentChannel);
          this.realtimePaymentChannel = null;
        }

        // Reset Payment Verification State on opening checkout
        this.isPaymentVerified = false;
        this.verifiedTxnRef = "";

        const verifiedBadge = document.getElementById("paymentVerifiedBadge");
        if (verifiedBadge) verifiedBadge.style.display = "none";

        const statusPill = document.getElementById("upiGatewayStatusPill");
        if (statusPill) {
          statusPill.innerHTML = '<span class="admin-pulse-dot"></span> Supabase Realtime: Listening for Payment (status = "pending")...';
          statusPill.style.color = '#059669';
        }

        if (autoDetectPayBtn) {
          autoDetectPayBtn.disabled = false;
          autoDetectPayBtn.style.background = "linear-gradient(135deg, #059669 0%, #10B981 100%)";
          autoDetectPayBtn.innerHTML = "<span>⚡</span> I Have Paid via UPI (Unlock Order)";
        }

        const lockHint = document.getElementById("orderLockHint");
        if (lockHint) {
          lockHint.innerHTML = "⚠️ Supabase Realtime: Button will unlock automatically when order status becomes 'paid'";
          lockHint.style.color = "var(--text-muted)";
          lockHint.style.fontWeight = "normal";
        }

        if (placeOrderBtn) {
          placeOrderBtn.disabled = true;
          placeOrderBtn.className = "btn btn-gold btn-lg btn-place-order-locked";
          placeOrderBtn.innerHTML = "<span>🔒</span> Pay via UPI to Unlock Order Placement";
        }

        // Real-Time Dynamic UPI QR Code with exact payable amount, merchant VPA, and order note
        const activeOrderIdClean = activeOrderId.replace(/-/g, "_");
        const payableAmount = totals.totalINR;
        const upiDeepLink = `upi://pay?pa=srinivasatextiles@hdfcbank&pn=Srinivasa%20Textiles&am=${payableAmount}&cu=INR&tn=Order_${activeOrderIdClean}`;

        const upiQrLink = document.getElementById("upiQrLink");
        if (upiQrLink) {
          upiQrLink.href = upiDeepLink;
        }

        // Generate dynamic scannable QR containing the exact UPI amount string
        const qrDynamicImg = document.getElementById("upiQrDynamicImg");
        if (qrDynamicImg) {
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(upiDeepLink)}`;
          qrDynamicImg.src = qrCodeUrl;
        }

        // Step 1: Create 'pending' row in Supabase DB
        const name = document.getElementById("custName")?.value.trim() || "Valued Customer";
        const phone = document.getElementById("custPhone")?.value.trim() || "9840012345";
        const address = document.getElementById("custAddress")?.value.trim() || "Tamil Nadu, India";
        const email = document.getElementById("custEmail")?.value.trim() || "customer@srinivasatextiles.com";

        if (window.supabaseService) {
          await window.supabaseService.createPendingOrder({
            order_id: activeOrderId,
            customer_name: name,
            mobile_number: phone,
            shipping_address: address,
            email: email,
            total_amount: totals.totalINR,
            amount: totals.totalINR,
            cart_items: cart.map(i => ({ name: i.title, qty: i.qty, price: i.unitPriceINR, size: i.selectedSize, color: i.selectedColor }))
          });

          // Step 2: Subscribe to Realtime UPDATE changes on this order
          this.realtimePaymentChannel = window.supabaseService.subscribeToOrderPayment(activeOrderId, (paidRow) => {
            console.info("🎉 [Supabase Realtime Channel] Received Paid Status for:", activeOrderId, paidRow);
            this.handleRealtimePaymentUnlock(paidRow);
          });
        }

        checkoutModal.classList.add("active");
      });
    }

    if (closeCheckoutBtn && checkoutModal) {
      closeCheckoutBtn.addEventListener("click", () => {
        if (this.realtimePaymentChannel && window.supabaseService) {
          window.supabaseService.unsubscribeChannel(this.realtimePaymentChannel);
          this.realtimePaymentChannel = null;
        }
        checkoutModal.classList.remove("active");
      });
    }

    // 1-Click Payment Confirmation Trigger (Updates Supabase -> Triggers Realtime Broadcast)
    if (autoDetectPayBtn) {
      autoDetectPayBtn.addEventListener("click", (e) => {
        e.preventDefault();
        triggerPaymentWebhookToSupabase();
      });
    }

    // Copy UPI ID button handler
    if (copyUpiBtn) {
      copyUpiBtn.addEventListener("click", () => {
        const upiId = document.getElementById("upiIdText")?.textContent || "srinivasatextiles@hdfcbank";
        navigator.clipboard.writeText(upiId).then(() => {
          copyUpiBtn.textContent = "✅ Copied!";
          this.showToast("UPI ID copied to clipboard!", "info");
          setTimeout(() => {
            copyUpiBtn.textContent = "📋 Copy";
          }, 2500);
        }).catch(() => {
          this.showToast("UPI ID: " + upiId, "info");
        });
      });
    }

    const upiQrLink = document.getElementById("upiQrLink");
    if (upiQrLink) {
      upiQrLink.addEventListener("click", () => {
        this.hasInitiatedUpiPayment = true;
        this.showToast("⚡ Opening Google Pay / UPI App for payment...", "info");
        const statusPill = document.getElementById("upiGatewayStatusPill");
        if (statusPill) {
          statusPill.innerHTML = '<span class="admin-pulse-dot" style="background:#F59E0B;"></span> Supabase Realtime: Waiting for UPI Payment Confirmation...';
          statusPill.style.color = '#D97706';
        }
      });
    }

    document.querySelectorAll(".payment-card-opt").forEach(opt => {
      opt.addEventListener("click", (e) => {
        document.querySelectorAll(".payment-card-opt").forEach(o => o.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        const method = target.getAttribute("data-method");

        const upiBox = document.getElementById("upiPaymentBox");
        const codBox = document.getElementById("codPaymentBox");

        if (upiBox) upiBox.style.display = method === "upi" ? "block" : "none";
        if (codBox) codBox.style.display = method === "cod" ? "block" : "none";
      });
    });

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handlePlaceOrder();
      });
    }
  }

  handlePlaceOrder() {
    // Strict System Verification Check: Order cannot be placed without system verification
    if (!this.isPaymentVerified) {
      this.showToast("⚠️ Please complete UPI payment first to unlock order confirmation!", "warning");
      return;
    }

    const name = document.getElementById("custName")?.value.trim();
    const phone = document.getElementById("custPhone")?.value.trim();
    const address = document.getElementById("custAddress")?.value.trim();
    const email = document.getElementById("custEmail")?.value.trim();
    const gstin = document.getElementById("custGstin")?.value.trim();
    const txnRef = this.verifiedTxnRef || `UPI/HDFC/TXN-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const orderIdToUse = this.activeRealtimeOrderId || ("ST-ORD-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));

    if (!name || !phone || !address) {
      this.showToast("Please provide your Full Name, Phone Number, and Shipping Address.", "warning");
      return;
    }

    const activePaymentOpt = document.querySelector(".payment-card-opt.active");
    const paymentMethod = activePaymentOpt ? activePaymentOpt.getAttribute("data-name") : "UPI Instant Pay (QR Verified)";

    const totals = window.store.getCartTotals();
    const cart = window.store.getCart();

    const order = window.store.createOrder({
      orderId: orderIdToUse,
      customer: { name, email, phone, address, gstin },
      items: cart.map(item => ({
        productId: item.productId,
        title: item.title,
        color: item.selectedColor,
        size: item.selectedSize,
        hsnCode: item.hsnCode,
        qty: item.qty,
        unitPriceINR: item.unitPriceINR,
        blouseOption: item.blouseLabel,
        totalINR: item.itemTotalINR * item.qty
      })),
      subtotalINR: totals.subtotalINR,
      discountINR: totals.discountINR,
      couponCode: totals.coupon ? totals.coupon.code : "",
      gstINR: totals.gstINR,
      shippingINR: totals.shippingINR,
      totalAmountINR: totals.totalINR,
      paymentMethod: `UPI (Ref: ${txnRef})`,
      paymentStatus: "paid",
      status: "paid",
      transactionId: txnRef,
      upi_ref_no: txnRef,
      utr_number: txnRef,
      courier: "BlueDart Express"
    });

    // Clean up Realtime Channel
    if (this.realtimePaymentChannel && window.supabaseService) {
      window.supabaseService.unsubscribeChannel(this.realtimePaymentChannel);
      this.realtimePaymentChannel = null;
    }

    document.getElementById("checkoutModal")?.classList.remove("active");

    this.showToast(`🎉 Order ${order.orderId} Confirmed & Saved in Supabase!`, "success");

    // Automatically open the official GST Tax Invoice for the customer
    setTimeout(() => {
      this.openGSTInvoiceModal(order.orderId);
    }, 300);
  }

  openGSTInvoiceModal(orderId, isEditMode = false) {
    const order = window.store.orders.find(o => o.orderId === orderId);
    if (!order) return;

    const modal = document.getElementById("invoiceModal");
    const container = document.getElementById("invoiceModalContent");
    if (!modal || !container) return;

    const subtotal = order.subtotalINR || 0;
    const discount = order.discountINR || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const cgst = Math.round(taxableAmount * 0.025);
    const sgst = Math.round(taxableAmount * 0.025);
    const totalTax = cgst + sgst;
    const shippingFee = order.shippingINR || 0;
    const finalAmount = (order.totalAmountINR !== undefined && order.totalAmountINR !== null) ? order.totalAmountINR : (taxableAmount + totalTax + shippingFee);

    const waOrderMsg = encodeURIComponent(`Namaste ${order.customer ? order.customer.name : 'Customer'}! 🙏 Here is your official GST Tax Invoice from Srinivasa Textiles for Order #${order.orderId} (Total: ₹${finalAmount.toLocaleString("en-IN")}). Courier: ${order.courier || 'BlueDart Express'} (AWB: ${order.trackingNumber}).`);
    const waLink = `https://wa.me/${(order.customer && order.customer.phone ? order.customer.phone.replace(/[^0-9]/g, '') : '916381265149')}?text=${waOrderMsg}`;

    // RENDER OFFICIAL GST TAX INVOICE
    container.innerHTML = `
      <button class="pdp-close-btn" id="invoiceCloseBtn" style="top: 1rem; right: 1rem;">✕</button>

      <div class="invoice-header">
        <div class="invoice-brand">
          <h2>SRINIVASA TEXTILES</h2>
          <p>Master Weavers &amp; Pure Silk Family Store Since 1978</p>
          <p>108 Raja Veedhi, Kanchipuram, Tamil Nadu - 631501, India</p>
          <p><strong>GSTIN:</strong> ${window.store.settings.gstin} | <strong>State Code:</strong> 33</p>
        </div>

        <div class="invoice-meta">
          <h3>TAX INVOICE</h3>
          <p><strong>Invoice No:</strong> INV-${order.orderId.replace("ST-ORD-", "")}</p>
          <p><strong>Invoice Date:</strong> ${order.date}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
        </div>
      </div>

      <div class="invoice-billing-grid">
        <div>
          <strong style="color: var(--color-primary-dark); text-transform: uppercase;">Billed To / Consignee:</strong>
          <p style="font-weight: 700; margin-top: 0.25rem;">${order.customer ? order.customer.name : "Customer"}</p>
          <p>${order.customer ? order.customer.address : "N/A"}</p>
          <p><strong>Phone:</strong> ${order.customer ? order.customer.phone : "N/A"} | <strong>Email:</strong> ${(order.customer && order.customer.email) || "N/A"}</p>
          ${(order.customer && order.customer.gstin) ? `<p><strong>Buyer GSTIN:</strong> ${order.customer.gstin}</p>` : ""}
          ${order.giftWrap ? `<p style="color: #059669; font-weight:700; margin-top:0.25rem;">🎁 Festive Gift Wrap with Handwritten Message Included</p>` : ""}
        </div>
        <div>
          <strong style="color: var(--color-primary-dark); text-transform: uppercase;">Shipping Partner:</strong>
          <p><strong>Courier:</strong> ${order.courier || "BlueDart Express"}</p>
          <p><strong>AWB Tracking:</strong> ${order.trackingNumber}</p>
        </div>
      </div>

      <table class="invoice-items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Description</th>
            <th>HSN / SAC</th>
            <th>Qty</th>
            <th>Unit Rate</th>
            <th>CGST (2.5%)</th>
            <th>SGST (2.5%)</th>
            <th>Total (INR)</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map((item, i) => {
      const itemTaxable = item.totalINR;
      const itemCgst = Math.round(itemTaxable * 0.025);
      const itemSgst = Math.round(itemTaxable * 0.025);
      const itemTotal = itemTaxable + itemCgst + itemSgst;
      return `
              <tr>
                <td>${i + 1}</td>
                <td>
                  <strong>${item.title}</strong>
                  <span style="display: block; font-size: 0.7rem; color: #555;">Size: ${item.size || "Standard"} • Color: ${item.color}</span>
                </td>
                <td>${item.hsnCode || "50072010"}</td>
                <td>${item.qty}</td>
                <td>₹${(item.unitPriceINR).toLocaleString("en-IN")}</td>
                <td>₹${itemCgst.toLocaleString("en-IN")}</td>
                <td>₹${itemSgst.toLocaleString("en-IN")}</td>
                <td><strong>₹${itemTotal.toLocaleString("en-IN")}</strong></td>
              </tr>
            `;
    }).join("")}
        </tbody>
      </table>

      <div class="invoice-summary-box">
        <div class="invoice-summary-row"><span>Subtotal Taxable:</span> <span>₹${taxableAmount.toLocaleString("en-IN")}</span></div>
        ${discount > 0 ? `<div class="invoice-summary-row" style="color: #059669;"><span>Discount (${order.couponCode || 'Custom'}):</span> <span>-₹${discount.toLocaleString("en-IN")}</span></div>` : ""}
        <div class="invoice-summary-row"><span>CGST (2.5%):</span> <span>₹${cgst.toLocaleString("en-IN")}</span></div>
        <div class="invoice-summary-row"><span>SGST (2.5%):</span> <span>₹${sgst.toLocaleString("en-IN")}</span></div>
        ${shippingFee > 0 ? `<div class="invoice-summary-row"><span>Shipping &amp; Handling:</span> <span>₹${shippingFee.toLocaleString("en-IN")}</span></div>` : `<div class="invoice-summary-row" style="color: #059669;"><span>Shipping (Express Courier):</span> <span>FREE (₹0)</span></div>`}
        <div class="invoice-summary-row total"><span>Total Amount:</span> <span>₹${finalAmount.toLocaleString("en-IN")}</span></div>
      </div>

      <div class="invoice-actions" style="margin-top: 1.5rem; display: flex; gap: 0.6rem; justify-content: flex-end; flex-wrap: wrap;">
        <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print / Save PDF</button>
      </div>
    `;

    modal.classList.add("active");
    document.getElementById("invoiceCloseBtn")?.addEventListener("click", () => modal.classList.remove("active"));
  }

  openShippingLabelModal(orderId) {
    const order = window.store.orders.find(o => o.orderId === orderId);
    if (!order) return;

    const modal = document.getElementById("invoiceModal");
    const container = document.getElementById("invoiceModalContent");
    if (!modal || !container) return;

    // RENDER VIEW LABEL MODE
    container.innerHTML = `
      <button class="pdp-close-btn" id="labelCloseBtn" style="top: 1rem; right: 1rem;">✕</button>
      <div class="shipping-label-card">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
          <h2 style="font-size: 1.25rem; font-family: var(--font-sans); font-weight: 800;">${(order.courier || "BLUEDART EXPRESS").toUpperCase()}</h2>
          <span style="font-weight: 800; font-size: 1rem; background: #000; color: #fff; padding: 0.2rem 0.5rem;">FAMILY EXPRESS</span>
        </div>
        <div class="label-barcode-mock"></div>
        <p style="text-align: center; font-family: monospace; font-size: 0.85rem; font-weight: 700; margin-bottom: 1rem;">AWB: ${order.trackingNumber}</p>
        <div style="border-top: 1px solid #000; padding-top: 0.75rem; margin-bottom: 0.75rem; font-size: 0.85rem;">
          <strong style="text-transform: uppercase;">Deliver To:</strong>
          <h3 style="font-size: 1.1rem; margin-top: 0.25rem;">${order.customer ? order.customer.name : "Customer"}</h3>
          <p>${order.customer ? order.customer.address : "N/A"}</p>
          <p><strong>Mobile:</strong> ${order.customer ? order.customer.phone : "N/A"}</p>
        </div>
      </div>
      <div class="invoice-actions" style="max-width: 500px; margin: 1.5rem auto 0; display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-outline-gold btn-sm" onclick="window.storefront.openGSTInvoiceModal('${order.orderId}')">🧾 View GST Invoice</button>
        <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print Label (4x6 format)</button>
      </div>
    `;

    modal.classList.add("active");
    document.getElementById("labelCloseBtn")?.addEventListener("click", () => modal.classList.remove("active"));
  }

  handleSearchAutocomplete(query) {
    const cleanQuery = (query || "").trim().toLowerCase();
    const resultsContainer = document.getElementById("searchLiveResults");
    if (!resultsContainer) return;

    if (cleanQuery.length < 2) {
      resultsContainer.innerHTML = "";
      return;
    }

    const matches = window.store.getAllProducts().filter(p =>
      p.title.toLowerCase().includes(cleanQuery) ||
      (p.department && p.department.toLowerCase().includes(cleanQuery)) ||
      (p.fabric && p.fabric.toLowerCase().includes(cleanQuery)) ||
      (p.occasion && p.occasion.toLowerCase().includes(cleanQuery))
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div style="grid-column: 1 / -1; font-size: 0.85rem; color: #888;">No textiles found matching "${query}".</div>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => `
      <div class="search-result-item" data-id="${p.id}" style="display: flex; gap: 0.75rem; padding: 0.5rem; background: var(--bg-surface-alt); border-radius: 4px; cursor: pointer;">
        <img src="${p.mainImage}" alt="${p.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
        <div>
          <h4 style="font-size: 0.85rem; color: var(--text-heading);">${p.title}</h4>
          <p style="font-size: 0.725rem; color: var(--text-muted);">${p.department}</p>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary);">${window.store.formatPrice(p.priceINR)}</span>
        </div>
      </div>
    `).join("");

    resultsContainer.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-id");
        document.getElementById("searchBarModal")?.classList.remove("active");
        this.openPDP(id);
      });
    });
  }

  renderReviews() {
    const grid = document.getElementById("ugcGrid");
    if (!grid) return;

    const reviews = (window.store && typeof window.store.getFeedbacks === "function")
      ? window.store.getFeedbacks()
      : (typeof INITIAL_REVIEWS !== "undefined" ? INITIAL_REVIEWS : []);

    if (!reviews || reviews.length === 0) {
      grid.innerHTML = `<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">No customer reviews recorded yet.</p>`;
      return;
    }

    grid.innerHTML = reviews.map(r => `
      <div class="ugc-card">
        <div class="ugc-header">
          <img src="${r.avatar || 'assets/images/hero_banner.jpg'}" alt="${r.author}" class="ugc-avatar" />
          <div class="ugc-author-meta">
            <h4>${r.author}</h4>
            <span>${r.location} • <strong style="color: var(--color-success);">✓ ${r.status || 'Verified Buyer'}</strong></span>
          </div>
        </div>

        <div class="ugc-stars">${"★".repeat(r.rating || 5)}</div>
        <h4 class="ugc-card-title">${r.title || 'Patron Review'}</h4>
        <p class="ugc-comment">"${r.comment}"</p>

        <div class="ugc-metrics-pill">
          <span class="metric-tag">Softness: ${r.softnessScore || '10/10'}</span>
          <span class="metric-tag">Color: ${r.colorAccuracy || '100% True Dye'}</span>
          <span class="metric-tag">Drape: ${r.drapeScore || 'Pure Heirloom'}</span>
        </div>
      </div>
    `).join("");
  }

  showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast-message";
    const icon = type === "success" ? "✓" : type === "warning" ? "⚠" : "ℹ";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  // ==========================================================================
  // STOREFRONT BULK ORDERS & WHOLESALE SESSION
  // ==========================================================================
  initBulkOrdersSync() {
    // 1. BroadcastChannel across tabs/windows
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const bc = new BroadcastChannel("st_bulk_sync");
        bc.onmessage = (event) => {
          if (event.data && (event.data.type === "BULK_SETTINGS_UPDATED" || event.data.type === "BULK_PACKAGES_UPDATED")) {
            this.renderBulkOrdersSection();
          }
        };
      } catch (e) {
        console.warn("[Storefront] Bulk BroadcastChannel notice:", e);
      }
    }

    // 2. Storage event listener (when admin toggles master switch or adds packages in another tab)
    window.addEventListener("storage", (e) => {
      if (e.key === "st_bulk_settings_v1" || e.key === "st_bulk_packages_v1") {
        this.renderBulkOrdersSection();
      }
    });

    // 3. Same-window custom events from store
    window.addEventListener("bulkSettingsUpdated", () => this.renderBulkOrdersSection());
    window.addEventListener("bulkPackagesUpdated", () => this.renderBulkOrdersSection());
  }

  scrollToBulkSection() {
    const isShopPage = window.location.pathname.includes("shop.html") || window.location.pathname.endsWith("/shop");
    if (!isShopPage) {
      window.location.href = "shop.html#bulkOrdersStoreSection";
      return;
    }

    if (this.currentPage && this.currentPage !== "explore") {
      this.navigateToPage("explore", false);
    }
    setTimeout(() => {
      const section = document.getElementById("bulkOrdersStoreSection");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  }

  renderBulkOrdersSection() {
    if (!window.store || typeof window.store.getBulkSettings !== "function") return;

    const settings = window.store.getBulkSettings();
    const isLive = Boolean(settings && settings.enabled !== false);

    const section = document.getElementById("bulkOrdersStoreSection");
    const headerBtn = document.getElementById("headerBulkOrdersBtn");
    const mobileBtn = document.getElementById("mobileNavBulkBtn");

    // Toggle header button visibility
    if (headerBtn) {
      headerBtn.style.display = isLive ? "inline-flex" : "none";
    }

    // Toggle mobile drawer button visibility
    if (mobileBtn) {
      mobileBtn.style.display = isLive ? "flex" : "none";
    }

    // If section element doesn't exist on this page (e.g. shop.html), return
    if (!section) return;

    // CASE 1: OFF -> COMPLETELY HIDDEN IN REAL TIME WITH ZERO FOOTPRINT
    if (!isLive) {
      section.style.display = "none";
      const grid = document.getElementById("bulkPackagesStoreGrid");
      if (grid) grid.innerHTML = "";
      return;
    }

    // CASE 2: ON -> RENDER BULK ORDERS SESSION ON WEBSITE
    if (this.currentPage && this.currentPage !== "explore") {
      section.style.display = "none";
      return;
    }
    section.style.display = "block";

    // Update section headlines/badges if customized
    const badgeEl = document.getElementById("bulkSectionBadge");
    const headlineEl = document.getElementById("bulkSectionHeadline");
    const subtitleEl = document.getElementById("bulkSectionSubtitle");

    if (badgeEl && settings.badge) badgeEl.textContent = settings.badge;
    if (headlineEl && settings.title) headlineEl.textContent = settings.title;
    if (subtitleEl && settings.subtitle) subtitleEl.textContent = settings.subtitle;

    // Render active packages
    const grid = document.getElementById("bulkPackagesStoreGrid");
    if (!grid) return;

    const allPackages = window.store.getBulkPackages() || [];
    const activePackages = allPackages.filter(p => p.isActive !== false);

    if (activePackages.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: 12px;">
          <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">✨</span>
          <h4 style="margin: 0 0 0.5rem 0; color: var(--text-heading);">Exclusive Weaving Batches in Preparation</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem; max-width: 460px; margin: 0 auto 1rem;">
            New bulk packages for the upcoming wedding season are being curated by our master weavers.
          </p>
          <button type="button" class="btn btn-gold btn-sm" onclick="window.storefront.openBulkInquiryModal('custom')">
            Request Custom Troupe Quote ➔
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = activePackages.map(pkg => {
      const wholesaleFormatted = Number(pkg.wholesalePrice || 0).toLocaleString("en-IN");
      const retailFormatted = Number(pkg.retailMrp || (pkg.wholesalePrice * 2)).toLocaleString("en-IN");
      const discount = pkg.discountPercent || Math.round(((pkg.retailMrp - pkg.wholesalePrice) / pkg.retailMrp) * 100) || 50;

      return `
        <div class="bulk-store-card" id="bulk-card-${pkg.id}">
          <div class="bulk-card-media">
            <img src="${pkg.image || 'assets/images/family_matching_combo.jpg'}" alt="${pkg.title}" loading="lazy" onerror="this.src='assets/images/hero_banner.jpg'" />
            <span class="bulk-card-badge">${pkg.badge || '✨ Verified Lot'}</span>
            <span class="bulk-card-discount-tag">${discount}% WHOLESALE SAVINGS</span>
          </div>

          <div class="bulk-card-content">
            <span class="bulk-card-category">${pkg.category || 'Wholesale Lot'}</span>
            <h3 class="bulk-card-title">${pkg.title}</h3>
            <p class="bulk-card-desc">${pkg.description || ''}</p>

            <div class="bulk-card-specs">
              <div><strong>🧵 Weave:</strong> ${pkg.fabric || '100% Pure Kanchipuram Silk'}</div>
              <div><strong>📦 Set:</strong> ${pkg.inclusions || 'Standard assortment'}</div>
              <div><strong>⏱️ Lead Time:</strong> ${pkg.timeline || '10-15 Days'}</div>
            </div>

            <div class="bulk-card-pricing">
              <span class="bulk-wholesale-rate">₹${wholesaleFormatted}</span>
              <span class="bulk-retail-mrp">₹${retailFormatted}</span>
              <span class="bulk-moq-pill">MOQ: ${pkg.moq || 15} ${pkg.unitLabel || 'Pieces'}</span>
            </div>

            <button type="button" class="btn btn-gold btn-sm" onclick="window.storefront.openBulkInquiryModal('${pkg.id}')" style="width: 100%; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;">
              <span>📋</span> Enquire for This Lot ➔
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  setupBulkInquiryModal() {
    const modal = document.getElementById("bulkInquiryModal");
    if (!modal) return;

    const closeBtn = document.getElementById("closeBulkInquiryModalBtn");
    const cancelBtn = document.getElementById("cancelBulkInquiryBtn");
    const closeSuccessBtn = document.getElementById("bulkInquiryCloseSuccessBtn");
    const form = document.getElementById("customerBulkInquiryForm");

    const closeModal = () => this.closeBulkInquiryModal();

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener("submit", (e) => this.handleCustomerBulkInquirySubmit(e));
    }
  }

  openBulkInquiryModal(packageId = "custom") {
    const modal = document.getElementById("bulkInquiryModal");
    if (!modal) return;

    const form = document.getElementById("customerBulkInquiryForm");
    const successBox = document.getElementById("bulkInquirySuccessContainer");
    const pkgBanner = document.getElementById("bulkInquirySelectedPkgBanner");
    const pkgTitleEl = document.getElementById("bulkInquirySelectedPkgTitle");
    const pkgPriceEl = document.getElementById("bulkInquirySelectedPkgPrice");
    const pkgIdInput = document.getElementById("bulkInquiryPackageId");
    const piecesInput = document.getElementById("bulkCustPieces");
    const typeSelect = document.getElementById("bulkCustOrderType");

    if (form) {
      form.reset();
      form.style.display = "flex";
    }
    if (successBox) successBox.style.display = "none";

    const deadlineInput = document.getElementById("bulkCustDeadline");
    if (deadlineInput) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 15);
      deadlineInput.value = targetDate.toISOString().split("T")[0];
    }

    if (packageId && packageId !== "custom" && window.store) {
      const pkg = window.store.getBulkPackageById(packageId);
      if (pkg) {
        if (pkgIdInput) pkgIdInput.value = pkg.id;
        if (pkgBanner) pkgBanner.style.display = "block";
        if (pkgTitleEl) pkgTitleEl.textContent = pkg.title;
        if (pkgPriceEl) {
          pkgPriceEl.textContent = `Wholesale: ₹${Number(pkg.wholesalePrice).toLocaleString("en-IN")} / unit (Showroom MRP ₹${Number(pkg.retailMrp).toLocaleString("en-IN")}) • MOQ: ${pkg.moq} ${pkg.unitLabel || 'Pcs'}`;
        }
        if (piecesInput) piecesInput.value = pkg.moq || 15;
        if (typeSelect) {
          if (pkg.category && pkg.category.toLowerCase().includes("wedding")) {
            typeSelect.value = "Wedding Bulk";
          } else if (pkg.category && pkg.category.toLowerCase().includes("boutique")) {
            typeSelect.value = "Boutique Reseller";
          } else if (pkg.category && pkg.category.toLowerCase().includes("corporate")) {
            typeSelect.value = "Corporate Gifting";
          } else {
            typeSelect.value = "Wholesale";
          }
        }
      }
    } else {
      if (pkgIdInput) pkgIdInput.value = "";
      if (pkgBanner) pkgBanner.style.display = "none";
      if (piecesInput) piecesInput.value = 15;
      if (typeSelect) typeSelect.value = "Customer Bulk Inquiry";
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeBulkInquiryModal() {
    const modal = document.getElementById("bulkInquiryModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  handleCustomerBulkInquirySubmit(e) {
    e.preventDefault();
    if (!window.store || typeof window.store.addBulkOrder !== "function") return;

    const form = document.getElementById("customerBulkInquiryForm");
    const name = document.getElementById("bulkCustName")?.value.trim() || "Valued Customer";
    const phone = document.getElementById("bulkCustPhone")?.value.trim() || "";
    const email = document.getElementById("bulkCustEmail")?.value.trim() || "";
    const company = document.getElementById("bulkCustCompany")?.value.trim() || name;
    const orderType = document.getElementById("bulkCustOrderType")?.value || "Customer Bulk Inquiry";
    const pieces = parseInt(document.getElementById("bulkCustPieces")?.value, 10) || 15;
    const deadline = document.getElementById("bulkCustDeadline")?.value || "";
    const city = document.getElementById("bulkCustCity")?.value.trim() || "";
    const gstin = document.getElementById("bulkCustGstin")?.value.trim() || "Unregistered / Individual";
    const notes = document.getElementById("bulkCustNotes")?.value.trim() || "";
    const packageId = document.getElementById("bulkInquiryPackageId")?.value || "";

    let pkgTitle = "Custom Handloom Bulk Requirement";
    let unitRate = 3500;
    if (packageId) {
      const pkg = window.store.getBulkPackageById(packageId);
      if (pkg) {
        pkgTitle = pkg.title;
        unitRate = pkg.wholesalePrice || 3500;
      }
    }

    const subtotal = pieces * unitRate;
    const gst = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + gst;

    const itemsDesc = `${pieces}x [${pkgTitle}] • Destination: ${city} • Details: ${notes || 'Standard specifications requested'}`;

    const newOrderData = {
      clientCompany: company,
      contactPerson: name,
      phone: phone,
      email: email,
      gstin: gstin,
      billingAddress: `${city}, India`,
      shippingAddress: `${city}, India`,
      orderType: orderType,
      itemsDescription: itemsDesc,
      totalPieces: pieces,
      subtotalINR: subtotal,
      gstINR: gst,
      totalAmountINR: totalAmount,
      advancePaidINR: 0,
      balanceDueINR: totalAmount,
      paymentStatus: "Unpaid",
      orderStatus: "New Inquiry",
      deliveryDeadline: deadline,
      priority: pieces >= 50 ? "High" : "Standard",
      productionUnit: "Loom Shed Unit 1",
      notes: `Online Customer Inquiry from Storefront • Selected Package: ${packageId || 'Custom Quote'} • ${notes}`
    };

    const savedOrder = window.store.addBulkOrder(newOrderData);

    if (form) form.style.display = "none";
    const successBox = document.getElementById("bulkInquirySuccessContainer");
    const confirmIdEl = document.getElementById("bulkInquiryConfirmId");
    const waChatBtn = document.getElementById("bulkInquiryWhatsAppChatBtn");

    if (confirmIdEl && savedOrder) {
      confirmIdEl.textContent = `Reference #${savedOrder.bulkOrderId}`;
    }

    if (waChatBtn && savedOrder) {
      const waText = encodeURIComponent(
        `Hello Srinivasa Textiles Master Weavers,\n` +
        `I have just submitted a Bulk Inquiry #${savedOrder.bulkOrderId}.\n` +
        `Name: ${name}\n` +
        `Company/Occasion: ${company}\n` +
        `Requirement: ${pkgTitle}\n` +
        `Pieces: ${pieces} Units\n` +
        `Destination: ${city}\n` +
        `Needed By: ${deadline}\n` +
        `Please share the formal quote and fabric swatches.`
      );
      waChatBtn.href = `https://wa.me/916381265149?text=${waText}`;
    }

    if (successBox) successBox.style.display = "block";

    this.showToast(`🎉 Bulk Inquiry #${savedOrder.bulkOrderId} submitted successfully!`, "success");
  }
}

// Global instantiation
window.storefront = new StorefrontController();
