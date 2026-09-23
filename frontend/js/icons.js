/**
 * SRINIVASA TEXTILES - CENTRAL SVG ICONS REPOSITORY (JS FORMAT)
 * Scalable, pixel-perfect, lightweight vector icons.
 * Usage:
 *   Icons.get('search')
 *   Icons.get('favourite', { size: 20, className: 'custom-class' })
 *   <span data-icon="ladies"></span> (auto-rendered via Icons.init())
 */

(function (window) {
  'use strict';

  const svgIcons = {
    // 1. Search Icon
    search: `<svg class="svg-icon svg-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>`,

    // 2. Favourite / Heart Icon (Outline)
    favourite: `<svg class="svg-icon svg-favourite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>`,

    // 3. Favourite / Heart Icon (Filled)
    favouriteFilled: `<svg class="svg-icon svg-favourite-filled" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>`,

    // 4. Customer Feedback / Review
    feedback: `<svg class="svg-icon svg-feedback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      <circle cx="8" cy="11.5" r="1" fill="currentColor"></circle>
      <circle cx="12" cy="11.5" r="1" fill="currentColor"></circle>
      <circle cx="16" cy="11.5" r="1" fill="currentColor"></circle>
    </svg>`,

    // 5. Ladies' / Women's Silk Sarees Icon
    ladies: `<svg class="svg-icon svg-ladies" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="5" r="3"></circle>
      <path d="M7 21v-3.5a3.5 3.5 0 0 1 3.5-3.5h3a3.5 3.5 0 0 1 3.5 3.5V21"></path>
      <path d="M8.5 13l7 8"></path>
      <path d="M10 9l4 4"></path>
    </svg>`,

    // 6. Men's Silk & Dhoti Icon
    mens: `<svg class="svg-icon svg-mens" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="5" r="3"></circle>
      <path d="M6 21v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4"></path>
      <path d="M12 9v5"></path>
      <path d="M10 14h4"></path>
    </svg>`,

    // 7. Kids (Girls & Boys) Icon
    kids: `<svg class="svg-icon svg-kids" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="6" r="3"></circle>
      <path d="M8 20v-3a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v3"></path>
      <path d="M9 11l-3 4"></path>
      <path d="M15 11l3 4"></path>
    </svg>`,

    // 8. Born Babies & Infants Icon
    baby: `<svg class="svg-icon svg-baby" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="6" r="3"></circle>
      <path d="M5 14a7 7 0 0 0 14 0c0-3.5-3.5-5-7-5s-7 1.5-7 5z"></path>
      <circle cx="9" cy="18" r="1.5" fill="currentColor"></circle>
      <circle cx="15" cy="18" r="1.5" fill="currentColor"></circle>
    </svg>`,

    // 9. Video Shopping Call Icon
    videoCall: `<svg class="svg-icon svg-video-call" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>`,

    // 10. Shopping Cart / Bag
    cart: `<svg class="svg-icon svg-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>`,

    // 11. WhatsApp Icon
    whatsapp: `<svg class="svg-icon svg-whatsapp" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.27 15.09 13.67 14.86 13.58C14.64 13.5 14.47 13.46 14.31 13.71C14.14 13.96 13.66 14.52 13.51 14.69C13.37 14.85 13.22 14.87 12.97 14.75C12.72 14.63 11.92 14.36 10.97 13.52C10.23 12.86 9.73 12.05 9.58 11.8C9.44 11.55 9.57 11.42 9.69 11.3C9.8 11.19 9.94 11.01 10.06 10.86C10.18 10.72 10.23 10.61 10.31 10.45C10.39 10.28 10.35 10.14 10.29 10.02C10.23 9.9 9.74 8.69 9.54 8.19C9.34 7.7 9.14 7.77 8.99 7.76C8.85 7.75 8.68 7.75 8.52 7.75C8.35 7.75 8.08 7.81 7.86 8.05C7.63 8.3 7 8.89 7 10.09C7 11.29 7.88 12.45 8 12.61C8.13 12.78 9.72 15.22 12.16 16.27C12.74 16.52 13.19 16.67 13.54 16.78C14.12 16.97 14.66 16.94 15.08 16.88C15.55 16.81 16.52 16.29 16.73 15.72C16.93 15.15 16.93 14.66 16.87 14.56C16.81 14.47 16.66 14.41 16.56 14.39Z"/>
    </svg>`,

    // 12. Arrow Right
    arrowRight: `<svg class="svg-icon svg-arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>`,

    // 13. Close / Cross
    close: `<svg class="svg-icon svg-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`,

    // 14. Check / Success Mark
    check: `<svg class="svg-icon svg-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`,

    // 15. Star Rating Icon
    star: `<svg class="svg-icon svg-star" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>`,

    // 16. Filter Icon
    filter: `<svg class="svg-icon svg-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>`,

    // 17. Shipping Truck
    truck: `<svg class="svg-icon svg-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>`,

    // 18. Verified Silk Mark / Shield
    shield: `<svg class="svg-icon svg-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <polyline points="9 12 11 14 15 10"></polyline>
    </svg>`,

    // 19. Sparkle / Motif
    sparkle: `<svg class="svg-icon svg-sparkle" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
    </svg>`,

    // 20. Lock / Security
    lock: `<svg class="svg-icon svg-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>`,

    // 21. Family Combos Icon
    family: `<svg class="svg-icon svg-family" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="6" r="2.5"></circle>
      <circle cx="15" cy="6" r="2.5"></circle>
      <path d="M4 18v-2a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2"></path>
      <path d="M14 13h3a3 3 0 0 1 3 3v2"></path>
    </svg>`,

    // 22. Dashboard Icon
    dashboard: `<svg class="svg-icon svg-dashboard" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>`,

    // 23. Inventory Box / Package
    box: `<svg class="svg-icon svg-box" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="16.5" y1="9.4" x2="7.55" y2="4.21"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>`,

    // 24. Orders & Invoices / Receipt
    receipt: `<svg class="svg-icon svg-receipt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"></path>
      <line x1="8" y1="8" x2="16" y2="8"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
      <line x1="8" y1="16" x2="12" y2="16"></line>
    </svg>`,

    // 25. Coupons & Offers Tag
    tag: `<svg class="svg-icon svg-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>`,

    // 26. Restock Alerts Bell
    bell: `<svg class="svg-icon svg-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>`,

    // 27. Product Camera / Uploader
    camera: `<svg class="svg-icon svg-camera" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>`,

    // 28. Edit / Pencil
    edit: `<svg class="svg-icon svg-edit" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>`,

    // 29. Trash / Delete
    trash: `<svg class="svg-icon svg-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>`,

    // 30. Eye / Preview
    eye: `<svg class="svg-icon svg-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`,

    // 31. Download / CSV Export
    download: `<svg class="svg-icon svg-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`,

    // 32. Refresh / Sync
    refresh: `<svg class="svg-icon svg-refresh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>`,

    // 33. Users / Customers
    users: `<svg class="svg-icon svg-users" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>`,

    // 34. Gear / Settings
    gear: `<svg class="svg-icon svg-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>`,

    // 35. Party / Festive Horn
    party: `<svg class="svg-icon svg-party" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5.8 11.3L2 22l10.7-3.79"></path>
      <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M18 12h.01"></path>
      <path d="M12 11c0 2 2 3 4 3s3-1 3-3-2-3-4-3-3 1-3 3z"></path>
    </svg>`
  };

  // Map legacy image filenames to SVG icon keys
  const legacyMap = {
    'search.jpeg': 'search',
    'favourite.jpeg': 'favourite',
    'feedback.jpeg': 'feedback',
    'ladies.jpeg': 'ladies',
    'mens.jpeg': 'mens',
    'kids.jpeg': 'kids',
    'bourn babies.jpeg': 'baby',
    'bourn%20babies.jpeg': 'baby',
    'video call.jpeg': 'videoCall',
    'video%20call.jpeg': 'videoCall'
  };

  const Icons = {
    svg: svgIcons,

    /**
     * Get SVG HTML markup for an icon
     * @param {string} name - Icon name
     * @param {Object} options - { size, width, height, className, style, color }
     * @returns {string} SVG HTML string
     */
    get(name, options = {}) {
      const key = (name || '').toLowerCase();
      // Resolve aliases
      const resolvedKey =
        key === 'women' ? 'ladies' :
        key === 'men' ? 'mens' :
        key === 'girls' || key === 'boys' ? 'kids' :
        key === 'infants' || key === 'born babies' ? 'baby' :
        key === 'heart' ? 'favourite' :
        key === 'videocall' ? 'videoCall' :
        key;

      let svg = svgIcons[resolvedKey] || svgIcons[key] || '';
      if (!svg) return '';

      // Apply options if provided
      if (options.size || options.width || options.height || options.className || options.style || options.color) {
        if (typeof DOMParser !== 'undefined') {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svg, 'image/svg+xml');
          const el = doc.querySelector('svg');
          if (el) {
            if (options.size) {
              el.setAttribute('width', options.size);
              el.setAttribute('height', options.size);
            }
            if (options.width) el.setAttribute('width', options.width);
            if (options.height) el.setAttribute('height', options.height);
            if (options.className) el.classList.add(...options.className.split(' ').filter(Boolean));
            if (options.color) el.style.color = options.color;
            if (options.style) el.setAttribute('style', (el.getAttribute('style') || '') + ';' + options.style);
            return el.outerHTML;
          }
        } else {
          let modified = svg;
          if (options.className) {
            modified = modified.replace('class="', `class="${options.className} `);
          }
          if (options.size) {
            modified = modified.replace('<svg ', `<svg width="${options.size}" height="${options.size}" `);
          }
          return modified;
        }
      }
      return svg;
    },

    /**
     * Replaces legacy <img src="icons/..."> elements with crisp SVG icons
     * @param {HTMLElement|Document} root
     */
    replaceLegacyImages(root) {
      if (typeof document === 'undefined') return;
      const target = root || document;
      const imgs = target.querySelectorAll('img[src*="icons/"]');
      imgs.forEach(img => {
        const src = img.getAttribute('src') || '';
        for (const [filename, iconKey] of Object.entries(legacyMap)) {
          if (src.includes(filename)) {
            const svgString = this.get(iconKey, {
              className: (img.className || '') + ' svg-icon-inlined',
              style: img.getAttribute('style') || ''
            });
            if (svgString) {
              const span = document.createElement('span');
              span.className = 'svg-icon-wrapper';
              span.innerHTML = svgString;
              img.parentNode?.replaceChild(span, img);
            }
            break;
          }
        }
      });
    },

    /**
     * Initializes all data-icon elements and legacy images
     */
    init(root) {
      if (typeof document === 'undefined') return;
      const target = root || document;

      // 1. Render all elements marked with data-icon="name"
      const iconHolders = target.querySelectorAll('[data-icon]');
      iconHolders.forEach(el => {
        const iconName = el.getAttribute('data-icon');
        const iconSize = el.getAttribute('data-icon-size');
        const extraClass = el.getAttribute('data-icon-class') || '';
        el.innerHTML = this.get(iconName, {
          size: iconSize ? Number(iconSize) : undefined,
          className: extraClass
        });
      });

      // 2. Automatically replace legacy jpeg icons with SVG
      this.replaceLegacyImages(target);
    }
  };

  // Expose to window / global
  if (typeof window !== 'undefined') {
    window.Icons = Icons;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Icons;
  }

  // Auto-run on DOMContentLoaded in browser
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => Icons.init());
    } else {
      Icons.init();
    }
  }

})(typeof window !== 'undefined' ? window : globalThis);
