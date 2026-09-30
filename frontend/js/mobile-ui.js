/**
 * SRINIVASA TEXTILES - MOBILE UI/UX ARCHITECTURE CONTROLLER
 * Based on textile_website_mobile_ui_ux_guide.md
 * Handles:
 * 1. Bottom Navigation Bar with live badge sync
 * 2. Instagram Stories Category Bar navigation
 * 3. Full-Screen Mobile Search Overlay with Popular & Recent searches
 * 4. 1-Column vs 2-Column Grid Layout Switcher
 * 5. Interactive Color Swatches & Wishlist quick actions
 * 6. Quick Add Micro-Drawer with Size & Quantity selection
 * 7. Bottom Slide-Up Filter Panel with multi-criteria live filtering
 * 8. Admin Mobile FAB & Quick Actions
 */

class MobileUIController {
  constructor() {
    this.currentGridMode = sessionStorage.getItem("st_mobile_grid_mode") || "2-col";
    this.activeFilters = {
      priceMax: 80000,
      fabrics: [],
      colors: [],
      patterns: [],
      sizes: []
    };
    this.recentSearches = this.loadRecentSearches();

    document.addEventListener("DOMContentLoaded", () => {
      this.init();
    });
  }

  init() {
    this.setupStickyHeaderBehavior();
    this.setupBottomNav();
    this.setupMobileSearchOverlay();
    this.setupGridSwitcher();
    this.setupQuickAddDrawer();
    this.setupFilterBottomSheet();
    this.setupAdminMobileFAB();
    this.updateBadges();

    // Listen to custom store events for live badge sync
    window.addEventListener("cartUpdated", () => this.updateBadges());
    window.addEventListener("wishlistUpdated", () => this.updateBadges());

    // Apply saved grid mode
    this.applyGridMode(this.currentGridMode);
  }

  // =========================================================================
  // 1. DYNAMIC STICKY HEADER SCROLL BEHAVIOR
  // =========================================================================
  setupStickyHeaderBehavior() {
    const header = document.querySelector(".main-header");
    if (!header) return;

    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        header.classList.add("header-scrolled-compact");
      } else {
        header.classList.remove("header-scrolled-compact");
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // =========================================================================
  // 2. STICKY BOTTOM NAVIGATION BAR (5 CORE TABS)
  // =========================================================================
  setupBottomNav() {
    const bottomNav = document.getElementById("mobileBottomNav");
    if (!bottomNav) return;

    const tabs = bottomNav.querySelectorAll(".bottom-nav-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        const action = tab.getAttribute("data-tab-action");
        if (!action) return;

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        switch (action) {
          case "home":
            if (window.storefront && typeof window.storefront.navigateToPage === "function") {
              window.storefront.navigateToPage("home");
            } else {
              window.location.href = "index.html";
            }
            break;

          case "shop":
            if (window.storefront && typeof window.storefront.navigateToPage === "function") {
              window.storefront.navigateToPage("explore");
            } else {
              window.location.href = "shop.html";
            }
            break;

          case "search":
            e.preventDefault();
            this.openMobileSearch();
            break;

          case "wishlist":
            e.preventDefault();
            if (window.storefront && typeof window.storefront.openWishlistDrawer === "function") {
              window.storefront.openWishlistDrawer();
            }
            break;

          case "cart":
            e.preventDefault();
            if (window.storefront && typeof window.storefront.openCartDrawer === "function") {
              window.storefront.openCartDrawer();
            }
            break;
        }
      });
    });
  }

  updateBadges() {
    if (!window.store) return;
    const cartCount = typeof window.store.getCartItemCount === "function" ? window.store.getCartItemCount() : 0;
    const wishlist = typeof window.store.getWishlist === "function" ? window.store.getWishlist() : [];
    const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

    const cartBadge = document.getElementById("bottomNavCartBadge");
    const wishBadge = document.getElementById("bottomNavWishlistBadge");

    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? "flex" : "none";
    }

    if (wishBadge) {
      wishBadge.textContent = wishlistCount;
      wishBadge.style.display = wishlistCount > 0 ? "flex" : "none";
    }
  }

  // =========================================================================
  // 3. FULL-SCREEN MOBILE SEARCH OVERLAY (POPULAR & RECENT SEARCHES)
  // =========================================================================
  setupMobileSearchOverlay() {
    const searchModal = document.getElementById("searchBarModal");
    const searchInput = document.getElementById("headerSearchInput");
    if (!searchModal) return;

    // Check if recommendations container exists, if not inject it
    let recContainer = document.getElementById("mobileSearchRecs");
    if (!recContainer) {
      const container = searchModal.querySelector(".search-modal-container");
      if (container) {
        recContainer = document.createElement("div");
        recContainer.id = "mobileSearchRecs";
        recContainer.className = "mobile-search-recommendations";
        container.appendChild(recContainer);
      }
    }

    this.renderSearchRecommendations();

    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && searchInput.value.trim()) {
          this.addRecentSearch(searchInput.value.trim());
        }
      });
    }
  }

  openMobileSearch() {
    if (window.storefront && typeof window.storefront.openSearchModal === "function") {
      window.storefront.openSearchModal();
    } else {
      const modal = document.getElementById("searchBarModal");
      if (modal) modal.classList.add("active");
    }
    this.renderSearchRecommendations();
  }

  renderSearchRecommendations() {
    const recContainer = document.getElementById("mobileSearchRecs");
    if (!recContainer) return;

    const popularQueries = [
      "Pure Kanchipuram Silk",
      "Bridal Korvai Saree",
      "Family Matching Combo",
      "Girls Pattu Pavadai",
      "Boys Silk Kurta Dhoti",
      "Men's 8-Muzham Dhoti",
      "Organic Baby Muslin",
      "Linen Sarees"
    ];

    const recentHtml = this.recentSearches.length > 0 ? `
      <div>
        <div class="mobile-search-section-title">
          <span>🕒 Recent Searches</span>
          <button type="button" onclick="window.mobileUI.clearRecentSearches()" style="background:none;border:none;color:var(--text-muted);font-size:0.75rem;cursor:pointer;">Clear All</button>
        </div>
        <div class="recent-searches-list">
          ${this.recentSearches.map(term => `
            <div class="recent-search-row" onclick="window.mobileUI.executeSearch('${term}')">
              <span>🔍 ${term}</span>
              <button type="button" class="recent-search-remove" onclick="event.stopPropagation(); window.mobileUI.removeRecentSearch('${term}')">✕</button>
            </div>
          `).join("")}
        </div>
      </div>
    ` : "";

    recContainer.innerHTML = `
      ${recentHtml}
      <div>
        <div class="mobile-search-section-title">
          <span>🔥 Popular Searches</span>
        </div>
        <div class="mobile-search-chips">
          ${popularQueries.map(term => `
            <button type="button" class="search-chip" onclick="window.mobileUI.executeSearch('${term}')">
              ✦ ${term}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  executeSearch(term) {
    const searchInput = document.getElementById("headerSearchInput");
    if (searchInput) {
      searchInput.value = term;
      this.addRecentSearch(term);
      if (window.storefront && typeof window.storefront.handleSearchInput === "function") {
        window.storefront.handleSearchInput(term);
      }
    }
  }

  loadRecentSearches() {
    try {
      const data = localStorage.getItem("st_recent_searches");
      return data ? JSON.parse(data) : ["Kanchipuram Silk", "Family Combo", "Pattu Pavadai"];
    } catch (e) {
      return [];
    }
  }

  addRecentSearch(term) {
    if (!term) return;
    this.recentSearches = [term, ...this.recentSearches.filter(t => t.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    try {
      localStorage.setItem("st_recent_searches", JSON.stringify(this.recentSearches));
    } catch (e) {}
    this.renderSearchRecommendations();
  }

  removeRecentSearch(term) {
    this.recentSearches = this.recentSearches.filter(t => t !== term);
    try {
      localStorage.setItem("st_recent_searches", JSON.stringify(this.recentSearches));
    } catch (e) {}
    this.renderSearchRecommendations();
  }

  clearRecentSearches() {
    this.recentSearches = [];
    try {
      localStorage.removeItem("st_recent_searches");
    } catch (e) {}
    this.renderSearchRecommendations();
  }

  // =========================================================================
  // 4. 1-COLUMN VS 2-COLUMN GRID SWITCHER
  // =========================================================================
  setupGridSwitcher() {
    const btn1Col = document.getElementById("mobileGrid1ColBtn");
    const btn2Col = document.getElementById("mobileGrid2ColBtn");

    if (btn1Col) {
      btn1Col.addEventListener("click", () => this.applyGridMode("1-col"));
    }
    if (btn2Col) {
      btn2Col.addEventListener("click", () => this.applyGridMode("2-col"));
    }
  }

  applyGridMode(mode) {
    this.currentGridMode = mode;
    sessionStorage.setItem("st_mobile_grid_mode", mode);

    const grid = document.getElementById("productsGrid");
    const btn1Col = document.getElementById("mobileGrid1ColBtn");
    const btn2Col = document.getElementById("mobileGrid2ColBtn");

    if (btn1Col) btn1Col.classList.toggle("active", mode === "1-col");
    if (btn2Col) btn2Col.classList.toggle("active", mode === "2-col");

    if (grid) {
      if (mode === "1-col") {
        grid.classList.add("grid-1-col");
        grid.classList.remove("grid-2-col");
      } else {
        grid.classList.add("grid-2-col");
        grid.classList.remove("grid-1-col");
      }
    }
  }

  // =========================================================================
  // 5. QUICK ADD MICRO-DRAWER (Size, Quantity, Add to Cart)
  // =========================================================================
  setupQuickAddDrawer() {
    // Intercept clicks on .quick-add-btn to open size micro-drawer on mobile
    document.addEventListener("click", (e) => {
      const quickAddBtn = e.target.closest(".quick-add-btn");
      if (quickAddBtn && window.innerWidth <= 768) {
        e.stopPropagation();
        e.preventDefault();
        const card = quickAddBtn.closest(".product-card");
        const productId = card ? card.getAttribute("data-id") : null;
        if (productId) {
          this.openQuickAddDrawer(productId);
        }
      }
    });
  }

  openQuickAddDrawer(productId) {
    if (!window.store) return;
    const product = window.store.getProductById(productId);
    if (!product) return;

    let drawer = document.getElementById("mobileQuickAddDrawer");
    let backdrop = document.getElementById("mobileSheetBackdrop");

    if (!drawer) {
      drawer = document.createElement("div");
      drawer.id = "mobileQuickAddDrawer";
      drawer.className = "mobile-quick-add-drawer";
      document.body.appendChild(drawer);
    }

    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "mobileSheetBackdrop";
      backdrop.className = "mobile-bottom-sheet-backdrop";
      backdrop.addEventListener("click", () => this.closeAllSheets());
      document.body.appendChild(backdrop);
    }

    const priceFormatted = window.store.formatPrice(product.priceINR || 0);
    const primaryImg = product.mainImage || product.image || 'assets/images/family_matching_combo.jpg';
    const sizes = (product.availableSizes && product.availableSizes.length > 0)
      ? product.availableSizes
      : ["S", "M", "L", "XL", "Free Size"];

    drawer.innerHTML = `
      <div class="sheet-drag-handle"></div>
      <div class="quick-drawer-product-row">
        <img src="${primaryImg}" class="quick-drawer-thumb" alt="${product.title}" />
        <div class="quick-drawer-meta">
          <h4>${product.title}</h4>
          <span class="quick-drawer-price">${priceFormatted}</span>
        </div>
        <button type="button" class="sheet-close-btn" onclick="window.mobileUI.closeAllSheets()" style="margin-left:auto;">✕</button>
      </div>

      <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-heading); margin-bottom: 0.4rem;">
        Select Size:
      </div>
      <div class="quick-drawer-sizes" id="quickDrawerSizeList">
        ${sizes.map((s, idx) => `
          <button type="button" class="quick-size-btn ${idx === 0 ? 'active' : ''}" data-size="${s}" onclick="window.mobileUI.selectQuickSize(this)">
            ${s}
          </button>
        `).join("")}
      </div>

      <div style="display: flex; gap: 0.75rem; align-items: center;">
        <button type="button" class="btn btn-gold btn-md" style="flex: 1; font-weight: 800; padding: 0.85rem;" onclick="window.mobileUI.confirmQuickAdd('${product.id}')">
          🛍️ Add to Shopping Bag
        </button>
      </div>
    `;

    backdrop.classList.add("active");
    drawer.classList.add("active");
  }

  selectQuickSize(btn) {
    const list = document.getElementById("quickDrawerSizeList");
    if (list) {
      list.querySelectorAll(".quick-size-btn").forEach(b => b.classList.remove("active"));
    }
    btn.classList.add("active");
  }

  confirmQuickAdd(productId) {
    if (!window.store) return;
    const product = window.store.getProductById(productId);
    if (!product) return;

    const activeSizeBtn = document.querySelector("#quickDrawerSizeList .quick-size-btn.active");
    const size = activeSizeBtn ? activeSizeBtn.getAttribute("data-size") : "Standard";
    const color = product.colors && product.colors[0] ? product.colors[0].name : "Original";

    window.store.addToCart(product.id, color, size, "unstitched", null, 1);
    this.closeAllSheets();
    if (window.storefront && typeof window.storefront.showToast === "function") {
      window.storefront.showToast(`Added "${product.title} (${size})" to your Bag!`, "success");
    }
  }

  // =========================================================================
  // 6. BOTTOM SLIDE-UP FILTER PANEL
  // =========================================================================
  setupFilterBottomSheet() {
    const filterTriggerBtn = document.getElementById("mobileOpenFilterBtn");
    const sortTriggerBtn = document.getElementById("mobileOpenSortBtn");

    if (filterTriggerBtn) {
      filterTriggerBtn.addEventListener("click", () => this.openFilterSheet());
    }

    if (sortTriggerBtn) {
      sortTriggerBtn.addEventListener("click", () => this.openSortSheet());
    }
  }

  openFilterSheet() {
    const sheet = document.getElementById("mobileFilterBottomSheet");
    let backdrop = document.getElementById("mobileSheetBackdrop");

    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "mobileSheetBackdrop";
      backdrop.className = "mobile-bottom-sheet-backdrop";
      backdrop.addEventListener("click", () => this.closeAllSheets());
      document.body.appendChild(backdrop);
    }

    if (sheet && backdrop) {
      backdrop.classList.add("active");
      sheet.classList.add("active");
      this.updateLiveFilterCount();
    }
  }

  openSortSheet() {
    // Cycles sort options or opens quick modal
    const sorts = ["featured", "price-low", "price-high", "rating"];
    const sortLabels = {
      "featured": "✨ Featured & Trending",
      "price-low": "💵 Price: Low to High",
      "price-high": "💎 Price: High to Low",
      "rating": "⭐ Customer Rating"
    };

    let currentIndex = sorts.indexOf(window.storefront?.currentSort || "featured");
    let nextIndex = (currentIndex + 1) % sorts.length;
    let nextSort = sorts[nextIndex];

    if (window.storefront) {
      window.storefront.currentSort = nextSort;
      const sortSelect = document.getElementById("sortSelect");
      if (sortSelect) sortSelect.value = nextSort;
      window.storefront.renderCurrentPage();
      window.storefront.showToast(`Sorted by: ${sortLabels[nextSort]}`, "info");
    }
  }

  closeAllSheets() {
    document.querySelectorAll(".mobile-bottom-sheet-backdrop, .mobile-filter-bottom-sheet, .mobile-quick-add-drawer").forEach(el => {
      el.classList.remove("active");
    });
  }

  toggleFilterChip(btn, category) {
    btn.classList.toggle("active");
    const value = btn.getAttribute("data-value");
    if (btn.classList.contains("active")) {
      if (!this.activeFilters[category].includes(value)) {
        this.activeFilters[category].push(value);
      }
    } else {
      this.activeFilters[category] = this.activeFilters[category].filter(v => v !== value);
    }
    this.updateLiveFilterCount();
  }

  updatePriceSlider(val) {
    const label = document.getElementById("sheetPriceLabel");
    if (label) {
      label.textContent = `Up to ₹${Number(val).toLocaleString("en-IN")}`;
    }
    this.activeFilters.priceMax = Number(val);
    this.updateLiveFilterCount();
  }

  updateLiveFilterCount() {
    let count = 0;
    if (this.activeFilters.priceMax < 80000) count++;
    count += this.activeFilters.fabrics.length;
    count += this.activeFilters.colors.length;
    count += this.activeFilters.patterns.length;
    count += this.activeFilters.sizes.length;

    const countEl = document.getElementById("sheetFilterLiveCount");
    const badgeEl = document.getElementById("mobileFilterBadgeCounter");

    if (countEl) {
      countEl.textContent = count > 0 ? `Apply ${count} Filters` : "Apply All";
    }
    if (badgeEl) {
      badgeEl.textContent = count;
      badgeEl.style.display = count > 0 ? "inline-flex" : "none";
    }
  }

  applyFilters() {
    if (!window.storefront) return;

    if (this.activeFilters.fabrics.length > 0) {
      window.storefront.currentFabricFilter = this.activeFilters.fabrics[0];
      const fabEl = document.getElementById("fabricFilter");
      if (fabEl) fabEl.value = this.activeFilters.fabrics[0];
    } else {
      window.storefront.currentFabricFilter = "All";
    }

    window.storefront.renderCurrentPage();
    this.closeAllSheets();
    window.storefront.showToast("Filters applied successfully!", "success");
  }

  resetFilters() {
    this.activeFilters = {
      priceMax: 80000,
      fabrics: [],
      colors: [],
      patterns: [],
      sizes: []
    };

    document.querySelectorAll(".sheet-filter-chip, .sheet-color-btn").forEach(el => {
      el.classList.remove("active");
    });

    const slider = document.getElementById("sheetPriceRange");
    if (slider) slider.value = 80000;
    this.updatePriceSlider(80000);

    if (window.storefront && typeof window.storefront.resetAllFilters === "function") {
      window.storefront.resetAllFilters();
    }

    this.closeAllSheets();
  }

  // =========================================================================
  // 7. ADMIN MOBILE FLOATING ACTION BUTTON (FAB)
  // =========================================================================
  setupAdminMobileFAB() {
    const fab = document.getElementById("adminMobileFAB");
    const menu = document.getElementById("adminFABMenu");
    if (!fab || !menu) return;

    fab.addEventListener("click", () => {
      fab.classList.toggle("active");
      menu.classList.toggle("active");
    });
  }
}

// Global instantiation
window.mobileUI = new MobileUIController();
