/**
 * SRINIVASA TEXTILES - MASTER LUXURY SVG VECTOR ICONS REPOSITORY (JS FORMAT)
 * Scalable, pixel-perfect, lightweight, theme-aware vector icons.
 * Usage:
 *   Icons.get('search')
 *   Icons.get('crown', { size: 24, className: 'brand-crest' })
 *   <span data-icon="saree"></span> (auto-rendered via Icons.init())
 */

(function (window) {
  'use strict';

  const svgIcons = {
    // 1. Search / Magnifier with luxury reflection arc
    search: `<svg class="svg-icon svg-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="7.5"></circle>
      <path d="M21 21l-4.5-4.5"></path>
      <path d="M8 10a3 3 0 0 1 3-3" stroke-width="1.5"></path>
    </svg>`,

    // 2. Favourite / Heart Icon (Outline)
    favourite: `<svg class="svg-icon svg-favourite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>`,

    // 3. Favourite / Heart Icon (Filled)
    favouriteFilled: `<svg class="svg-icon svg-favourite-filled" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>`,

    // 4. Customer Feedback & Reviews
    feedback: `<svg class="svg-icon svg-feedback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"></path>
      <polygon points="12 7.5 13.1 9.7 15.5 10 13.8 11.7 14.2 14.1 12 12.9 9.8 14.1 10.2 11.7 8.5 10 10.9 9.7 12 7.5" fill="currentColor" stroke="none"></polygon>
    </svg>`,

    // 5. Ladies' / Women's Silk Sarees
    ladies: `<svg class="svg-icon svg-ladies" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3c0 1.2.7 2.2 1.7 2.7L8 14h8l-2.7-6.3c1-.5 1.7-1.5 1.7-2.7a3 3 0 0 0-3-3z"></path>
      <path d="M7 14l-3 8h16l-3-8"></path>
      <path d="M12 14v8M9 18h6"></path>
    </svg>`,

    // 6. Men's Silk & Dhoti
    mens: `<svg class="svg-icon svg-mens" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 3h12l3 5-3 3v10H6V11L3 8l3-5z"></path>
      <path d="M9 3v4a3 3 0 0 0 6 0V3M12 7v14M6 14h12"></path>
    </svg>`,

    // 7. Kids (Girls & Boys) Pattu Pavadai
    kids: `<svg class="svg-icon svg-kids" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 3h6l2 5-3 1v3H10V9L7 8l2-5z"></path>
      <path d="M8 12l-4 9h16l-4-9H8z"></path>
      <path d="M12 12v9M8 17h8"></path>
    </svg>`,

    // 8. Born Babies & Infants
    baby: `<svg class="svg-icon svg-baby" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="6" r="3.5"></circle>
      <path d="M7 12a5 5 0 0 1 10 0v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-7z"></path>
      <path d="M10 13v3M14 13v3M10 18h4"></path>
    </svg>`,

    // 9. Video Shopping Call
    videoCall: `<svg class="svg-icon svg-video-call" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="5" width="14" height="14" rx="3"></rect>
      <polygon points="22 8 16 12 22 16 22 8" fill="currentColor"></polygon>
      <circle cx="9" cy="12" r="2"></circle>
    </svg>`,

    // 10. Shopping Cart / Boutique Bag
    cart: `<svg class="svg-icon svg-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>`,

    // 11. WhatsApp Vector Icon
    whatsapp: `<svg class="svg-icon svg-whatsapp" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.27 15.09 13.67 14.86 13.58C14.64 13.5 14.47 13.46 14.31 13.71C14.14 13.96 13.66 14.52 13.51 14.69C13.37 14.85 13.22 14.87 12.97 14.75C12.72 14.63 11.92 14.36 10.97 13.52C10.23 12.86 9.73 12.05 9.58 11.8C9.44 11.55 9.57 11.42 9.69 11.3C9.8 11.19 9.94 11.01 10.06 10.86C10.18 10.72 10.23 10.61 10.31 10.45C10.39 10.28 10.35 10.14 10.29 10.02C10.23 9.9 9.74 8.69 9.54 8.19C9.34 7.7 9.14 7.77 8.99 7.76C8.85 7.75 8.68 7.75 8.52 7.75C8.35 7.75 8.08 7.81 7.86 8.05C7.63 8.3 7 8.89 7 10.09C7 11.29 7.88 12.45 8 12.61C8.13 12.78 9.72 15.22 12.16 16.27C12.74 16.52 13.19 16.67 13.54 16.78C14.12 16.97 14.66 16.94 15.08 16.88C15.55 16.81 16.52 16.29 16.73 15.72C16.93 15.15 16.93 14.66 16.87 14.56C16.81 14.47 16.66 14.41 16.56 14.39Z"/>
    </svg>`,

    // 12. Imperial Royal Crown (Showroom & Owner)
    crown: `<svg class="svg-icon svg-crown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 19h20M5 19l-2-12 5.5 5 3.5-7 3.5 7 5.5-5-2 12H5z"></path>
      <circle cx="12" cy="4" r="1.5" fill="currentColor"></circle>
      <circle cx="3" cy="7" r="1.5" fill="currentColor"></circle>
      <circle cx="21" cy="7" r="1.5" fill="currentColor"></circle>
      <circle cx="7" cy="15" r="1" fill="currentColor"></circle>
      <circle cx="12" cy="15" r="1" fill="currentColor"></circle>
      <circle cx="17" cy="15" r="1" fill="currentColor"></circle>
    </svg>`,

    // 13. Heritage Showroom / Palace
    palace: `<svg class="svg-icon svg-palace" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L3 7v2h18V7L12 2zM4 11v9M8 11v9M12 11v9M16 11v9M20 11v9M2 20h20M10 20v-4a2 2 0 0 1 4 0v4"></path>
    </svg>`,

    // 14. Family Combos & Bundles
    family: `<svg class="svg-icon svg-family" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="7" cy="5" r="2.5"></circle>
      <circle cx="17" cy="5" r="2.5"></circle>
      <path d="M3 17v-2a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v2M12 17v-2a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v2"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M9 21v-1a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1"></path>
    </svg>`,

    // 15. Sparkle / Celestial Zari Glow
    sparkle: `<svg class="svg-icon svg-sparkle" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c.5 4.5 4.5 5.5 4.5 5.5s4 1 4 4.5-4 4.5-4 4.5-4 1-4.5 5.5c-.5-4.5-4.5-5.5-4.5-5.5s-4-1-4-4.5 4-4.5 4-4.5 4-1 4.5-5.5z"></path>
    </svg>`,

    // 16. Star Rating
    star: `<svg class="svg-icon svg-star" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>`,

    // 17. Verified Shield / SMOI Silk Mark
    shield: `<svg class="svg-icon svg-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <polyline points="9 12 11 14 15 10"></polyline>
    </svg>`,

    // 18. Silk Cocoon / Silk Mark SMOI
    silkMark: `<svg class="svg-icon svg-silk-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="12" rx="7" ry="9" stroke="currentColor"></ellipse>
      <path d="M7 9c3 1 7 4 10 3M7 15c3-1 7-4 10-3M12 3v18"></path>
      <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
    </svg>`,

    // 19. Pure Handloom Shuttle / Weaver
    loom: `<svg class="svg-icon svg-loom" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2"></rect>
      <line x1="7" y1="4" x2="7" y2="20"></line>
      <line x1="12" y1="4" x2="12" y2="20"></line>
      <line x1="17" y1="4" x2="17" y2="20"></line>
      <path d="M2 12h20" stroke-width="2.2"></path>
    </svg>`,

    // 20. Zari Thread Spool / SKUs
    thread: `<svg class="svg-icon svg-thread" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 3h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
      <path d="M6 15h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"></path>
      <line x1="7" y1="9" x2="7" y2="15"></line>
      <line x1="17" y1="9" x2="17" y2="15"></line>
      <line x1="10" y1="9" x2="14" y2="15"></line>
      <line x1="14" y1="9" x2="10" y2="15"></line>
    </svg>`,

    // 21. Feather / Baby Softness Shield
    softness: `<svg class="svg-icon svg-softness" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
      <line x1="16" y1="8" x2="2" y2="22"></line>
      <line x1="17.5" y1="15" x2="9" y2="15"></line>
    </svg>`,

    // 22. Indian Rupee / Revenue
    revenue: `<svg class="svg-icon svg-revenue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 7h8M8 11h6M8 7v10M12 11c3 0 3-4 0-4M12 11l4 6"></path>
    </svg>`,

    // 23. Package / Inventory Box
    box: `<svg class="svg-icon svg-box" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>`,

    // 24. Flame / Low Stock & Hot Deals
    flame: `<svg class="svg-icon svg-flame" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
    </svg>`,

    // 25. Orders & Invoices / Tax Receipt
    receipt: `<svg class="svg-icon svg-receipt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"></path>
      <line x1="8" y1="8" x2="16" y2="8"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
      <line x1="8" y1="16" x2="13" y2="16"></line>
    </svg>`,

    // 26. Printer / PDF Generation
    printer: `<svg class="svg-icon svg-printer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>`,

    // 27. Coupons & Offers Tag
    tag: `<svg class="svg-icon svg-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <circle cx="7" cy="7" r="1.5" fill="currentColor"></circle>
    </svg>`,

    // 28. Restock Alerts Bell
    bell: `<svg class="svg-icon svg-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>`,

    // 29. Camera / Product SKU Uploader
    camera: `<svg class="svg-icon svg-camera" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>`,

    // 30. Lock / Store Protection
    lock: `<svg class="svg-icon svg-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      <circle cx="12" cy="16" r="1.5" fill="currentColor"></circle>
    </svg>`,

    // 31. Unlock / Authorized
    unlock: `<svg class="svg-icon svg-unlock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
      <circle cx="12" cy="16" r="1.5" fill="currentColor"></circle>
    </svg>`,

    // 32. Eye / Storefront View
    eye: `<svg class="svg-icon svg-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`,

    // 33. Trash / Delete
    trash: `<svg class="svg-icon svg-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>`,

    // 34. Copy / Clipboard
    copy: `<svg class="svg-icon svg-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>`,

    // 35. Edit / Modify
    edit: `<svg class="svg-icon svg-edit" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>`,

    // 36. Gift / Festive Gift Wrap
    gift: `<svg class="svg-icon svg-gift" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5" rx="1"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>`,

    // 37. Party Popper / Festive Specials 2026
    party: `<svg class="svg-icon svg-party" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5.8 11.3L2 22l10.7-3.79"></path>
      <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M18 12h.01"></path>
      <path d="M12 11c0 2 2 3 4 3s3-1 3-3-2-3-4-3-3 1-3 3z"></path>
    </svg>`,

    // 38. Map Pin / Showroom Directions
    mapPin: `<svg class="svg-icon svg-map-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>`,

    // 39. Phone / Customer Call Care
    phone: `<svg class="svg-icon svg-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>`,

    // 40. Clock / Real-Time Session
    clock: `<svg class="svg-icon svg-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>`,

    // 41. Shipping Express Truck
    truck: `<svg class="svg-icon svg-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>`,

    // 42. Theme Moon (Dark Mode)
    themeMoon: `<svg class="svg-icon svg-theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      <path d="M19 4v3M20.5 5.5h-3" stroke-width="1.5"></path>
    </svg>`,

    // 43. Theme Sun (Light Mode)
    themeSun: `<svg class="svg-icon svg-theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,

    // 44. Arrow Right
    arrowRight: `<svg class="svg-icon svg-arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>`,

    // 45. Close / Cross
    close: `<svg class="svg-icon svg-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`,

    // 46. Check / Verified
    check: `<svg class="svg-icon svg-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`,

    // 47. Filter Funnel
    filter: `<svg class="svg-icon svg-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>`,

    // 48. Hamburger Menu
    menu: `<svg class="svg-icon svg-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>`,

    // 49. Refresh / Synchronize
    refresh: `<svg class="svg-icon svg-refresh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>`,

    // 50. Dashboard Analytics Hub
    dashboard: `<svg class="svg-icon svg-dashboard" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"></rect>
      <rect x="14" y="3" width="7" height="5" rx="1"></rect>
      <rect x="14" y="12" width="7" height="9" rx="1"></rect>
      <rect x="3" y="16" width="7" height="5" rx="1"></rect>
    </svg>`,

    // 51. Analytics Chart / Sales Performance
    chart: `<svg class="svg-icon svg-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
      <line x1="2" y1="20" x2="22" y2="20"></line>
      <path d="M4 11l4-4 4 3 6-6" stroke-width="1.6"></path>
    </svg>`,

    // 52. Document / Structured Invoice Sheet
    fileText: `<svg class="svg-icon svg-file-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>`,

    // 53. Save / Database Sync
    save: `<svg class="svg-icon svg-save" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>`,

    // 54. Folder / Archive
    folder: `<svg class="svg-icon svg-folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>`,

    // 55. Upload / Cloud Import
    upload: `<svg class="svg-icon svg-upload" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>`,

    // 56. Download / Export
    download: `<svg class="svg-icon svg-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`,

    // 57. User / Patron Profile
    user: `<svg class="svg-icon svg-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>`,

    // 58. Organic Mulberry Silk Leaf
    leaf: `<svg class="svg-icon svg-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
    </svg>`,

    // 59. Artisan Dye Palette
    palette: `<svg class="svg-icon svg-palette" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z"></path>
    </svg>`,

    // 60. Calendar / Festival Schedule
    calendar: `<svg class="svg-icon svg-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <rect x="7" y="14" width="3" height="3" fill="currentColor"></rect>
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

  // Map raw emojis to SVG icon keys for automated vector elevation
  const emojiMap = {
    '👑': 'crown',
    '✨': 'sparkle',
    '🌟': 'star',
    '⭐': 'star',
    '★': 'star',
    '🛡️': 'shield',
    '🛡': 'shield',
    '📦': 'box',
    '🧾': 'receipt',
    '🏷️': 'tag',
    '🏷': 'tag',
    '🔔': 'bell',
    '📸': 'camera',
    '💰': 'revenue',
    '💵': 'revenue',
    '🔥': 'flame',
    '🧵': 'thread',
    '🪶': 'softness',
    '👁️': 'eye',
    '👁': 'eye',
    '🗑️': 'trash',
    '🗑': 'trash',
    '📋': 'copy',
    '🖨️': 'printer',
    '🖨': 'printer',
    '🎁': 'gift',
    '🎉': 'party',
    '📍': 'mapPin',
    '📞': 'phone',
    '📱': 'phone',
    '📲': 'phone',
    '🏰': 'palace',
    '🏛️': 'palace',
    '🏛': 'palace',
    '🏢': 'palace',
    '🏬': 'palace',
    '🏠': 'palace',
    '👨‍👩‍👧‍👦': 'family',
    '🌙': 'themeMoon',
    '☀️': 'themeSun',
    '🔒': 'lock',
    '🔓': 'unlock',
    '🚚': 'truck',
    '💬': 'whatsapp',
    '🛍️': 'cart',
    '🛍': 'cart',
    '📊': 'chart',
    '📑': 'receipt',
    '📄': 'fileText',
    '💾': 'save',
    '📁': 'folder',
    '📂': 'folder',
    '📤': 'upload',
    '📥': 'download',
    '👤': 'user',
    '🌿': 'leaf',
    '🎨': 'palette',
    '📅': 'calendar',
    '🕒': 'clock',
    '⚡': 'sparkle',
    '☰': 'menu',
    '✕': 'close',
    '✓': 'check',
    '✅': 'check',
    '⚪': 'shield',
    '🟢': 'check',
    '🔴': 'flame',
    '🤍': 'favourite',
    '👔': 'mens'
  };

  const Icons = {
    svg: svgIcons,
    emojiMap: emojiMap,

    /**
     * Get SVG HTML markup for an icon
     * @param {string} name - Icon name
     * @param {Object} options - { size, width, height, className, style, color }
     * @returns {string} SVG HTML string
     */
    get(name, options = {}) {
      const key = (name || '').trim();
      const lowerKey = key.toLowerCase();

      // Check emoji mapping first
      let resolvedKey = emojiMap[key] || '';

      if (!resolvedKey) {
        // Resolve semantic aliases
        resolvedKey =
          lowerKey === 'women' || lowerKey === 'saree' ? 'ladies' :
          lowerKey === 'men' || lowerKey === 'dhoti' ? 'mens' :
          lowerKey === 'girls' || lowerKey === 'boys' || lowerKey === 'pavadai' ? 'kids' :
          lowerKey === 'infants' || lowerKey === 'born babies' ? 'baby' :
          lowerKey === 'heart' ? 'favourite' :
          lowerKey === 'videocall' || lowerKey === 'video' ? 'videoCall' :
          lowerKey === 'rupee' || lowerKey === 'sales' ? 'revenue' :
          lowerKey === 'fire' || lowerKey === 'lowstock' ? 'flame' :
          lowerKey === 'spool' || lowerKey === 'sku' ? 'thread' :
          lowerKey === 'invoice' || lowerKey === 'bill' ? 'receipt' :
          lowerKey === 'delivery' || lowerKey === 'shipping' ? 'truck' :
          lowerKey === 'moon' || lowerKey === 'dark' ? 'themeMoon' :
          lowerKey === 'sun' || lowerKey === 'light' ? 'themeSun' :
          lowerKey === 'location' || lowerKey === 'directions' ? 'mapPin' :
          lowerKey === 'call' || lowerKey === 'telephone' ? 'phone' :
          lowerKey === 'showroom' || lowerKey === 'store' ? 'palace' :
          lowerKey === 'festive' || lowerKey === 'offer' ? 'party' :
          lowerKey === 'silk' || lowerKey === 'pure' ? 'silkMark' :
          lowerKey;
      }

      let svg = svgIcons[resolvedKey] || svgIcons[lowerKey] || '';
      if (!svg) return '';

      // Apply options if provided
      if (options.size || options.width || options.height || options.className || options.style || options.color) {
        if (typeof DOMParser !== 'undefined') {
          try {
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
          } catch (e) {
            // Fallback to string replace
          }
        }

        let modified = svg;
        if (options.className) {
          modified = modified.replace('class="', `class="${options.className} `);
        }
        if (options.size) {
          modified = modified.replace('<svg ', `<svg width="${options.size}" height="${options.size}" `);
        }
        return modified;
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
     * Automatically elevates raw emoji elements (like in KPI icons & shortcuts) into SVG format
     * @param {HTMLElement|Document} root
     */
    elevateEmojiIcons(root) {
      if (typeof document === 'undefined') return;
      const target = root || document;

      // Scan specific icon containers: .kpi-icon, .admin-shortcut-icon, .gold-icon, .menu-icon, .admin-brand-icon, etc.
      const selectors = '.kpi-icon, .admin-shortcut-icon, .gold-icon, .admin-brand-icon, .lock-brand-icon, .media-uploader-icon, .admin-owner-avatar, .admin-sidebar-mobile-title > span, .admin-silkmark-widget > span';
      const containers = target.querySelectorAll(selectors);

      containers.forEach(el => {
        const text = el.textContent ? el.textContent.trim() : '';
        if (text && emojiMap[text]) {
          const iconKey = emojiMap[text];
          const svgMarkup = this.get(iconKey, {
            size: el.classList.contains('admin-brand-icon') ? 22 :
                  el.classList.contains('lock-brand-icon') ? 34 :
                  el.classList.contains('kpi-icon') ? 26 :
                  el.classList.contains('admin-shortcut-icon') ? 22 :
                  el.classList.contains('admin-owner-avatar') ? 22 :
                  el.classList.contains('media-uploader-icon') ? 38 : 18,
            className: 'svg-elevated-icon'
          });
          if (svgMarkup) {
            el.innerHTML = svgMarkup;
          }
        }
      });
    },

    /**
     * Initializes all data-icon elements, legacy images, and emoji containers
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

      // 3. Automatically elevate raw emojis in cards and badges into vector SVGs
      this.elevateEmojiIcons(target);
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
