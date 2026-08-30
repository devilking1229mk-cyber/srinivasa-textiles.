# Srinivasa Textiles - Professional E-Commerce & Admin Platform

> **Master Weavers & Pure Silk Handloom Emporium Since 1978**  
> Built according to [`Textile_Website_Strategy_and_Blueprint.md`](./Textile_Website_Strategy_and_Blueprint.md.txt)

---

## 🌟 Overview & Key Highlights

**Srinivasa Textiles** is a production-ready luxury textile e-commerce platform and owner backend management system designed to deliver tactile trust, visual elegance, and operational efficiency.

---

## 🛍️ 1. Customer Storefront Features

- **Royal Aesthetic & Typography:** Luxury color palette (Kanchipuram Crimson, Antique Zari Gold, Temple Emerald, Obsidian Charcoal) with Google Fonts (`Playfair Display`, `Cinzel`, and `Plus Jakarta Sans`).
- **500% HD Micro-Zoom Fabric Lens:** Move your cursor over high-resolution sarees to inspect gold zari threads, warp-weft weave count, and authentic korvai joinery.
- **Dynamic Collection Showcase:** Filter effortlessly by *Bridal Trousseau*, *Festive Silk 2026*, *Pure Linen Summer*, and *Handloom Cotton Heritage*.
- **Interactive Attribute Filters:** Filter by Fabric (*Kanchipuram Silk, Banarasi Silk, Pure Linen, Chanderi Tissue, Tussar Silk, Mulmul Cotton*), Occasion (*Bridal, Festive, Casual, Formal*), Technique, and Price sorting.
- **Color Swatch Selector:** Switch across colorways (e.g. Crimson Maroon, Midnight Blue, Mustard Gold) with instantaneous image and variant code updating.
- **Custom Blouse Tailoring Calculator:** Choose unstitched vs standard tailored vs custom bridal hand Aari/Maggam stitching with measurement inputs (Bust, Waist, Length, Front Neck).
- **Pincode Delivery Estimator:** Instant BlueDart / Delhivery dispatch and delivery estimate calculation.
- **Multi-Currency Engine:** Instant price conversions across **INR (₹), USD ($), GBP (£), AED (د.إ), and SGD (S$)**.
- **Slide-Over Cart Drawer & Coupons:** Live item quantity increment/decrement, free insured delivery progress bar, and promo code support (Try `HERITAGE10` for 10% off).
- **Express Checkout & Payment Methods:** UPI QR Code simulation, Credit/Debit Cards, NetBanking, and Cash on Delivery (COD) with Anti-Fraud Shield.
- **Authenticity Badges:** Silk Mark Organisation of India (SMOI) Certified, 100% Handloom Mark, GOTS Organic Cotton, and Craftmark Seals.
- **Verified Buyer Reviews & UGC:** Customer drape photographs, softness scores, drape rankings, and color fidelity ratings.
- **Floating WhatsApp Concierge:** Instant live consultation chat popup for video call shopping and custom bridal orders.

---

## 👑 2. Owner Admin Management System

Switch to the **Store Owner Admin Console** anytime with a single click on the top gold banner button `👑 Store Owner Admin`.

- **Real-Time Sales & KPI Analytics:** Live trackers for Net Sales (INR ₹), Active Orders, Low-Stock alerts, and Master Catalog SKUs.
- **Product & Multi-Angle Media Uploader:** Add new textile SKUs with multi-angle dropzone, auto-simulated WebP 65% compression, HSN Codes (`50072010`), and Dynamic Collection assignment rules.
- **Bulk CSV / Excel Import & Export:**
  - Download standardized CSV template.
  - Export live inventory to CSV file.
  - Batch upload CSV to synchronize 50 to 500+ SKUs with instant validation.
- **Real-Time Inventory & Scarcity Control:**
  - Table of all products with inline stock editing.
  - Automated "🔥 Only X Left!" scarcity badge triggers on storefront when stock is low.
  - "Out of Stock" state with automated restock subscriber waitlist.
- **Order Fulfillment & Logistics Hub:**
  - Order queue with fulfillment status switcher (*Pending Dispatch, Packed, Dispatched, Delivered*).
  - **1-Click GST Tax Invoice Generator:** Printable/downloadable authentic tax invoice with Seller GSTIN (`33AABCS9876C1ZT`), Buyer GSTIN, HSN Codes, CGST (2.5%), SGST (2.5%), and authorized signatory seal.
  - **1-Click Shipping Barcode Label Generator:** Ready-to-print 4x6 shipping labels for BlueDart / Delhivery / Shiprocket / DHL Express with airway bill (AWB) barcodes.
  - Simulated WhatsApp invoice and tracking notification sender.

---

## 🚀 How to Run the Application

The application is completely self-contained with **zero external build steps or server dependencies required**:

### Option 1: Direct File Opening
Double-click `index.html` or right-click and choose **Open with Google Chrome / Microsoft Edge / Firefox / Safari**.

### Option 2: Local HTTP Server (VS Code / Live Server)
If using VS Code, click **Go Live** with the Live Server extension, or run:
```bash
npx serve .
# or
python -m http.server 8080
```
Then open `http://localhost:8080` in your web browser.

---

## 📁 File Structure

```
c:/Users/kumar/Downloads/srinivasa textiles/
├── index.html                   # Master HTML structure (Storefront + Admin Workspace + Modals)
├── README.md                    # Deployment & user manual
├── Textile_Website_Strategy_and_Blueprint.md.txt  # Strategy specification
├── css/
│   ├── main.css                 # Core typography, tokens, layout, header, footer
│   ├── storefront.css           # PDP 500% micro-zoom, hero, product cards, UGC
│   ├── admin.css                # Owner dashboard, KPI cards, GST invoice print styles
│   └── components.css           # Slide cart, checkout modal, floating WhatsApp widget
├── js/
│   ├── data.js                  # Master dataset (Textiles, reviews, orders, currencies)
│   ├── store.js                 # Central state manager (LocalStorage, dynamic rules, cart)
│   ├── storefront.js            # Storefront interactions (Micro-zoom, tailoring, search, cart)
│   ├── admin.js                 # Admin management (Upload, bulk CSV, GST invoices, labels)
│   └── app.js                   # Application coordinator & view routing
└── assets/
    └── images/                  # High-res Kanchipuram, Banarasi, Linen, and loom photos
```
