// Owner Admin Panel Controller & Multi-Category Family Management System
// Compliant with Complete_Family_Textile_Website_Blueprint.md

class AdminController {
  constructor() {
    this.currentTab = "overview";
    this.uploadedImages = [];
    this.init();
  }

  init() {
    this.setupMobileSidebar();
    this.bindEvents();
    try { this.renderDashboardKPIs(); } catch (e) { console.error("renderDashboardKPIs error:", e); }
    try { this.renderInventoryTable(); } catch (e) { console.error("renderInventoryTable error:", e); }
    try { this.renderOrdersTable(); } catch (e) { console.error("renderOrdersTable error:", e); }
    try { this.renderSubscribersTable(); } catch (e) { console.error("renderSubscribersTable error:", e); }
    try { this.renderFeedbacksTable(); } catch (e) { console.error("renderFeedbacksTable error:", e); }
    try { this.setupMediaUploader(); } catch (e) { console.error("setupMediaUploader error:", e); }
  }

  setupMobileSidebar() {
    const menuBtn = document.getElementById("adminMobileMenuBtn");
    const drawer = document.getElementById("adminMobileNavDrawer");
    const overlay = document.getElementById("adminMobileNavOverlay");
    const closeBtn = document.getElementById("adminMobileNavCloseBtn");

    const openDrawer = () => {
      drawer?.classList.add("active");
      overlay?.classList.add("active");
      document.body.classList.add("admin-sidebar-open");
    };

    const closeDrawer = () => {
      drawer?.classList.remove("active");
      overlay?.classList.remove("active");
      document.body.classList.remove("admin-sidebar-open");
    };

    if (menuBtn) {
      menuBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDrawer();
      };
    }
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeDrawer();
      };
    }
    if (overlay) {
      overlay.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeDrawer();
      };
    }

    // Attach click listener to all tab buttons inside the mobile drawer
    document.querySelectorAll("#adminMobileNavDrawer .mobile-dept-btn").forEach(btn => {
      btn.onclick = (e) => {
        const tab = btn.getAttribute("data-tab");
        closeDrawer();
        if (tab) this.switchTab(tab);
      };
    });

    window.openAdminMobileMenu = openDrawer;
    window.closeAdminMobileMenu = closeDrawer;
    window.toggleAdminMobileMenu = () => {
      if (drawer?.classList.contains("active")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };
  }

  toggleMobileSidebar(open) {
    const drawer = document.getElementById("adminMobileNavDrawer");
    const overlay = document.getElementById("adminMobileNavOverlay");
    if (!drawer) return;
    const isOpen = open !== undefined ? open : !drawer.classList.contains("active");
    if (isOpen) {
      drawer.classList.add("active");
      overlay?.classList.add("active");
      document.body.classList.add("admin-sidebar-open");
    } else {
      drawer.classList.remove("active");
      overlay?.classList.remove("active");
      document.body.classList.remove("admin-sidebar-open");
    }
  }

  closeMobileSidebar() {
    const drawer = document.getElementById("adminMobileNavDrawer");
    const overlay = document.getElementById("adminMobileNavOverlay");
    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.classList.remove("admin-sidebar-open");
  }

  bindEvents() {
    // Tab switching
    document.querySelectorAll(".admin-menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        const tab = e.currentTarget.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });

    // Reactivity
    window.addEventListener("catalogUpdated", () => {
      this.renderDashboardKPIs();
      this.renderInventoryTable();
    });

    window.addEventListener("ordersUpdated", () => {
      this.renderDashboardKPIs();
      this.renderOrdersTable();
    });

    window.addEventListener("subscribersUpdated", () => {
      this.renderDashboardKPIs();
      this.renderSubscribersTable();
    });

    window.addEventListener("feedbacksUpdated", () => {
      this.renderDashboardKPIs();
      this.renderFeedbacksTable();
    });

    // Feedback Filter Controls
    const fbSearch = document.getElementById("feedbackSearchInput");
    const fbDept = document.getElementById("feedbackDeptFilter");
    const fbReset = document.getElementById("resetFeedbackFilterBtn");
    const fbExport = document.getElementById("exportFeedbacksCsvBtn");

    if (fbSearch) {
      fbSearch.addEventListener("input", () => this.applyFeedbackFilters());
    }
    if (fbDept) {
      fbDept.addEventListener("change", () => this.applyFeedbackFilters());
    }
    if (fbReset) {
      fbReset.addEventListener("click", () => {
        if (fbSearch) fbSearch.value = "";
        if (fbDept) fbDept.value = "";
        this.renderFeedbacksTable();
      });
    }
    if (fbExport) {
      fbExport.addEventListener("click", () => this.handleExportFeedbacksCSV());
    }

    // Add Product Form
    const productForm = document.getElementById("adminAddProductForm");
    if (productForm) {
      productForm.addEventListener("submit", (e) => this.handleAddProduct(e));
    }

    // Bulk CSV Export & Import Buttons
    const exportCsvBtn = document.getElementById("exportCsvBtn");
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener("click", () => this.handleExportCSV());
    }

    const downloadTemplateBtn = document.getElementById("downloadTemplateBtn");
    if (downloadTemplateBtn) {
      downloadTemplateBtn.addEventListener("click", () => this.handleDownloadTemplateCSV());
    }

    const importCsvInput = document.getElementById("importCsvInput");
    if (importCsvInput) {
      importCsvInput.addEventListener("change", (e) => this.handleImportCSV(e));
    }

    // Real-Time Orders PDF Export & Batch Print Buttons
    const printAllOrdersReportBtn = document.getElementById("printAllOrdersReportBtn");
    if (printAllOrdersReportBtn) {
      printAllOrdersReportBtn.addEventListener("click", () => this.printAllOrdersReportPDF());
    }

    const printAllInvoicesBtn = document.getElementById("printAllInvoicesBtn");
    if (printAllInvoicesBtn) {
      printAllInvoicesBtn.addEventListener("click", () => this.printAllGSTInvoicesPDF());
    }
  }

  switchTab(tabName) {
    if (!tabName) return;
    this.currentTab = tabName;
    this.closeMobileSidebar();

    window.scrollTo({ top: 0, behavior: "smooth" });
    const mainContent = document.querySelector(".admin-main-content");
    if (mainContent) mainContent.scrollTop = 0;

    const normTab = (tabName === "feedback") ? "feedbacks" : tabName;

    document.querySelectorAll(".admin-menu-item").forEach(item => {
      const itemTab = item.getAttribute("data-tab");
      const isActive = itemTab === normTab || itemTab === tabName;
      item.classList.toggle("active", isActive);
    });

    document.querySelectorAll("#adminMobileNavDrawer .mobile-dept-btn").forEach(btn => {
      const btnTab = btn.getAttribute("data-tab");
      const isActive = btnTab === normTab || btnTab === tabName;
      btn.classList.toggle("active", isActive);
    });

    document.querySelectorAll(".admin-tab-pane").forEach(pane => {
      const paneId = pane.getAttribute("id");
      const isActive = paneId === `adminTab-${normTab}` || paneId === `adminTab-${tabName}`;
      pane.classList.toggle("active", isActive);
    });

    if (normTab === "orders") {
      this.renderOrdersTable();
    } else if (normTab === "inventory") {
      this.renderInventoryTable();
    } else if (normTab === "feedbacks" || normTab === "feedback") {
      this.renderFeedbacksTable();
    } else if (normTab === "subscribers") {
      this.renderSubscribersTable();
    } else if (normTab === "overview") {
      this.renderDashboardKPIs();
    }
  }

  renderDashboardKPIs() {
    const stats = window.store.getAdminStats();
    const feedbacks = window.store.getFeedbacks();

    const revEl = document.getElementById("kpiTotalRevenue");
    const ordersEl = document.getElementById("kpiActiveOrders");
    const lowStockEl = document.getElementById("kpiLowStock");
    const skusEl = document.getElementById("kpiTotalSKUs");
    const avgRatingEl = document.getElementById("kpiAvgRating");
    const totalFbEl = document.getElementById("kpiTotalFeedbacks");
    const btnFbCount = document.getElementById("btnFeedbackCount");
    const sidebarFbBadge = document.getElementById("sidebarFeedbackBadge");
    const fbBadge = document.getElementById("feedbackCountBadge");
    const fbAvgVal = document.getElementById("fbAvgRatingVal");
    const fbTotalVal = document.getElementById("fbTotalSubmissionsVal");
    const fbSoftnessVal = document.getElementById("fbSoftnessScoreVal");

    if (revEl) revEl.textContent = `₹${stats.totalSalesINR.toLocaleString("en-IN")}`;
    if (ordersEl) ordersEl.textContent = stats.activeOrdersCount;
    if (lowStockEl) lowStockEl.textContent = stats.lowStockCount;
    if (skusEl) skusEl.textContent = stats.totalSKUs;

    // Calculate rating metrics
    const totalFeedbacks = feedbacks.length;
    let avgRating = 5.0;
    if (totalFeedbacks > 0) {
      const sum = feedbacks.reduce((acc, f) => acc + (parseInt(f.rating, 10) || 5), 0);
      avgRating = (sum / totalFeedbacks).toFixed(1);
    }

    const mobileSidebarFbBadge = document.getElementById("mobileSidebarFeedbackBadge");
    const mobileSidebarStockBadge = document.getElementById("mobileSidebarStockBadge");
    const sidebarStockBadge = document.getElementById("sidebarStockBadge");
    if (sidebarStockBadge) sidebarStockBadge.textContent = `${stats.totalSKUs} SKUs`;
    if (mobileSidebarStockBadge) mobileSidebarStockBadge.textContent = `${stats.totalSKUs} SKUs`;
    if (sidebarFbBadge) sidebarFbBadge.textContent = `${totalFeedbacks} Reviews`;
    if (mobileSidebarFbBadge) mobileSidebarFbBadge.textContent = `${totalFeedbacks} Reviews`;
    if (fbBadge) fbBadge.textContent = `${totalFeedbacks} Reviews`;
    if (btnFbCount) btnFbCount.textContent = `(${totalFeedbacks})`;
    if (avgRatingEl) avgRatingEl.textContent = `${avgRating} ★`;
    if (totalFbEl) totalFbEl.textContent = totalFeedbacks;
    if (fbAvgVal) fbAvgVal.textContent = `${avgRating} ★`;
    if (fbTotalVal) fbTotalVal.textContent = totalFeedbacks;
  }

  setupMediaUploader() {
    const dropzone = document.getElementById("mediaDropzone");
    const fileInput = document.getElementById("productMediaFiles");
    const urlInput = document.getElementById("pImageURL");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
          fileInput.click();
        }
      });

      // Drag and Drop Events
      ["dragenter", "dragover"].forEach(evtName => {
        dropzone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.style.borderColor = "var(--color-gold)";
          dropzone.style.background = "rgba(212, 175, 55, 0.08)";
        });
      });

      ["dragleave", "drop"].forEach(evtName => {
        dropzone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.style.borderColor = "";
          dropzone.style.background = "";
        });
      });

      dropzone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const files = dt ? Array.from(dt.files) : [];
        if (files.length > 0) {
          this.processUploadedFiles(files);
        }
      });

      fileInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          this.processUploadedFiles(files);
        }
      });
    }

    if (urlInput) {
      urlInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (val && this.uploadedImages.length === 0) {
          this.renderMediaPreviews([val]);
        } else if (!val && this.uploadedImages.length === 0) {
          this.renderMediaPreviews([]);
        }
      });
    }
  }

  async processUploadedFiles(files) {
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    for (const file of imageFiles) {
      const dataUrl = await this.readFileAsDataURL(file);
      if (dataUrl) {
        this.uploadedImages.push(dataUrl);
      }
    }

    this.renderMediaPreviews(this.uploadedImages);

    if (window.storefront) {
      window.storefront.showToast(`📸 ${imageFiles.length} photo(s) added & ready to publish!`, "success");
    }
  }

  readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  renderMediaPreviews(images) {
    const previewContainer = document.getElementById("mediaPreviewStrip");
    if (!previewContainer) return;

    if (!images || images.length === 0) {
      previewContainer.innerHTML = "";
      return;
    }

    previewContainer.innerHTML = images.map((imgSrc, idx) => `
      <div class="preview-thumb">
        <img src="${imgSrc}" alt="Product Image ${idx + 1}" />
        <span class="tag">${idx === 0 ? "⭐ Main Cover" : `#${idx + 1}`}</span>
        <button type="button" class="remove-img-btn" data-index="${idx}" title="Remove photo">✕</button>
      </div>
    `).join("");

    previewContainer.querySelectorAll(".remove-img-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute("data-index"), 10);
        if (this.uploadedImages.length > index) {
          this.uploadedImages.splice(index, 1);
          this.renderMediaPreviews(this.uploadedImages);
        } else {
          this.renderMediaPreviews([]);
          const urlInput = document.getElementById("pImageURL");
          if (urlInput) urlInput.value = "";
        }
      });
    });
  }

  handleAddProduct(e) {
    e.preventDefault();

    const title = document.getElementById("pTitle")?.value;
    const subtitle = document.getElementById("pSubtitle")?.value;
    const department = document.getElementById("pDepartment")?.value || "Women's Collection";
    const subCategory = document.getElementById("pSubCategory")?.value || "Ethnic Wear";
    const ageGroup = document.getElementById("pAgeGroup")?.value || "Adults";
    const fabric = document.getElementById("pFabric")?.value || "Kanchipuram Silk";
    const occasion = document.getElementById("pOccasion")?.value || "Wedding & Grand Celebration";
    const technique = document.getElementById("pTechnique")?.value || "Handloom";
    const priceINR = parseInt(document.getElementById("pPrice")?.value, 10) || 12000;
    const mrpINR = parseInt(document.getElementById("pMRP")?.value, 10) || Math.round(priceINR * 1.3);
    const stock = parseInt(document.getElementById("pStock")?.value, 10) || 3;
    const hsnCode = document.getElementById("pHSN")?.value || "50072010";
    const customUrl = document.getElementById("pImageURL")?.value.trim();
    const hasSoftLining = document.getElementById("pSoftLiningCheckbox")?.checked;
    const hasOrganicCotton = document.getElementById("pOrganicCottonCheckbox")?.checked;

    // Determine primary cover image & gallery
    let mainImage = "";
    if (this.uploadedImages && this.uploadedImages.length > 0) {
      mainImage = this.uploadedImages[0];
    } else if (customUrl) {
      mainImage = customUrl;
    } else {
      // High-resolution thematic default fallback
      const fallbacks = {
        "Women's Collection": "assets/images/banarasi_blue.jpg",
        "Kids Wear (Girls)": "assets/images/kids_pattu_pavadai.jpg",
        "Kids Wear (Boys)": "assets/images/boys_kurta_dhoti.jpg",
        "Men's Collection": "assets/images/mens_silk_dhoti.jpg",
        "Infants & Toddlers": "assets/images/infant_organic_jhabla.jpg",
        "Family Combos & Sets": "assets/images/family_matching_combo.jpg"
      };
      mainImage = fallbacks[department] || "assets/images/family_matching_combo.jpg";
    }

    const allImages = this.uploadedImages && this.uploadedImages.length > 0
      ? [...this.uploadedImages]
      : [mainImage];

    const badges = ["✨ Silk Mark (SMOI) Certified"];
    const safetyBadges = [];
    if (hasSoftLining) safetyBadges.push("🛡️ Soft Inner-Lining Guarantee");
    if (hasOrganicCotton) safetyBadges.push("🌿 100% Skin-Friendly Organic Cotton");

    const newProduct = {
      title,
      subtitle,
      department,
      subCategory,
      ageGroup,
      fabric,
      fabricType: `100% Certified ${fabric}`,
      warpWeft: "3-Ply Silk Warp & Weft",
      zariType: "Pure Tested Gold Zari",
      threadCount: "240 EPI x 140 PPI",
      length: "Standard Sizing",
      weight: "550g",
      hsnCode,
      gstRate: 5,
      priceINR,
      mrpINR,
      stock,
      lowStockThreshold: 2,
      collections: [department, "Festive Silk 2026"],
      occasion,
      technique,
      availableSizes: ["Standard", "Size 26 (4-5Y)", "Size 30 (6-8Y)", "Size 34 (9-11Y)", "Adult M/L"],
      colors: [
        { name: "Signature Palette", hex: "#7A0C2E", image: mainImage, code: "SIG-01" }
      ],
      mainImage: mainImage,
      image: mainImage,
      zoomImage: mainImage,
      images: allImages,
      gallery: allImages,
      badges,
      safetyBadges,
      rating: 5.0,
      reviewCount: 1,
      description: `Newly added ${title} for ${department} handcrafted by Srinivasa Textiles master artisans.`,
      careInstructions: ["Professional Dry Clean or gentle wash"]
    };

    window.store.addProduct(newProduct);
    e.target.reset();
    this.uploadedImages = [];
    this.renderMediaPreviews([]);

    if (window.storefront) {
      window.storefront.showToast(`✅ Product "${title}" published with image to live storefront!`, "success");
    }

    this.switchTab("inventory");
  }

  renderInventoryTable() {
    const tbody = document.getElementById("adminInventoryTableBody");
    if (!tbody) return;

    const catalog = window.store.getAllProducts();

    tbody.innerHTML = catalog.map(product => {
      const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 2);
      const isOutOfStock = product.stock <= 0;

      return `
        <tr data-id="${product.id}">
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${product.mainImage || 'assets/images/family_matching_combo.jpg'}" alt="${product.title}" onerror="this.onerror=null;this.src='assets/images/family_matching_combo.jpg';" style="width: 44px; height: 52px; object-fit: cover; border-radius: 4px;" />
              <div>
                <strong style="display: block; font-size: 0.85rem;">${product.title}</strong>
                <span style="font-size: 0.725rem; color: #64748B;">SKU: ${product.id} • <strong>${product.department}</strong></span>
              </div>
            </div>
          </td>
          <td><strong>${product.hsnCode || "50072010"}</strong></td>
          <td>${window.store.formatPrice(product.priceINR)}</td>
          <td>
            <input type="number" class="stock-inline-edit" data-id="${product.id}" value="${product.stock}" min="0" />
          </td>
          <td>
            ${isOutOfStock ? `
              <span class="status-badge" style="background:#FEE2E2; color:#DC2626;">Out of Stock</span>
            ` : isLowStock ? `
              <span class="status-badge" style="background:#FEF3C7; color:#D97706;">Low Stock (${product.stock})</span>
            ` : `
              <span class="status-badge paid">In Stock</span>
            `}
          </td>
          <td>
            <button class="btn btn-outline btn-sm delete-prod-btn" data-id="${product.id}" style="color: var(--color-danger); border-color: #FECDD3;">Delete</button>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".stock-inline-edit").forEach(input => {
      input.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        const val = parseInt(e.target.value, 10);
        window.store.updateStock(id, val);
        if (window.storefront) {
          window.storefront.showToast(`Updated stock for ${id} to ${val}`, "info");
        }
      });
    });

    tbody.querySelectorAll(".delete-prod-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        if (confirm(`Remove product ${id} from catalog?`)) {
          window.store.deleteProduct(id);
          if (window.storefront) {
            window.storefront.showToast(`Product ${id} deleted from catalog`, "warning");
          }
        }
      });
    });
  }

  handleExportCSV() {
    const csvData = window.store.exportCatalogToCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Srinivasa_Family_Catalog_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.storefront) window.storefront.showToast("Exported family catalog CSV!", "success");
  }

  handleDownloadTemplateCSV() {
    const templateContent = `SKU_ID,Title,Department,SubCategory,Age_Group,Fabric,HSN_Code,Price_INR,MRP_INR,Stock_Level,Occasion,Technique,Collections
ST-FAM-SAMPLE,Family Festive Silk Matching Set,Family Combos & Sets,Full Family Festival Bundles,Family Set,Kanchipuram Silk,50072010,48000,58000,3,Wedding & Grand Celebration,Handloom Korvai,Family Combos;Festive Silk 2026
ST-KDG-SAMPLE,Girls Pure Silk Pattu Pavadai,Kids Wear (Girls),Pattu Pavadai,4-5 Yrs,Pure Silk,62044220,7800,9500,5,Birthday & Party Wear,Jacquard,Kids Wear;Festive Silk 2026`;

    const blob = new Blob([templateContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Srinivasa_Family_Textiles_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  handleImportCSV(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const res = window.store.importCatalogFromCSV(content);
      if (res.success) {
        if (window.storefront) {
          window.storefront.showToast(`Batch imported ${res.count} family SKUs successfully!`, "success");
        }
        this.renderInventoryTable();
        this.renderDashboardKPIs();
      } else {
        alert(`Error importing CSV: ${res.message}`);
      }
    };
    reader.readAsText(file);
  }

  renderOrdersTable() {
    const tbody = document.getElementById("adminOrdersTableBody");
    if (!tbody) return;

    const orders = window.store.orders || [];

    tbody.innerHTML = orders.map(order => {
      const upiRef = order.upi_ref_no || order.transactionId || "";
      const isPendingVerification = order.paymentStatus === "PENDING_VERIFICATION";
      const isVerified = order.paymentStatus === "VERIFIED" || order.paymentStatus === "Paid Verified" || order.paymentStatus === "Paid";

      return `
      <tr data-order-id="${order.orderId}">
        <td>
          <strong style="color: var(--color-primary);">${order.orderId}</strong>
          <span style="display: block; font-size: 0.725rem; color: #64748B;">${order.date}</span>
          ${order.giftWrap ? `<span class="badge-safety" style="margin-top: 0.2rem; display:inline-block;">🎁 Gift Wrapped</span>` : ""}
        </td>
        <td>
          <strong>${order.customer ? (order.customer.name || order.customer_name) : "Customer"}</strong>
          <span style="display: block; font-size: 0.725rem; color: #64748B;">📞 ${order.customer ? (order.customer.phone || order.mobile_number) : "N/A"}</span>
          <span style="display: block; font-size: 0.7rem; color: var(--text-muted); max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${order.customer ? (order.customer.address || order.shipping_address) : ""}">${order.customer ? (order.customer.address || order.shipping_address) : ""}</span>
        </td>
        <td>
          <span style="font-size: 0.8rem;">${(order.items || order.cart_items || []).map(i => `${i.qty || 1}x ${i.title || i.name} (${i.size || "Standard"})`).join(", ")}</span>
        </td>
        <td><strong>₹${(order.totalAmountINR || order.total_amount || 0).toLocaleString("en-IN")}</strong></td>
        <td>
          ${isPendingVerification ? `
            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
              <span class="status-badge" style="background: rgba(245, 158, 11, 0.18); color: #D97706; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 700;">
                ⏳ PENDING_VERIFICATION
              </span>
              ${upiRef ? `<span style="font-size: 0.7rem; font-family: monospace; color: var(--color-primary); font-weight: 700;">Ref: ${upiRef}</span>` : ""}
              <button class="btn btn-sm approve-pay-btn" data-order-id="${order.orderId}" style="background: #10B981; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); border: none; cursor: pointer; margin-top: 0.15rem;">
                ✓ Approve Payment
              </button>
            </div>
          ` : isVerified ? `
            <span class="status-badge paid" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; display: inline-block;">
              ✓ VERIFIED
            </span>
            ${upiRef ? `<span style="display: block; font-size: 0.685rem; font-family: monospace; color: var(--text-muted); margin-top: 0.15rem;">Ref: ${upiRef}</span>` : ""}
            <span style="display: block; font-size: 0.7rem; color: var(--text-muted); margin-top: 0.1rem;">${order.paymentMethod || "Direct UPI"}</span>
          ` : `
            <span class="status-badge" style="background: rgba(239, 68, 68, 0.15); color: #DC2626;">
              ${order.paymentStatus}
            </span>
          `}
        </td>
        <td>
          <select class="form-control order-status-select" data-order-id="${order.orderId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
            <option value="Pending Dispatch" ${order.fulfillmentStatus === "Pending Dispatch" ? "selected" : ""}>Pending Dispatch</option>
            <option value="Packed" ${order.fulfillmentStatus === "Packed" ? "selected" : ""}>Packed</option>
            <option value="Dispatched" ${order.fulfillmentStatus === "Dispatched" ? "selected" : ""}>Dispatched</option>
            <option value="Delivered" ${order.fulfillmentStatus === "Delivered" ? "selected" : ""}>Delivered</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm gen-invoice-btn" data-order-id="${order.orderId}" title="Print official GST Invoice PDF">🖨️ PDF Invoice</button>
          </div>
        </td>
      </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".approve-pay-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const orderId = e.target.getAttribute("data-order-id");
        window.store.updateOrder(orderId, { paymentStatus: "VERIFIED" });
        if (window.supabaseService) {
          await window.supabaseService.updatePaymentStatus(orderId, "VERIFIED");
        }
        this.renderOrdersTable();
        this.renderDashboardKPIs();
        if (window.storefront) window.storefront.showToast(`✅ Payment approved for order ${orderId}!`, "success");
      });
    });

    tbody.querySelectorAll(".order-status-select").forEach(select => {
      select.addEventListener("change", async (e) => {
        const orderId = e.target.getAttribute("data-order-id");
        const status = e.target.value;
        window.store.updateOrderStatus(orderId, status);
        if (window.supabaseService) {
          await window.supabaseService.updateOrderStatus(orderId, status);
        }
        if (window.storefront) window.storefront.showToast(`Order ${orderId} status updated to "${status}"`, "info");
      });
    });

    tbody.querySelectorAll(".gen-invoice-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const orderId = e.target.getAttribute("data-order-id");
        this.openGSTInvoiceModal(orderId);
      });
    });

    const countBadge = document.getElementById("orderPdfCountBadge");
    if (countBadge) {
      countBadge.textContent = `${orders.length} Real-Time Orders Active`;
    }
  }

  printAllOrdersReportPDF() {
    const orders = window.store.orders || [];
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmountINR || 0), 0);
    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups in your browser to generate and print PDF reports.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Srinivasa Textiles - Real-Time Orders Ledger Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #111; font-size: 13px; line-height: 1.4; }
          .header { border-bottom: 2px solid #D4AF37; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .brand-title { font-size: 22px; font-weight: 800; color: #7A0C2E; letter-spacing: 0.05em; }
          .brand-sub { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; margin-top: 2px; }
          .report-meta { text-align: right; font-size: 11px; color: #555; }
          .kpi-row { display: flex; gap: 15px; margin-bottom: 20px; }
          .kpi-box { flex: 1; border: 1px solid #ddd; background: #fafafa; border-radius: 6px; padding: 10px 14px; }
          .kpi-label { font-size: 11px; color: #666; text-transform: uppercase; font-weight: 700; }
          .kpi-val { font-size: 18px; font-weight: 800; color: #7A0C2E; margin-top: 3px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          th { background: #7A0C2E; color: #fff; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
          td { border-bottom: 1px solid #eee; padding: 9px 10px; vertical-align: top; }
          tr:nth-child(even) td { background: #fdfaf7; }
          .order-id { font-weight: 700; color: #7A0C2E; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; }
          .badge-paid { background: #ECFDF5; color: #047857; }
          .badge-status { background: #FEF3C7; color: #78350F; }
          .footer { border-top: 1px solid #ddd; padding-top: 10px; font-size: 11px; color: #777; display: flex; justify-content: space-between; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand-title">SRINIVASA TEXTILES</div>
            <div class="brand-sub">Master Weavers Since 1978 • Kanchipuram Heritage</div>
            <div style="font-size: 11px; color: #666; margin-top: 4px;">GSTIN: 33AABCS9876C1ZT | Central Silk Mark (SMOI) Verified</div>
          </div>
          <div class="report-meta">
            <div style="font-size: 14px; font-weight: 800; color: #111;">REAL-TIME ORDERS LEDGER (PDF)</div>
            <div>Generated: ${currentDate}</div>
            <div>Status: Live Stream Active</div>
          </div>
        </div>

        <div class="kpi-row">
          <div class="kpi-box">
            <div class="kpi-label">Total Real-Time Orders</div>
            <div class="kpi-val">${orders.length} Orders</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Total Sales Volume</div>
            <div class="kpi-val">₹${totalSales.toLocaleString("en-IN")}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Dispatched / Completed</div>
            <div class="kpi-val">${orders.filter(o => o.fulfillmentStatus === "Dispatched" || o.fulfillmentStatus === "Delivered").length} / ${orders.length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID & Date</th>
              <th>Customer & Contact</th>
              <th>Items Ordered & SKUs</th>
              <th>Payment Status</th>
              <th>Fulfillment & Courier</th>
              <th style="text-align: right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((ord, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>
                  <span class="order-id">${ord.orderId}</span><br>
                  <span style="font-size: 10px; color: #666;">${ord.date}</span>
                </td>
                <td>
                  <strong>${ord.customer ? ord.customer.name : "N/A"}</strong><br>
                  <span style="font-size: 11px; color: #555;">📞 ${ord.customer ? ord.customer.phone : "N/A"}</span><br>
                  <span style="font-size: 10px; color: #777;">${ord.customer ? ord.customer.address : ""}</span>
                </td>
                <td>
                  ${(ord.items || []).map(i => `• ${i.qty}x ${i.title} (${i.size || 'Standard'})`).join('<br>')}
                </td>
                <td>
                  <span class="badge badge-paid">${ord.paymentStatus || 'Paid Verified'}</span><br>
                  <span style="font-size: 10px; color: #666;">${ord.paymentMethod || 'Online UPI'}</span>
                </td>
                <td>
                  <span class="badge badge-status">${ord.fulfillmentStatus || 'Pending'}</span><br>
                  <span style="font-size: 10px; color: #555;">${ord.courier || 'BlueDart Express'}: ${ord.trackingNumber || 'Pending'}</span>
                </td>
                <td style="text-align: right; font-weight: 800; font-size: 13px;">
                  ₹${(ord.totalAmountINR || 0).toLocaleString("en-IN")}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <span>Official Real-Time Operational Ledger Document • Srinivasa Textiles Admin Console</span>
          <span>Page 1 of 1 • System Generated</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  printAllGSTInvoicesPDF() {
    const orders = window.store.orders || [];
    if (orders.length === 0) {
      alert("No active customer orders found to print invoices.");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    // Master Total Calculations across ALL bills
    const totalBillsCount = orders.length;
    let totalGrossAmount = 0;
    let totalDiscountAmount = 0;
    let totalTaxableAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalShippingAmount = 0;
    let totalGiftWrapAmount = 0;
    let grandTotalRevenue = 0;

    const invoiceEntries = orders.map((order, idx) => {
      const subtotal = order.subtotalINR || (order.items || []).reduce((acc, it) => acc + (it.totalINR || (it.unitPriceINR * it.qty)), 0);
      const discount = order.discountINR || 0;
      const taxable = Math.max(0, subtotal - discount);
      const cgst = Math.round(taxable * 0.025);
      const sgst = Math.round(taxable * 0.025);
      const gstTotal = order.gstINR || (cgst + sgst);
      const shipping = order.shippingINR || 0;
      const giftWrap = order.giftWrap ? (order.giftWrapINR || 150) : 0;
      const finalAmount = order.totalAmountINR || (taxable + cgst + sgst + shipping + giftWrap);

      totalGrossAmount += subtotal;
      totalDiscountAmount += discount;
      totalTaxableAmount += taxable;
      totalCGST += cgst;
      totalSGST += sgst;
      totalShippingAmount += shipping;
      totalGiftWrapAmount += giftWrap;
      grandTotalRevenue += finalAmount;

      return {
        ...order,
        subtotal,
        discount,
        taxable,
        cgst,
        sgst,
        gstTotal,
        shipping,
        giftWrap,
        finalAmount,
        invoiceNo: `INV-${(order.orderId || '').replace("ST-ORD-", "") || (idx + 101)}`
      };
    });

    const totalCombinedGST = totalCGST + totalSGST;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups in your browser to generate and print PDF invoices.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Srinivasa Textiles - Master Consolidated Invoices & Tax Ledger</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #111; font-size: 12px; line-height: 1.4; background: #fff; }
          
          .master-header { border-bottom: 2.5px solid #7A0C2E; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; }
          .brand-title { font-size: 24px; font-weight: 900; color: #7A0C2E; letter-spacing: 0.04em; }
          .brand-sub { font-size: 11px; color: #666; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 2px; }
          .meta-box { text-align: right; font-size: 11px; color: #444; }
          .report-badge { display: inline-block; background: #7A0C2E; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
          
          .summary-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
          .kpi-stat-card { border: 1.5px solid #E2E8F0; background: #FAF9F6; border-radius: 6px; padding: 10px 12px; }
          .kpi-stat-card.highlight { background: #FDF2F4; border-color: #7A0C2E; }
          .kpi-stat-label { font-size: 10px; color: #64748B; text-transform: uppercase; font-weight: 700; }
          .kpi-stat-card.highlight .kpi-stat-label { color: #7A0C2E; }
          .kpi-stat-val { font-size: 17px; font-weight: 900; color: #0F172A; margin-top: 2px; }
          .kpi-stat-card.highlight .kpi-stat-val { color: #7A0C2E; }

          .section-heading { font-size: 14px; font-weight: 800; color: #7A0C2E; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 5px; margin: 18px 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em; display: flex; justify-content: space-between; align-items: center; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11.5px; }
          th { background: #7A0C2E; color: #fff; padding: 8px 9px; text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.03em; }
          td { border-bottom: 1px solid #E2E8F0; padding: 8px 9px; vertical-align: top; }
          tr:nth-child(even) td { background: #FAF8F5; }
          .total-row td { background: #F1F5F9 !important; font-weight: 800; font-size: 12px; border-top: 2px solid #7A0C2E; border-bottom: 2px solid #7A0C2E; }

          /* Individual Invoice Styling */
          .invoice-page { page-break-before: always; padding-top: 15px; border-top: 2px dashed #CBD5E1; margin-top: 30px; }
          .inv-head-grid { display: flex; justify-content: space-between; border-bottom: 2px solid #7A0C2E; padding-bottom: 10px; margin-bottom: 14px; }
          .inv-buyer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #FAF9F6; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px 14px; margin-bottom: 14px; }
          .inv-total-box { margin-left: auto; width: 320px; border: 1.5px solid #7A0C2E; border-radius: 6px; background: #FFFDF9; padding: 10px 14px; margin-bottom: 15px; }
          .inv-total-row { display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px; color: #475569; }
          .inv-total-row.grand { font-size: 14px; font-weight: 900; color: #7A0C2E; border-top: 1.5px solid #7A0C2E; padding-top: 6px; margin-top: 6px; }

          .btn-print-floating { position: fixed; top: 15px; right: 15px; background: #7A0C2E; color: #fff; border: 1.5px solid #D4AF37; padding: 10px 20px; border-radius: 6px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.25); z-index: 9999; font-size: 13px; }

          @media print {
            body { padding: 0; }
            .btn-print-floating { display: none !important; }
            .invoice-page { page-break-before: always; border-top: none; margin-top: 0; padding-top: 0; }
          }
        </style>
      </head>
      <body>
        <button class="btn-print-floating" onclick="window.print()">🖨️ Print Master PDF / Save</button>

        <!-- =================================================================
             PAGE 1: MASTER CONSOLIDATED FINANCIAL CALCULATION LEDGER
             ================================================================= -->
        <div class="master-header">
          <div>
            <div class="brand-title">SRINIVASA TEXTILES</div>
            <div class="brand-sub">Master Weavers & Pure Silk Family Emporium • Since 1978</div>
            <div style="font-size: 11px; color: #475569; margin-top: 4px;">
              108 Raja Veedhi, Kanchipuram, Tamil Nadu - 631501, India | Phone: +91 6381265149
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #7A0C2E; margin-top: 2px;">
              GSTIN: 33AABCS9876C1ZT | State Code: 33 (Tamil Nadu) | Silk Mark (SMOI) Certified
            </div>
          </div>
          <div class="meta-box">
            <div class="report-badge">MASTER GST INVOICES &amp; FINANCIAL LEDGER</div>
            <div><strong>Report Date:</strong> ${currentDate}</div>
            <div><strong>Total Active Bills:</strong> ${totalBillsCount} Invoices</div>
            <div style="color: #047857; font-weight: 700;">✓ 100% Tax Compliant</div>
          </div>
        </div>

        <!-- 8-KPI MASTER SUMMARY CALCULATION GRID -->
        <div class="summary-kpi-grid">
          <div class="kpi-stat-card">
            <div class="kpi-stat-label">Total Bills Count</div>
            <div class="kpi-stat-val">${totalBillsCount} Invoices</div>
          </div>
          <div class="kpi-stat-card">
            <div class="kpi-stat-label">Gross Value of All Bills</div>
            <div class="kpi-stat-val">₹${totalGrossAmount.toLocaleString("en-IN")}</div>
          </div>
          <div class="kpi-stat-card">
            <div class="kpi-stat-label">Total Discounts Given</div>
            <div class="kpi-stat-val" style="color: #059669;">-₹${totalDiscountAmount.toLocaleString("en-IN")}</div>
          </div>
          <div class="kpi-stat-card">
            <div class="kpi-stat-label">Total Taxable Value</div>
            <div class="kpi-stat-val">₹${totalTaxableAmount.toLocaleString("en-IN")}</div>
          </div>
          <div class="kpi-stat-card">
            <div class="kpi-stat-label">Total CGST (2.5%)</div>
            <div class="kpi-stat-val">₹${totalCGST.toLocaleString("en-IN")}</div>
          </div>
          <div class="kpi-stat-card">
            <div class="kpi-stat-label">Total SGST (2.5%)</div>
            <div class="kpi-stat-val">₹${totalSGST.toLocaleString("en-IN")}</div>
          </div>
          <div class="kpi-stat-card">
            <div class="kpi-stat-label">Total Combined GST (5%)</div>
            <div class="kpi-stat-val">₹${totalCombinedGST.toLocaleString("en-IN")}</div>
          </div>
          <div class="kpi-stat-card highlight">
            <div class="kpi-stat-label">GRAND TOTAL BILLS REVENUE</div>
            <div class="kpi-stat-val">₹${grandTotalRevenue.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <!-- CONSOLIDATED INVOICES CALCULATION TABLE -->
        <div class="section-heading">
          <span>📊 Master Invoices Calculation Breakdown</span>
          <span style="font-size: 11px; font-weight: 600; color: #475569;">Consolidated Sales, GST &amp; Revenue</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice No &amp; Date</th>
              <th>Customer / Consignee</th>
              <th>Items &amp; SKU</th>
              <th>Payment &amp; Ref</th>
              <th style="text-align: right;">Taxable (₹)</th>
              <th style="text-align: right;">CGST 2.5%</th>
              <th style="text-align: right;">SGST 2.5%</th>
              <th style="text-align: right;">Discount</th>
              <th style="text-align: right;">Net Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceEntries.map((inv, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>
                  <strong style="color: #7A0C2E;">${inv.invoiceNo}</strong><br>
                  <span style="font-size: 10px; color: #64748B;">${inv.date}</span>
                </td>
                <td>
                  <strong>${inv.customer ? inv.customer.name : "Customer"}</strong><br>
                  <span style="font-size: 10.5px; color: #475569;">📞 ${inv.customer ? inv.customer.phone : "N/A"}</span>
                  ${inv.customer && inv.customer.gstin ? `<br><span style="font-size: 10px; color: #7A0C2E; font-weight: 700;">GSTIN: ${inv.customer.gstin}</span>` : ""}
                </td>
                <td>
                  ${(inv.items || []).map(i => `• ${i.qty}x ${i.title} (${i.size || 'Std'})`).join('<br>')}
                </td>
                <td>
                  <span style="font-weight: 700; color: #047857;">${inv.paymentStatus || 'VERIFIED'}</span><br>
                  <span style="font-size: 10px; color: #64748B;">${inv.paymentMethod || 'UPI'}${inv.upiRefNo ? ` (${inv.upiRefNo})` : ''}</span>
                </td>
                <td style="text-align: right; font-weight: 600;">₹${inv.taxable.toLocaleString("en-IN")}</td>
                <td style="text-align: right;">₹${inv.cgst.toLocaleString("en-IN")}</td>
                <td style="text-align: right;">₹${inv.sgst.toLocaleString("en-IN")}</td>
                <td style="text-align: right; color: ${inv.discount > 0 ? '#059669' : '#94A3B8'}; font-weight: ${inv.discount > 0 ? '700' : 'normal'};">
                  ${inv.discount > 0 ? `-₹${inv.discount.toLocaleString("en-IN")}` : '₹0'}
                </td>
                <td style="text-align: right; font-weight: 900; color: #7A0C2E; font-size: 12.5px;">
                  ₹${inv.finalAmount.toLocaleString("en-IN")}
                </td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="5" style="text-align: right; text-transform: uppercase; letter-spacing: 0.05em;">
                MASTER CONSOLIDATED TOTALS (${totalBillsCount} BILLS):
              </td>
              <td style="text-align: right;">₹${totalTaxableAmount.toLocaleString("en-IN")}</td>
              <td style="text-align: right;">₹${totalCGST.toLocaleString("en-IN")}</td>
              <td style="text-align: right;">₹${totalSGST.toLocaleString("en-IN")}</td>
              <td style="text-align: right; color: #059669;">-₹${totalDiscountAmount.toLocaleString("en-IN")}</td>
              <td style="text-align: right; color: #7A0C2E; font-size: 13.5px;">₹${grandTotalRevenue.toLocaleString("en-IN")}</td>
            </tr>
          </tfoot>
        </table>

        <div style="font-size: 10.5px; color: #64748B; display: flex; justify-content: space-between; border-top: 1px solid #CBD5E1; padding-top: 8px;">
          <span>Official Cumulative Financial Report • Srinivasa Textiles Kanchipuram Hub</span>
          <span>Individual Invoices detailed on subsequent pages ➔</span>
        </div>

        <!-- =================================================================
             INDIVIDUAL FULL-PAGE OFFICIAL GST TAX INVOICES FOR EACH ORDER
             ================================================================= -->
        ${invoiceEntries.map((inv, idx) => `
          <div class="invoice-page">
            <div class="inv-head-grid">
              <div>
                <div class="brand-title">SRINIVASA TEXTILES</div>
                <div class="brand-sub">Master Weavers & Pure Silk Family Emporium Since 1978</div>
                <div style="font-size: 10.5px; color: #475569; margin-top: 2px;">
                  108 Raja Veedhi, Kanchipuram, Tamil Nadu - 631501 | GSTIN: 33AABCS9876C1ZT
                </div>
              </div>
              <div style="text-align: right;">
                <div class="report-badge">ORIGINAL TAX INVOICE</div>
                <div style="font-size: 12px; font-weight: 800; color: #7A0C2E; margin-top: 3px;">Invoice No: ${inv.invoiceNo}</div>
                <div style="font-size: 11px; color: #475569;">Date: ${inv.date}</div>
                <div style="font-size: 11px; color: #475569;">Payment: ${inv.paymentMethod} (${inv.paymentStatus || 'Verified'})</div>
              </div>
            </div>

            <div class="inv-buyer-grid">
              <div>
                <strong style="color: #7A0C2E; text-transform: uppercase; font-size: 10.5px;">Billed To / Consignee:</strong>
                <div style="font-size: 12px; font-weight: 800; margin-top: 2px;">${inv.customer ? inv.customer.name : "Customer"}</div>
                <div style="color: #334155; font-size: 11px; margin-top: 2px;">${inv.customer ? inv.customer.address : "N/A"}</div>
                <div style="color: #334155; font-size: 11px; margin-top: 2px;">
                  <strong>Mobile:</strong> ${inv.customer ? inv.customer.phone : "N/A"} | <strong>Email:</strong> ${(inv.customer && inv.customer.email) || "N/A"}
                </div>
                ${inv.customer && inv.customer.gstin ? `<div style="color: #7A0C2E; font-weight: 700; font-size: 11px; margin-top: 2px;">Buyer GSTIN: ${inv.customer.gstin}</div>` : ""}
              </div>
              <div>
                <strong style="color: #7A0C2E; text-transform: uppercase; font-size: 10.5px;">Logistics &amp; Dispatch:</strong>
                <div style="font-size: 11.5px; margin-top: 2px;"><strong>Courier Partner:</strong> ${inv.courier || "BlueDart Express"}</div>
                <div style="font-size: 11.5px; margin-top: 2px;"><strong>AWB Tracking:</strong> ${inv.trackingNumber || 'Pending Generation'}</div>
                <div style="font-size: 11.5px; margin-top: 2px;"><strong>Fulfillment Status:</strong> ${inv.fulfillmentStatus || 'Processing'}</div>
                ${inv.giftWrap ? `<div style="color: #047857; font-weight: 700; font-size: 10.5px; margin-top: 3px;">🎁 Festive Gift Wrap Included</div>` : ""}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Description &amp; Specifications</th>
                  <th>HSN/SAC</th>
                  <th>Qty</th>
                  <th style="text-align: right;">Unit Rate (₹)</th>
                  <th style="text-align: right;">CGST (2.5%)</th>
                  <th style="text-align: right;">SGST (2.5%)</th>
                  <th style="text-align: right;">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${(inv.items || []).map((it, itemIdx) => {
                  const itTaxable = it.totalINR || (it.unitPriceINR * it.qty);
                  const itCgst = Math.round(itTaxable * 0.025);
                  const itSgst = Math.round(itTaxable * 0.025);
                  const itTotal = itTaxable + itCgst + itSgst;
                  return `
                    <tr>
                      <td>${itemIdx + 1}</td>
                      <td>
                        <strong>${it.title}</strong>
                        <div style="font-size: 10px; color: #64748B;">Size: ${it.size || "Standard"} • Color: ${it.color} • Silk Mark SMOI</div>
                      </td>
                      <td>${it.hsnCode || "50072010"}</td>
                      <td>${it.qty}</td>
                      <td style="text-align: right;">₹${(it.unitPriceINR).toLocaleString("en-IN")}</td>
                      <td style="text-align: right;">₹${itCgst.toLocaleString("en-IN")}</td>
                      <td style="text-align: right;">₹${itSgst.toLocaleString("en-IN")}</td>
                      <td style="text-align: right; font-weight: 700;">₹${itTotal.toLocaleString("en-IN")}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>

            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px;">
              <div style="max-width: 320px; font-size: 10.5px; color: #64748B; border: 1px solid #E2E8F0; border-radius: 6px; padding: 8px 12px; background: #FAF9F6;">
                <strong style="color: #7A0C2E; display: block; margin-bottom: 2px;">Declaration &amp; Warranty:</strong>
                We declare that this invoice shows the actual price of pure handloom silk goods described and that all particulars are true and authentic.
              </div>

              <div class="inv-total-box">
                <div class="inv-total-row"><span>Subtotal Taxable:</span> <span>₹${inv.taxable.toLocaleString("en-IN")}</span></div>
                ${inv.discount > 0 ? `<div class="inv-total-row" style="color: #059669; font-weight: 700;"><span>Discount (${inv.couponCode || 'Custom'}):</span> <span>-₹${inv.discount.toLocaleString("en-IN")}</span></div>` : ""}
                <div class="inv-total-row"><span>CGST (2.5%):</span> <span>₹${inv.cgst.toLocaleString("en-IN")}</span></div>
                <div class="inv-total-row"><span>SGST (2.5%):</span> <span>₹${inv.sgst.toLocaleString("en-IN")}</span></div>
                ${inv.shipping > 0 ? `<div class="inv-total-row"><span>Express Insured Shipping:</span> <span>+₹${inv.shipping.toLocaleString("en-IN")}</span></div>` : `<div class="inv-total-row" style="color: #047857;"><span>Shipping:</span> <span>FREE Express Insured</span></div>`}
                <div class="inv-total-row grand">
                  <span>Grand Total:</span>
                  <span>₹${inv.finalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 25px; border-top: 1px solid #E2E8F0; padding-top: 12px;">
              <div style="font-size: 10px; color: #64748B;">
                <div><strong>Central Silk Board SMOI Reg:</strong> SMOI/TN/78-980</div>
                <div>Computer generated official tax invoice • Valid without signature</div>
              </div>
              <div style="text-align: right;">
                <div style="font-family: var(--font-serif-display, serif); font-size: 14px; font-weight: 800; color: #7A0C2E;">SRINIVASA TEXTILES</div>
                <div style="font-size: 10px; color: #64748B; margin-top: 2px;">Authorized Master Weaver Signatory</div>
              </div>
            </div>
          </div>
        `).join("")}

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  printAllShippingLabelsPDF() {
    const orders = window.store.orders || [];
    if (orders.length === 0) {
      alert("No active orders found to print shipping labels.");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups in your browser to print shipping labels.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Srinivasa Textiles - Batch Courier Shipping Labels</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #000; font-size: 12px; background: #fff; }
          .manifest-header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
          .manifest-title { font-size: 20px; font-weight: 800; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 11px; }
          th { background: #000; color: #fff; padding: 6px 8px; text-align: left; }
          td { border-bottom: 1px solid #ddd; padding: 6px 8px; }
          
          .label-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .shipping-label-card { border: 2px solid #000; padding: 15px; border-radius: 4px; background: #fff; page-break-inside: avoid; margin-bottom: 15px; }
          .label-top { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
          .label-courier { font-size: 15px; font-weight: 900; }
          .label-badge { background: #000; color: #fff; font-weight: 800; font-size: 10px; padding: 2px 6px; }
          .barcode-line { height: 36px; background: repeating-linear-gradient(90deg, #000 0, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 7px, transparent 7px, transparent 9px); margin: 8px 0 4px; }
          .btn-print-floating { position: fixed; top: 15px; right: 15px; background: #000; color: #fff; padding: 10px 18px; border-radius: 6px; font-weight: 800; cursor: pointer; z-index: 9999; }
          @media print {
            body { padding: 0; }
            .btn-print-floating { display: none !important; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <button class="btn-print-floating" onclick="window.print()">🖨️ Print All Shipping Labels</button>

        <div class="manifest-header">
          <div>
            <div class="manifest-title">SRINIVASA TEXTILES • COURIER DISPATCH MANIFEST</div>
            <div style="font-size: 11px; color: #555;">Kanchipuram Master Weavers Logistics Center | Total Shipments: ${orders.length} Packages</div>
          </div>
          <div style="text-align: right; font-size: 11px;">
            <div><strong>Dispatch Date:</strong> ${currentDate}</div>
            <div><strong>Status:</strong> Ready for Pickup</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Consignee / Customer</th>
              <th>Contact Phone</th>
              <th>Destination Address</th>
              <th>Courier</th>
              <th>AWB Number</th>
              <th>Declared Value</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((o, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${o.orderId}</strong></td>
                <td><strong>${o.customer ? o.customer.name : "Customer"}</strong></td>
                <td>${o.customer ? o.customer.phone : "N/A"}</td>
                <td>${o.customer ? o.customer.address : "N/A"}</td>
                <td><strong>${o.courier || 'BlueDart Express'}</strong></td>
                <td style="font-family: monospace; font-weight: 700;">${o.trackingNumber || 'Pending'}</td>
                <td>₹${(o.totalAmountINR || 0).toLocaleString("en-IN")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="manifest-title" style="font-size: 16px; margin-bottom: 12px; border-bottom: 1.5px solid #000; padding-bottom: 4px;">
          📦 Individual Shipping Labels (${orders.length} Packages)
        </div>

        <div class="label-grid">
          ${orders.map(o => `
            <div class="shipping-label-card">
              <div class="label-top">
                <div class="label-courier">${(o.courier || "BLUEDART EXPRESS").toUpperCase()}</div>
                <div class="label-badge">EXPRESS AIR</div>
              </div>
              <div class="barcode-line"></div>
              <div style="text-align: center; font-family: monospace; font-size: 11px; font-weight: 700; margin-bottom: 8px;">AWB: ${o.trackingNumber || 'BLU-9840-7890'}</div>
              <div style="border-top: 1px solid #000; padding-top: 6px; font-size: 11px;">
                <div style="font-size: 9px; font-weight: 700; text-transform: uppercase;">Deliver To:</div>
                <div style="font-size: 13px; font-weight: 800; margin-top: 1px;">${o.customer ? o.customer.name : "Customer"}</div>
                <div style="margin-top: 2px;">${o.customer ? o.customer.address : "N/A"}</div>
                <div style="margin-top: 2px;"><strong>Mobile:</strong> ${o.customer ? o.customer.phone : "N/A"}</div>
                <div style="margin-top: 4px; font-size: 10px; color: #333;"><strong>Order:</strong> ${o.orderId} • Pre-Paid Silk Parcel</div>
              </div>
            </div>
          `).join("")}
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
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
    const finalAmount = taxableAmount + totalTax + (order.shippingINR || 0);

    const waOrderMsg = encodeURIComponent(`Namaste ${order.customer ? order.customer.name : 'Customer'}! 🙏 Here is your official GST Tax Invoice from Srinivasa Textiles for Order #${order.orderId} (Total: ₹${finalAmount.toLocaleString("en-IN")}). Courier: ${order.courier || 'BlueDart Express'} (AWB: ${order.trackingNumber}).`);
    const waLink = `https://wa.me/${(order.customer && order.customer.phone ? order.customer.phone.replace(/[^0-9]/g, '') : '916381265149')}?text=${waOrderMsg}`;

    if (isEditMode) {
      // RENDER EDIT MODE
      container.innerHTML = `
        <button class="pdp-close-btn" id="invoiceCloseBtn" style="top: 1rem; right: 1rem;">✕</button>

        <div style="border-bottom: 2px solid var(--color-gold); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
          <h3 style="font-family: var(--font-serif-display); font-size: 1.3rem; color: var(--color-primary); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <span>✏️</span> Edit GST Tax Invoice &amp; Customer Order Details
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Modify invoice fields, consignee info, shipping partner, and tracking number.</p>
        </div>

        <form id="adminEditInvoiceForm">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">Customer / Consignee Name *</label>
              <input type="text" id="editCustName" class="form-control" value="${order.customer ? order.customer.name : ''}" required />
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">Contact Mobile Number *</label>
              <input type="tel" id="editCustPhone" class="form-control" value="${order.customer ? order.customer.phone : ''}" required />
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">Email Address</label>
              <input type="email" id="editCustEmail" class="form-control" value="${order.customer && order.customer.email ? order.customer.email : ''}" />
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">Buyer GSTIN (Optional)</label>
              <input type="text" id="editBuyerGSTIN" class="form-control" value="${order.customer && order.customer.gstin ? order.customer.gstin : ''}" placeholder="33AAAAA0000A1Z5" />
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">Full Shipping Address *</label>
              <textarea id="editCustAddress" class="form-control" rows="2" required>${order.customer ? order.customer.address : ''}</textarea>
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">Invoice Date</label>
              <input type="text" id="editOrderDate" class="form-control" value="${order.date}" />
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">Courier Partner</label>
              <select id="editCourier" class="form-control">
                <option value="BlueDart Express" ${order.courier === "BlueDart Express" ? "selected" : ""}>BlueDart Express</option>
                <option value="Delhivery Express Air" ${order.courier === "Delhivery Express Air" ? "selected" : ""}>Delhivery Express Air</option>
                <option value="DTDC Express" ${order.courier === "DTDC Express" ? "selected" : ""}>DTDC Express</option>
                <option value="DHL Express" ${order.courier === "DHL Express" ? "selected" : ""}>DHL Express</option>
                <option value="India Post Speed Post" ${order.courier === "India Post Speed Post" ? "selected" : ""}>India Post Speed Post</option>
              </select>
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">AWB / Tracking Number</label>
              <input type="text" id="editTrackingNumber" class="form-control" value="${order.trackingNumber || ''}" />
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-heading); display: block; margin-bottom: 0.3rem;">Discount Amount (₹)</label>
              <input type="number" id="editDiscountINR" class="form-control" value="${order.discountINR || 0}" min="0" />
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <button type="button" class="btn btn-outline" id="cancelEditInvoiceBtn">✕ Cancel</button>
            <button type="submit" class="btn btn-gold" style="font-weight: 700;">💾 Save &amp; Recalculate Invoice</button>
          </div>
        </form>
      `;

      document.getElementById("cancelEditInvoiceBtn")?.addEventListener("click", () => this.openGSTInvoiceModal(orderId, false));

      document.getElementById("adminEditInvoiceForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedCustomer = {
          name: document.getElementById("editCustName").value.trim(),
          phone: document.getElementById("editCustPhone").value.trim(),
          email: document.getElementById("editCustEmail").value.trim(),
          gstin: document.getElementById("editBuyerGSTIN").value.trim(),
          address: document.getElementById("editCustAddress").value.trim()
        };

        const updatedCourier = document.getElementById("editCourier").value;
        const updatedTracking = document.getElementById("editTrackingNumber").value.trim();
        const updatedDate = document.getElementById("editOrderDate").value.trim();
        const updatedDiscount = parseFloat(document.getElementById("editDiscountINR").value) || 0;

        const newTaxable = Math.max(0, subtotal - updatedDiscount);
        const newCgst = Math.round(newTaxable * 0.025);
        const newSgst = Math.round(newTaxable * 0.025);
        const newTotal = newTaxable + newCgst + newSgst + (order.shippingINR || 0);

        window.store.updateOrder(orderId, {
          customer: updatedCustomer,
          courier: updatedCourier,
          trackingNumber: updatedTracking,
          date: updatedDate,
          discountINR: updatedDiscount,
          gstINR: newCgst + newSgst,
          totalAmountINR: newTotal
        });

        this.renderOrdersTable();
        this.openGSTInvoiceModal(orderId, false);
        if (window.storefront) window.storefront.showToast("✅ GST Invoice details updated successfully!", "success");
      });

    } else {
      // RENDER VIEW MODE
      container.innerHTML = `
        <button class="pdp-close-btn" id="invoiceCloseBtn" style="top: 1rem; right: 1rem;">✕</button>

        <div class="invoice-header">
          <div class="invoice-brand">
            <h2>SRINIVASA TEXTILES</h2>
            <p>Master Weavers &amp; Pure Silk Family Emporium Since 1978</p>
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
          <div class="invoice-summary-row total"><span>Total Amount:</span> <span>₹${finalAmount.toLocaleString("en-IN")}</span></div>
        </div>

        <div class="invoice-actions" style="margin-top: 1.5rem; display: flex; gap: 0.6rem; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn btn-outline btn-sm" id="editInvoiceBtn" style="color: var(--color-primary); font-weight: 700;">✏️ Edit Invoice Details</button>
          <button class="btn btn-outline-gold btn-sm" onclick="window.admin.openShippingLabelModal('${order.orderId}')">📦 View Shipping Label</button>
          <a href="${waLink}" target="_blank" class="btn btn-sm" style="background: #25D366; color: #fff; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem; text-decoration: none;">💬 WhatsApp Invoice</a>
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print / Save PDF</button>
        </div>
      `;

      document.getElementById("editInvoiceBtn")?.addEventListener("click", () => this.openGSTInvoiceModal(orderId, true));
    }

    modal.classList.add("active");
    document.getElementById("invoiceCloseBtn")?.addEventListener("click", () => modal.classList.remove("active"));
  }

  openShippingLabelModal(orderId, isEditMode = false) {
    const order = window.store.orders.find(o => o.orderId === orderId);
    if (!order) return;

    const modal = document.getElementById("invoiceModal");
    const container = document.getElementById("invoiceModalContent");
    if (!modal || !container) return;

    if (isEditMode) {
      // RENDER EDIT LABEL MODE
      container.innerHTML = `
        <button class="pdp-close-btn" id="labelCloseBtn" style="top: 1rem; right: 1rem;">✕</button>
        <div style="border-bottom: 2px solid var(--color-gold); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
          <h3 style="font-family: var(--font-serif-display); font-size: 1.3rem; color: var(--color-primary); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <span>✏️</span> Edit Courier Shipping Label
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Update courier partner, AWB number, consignee name, and delivery address.</p>
        </div>

        <form id="adminEditLabelForm">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">Courier Partner</label>
              <select id="editLabelCourier" class="form-control">
                <option value="BLUEDART EXPRESS" ${order.courier === "BLUEDART EXPRESS" || order.courier === "BlueDart Express" ? "selected" : ""}>BLUEDART EXPRESS</option>
                <option value="DELHIVERY EXPRESS AIR" ${order.courier === "DELHIVERY EXPRESS AIR" || order.courier === "Delhivery Express Air" ? "selected" : ""}>DELHIVERY EXPRESS AIR</option>
                <option value="DTDC EXPRESS" ${order.courier === "DTDC EXPRESS" || order.courier === "DTDC Express" ? "selected" : ""}>DTDC EXPRESS</option>
                <option value="DHL EXPRESS" ${order.courier === "DHL EXPRESS" || order.courier === "DHL Express" ? "selected" : ""}>DHL EXPRESS</option>
                <option value="INDIA POST SPEED POST" ${order.courier === "INDIA POST SPEED POST" || order.courier === "India Post Speed Post" ? "selected" : ""}>INDIA POST SPEED POST</option>
              </select>
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">AWB / Tracking Number</label>
              <input type="text" id="editLabelTracking" class="form-control" value="${order.trackingNumber || ''}" required />
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">Consignee Name</label>
              <input type="text" id="editLabelCustName" class="form-control" value="${order.customer ? order.customer.name : ''}" required />
            </div>

            <div class="form-group">
              <label style="font-size: 0.775rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">Mobile Contact</label>
              <input type="tel" id="editLabelCustPhone" class="form-control" value="${order.customer ? order.customer.phone : ''}" required />
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label style="font-size: 0.775rem; font-weight: 700; display: block; margin-bottom: 0.3rem;">Delivery Address</label>
              <textarea id="editLabelCustAddress" class="form-control" rows="2" required>${order.customer ? order.customer.address : ''}</textarea>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <button type="button" class="btn btn-outline" id="cancelEditLabelBtn">✕ Cancel</button>
            <button type="submit" class="btn btn-gold" style="font-weight: 700;">💾 Save &amp; Update Label</button>
          </div>
        </form>
      `;

      document.getElementById("cancelEditLabelBtn")?.addEventListener("click", () => this.openShippingLabelModal(orderId, false));

      document.getElementById("adminEditLabelForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedCourier = document.getElementById("editLabelCourier").value;
        const updatedTracking = document.getElementById("editLabelTracking").value.trim();
        const updatedName = document.getElementById("editLabelCustName").value.trim();
        const updatedPhone = document.getElementById("editLabelCustPhone").value.trim();
        const updatedAddress = document.getElementById("editLabelCustAddress").value.trim();

        window.store.updateOrder(orderId, {
          courier: updatedCourier,
          trackingNumber: updatedTracking,
          customer: {
            name: updatedName,
            phone: updatedPhone,
            address: updatedAddress
          }
        });

        this.renderOrdersTable();
        this.openShippingLabelModal(orderId, false);
        if (window.storefront) window.storefront.showToast("✅ Shipping Label updated successfully!", "success");
      });

    } else {
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
          <button class="btn btn-outline btn-sm" id="editLabelBtn" style="color: var(--color-primary); font-weight: 700;">✏️ Edit Label</button>
          <button class="btn btn-outline-gold btn-sm" onclick="window.admin.openGSTInvoiceModal('${order.orderId}')">🧾 View GST Invoice</button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print Label (4x6 format)</button>
        </div>
      `;

      document.getElementById("editLabelBtn")?.addEventListener("click", () => this.openShippingLabelModal(orderId, true));
    }

    modal.classList.add("active");
    document.getElementById("labelCloseBtn")?.addEventListener("click", () => modal.classList.remove("active"));
  }

  renderSubscribersTable() {
    const tbody = document.getElementById("adminSubscribersTableBody");
    const countBadge = document.getElementById("waitlistCountBadge");
    const sidebarBadge = document.querySelector('.admin-menu-item[data-tab="subscribers"] .admin-menu-badge');

    const subscribers = window.store.subscribers || [];

    if (countBadge) {
      countBadge.textContent = `${subscribers.length} Requests`;
    }
    if (sidebarBadge) {
      sidebarBadge.textContent = `${subscribers.length}`;
    }

    if (!tbody) return;

    if (subscribers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            🔔 No pending restock waitlist requests. Customers clicking "Notify Me When Available" on the storefront will appear here in real time.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = subscribers.map(sub => {
      const cleanPhone = (sub.phone || "").replace(/[^0-9]/g, "");
      const waMsg = encodeURIComponent(`Namaste ${sub.customerName}! 🙏 Good news from Srinivasa Textiles: Your requested pure handloom piece "${sub.productTitle}" (SKU: ${sub.productId}) is now back in stock! Visit our store or reply here to reserve your order.`);
      const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;
      const isAlerted = (sub.status === "Alert Sent" || sub.status === "Customer Alerted" || sub.status === "Notified");

      return `
        <tr>
          <td>
            <strong>${sub.id}</strong>
            <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 0.15rem;">${sub.requestedDate || "Recent"}</div>
          </td>
          <td>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <img src="${sub.productImage || 'assets/images/banarasi_blue.jpg'}" alt="${sub.productTitle}" style="width: 44px; height: 44px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" />
              <div>
                <strong style="font-size: 0.85rem; color: var(--text-heading); display: block;">${sub.productTitle}</strong>
                <span style="font-size: 0.725rem; color: var(--color-gold-dark); font-weight: 700;">SKU: ${sub.productId}</span>
                ${sub.size ? `<span style="font-size: 0.7rem; color: var(--text-muted);"> • Size: ${sub.size}</span>` : ""}
              </div>
            </div>
          </td>
          <td>
            <strong style="color: var(--text-heading);">${sub.customerName}</strong>
          </td>
          <td>
            <div><strong>📱 ${sub.phone}</strong></div>
            ${sub.email ? `<div style="font-size: 0.75rem; color: var(--text-muted);">✉️ ${sub.email}</div>` : ""}
          </td>
          <td>
            <button class="btn btn-sm" onclick="window.admin.handleSendWhatsAppRestock('${sub.id}', '${waLink}')" style="background: #25D366; color: #fff; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem; border: none; cursor: pointer;">
              💬 Send WhatsApp Alert
            </button>
          </td>
          <td>
            <button class="status-badge" onclick="window.admin.toggleSubscriberStatus('${sub.id}')" style="cursor: pointer; border: 1.5px solid ${isAlerted ? '#10B981' : '#F59E0B'}; background: ${isAlerted ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.18)'}; color: ${isAlerted ? '#10B981' : '#F59E0B'}; font-weight: 800; padding: 0.3rem 0.75rem; border-radius: var(--radius-full); transition: all var(--transition-fast);" title="Click to toggle status between Pending Alert and Alert Sent">
              ${isAlerted ? '✅ Alert Sent' : '⏳ Pending Alert'}
            </button>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.admin.deleteSubscriber('${sub.id}')" title="Remove Request" style="color: var(--color-danger); border-color: rgba(185, 28, 28, 0.3); padding: 0.25rem 0.6rem;">
              🗑️
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  handleSendWhatsAppRestock(subId, waLink) {
    window.open(waLink, "_blank");
    const sub = (window.store.subscribers || []).find(s => s.id === subId);
    if (sub && sub.status !== "Customer Alerted" && sub.status !== "Alert Sent") {
      window.store.updateSubscriberStatus(subId, "Alert Sent");
      this.renderSubscribersTable();
      this.renderInventoryTable();
      this.renderDashboardKPIs();
      if (window.storefront) {
        window.storefront.showToast(`✨ Restock Alert Sent! SKU ${sub.productId} is now Available in store collections!`, "success");
      }
    }
  }

  toggleSubscriberStatus(subId) {
    const sub = (window.store.subscribers || []).find(s => s.id === subId);
    if (!sub) return;
    const isNowAlerted = (sub.status === "Customer Alerted" || sub.status === "Alert Sent" || sub.status === "Notified");
    const newStatus = isNowAlerted ? "Pending Alert" : "Alert Sent";

    window.store.updateSubscriberStatus(subId, newStatus);
    this.renderSubscribersTable();
    this.renderInventoryTable();
    this.renderDashboardKPIs();

    if (window.storefront) {
      if (newStatus === "Alert Sent") {
        window.storefront.showToast(`✨ Restock Alert Sent! SKU ${sub.productId} is now Available in store collections!`, "success");
      } else {
        window.storefront.showToast(`Request ${subId} marked as Pending Alert.`, "info");
      }
    }
  }

  deleteSubscriber(subId) {
    if (confirm("Are you sure you want to remove this customer waitlist request?")) {
      window.store.deleteSubscriber(subId);
      this.renderSubscribersTable();
      this.renderDashboardKPIs();
      if (window.storefront) {
        window.storefront.showToast(`Removed waitlist request ${subId}`, "info");
      }
    }
  }

  // ==========================================
  // PATRON FEEDBACK & REVIEWS MANAGEMENT (OWNER CONSOLE)
  // ==========================================
  applyFeedbackFilters() {
    const searchVal = document.getElementById("feedbackSearchInput")?.value.toLowerCase().trim() || "";
    const deptVal = document.getElementById("feedbackDeptFilter")?.value || "";
    this.renderFeedbacksTable(deptVal, searchVal);
  }

  renderFeedbacksTable(deptFilter = "", searchQuery = "") {
    const tbody = document.getElementById("adminFeedbacksTableBody");
    if (!tbody) return;

    let feedbacks = window.store.getFeedbacks();

    // Filter by department
    if (deptFilter) {
      feedbacks = feedbacks.filter(f => {
        const itemDept = (f.dept || f.title || "").toLowerCase();
        return itemDept.includes(deptFilter.toLowerCase());
      });
    }

    // Filter by search query
    if (searchQuery) {
      feedbacks = feedbacks.filter(f => {
        const fullText = `${f.id} ${f.author} ${f.location} ${f.title} ${f.comment} ${f.dept || ''}`.toLowerCase();
        return fullText.includes(searchQuery);
      });
    }

    if (feedbacks.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌟</div>
            <strong style="color: var(--text-heading); display: block; margin-bottom: 0.25rem;">No Patron Feedbacks Match Current Filters</strong>
            <span>Clear filters or search criteria to view all submitted patron reviews.</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = feedbacks.map(fb => {
      const ratingNum = parseInt(fb.rating, 10) || 5;
      const starsDisplay = "★".repeat(ratingNum) + "☆".repeat(Math.max(0, 5 - ratingNum));
      const cleanPhone = "916381265149"; // Store care line or patron reference
      const waMsg = encodeURIComponent(`Namaste ${fb.author}! 🙏 Thank you for your wonderful ${ratingNum}★ review with Srinivasa Textiles. We are honored to serve your family.`);
      const waLink = `https://wa.me/?text=${waMsg}`;

      return `
        <tr data-feedback-id="${fb.id}">
          <td>
            <strong style="color: var(--color-primary); font-family: monospace;">${fb.id}</strong>
            <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 0.2rem;">${fb.date || "Recent"}</div>
          </td>
          <td>
            <strong style="color: var(--text-heading); font-size: 0.9rem;">${fb.author || "Patron"}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">📍 ${fb.location || "India"}</div>
          </td>
          <td>
            <span class="badge-dept" style="background: rgba(212, 175, 55, 0.12); color: var(--color-gold-dark); border: 1px solid rgba(212, 175, 55, 0.3); padding: 0.25rem 0.6rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; display: inline-block;">
              ${fb.dept || fb.title || "Pure Handloom Silk"}
            </span>
          </td>
          <td>
            <span style="color: #F59E0B; font-size: 1.05rem; letter-spacing: 0.05em;" title="${ratingNum} Stars">${starsDisplay}</span>
            <span style="font-size: 0.725rem; color: var(--text-muted); display: block;">(${ratingNum}.0 / 5.0)</span>
          </td>
          <td>
            <span class="badge-softness" style="background: rgba(34, 197, 94, 0.12); color: #059669; border: 1px solid rgba(34, 197, 94, 0.3); padding: 0.2rem 0.5rem; border-radius: var(--radius-full); font-size: 0.725rem; font-weight: 700; display: inline-block;">
              🪶 ${fb.softnessScore || "10/10"}
            </span>
          </td>
          <td style="max-width: 320px;">
            ${fb.title ? `<div style="font-weight: 700; font-size: 0.8rem; color: var(--text-heading); margin-bottom: 0.2rem;">"${fb.title}"</div>` : ""}
            <p style="font-size: 0.775rem; color: var(--text-main); margin: 0; line-height: 1.4; font-style: italic;">"${fb.comment || ''}"</p>
          </td>
          <td>
            <span class="status-badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.7rem; padding: 0.25rem 0.6rem;">
              ✓ ${fb.status || "Verified Patron"}
            </span>
          </td>
          <td>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <button class="btn btn-outline-gold btn-sm" onclick="window.admin.copyFeedbackDetails('${fb.id}')" title="Copy Review Text" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;">
                📋 Copy
              </button>
              <button class="btn btn-outline btn-sm" onclick="window.admin.deleteFeedback('${fb.id}')" title="Delete Review" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.3); padding: 0.25rem 0.55rem; font-size: 0.75rem;">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  deleteFeedback(fbId) {
    if (confirm(`Remove patron feedback ${fbId}?`)) {
      window.store.deleteFeedback(fbId);
      if (window.storefront) {
        window.storefront.showToast(`Feedback ${fbId} deleted from Owner Console.`, "warning");
      }
    }
  }

  copyFeedbackDetails(fbId) {
    const feedbacks = window.store.getFeedbacks();
    const fb = feedbacks.find(f => f.id === fbId);
    if (!fb) return;

    const textToCopy = `Patron: ${fb.author} (${fb.location})\nRating: ${fb.rating}/5.0\nDepartment: ${fb.dept || fb.title}\nSoftness: ${fb.softnessScore}\nReview: "${fb.comment}"`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (window.storefront) {
        window.storefront.showToast("Copied patron feedback details to clipboard!", "success");
      } else {
        alert("Copied feedback details to clipboard!");
      }
    }).catch(() => {
      prompt("Copy review text:", textToCopy);
    });
  }

  handleExportFeedbacksCSV() {
    const csvData = window.store.exportFeedbacksToCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Srinivasa_Patron_Feedbacks_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (window.storefront) {
      window.storefront.showToast("Exported confidential Patron Feedbacks CSV for Store Owner!", "success");
    }
  }
}

// Global instantiation
window.admin = new AdminController();
