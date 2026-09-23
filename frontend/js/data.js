// Master Family Textile Catalog Dataset for Srinivasa Textiles
// Dedicated Multi-Gender & Multi-Department Architecture

const INITIAL_CATALOG = [
  // ==========================================
  // 1. FAMILY COMBOS & MATCHING SETS DEPARTMENT
  // ==========================================
  {
    id: "ST-FAM-010",
    title: "Samanvaya 4-Piece Grand Muhurtham Family Matching Silk Bundle",
    subtitle: "Color-Coordinated Pure Kanchipuram Crimson & Gold Festive Attire for Father, Mother, Son & Daughter",
    department: "Family Combos & Sets",
    subCategory: "Full Family Festival Bundles",
    ageGroup: "Full Family Ensemble",
    fabric: "Kanchipuram Silk & Pure Mulberry Silk",
    fabricType: "100% Pure Tested Silk with Pure Gold Zari",
    warpWeft: "3-Ply Mulberry Silk Warp & Weft",
    zariType: "Pure Tested Gold Zari (Silver Electroplated)",
    threadCount: "280 EPI x 160 PPI",
    length: "Full 4-Outfit Ensemble (Saree + Pattu Pavadai + Men's Dhoti/Shirt + Boys Kurta/Dhoti)",
    weight: "2,200 grams total",
    hsnCode: "50072010",
    gstRate: 5,
    priceINR: 58500,
    mrpINR: 72000,
    stock: 3,
    lowStockThreshold: 2,
    collections: ["Family Combos", "Bridal Trousseau", "Festive Silk 2026"],
    occasion: "Wedding & Grand Celebration",
    technique: "Handloom Korvai & Jacquard",
    availableSizes: ["Complete Family Pack (All Sizes Configured)"],
    colors: [
      { name: "Crimson & Pure Gold", hex: "#7A0C2E", image: "assets/images/family_matching_combo.jpg", code: "FAM-01" }
    ],
    mainImage: "assets/images/family_matching_combo.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/family_matching_combo.jpg",
      "assets/images/hero_banner.jpg",
      "assets/images/kids_pattu_pavadai.jpg",
      "assets/images/mens_silk_dhoti.jpg"
    ],
    badges: ["✨ Silk Mark (SMOI) Certified", "👨‍👩‍👧‍👦 Complete 4-Piece Family Bundle", "🛡️ Soft Inner-Lining Guarantee"],
    safetyBadges: ["100% Skin-Friendly Natural Silk", "Scratch-Free Cotton Lining for Kids"],
    rating: 5.0,
    reviewCount: 42,
    description: "The crown jewel of festive family harmony. Specially dyed in color-coordinated Crimson & Gold batches so the entire family reflects majestic unified elegance at weddings and temple celebrations. Single-click family bundling saves over ₹13,500.",
    careInstructions: [
      "Strictly Professional Dry Clean only",
      "Store each garment wrapped in pure muslin cloth"
    ],
    featured: true,
    trendingRank: 1
  },
  {
    id: "ST-FAM-012",
    title: "Vatsalya Mother & Daughter Crimson Gold Silk Set",
    subtitle: "Matching Kanchipuram Bridal Saree (Mother) & Stitched Pure Silk Pattu Pavadai (Daughter)",
    department: "Family Combos & Sets",
    subCategory: "Mother & Daughter Matching Sets",
    ageGroup: "Mother & Daughter",
    fabric: "Kanchipuram Silk & Pure Mulberry Silk",
    fabricType: "Pure Silk with Soft Cotton Underside for Kids",
    warpWeft: "3-Ply Mulberry Silk Warp",
    zariType: "Pure Tested Gold Zari",
    threadCount: "260 EPI x 150 PPI",
    length: "Mother Saree (6.3m) + Daughter Stitched Pavadai Set (2-12Y)",
    weight: "1,250 grams",
    hsnCode: "50072010",
    gstRate: 5,
    priceINR: 39900,
    mrpINR: 48000,
    stock: 4,
    lowStockThreshold: 2,
    collections: ["Family Combos", "Festive Silk 2026"],
    occasion: "Wedding & Grand Celebration",
    technique: "Handloom Korvai",
    availableSizes: ["Mother Free Size + Daughter 4-5Y", "Mother Free Size + Daughter 6-7Y", "Mother Free Size + Daughter 8-9Y"],
    colors: [
      { name: "Crimson Maroon & Gold", hex: "#7A0C2E", image: "assets/images/hero_banner.jpg", code: "MD-01" }
    ],
    mainImage: "assets/images/hero_banner.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/hero_banner.jpg",
      "assets/images/kids_pattu_pavadai.jpg"
    ],
    badges: ["✨ Silk Mark Certified", "👩‍👧 Mother-Daughter Pair", "🛡️ Soft Lining Guarantee"],
    safetyBadges: ["100% Skin-Friendly Scratch-Free Cotton Lining", "Baby-Safe Dyes"],
    rating: 4.95,
    reviewCount: 34,
    description: "A cherished festive tradition. Create timeless photographs with matching mother-daughter heirloom pure silk garments woven in the same ceremonial dye batch.",
    careInstructions: ["Professional Dry Clean only"],
    featured: true,
    trendingRank: 2
  },
  {
    id: "ST-FAM-013",
    title: "Pithamaha Father & Son Royal Cream Silk Wedding Pair",
    subtitle: "Matching Pure Mulberry Silk Shirt & Dhoti for Father with Matching Boys Silk Kurta & Dhoti Set",
    department: "Family Combos & Sets",
    subCategory: "Father & Son Matching Sets",
    ageGroup: "Father & Son",
    fabric: "100% Pure Mulberry Silk",
    fabricType: "Pure Silk (Woven in Kanchipuram)",
    warpWeft: "2-Ply Compact Silk",
    zariType: "Gold Zari Temple Border",
    threadCount: "240 EPI x 130 PPI",
    length: "Father 3-Piece Set + Son 2-Piece Kurta/Dhoti Set",
    weight: "980 grams",
    hsnCode: "62059010",
    gstRate: 5,
    priceINR: 18900,
    mrpINR: 23500,
    stock: 5,
    lowStockThreshold: 2,
    collections: ["Family Combos", "Bridal Trousseau"],
    occasion: "Wedding & Grand Celebration",
    technique: "Pit Loom Weave",
    availableSizes: ["Father Size 40 + Son 4-5Y", "Father Size 42 + Son 6-7Y", "Father Size 44 + Son 8-9Y"],
    colors: [
      { name: "Cream Silk & Gold Zari", hex: "#FFF8DC", image: "assets/images/mens_silk_dhoti.jpg", code: "FS-01" }
    ],
    mainImage: "assets/images/mens_silk_dhoti.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/mens_silk_dhoti.jpg",
      "assets/images/boys_kurta_dhoti.jpg"
    ],
    badges: ["✨ Silk Mark Certified", "👨‍👦 Father-Son Pair", "👔 Complete Wedding Set"],
    safetyBadges: ["100% Pure Mulberry Silk", "Elastic Waist for Kids"],
    rating: 4.92,
    reviewCount: 29,
    description: "Honor ceremonial occasions with coordinated father-and-son traditional South Indian pure silk attire.",
    careInstructions: ["Professional Dry Clean only"],
    featured: true,
    trendingRank: 3
  },

  // ==========================================
  // 2. WOMEN'S DEPARTMENT (SAREES & ETHNIC)
  // ==========================================
  {
    id: "ST-KAN-001",
    title: "Rajasi Crimson Bridal Kanchipuram Pure Silk Saree",
    subtitle: "Heavy Gold Zari Temple Korvai Border with Royal Mayil (Peacock) Pallu",
    department: "Women's Collection",
    subCategory: "Kanchipuram Silk Sarees",
    ageGroup: "Adults & Teens",
    fabric: "Kanchipuram Silk",
    fabricType: "Pure Mulberry Silk (100%)",
    warpWeft: "3-Ply Mulberry Silk Warp & Weft",
    zariType: "Pure Tested Gold Zari (Half-Fine Silver & Gold Electroplated)",
    threadCount: "280 EPI x 160 PPI (Heavy Bridal Weave)",
    length: "6.3 Meters (Includes 80cm Unstitched Blouse Piece)",
    weight: "850 grams",
    hsnCode: "50072010",
    gstRate: 5,
    priceINR: 34500,
    mrpINR: 42000,
    stock: 3,
    lowStockThreshold: 2,
    collections: ["Bridal Trousseau", "Festive Silk 2026", "Women's Ethnic"],
    occasion: "Wedding & Grand Celebration",
    technique: "Handloom Korvai",
    availableSizes: ["Free Size (6.3m with Blouse)"],
    colors: [
      { name: "Crimson Maroon & Gold", hex: "#7A0C2E", image: "assets/images/hero_banner.jpg", code: "CR-01" },
      { name: "Peacock Blue & Gold", hex: "#0E3B66", image: "assets/images/banarasi_blue.jpg", code: "PB-02" },
      { name: "Mustard Gold", hex: "#C59B27", image: "assets/images/chanderi_mustard.jpg", code: "MG-03" }
    ],
    mainImage: "assets/images/hero_banner.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/hero_banner.jpg",
      "assets/images/kanchipuram_weave_closeup.jpg",
      "assets/images/banarasi_blue.jpg"
    ],
    badges: ["✨ Silk Mark (SMOI) Certified", "🏅 100% Handloom Mark", "👰 Bridal Exclusive"],
    safetyBadges: ["100% Pure Mulberry Silk", "Zero Synthetic Polyester"],
    rating: 4.9,
    reviewCount: 48,
    description: "Handcrafted over 28 days by master weavers in Kanchipuram. Featuring authentic petni korvai interlocking joinery, pure tested gold zari brocade, and mythical Gandaberunda and Mayil motifs.",
    careInstructions: ["Strictly Dry Clean only", "Store wrapped in muslin cloth"],
    blouseOptions: {
      unstitched: { label: "Unstitched 80cm Running Blouse (Included)", extraPriceINR: 0 },
      basicStitched: { label: "Standard Tailored Blouse (Size 34-44)", extraPriceINR: 999 },
      designerBridal: { label: "Bridal Aari Hand Embroidery Custom Stitching", extraPriceINR: 3499 }
    },
    featured: true,
    trendingRank: 4
  },
  {
    id: "ST-BAN-002",
    title: "Varanasi Royal Katan Silk Banarasi Brocade Saree",
    subtitle: "Midnight Blue with Intricate Kadwa Silver & Gold Floral Jaal",
    department: "Women's Collection",
    subCategory: "Banarasi Silk Sarees",
    ageGroup: "Adults & Teens",
    fabric: "Banarasi Silk",
    fabricType: "100% Pure Katan Mulberry Silk",
    warpWeft: "Fine Organzine Silk Warp & Degummed Katan Weft",
    zariType: "Real Silver & Electroplated Antique Zari",
    threadCount: "240 EPI x 140 PPI",
    length: "6.3 Meters (Includes 80cm Brocade Blouse Piece)",
    weight: "720 grams",
    hsnCode: "50072010",
    gstRate: 5,
    priceINR: 28900,
    mrpINR: 36000,
    stock: 2,
    lowStockThreshold: 2,
    collections: ["Festive Silk 2026", "Pure Silks", "Bridal Trousseau", "Women's Ethnic"],
    occasion: "Wedding & Grand Celebration",
    technique: "Kadwa Hand-Weave",
    availableSizes: ["Free Size (6.3m with Blouse)"],
    colors: [
      { name: "Midnight Royal Blue", hex: "#16284F", image: "assets/images/banarasi_blue.jpg", code: "MB-01" }
    ],
    mainImage: "assets/images/banarasi_blue.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/banarasi_blue.jpg",
      "assets/images/kanchipuram_weave_closeup.jpg"
    ],
    badges: ["✨ Silk Mark (SMOI) Certified", "🏅 GI Tagged Authenticity"],
    safetyBadges: ["100% Pure Mulberry Silk", "Zero Synthetic Blends"],
    rating: 4.95,
    reviewCount: 36,
    description: "An heirloom masterpiece woven in Varanasi using the time-honored Kadwa technique where each motif is engraved individually without loose floating threads on the reverse.",
    careInstructions: ["Dry Clean only"],
    blouseOptions: {
      unstitched: { label: "Unstitched Brocade Blouse (Included)", extraPriceINR: 0 },
      basicStitched: { label: "Standard Tailored Blouse (Size 34-44)", extraPriceINR: 999 }
    },
    featured: true,
    trendingRank: 5
  },
  {
    id: "ST-LIN-003",
    title: "Aura Sage Organic Handloom Pure Linen Saree",
    subtitle: "100-Count French Flax Linen with Delicate Antique Gold Tissue Border",
    department: "Women's Collection",
    subCategory: "Linen & Cotton Sarees",
    ageGroup: "Adults & Teens",
    fabric: "Pure Linen",
    fabricType: "100% Certified Organic French Flax Linen",
    warpWeft: "100 Lea Pure Linen Warp & Weft",
    zariType: "Subtle Brushed Gold Tissue Zari Border",
    threadCount: "120 EPI x 110 PPI (Breezy & Ultra-Soft)",
    length: "6.5 Meters (Includes Contrast Organic Linen Blouse)",
    weight: "480 grams",
    hsnCode: "53091910",
    gstRate: 5,
    priceINR: 8490,
    mrpINR: 11200,
    stock: 8,
    lowStockThreshold: 3,
    collections: ["Pure Linen Summer", "Daily, School & Workwear", "Women's Ethnic"],
    occasion: "Daily, School & Workwear",
    technique: "Pit Loom Handloom",
    availableSizes: ["Free Size (6.5m with Blouse)"],
    colors: [
      { name: "Pastel Sage Green", hex: "#9CAF88", image: "assets/images/linen_sage.jpg", code: "SG-01" }
    ],
    mainImage: "assets/images/linen_sage.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/linen_sage.jpg",
      "assets/images/artisan_loom.jpg"
    ],
    badges: ["🌿 GOTS Certified Organic", "🏅 100% Handloom Mark"],
    safetyBadges: ["100% Natural Organic Flax", "Zero Microplastics"],
    rating: 4.8,
    reviewCount: 52,
    description: "Woven from supreme 100-lea European flax yarn, this organic linen saree softens with every wash, offering unmatched breathability and effortless elegance.",
    careInstructions: ["Gentle hand wash or dry clean"],
    blouseOptions: {
      unstitched: { label: "Unstitched Organic Linen Blouse (Included)", extraPriceINR: 0 }
    },
    featured: false,
    trendingRank: 6
  },
  {
    id: "ST-CHA-004",
    title: "Swarna Mayuri Chanderi Tissue Silk Saree",
    subtitle: "Lustrous Gold-Copper Tissue Weave with Hand-Woven Peacock Buttas",
    department: "Women's Collection",
    subCategory: "Chanderi Silk Sarees",
    ageGroup: "Adults & Teens",
    fabric: "Chanderi Tissue",
    fabricType: "Pure Silk Warp & Fine Zari Tissue Weft",
    warpWeft: "20/22 Denier Mulberry Silk x 1-Ply Zari",
    zariType: "Gold and Rose Gold Zari Blend",
    threadCount: "190 EPI x 120 PPI",
    length: "6.3 Meters (With Pure Silk Blouse Piece)",
    weight: "420 grams",
    hsnCode: "50072010",
    gstRate: 5,
    priceINR: 16800,
    mrpINR: 21500,
    stock: 4,
    lowStockThreshold: 2,
    collections: ["Festive Silk 2026", "Pure Silks", "Women's Ethnic"],
    occasion: "Birthday & Party Wear",
    technique: "Eknaliya Handloom Technique",
    availableSizes: ["Free Size (6.3m with Blouse)"],
    colors: [
      { name: "Mustard Gold & Copper", hex: "#C59B27", image: "assets/images/chanderi_mustard.jpg", code: "MC-01" }
    ],
    mainImage: "assets/images/chanderi_mustard.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/chanderi_mustard.jpg",
      "assets/images/kanchipuram_weave_closeup.jpg"
    ],
    badges: ["✨ Silk Mark (SMOI) Certified", "🏅 Craftmark Authenticated"],
    safetyBadges: ["100% Pure Silk Weft", "Skin-Safe Metallic Thread"],
    rating: 4.88,
    reviewCount: 29,
    description: "A luminous Chanderi tissue silk crafted with gossamer sheer brilliance. The iridescent reflection of metallic zari woven into fine silk gives a celestial glow in evening lights.",
    careInstructions: ["Dry Clean only"],
    featured: false,
    trendingRank: 7
  },
  {
    id: "ST-TUS-005",
    title: "Vriksha Heritage Hand-Painted Kalamkari Tussar Silk Saree",
    subtitle: "Raw Wild Tussar Silk with Natural Vegetable Dye Tree of Life Motifs",
    department: "Women's Collection",
    subCategory: "Tussar & Art Silks",
    ageGroup: "Adults & Teens",
    fabric: "Tussar Silk",
    fabricType: "100% Pure Wild Forest Tussar Silk",
    warpWeft: "Unbleached Natural Tussar Silk Reeled Yarns",
    zariType: "Natural Antique Muted Zari Border",
    threadCount: "160 EPI x 110 PPI",
    length: "6.4 Meters (Includes Hand-Painted Blouse Piece)",
    weight: "560 grams",
    hsnCode: "50072010",
    gstRate: 5,
    priceINR: 19500,
    mrpINR: 24000,
    stock: 3,
    lowStockThreshold: 2,
    collections: ["Festive Silk 2026", "Pure Silks", "Daily, School & Workwear", "Women's Ethnic"],
    occasion: "Daily, School & Workwear",
    technique: "Srikalahasti Pen Kalamkari Hand-Paint",
    availableSizes: ["Free Size (6.4m with Blouse)"],
    colors: [
      { name: "Raw Honey Beige & Indigo", hex: "#D8C2A7", image: "assets/images/tussar_kalamkari.jpg", code: "TB-01" }
    ],
    mainImage: "assets/images/tussar_kalamkari.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/tussar_kalamkari.jpg",
      "assets/images/artisan_loom.jpg"
    ],
    badges: ["✨ Silk Mark (SMOI) Certified", "🎨 100% Eco Natural Dye"],
    safetyBadges: ["Natural Vegetable Dyes Only", "Wild Organic Forest Silk"],
    rating: 4.92,
    reviewCount: 41,
    description: "Every stroke of this masterpiece is hand-drawn using bamboo kalam and natural vegetable dyes on rich raw textured wild forest Tussar silk.",
    careInstructions: ["Strictly Dry Clean only"],
    featured: false,
    trendingRank: 8
  },

  // ==========================================
  // 3. KIDS WEAR (GIRLS, 2 - 14 YEARS)
  // ==========================================
  {
    id: "ST-KDG-007",
    title: "Mayuri Rani Pink Girls Pure Silk Pattu Pavadai Set",
    subtitle: "Traditional Kanchipuram Brocade Temple Border with Scratch-Free Breathable Pure Cotton Lining",
    department: "Kids Wear (Girls)",
    subCategory: "Pattu Pavadai & Lehenga Choli",
    ageGroup: "2 - 14 Years",
    fabric: "Pure Kanchipuram Silk & Cotton Lining",
    fabricType: "Pure Silk Exterior with 100% Cotton Inner Layer",
    warpWeft: "2-Ply Mulberry Silk Warp & Pure Cotton Lining",
    zariType: "Tested Gold Zari Brocade",
    threadCount: "220 EPI x 120 PPI",
    length: "Stitched Skirt & Puff-Sleeve Blouse Set",
    weight: "380 grams",
    hsnCode: "62044220",
    gstRate: 5,
    priceINR: 8900,
    mrpINR: 11500,
    stock: 6,
    lowStockThreshold: 2,
    collections: ["Kids Wear", "Festive Silk 2026", "Family Combos"],
    occasion: "Birthday & Party Wear",
    technique: "Handloom Jacquard",
    availableSizes: [
      "Size 22 (2-3 Yrs / 85-95 cm)",
      "Size 26 (4-5 Yrs / 100-110 cm)",
      "Size 30 (6-8 Yrs / 115-125 cm)",
      "Size 34 (9-11 Yrs / 130-140 cm)",
      "Size 38 (12-14 Yrs / 145-155 cm)"
    ],
    colors: [
      { name: "Rani Pink & Gold Zari", hex: "#C2185B", image: "assets/images/kids_pattu_pavadai.jpg", code: "KP-01" }
    ],
    mainImage: "assets/images/kids_pattu_pavadai.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/kids_pattu_pavadai.jpg",
      "assets/images/family_matching_combo.jpg"
    ],
    badges: ["🛡️ Soft Inner-Lining Guarantee", "✨ Pure Silk Mark Certified", "👶 Child-Safe Nickel-Free Hooks"],
    safetyBadges: ["100% Skin-Friendly Scratch-Free Cotton Lining", "Azo-Free Baby-Safe Dyes"],
    rating: 4.95,
    reviewCount: 38,
    description: "Designed specifically for young girls with delicate skin. We line every pure silk lehenga skirt and puff-sleeve top with 100% ultra-soft combed cotton, preventing any zari itchiness or irritation during festivals, temple visits, and family celebrations.",
    careInstructions: ["Gentle dry clean or cold hand wash", "Iron on reverse side with low heat"],
    featured: true,
    trendingRank: 9
  },

  // ==========================================
  // 4. KIDS WEAR (BOYS, 2 - 14 YEARS)
  // ==========================================
  {
    id: "ST-KDB-009",
    title: "Yuvraj Royal Blue Silk Jacquard Boys Kurta & Dhoti Set",
    subtitle: "Rich Banarasi Silk Kurta with Gold Zari Dhoti & Soft Sweat-Absorbent Cotton Inner Lining",
    department: "Kids Wear (Boys)",
    subCategory: "Kurta Pyjama & Dhoti Sets",
    ageGroup: "2 - 14 Years",
    fabric: "Art Silk Jacquard with 100% Cotton Lining",
    fabricType: "Silk Brocade with Soft Cotton Underside",
    warpWeft: "Jacquard Weft with Cotton Voile Lining",
    zariType: "Fine Golden Zari Paisley Weave",
    threadCount: "200 EPI x 110 PPI",
    length: "Stitched Kurta Shirt + Ready-to-Wear Elasticated Dhoti Pants",
    weight: "320 grams",
    hsnCode: "62032200",
    gstRate: 5,
    priceINR: 5990,
    mrpINR: 7800,
    stock: 7,
    lowStockThreshold: 3,
    collections: ["Kids Wear", "Festive Silk 2026", "Family Combos"],
    occasion: "Birthday & Party Wear",
    technique: "Jacquard Weave with Tailored Elastic Waist",
    availableSizes: [
      "Size 22 (2-3 Yrs / 85-95 cm)",
      "Size 26 (4-5 Yrs / 100-110 cm)",
      "Size 30 (6-8 Yrs / 115-125 cm)",
      "Size 34 (9-11 Yrs / 130-140 cm)"
    ],
    colors: [
      { name: "Royal Peacock Blue & Gold", hex: "#1A365D", image: "assets/images/boys_kurta_dhoti.jpg", code: "BK-01" }
    ],
    mainImage: "assets/images/boys_kurta_dhoti.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/boys_kurta_dhoti.jpg",
      "assets/images/family_matching_combo.jpg"
    ],
    badges: ["🛡️ Soft Inner-Lining Guarantee", "⚡ Ready-to-Wear Elastic Dhoti", "👶 Skin-Friendly"],
    safetyBadges: ["100% Combed Cotton Lining", "No Scratchy Seams or Threads"],
    rating: 4.88,
    reviewCount: 27,
    description: "Makes dressing up boys hassle-free and comfortable. Features a pre-pleated, ready-to-wear elasticated dhoti pant with a soft breathable cotton inner lining so your boy stays happy and playful all day.",
    careInstructions: ["Gentle machine wash in laundry bag or hand wash"],
    featured: true,
    trendingRank: 10
  },

  // ==========================================
  // 5. MEN'S COLLECTION (TRADITIONAL & FORMAL)
  // ==========================================
  {
    id: "ST-MEN-008",
    title: "Rajkumar Pure Mulberry Silk Men's Wedding Shirt & Dhoti Set",
    subtitle: "Heavy Silk Full-Sleeve Kurta Shirt with Matching 8-Muzham Gold Zari Border Dhoti (Veshti) & Angavastram",
    department: "Men's Collection",
    subCategory: "Traditional Silk Shirts & Dhotis",
    ageGroup: "Adults & Teens",
    fabric: "100% Pure Mulberry Silk",
    fabricType: "Pure Silk (Woven in Kanchipuram)",
    warpWeft: "Compact 2-Ply Silk Weft",
    zariType: "Pure Antique Gold Tested Zari Border",
    threadCount: "260 EPI x 140 PPI",
    length: "Stitched Shirt (Size 38-46) + 4-Meter Dhoti (Veshti) + 2.25-Meter Angavastram",
    weight: "680 grams",
    hsnCode: "62059010",
    gstRate: 5,
    priceINR: 14500,
    mrpINR: 18000,
    stock: 5,
    lowStockThreshold: 2,
    collections: ["Men's Collection", "Bridal Trousseau", "Family Combos"],
    occasion: "Wedding & Grand Celebration",
    technique: "Pit Loom Weave",
    availableSizes: [
      "Size 38 (Medium / Chest 40 in)",
      "Size 40 (Large / Chest 42 in)",
      "Size 42 (XL / Chest 44 in)",
      "Size 44 (XXL / Chest 46 in)"
    ],
    colors: [
      { name: "Pure Silk Cream & Gold Zari", hex: "#FFF8DC", image: "assets/images/mens_silk_dhoti.jpg", code: "MS-01" }
    ],
    mainImage: "assets/images/mens_silk_dhoti.jpg",
    zoomImage: "assets/images/kanchipuram_weave_closeup.jpg",
    gallery: [
      "assets/images/mens_silk_dhoti.jpg",
      "assets/images/family_matching_combo.jpg"
    ],
    badges: ["✨ Silk Mark (SMOI) Certified", "🏅 100% Handloom Mark", "👔 Complete 3-Piece Wedding Set"],
    safetyBadges: ["100% Natural Silk", "Zero Synthetic Blends"],
    rating: 4.9,
    reviewCount: 31,
    description: "The definitive South Indian groom and wedding attire. Woven from supreme quality pure mulberry silk with an opulent 2-inch real gold tested zari temple border. Includes tailored silk shirt, 8-muzham dhoti, and matching angavastram shawl.",
    careInstructions: ["Professional Dry Clean only"],
    featured: true,
    trendingRank: 11
  },

  // ==========================================
  // 6. INFANTS & TODDLERS (0 - 2 YEARS)
  // ==========================================
  {
    id: "ST-INF-011",
    title: "Ayush Newborn Organic Muslin Cotton Jhabla & Swaddle Set",
    subtitle: "Pack of 4 Chemical-Free Organic Cotton Jhablas with 2 Layered Mulmul Swaddle Blankets",
    department: "Infants & Toddlers",
    subCategory: "Newborn Jhablas & Swaddle Cloths",
    ageGroup: "0 - 2 Years",
    fabric: "100% GOTS Certified Organic Muslin Cotton",
    fabricType: "Hypoallergenic Unbleached Combed Organic Cotton",
    warpWeft: "120s Superfine Organic Combed Cotton",
    zariType: "Zero Zari (100% Pure Soft Fabric)",
    threadCount: "180 EPI x 140 PPI (Feather-Soft)",
    length: "Pack of 4 Jhablas + 2 Full Size Muslin Swaddles (100x100 cm)",
    weight: "260 grams",
    hsnCode: "62092000",
    gstRate: 5,
    priceINR: 2490,
    mrpINR: 3200,
    stock: 14,
    lowStockThreshold: 4,
    collections: ["Infants & Toddlers", "Daily, School & Workwear"],
    occasion: "Daily, School & Workwear",
    technique: "Hand-Crafted Baby Seams",
    availableSizes: [
      "0 - 3 Months (Newborn)",
      "3 - 6 Months",
      "6 - 12 Months",
      "12 - 18 Months"
    ],
    colors: [
      { name: "Pastel Sunshine Yellow", hex: "#FFF9C4", image: "assets/images/infant_organic_jhabla.jpg", code: "NB-01" }
    ],
    mainImage: "assets/images/infant_organic_jhabla.jpg",
    zoomImage: "assets/images/infant_organic_jhabla.jpg",
    gallery: [
      "assets/images/infant_organic_jhabla.jpg"
    ],
    badges: ["🌿 100% GOTS Certified Organic", "👶 Pediatrician Recommended", "🍼 Hypoallergenic & Chemical-Free"],
    safetyBadges: ["100% Skin-Friendly Organic Cotton", "Tagless Neck & Flat Seams"],
    rating: 4.96,
    reviewCount: 56,
    description: "Crafted with the gentlest love for newborns. Woven from 100% certified organic mulmul cotton without toxic chemical dyes or harsh bleaches. Features flat-lock anti-scratch seams, tagless necks, and tie-up front closures.",
    careInstructions: ["Machine wash with baby-safe mild detergent", "Air dry in gentle morning sunlight"],
    featured: true,
    trendingRank: 12
  }
];

// Currencies and Exchange Rates
const CURRENCIES = {
  INR: { symbol: "₹", name: "Indian Rupee", rate: 1.0, flag: "🇮🇳" },
  USD: { symbol: "$", name: "US Dollar", rate: 0.012, flag: "🇺🇸" },
  GBP: { symbol: "£", name: "British Pound", rate: 0.0094, flag: "🇬🇧" },
  AED: { symbol: "AED ", name: "UAE Dirham", rate: 0.044, flag: "🇦🇪" },
  SGD: { symbol: "S$", name: "Singapore Dollar", rate: 0.016, flag: "🇸🇬" }
};

// Kids Age to Height/Size Chart Master
const KIDS_SIZE_CHART = [
  { age: "0-6 Months", heightRange: "55 - 65 cm", weightRange: "4 - 7 kg", recommendedSize: "Size 16 (0-6M)" },
  { age: "6-12 Months", heightRange: "65 - 75 cm", weightRange: "7 - 10 kg", recommendedSize: "Size 18 (6-12M)" },
  { age: "1-2 Years", heightRange: "75 - 85 cm", weightRange: "10 - 13 kg", recommendedSize: "Size 20 (1-2Y)" },
  { age: "2-3 Years", heightRange: "85 - 95 cm", weightRange: "13 - 15 kg", recommendedSize: "Size 22 (2-3Y)" },
  { age: "3-4 Years", heightRange: "95 - 105 cm", weightRange: "15 - 18 kg", recommendedSize: "Size 24 (3-4Y)" },
  { age: "4-5 Years", heightRange: "105 - 115 cm", weightRange: "18 - 21 kg", recommendedSize: "Size 26 (4-5Y)" },
  { age: "6-7 Years", heightRange: "115 - 125 cm", weightRange: "21 - 25 kg", recommendedSize: "Size 28 (6-7Y)" },
  { age: "8-9 Years", heightRange: "125 - 135 cm", weightRange: "25 - 30 kg", recommendedSize: "Size 30 (8-9Y)" },
  { age: "10-11 Years", heightRange: "135 - 145 cm", weightRange: "30 - 36 kg", recommendedSize: "Size 32 (10-11Y)" },
  { age: "12-14 Years", heightRange: "145 - 158 cm", weightRange: "36 - 45 kg", recommendedSize: "Size 34-36 (12-14Y)" }
];

// Initial Verified Customer Reviews & Family UGC Testimonials
const INITIAL_REVIEWS = [
  {
    id: "REV-101",
    productId: "ST-FAM-010",
    author: "Ranganathan & Meenakshi Family",
    location: "Bengaluru, Karnataka",
    rating: 5,
    verifiedBuyer: true,
    title: "The matching family bundle made our daughter's Ayushya Homam unforgettable!",
    comment: "We ordered the 4-piece Samanvaya family bundle. The colors matched 100% across my husband's silk shirt, my saree, and the kids' outfits! The cotton lining inside our 4-year-old daughter's pavadai was so soft—no complaints of itching at all.",
    date: "August 18, 2026",
    softnessScore: "5/5 (Kid-Safe)",
    colorAccuracy: "100% Exact to Screen",
    drapeScore: "Royal Family Harmony",
    avatar: "assets/images/family_matching_combo.jpg",
    photos: ["assets/images/family_matching_combo.jpg"]
  },
  {
    id: "REV-102",
    productId: "ST-KDG-007",
    author: "Deepa Sridharan",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    verifiedBuyer: true,
    title: "Finally a pure silk pattu pavadai that doesn't scratch my 5-year-old!",
    comment: "The soft cotton inner lining guarantee is 100% real. The zaris are magnificent and rich, while the inside is pure gentle cotton. She wore it for 6 hours straight without any discomfort.",
    date: "August 10, 2026",
    softnessScore: "5/5 (Scratch-Free)",
    colorAccuracy: "Rich Rani Pink",
    drapeScore: "Puff Sleeve Elegance",
    avatar: "assets/images/kids_pattu_pavadai.jpg",
    photos: ["assets/images/kids_pattu_pavadai.jpg"]
  },
  {
    id: "REV-103",
    productId: "ST-MEN-008",
    author: "Karthik Subramanian",
    location: "Hyderabad & San Jose (NRI Order)",
    rating: 5,
    verifiedBuyer: true,
    title: "Pure mulberry silk wedding shirt and dhoti of supreme quality.",
    comment: "Wore this for my brother's wedding. The silk weight and luster received compliments all evening. Delivered to USA via DHL in pristine gift box packaging.",
    date: "August 02, 2026",
    softnessScore: "5/5",
    colorAccuracy: "Pure Cream Gold",
    drapeScore: "Dignified Groom Fall",
    avatar: "assets/images/mens_silk_dhoti.jpg",
    photos: ["assets/images/mens_silk_dhoti.jpg"]
  }
];

// Initial Orders
const INITIAL_ORDERS = [
  {
    orderId: "ST-ORD-2026-9812",
    date: "2026-08-23 14:30",
    customer: {
      name: "Meenakshi Sundaram",
      email: "meenakshi.s@gmail.com",
      phone: "+91 98401 23456",
      address: "Flat 4B, Temple Towers, Mylapore, Chennai, Tamil Nadu - 600004",
      gstin: "33AABCS1429B1Z8"
    },
    items: [
      {
        productId: "ST-FAM-010",
        title: "Samanvaya 4-Piece Grand Muhurtham Family Matching Silk Bundle",
        color: "Crimson & Pure Gold",
        hsnCode: "50072010",
        qty: 1,
        unitPriceINR: 58500,
        size: "Custom Family Bundle (M/L/Kids 4Y & 6Y)",
        giftWrap: true,
        giftMessage: "With heartfelt blessings on your wedding anniversary!",
        totalINR: 58500
      }
    ],
    subtotalINR: 58500,
    discountINR: 5850,
    couponCode: "HERITAGE10",
    gstINR: 2632,
    shippingINR: 0,
    totalAmountINR: 55282,
    paymentMethod: "UPI (GPay)",
    paymentStatus: "Paid",
    fulfillmentStatus: "Packed",
    courier: "BlueDart Express",
    trackingNumber: "BD99281746201IN",
    sheetSyncStatus: "Synced",
    sheetSyncTime: "2026-08-23 14:30",
    notes: "Festive Gift Wrapping requested with handwritten card."
  },
  {
    orderId: "ST-ORD-2026-9811",
    date: "2026-08-22 11:15",
    customer: {
      name: "Radhika Sharma",
      email: "radhika.sharma@yahoo.com",
      phone: "+91 98110 87654",
      address: "Villa 12, Golf Links, New Delhi - 110003",
      gstin: ""
    },
    items: [
      {
        productId: "ST-KDG-007",
        title: "Mayuri Rani Pink Girls Pure Silk Pattu Pavadai Set",
        color: "Rani Pink & Gold Zari",
        hsnCode: "62044220",
        qty: 1,
        unitPriceINR: 8900,
        size: "Size 26 (4-5 Yrs)",
        totalINR: 8900
      }
    ],
    subtotalINR: 8900,
    discountINR: 0,
    gstINR: 445,
    shippingINR: 0,
    totalAmountINR: 9345,
    paymentMethod: "Credit Card (HDFC Visa)",
    paymentStatus: "Paid",
    fulfillmentStatus: "Dispatched",
    courier: "Delhivery Logistics",
    trackingNumber: "DEL20268839201",
    sheetSyncStatus: "Synced",
    sheetSyncTime: "2026-08-22 11:15",
    notes: "Fragile Silk packaging requested."
  }
];

// Initial Restock Subscribers
const INITIAL_SUBSCRIBERS = [
  {
    id: "SUB-01",
    productId: "ST-BAN-002",
    productTitle: "Varanasi Royal Katan Silk Banarasi Brocade Saree",
    customerName: "Kavitha Reddy",
    email: "kavitha.reddy@gmail.com",
    phone: "+91 99887 66554",
    preferredColor: "Midnight Royal Blue",
    requestedDate: "2026-08-20",
    status: "Pending Restock"
  }
];

// Master B2B Wholesale & Bulk Orders Dataset
const INITIAL_BULK_ORDERS = [
  {
    bulkOrderId: "ST-BLK-2026-001",
    clientCompany: "Coimbatore Handloom Store Pvt Ltd",
    contactPerson: "S. Vijayaraghavan",
    phone: "+91 94432 18902",
    email: "wholesale@coimbatoresilks.in",
    gstin: "33AAAC1234F1Z5",
    address: "142 Crosscut Road, Gandhipuram, Coimbatore, Tamil Nadu - 641012",
    orderType: "Wholesale",
    itemsDescription: "40x Samanvaya Grand Muhurtham Family Matching Sets (Crimson & Gold); 60x Pure Kanchipuram Bridal Silk Sarees",
    totalPieces: 100,
    subtotalINR: 3120000,
    gstINR: 156000,
    totalAmountINR: 3276000,
    advancePaidINR: 1500000,
    balanceDueINR: 1776000,
    paymentStatus: "Advance Received",
    orderStatus: "Under Production",
    orderDate: "2026-08-25",
    deliveryDeadline: "2026-09-22",
    priority: "High Priority",
    productionUnit: "Loom Shed #3 (Kanchipuram Master Weavers)",
    notes: "Custom gold zari border motif with certified Silk Mark tags on every set."
  },
  {
    bulkOrderId: "ST-BLK-2026-002",
    clientCompany: "Sri Padmavathi Kalyana Mandapam (Wedding Troupe)",
    contactPerson: "K. S. Narayanan",
    phone: "+91 98410 77651",
    email: "wedding.narayanan@gmail.com",
    gstin: "URP-B2C-BULK",
    address: "Sri Padmavathi Kalyana Mandapam, T. Nagar, Chennai, Tamil Nadu - 600017",
    orderType: "Wedding Bulk",
    itemsDescription: "35x Pithamaha Father & Son Royal Cream Silk Pairs; 50x Mayuri Rani Pink Girls Pure Silk Pattu Pavadai Sets",
    totalPieces: 85,
    subtotalINR: 882500,
    gstINR: 44125,
    totalAmountINR: 926625,
    advancePaidINR: 926625,
    balanceDueINR: 0,
    paymentStatus: "Fully Paid",
    orderStatus: "Ready to Ship",
    orderDate: "2026-08-28",
    deliveryDeadline: "2026-09-18",
    priority: "Urgent",
    productionUnit: "Ready Box Packaging (Warehouse 1)",
    notes: "Festive silk gifting boxes and individual name tags attached."
  },
  {
    bulkOrderId: "ST-BLK-2026-003",
    clientCompany: "Sankara Heritage Boutique Bengaluru",
    contactPerson: "Ananya Deshmukh",
    phone: "+91 98801 34980",
    email: "orders@sankaraheritage.com",
    gstin: "29AABCS8819D1Z4",
    address: "88 Commercial Street, Shivajinagar, Bengaluru, Karnataka - 560001",
    orderType: "Boutique Reseller",
    itemsDescription: "25x Varanasi Royal Katan Silk Banarasi Brocade Sarees; 30x Samanvaya 4-Piece Family Silk Sets",
    totalPieces: 55,
    subtotalINR: 1980000,
    gstINR: 99000,
    totalAmountINR: 2079000,
    advancePaidINR: 1000000,
    balanceDueINR: 1079000,
    paymentStatus: "Advance Received",
    orderStatus: "Dispatched",
    orderDate: "2026-09-02",
    deliveryDeadline: "2026-09-25",
    priority: "Standard",
    productionUnit: "VRL Logistics (LR: VRL-BLR-88391)",
    notes: "Courier dispatched via express freight with insured transit."
  },
  {
    bulkOrderId: "ST-BLK-2026-004",
    clientCompany: "Sundaram Corporate Gifting & Trust",
    contactPerson: "M. Soundararajan",
    phone: "+91 97909 66120",
    email: "gifting@sundaramtrust.org",
    gstin: "33AABCT9981E1ZR",
    address: "Sundaram Towers, Anna Salai, Chennai, Tamil Nadu - 600002",
    orderType: "Corporate Gifting",
    itemsDescription: "120x Pure Tussar Handloom Dupattas & Stoles with Hand-Embroidered Borders",
    totalPieces: 120,
    subtotalINR: 420000,
    gstINR: 21000,
    totalAmountINR: 441000,
    advancePaidINR: 200000,
    balanceDueINR: 241000,
    paymentStatus: "Advance Received",
    orderStatus: "Under Production",
    orderDate: "2026-09-05",
    deliveryDeadline: "2026-09-30",
    priority: "Standard",
    productionUnit: "Loom Shed #1 (Tussar Weavers)",
    notes: "Corporate embossed emblem on handmade wooden gift boxes."
  }
];

// Default Storefront Bulk Orders Session Settings (Controlled by Admin Master Switch)
const DEFAULT_BULK_SETTINGS = {
  enabled: true,
  title: "Wholesale & Direct Pitloom Bulk Orders",
  badge: "🏬 B2B DIRECT WEAVERS WHOLESALE",
  headline: "Handloom Bulk Orders & Wedding Troupe Ensembles",
  subtitle: "Direct from our Kanchipuram master weaving pit-looms. Specially curated bulk lots, certified pure silks, wholesale pricing, and dedicated relationship draper for wedding planners, dance troupes, boutiques, and corporate institutions.",
  whatsappNumber: "916381265149",
  minOrderNotice: "Minimum Order Quantity applies. Custom colorway dyeing available for lots over 25 pieces."
};

// Default Bulk Packages / Offerings published on the website
const DEFAULT_BULK_PACKAGES = [
  {
    id: "BLK-PKG-01",
    title: "Grand Muhurtham Wedding Bridal Trousseau Lot",
    category: "Wedding Troupe",
    badge: "👑 Bridal Troupe Favorite",
    moq: 15,
    unitLabel: "Sets",
    wholesalePrice: 8500,
    retailMrp: 17000,
    discountPercent: 50,
    timeline: "12-15 Working Days",
    fabric: "100% Pure Kanchipuram Mulberry Silk with Korvai Interlocking Weave & Tested Silver-Gold Zari",
    description: "Authentic Kanchipuram bridal silk sarees with heavy contrast zari pallu and rich borders. Synchronized ritual dye lots suitable for bridal entourage, family elders, and reception celebrations.",
    inclusions: "15 Pure Silk Sarees + Matching Unstitched Silk Blouse Pieces + Silk Mark Tags + Luxury Rigid Gift Boxes",
    image: "assets/images/family_matching_combo.jpg",
    isActive: true
  },
  {
    id: "BLK-PKG-02",
    title: "Kanchipuram Pure Silk Sarees Boutique Reseller Pack",
    category: "Boutique Reseller",
    badge: "🔥 Reseller Bestseller",
    moq: 25,
    unitLabel: "Pieces",
    wholesalePrice: 4800,
    retailMrp: 10500,
    discountPercent: 54,
    timeline: "7-10 Working Days",
    fabric: "Pure Mulberry Soft Silk with Certified SMOI Silk Mark & Tested Zari Borders",
    description: "Curated assortment of contemporary temple motifs and traditional korvai designs for retail boutiques and ethnic showrooms across India and worldwide export.",
    inclusions: "Assorted vibrant jewel colors (Crimson, Mustard, Peacock Blue, Emerald Green) + Individual Barcoded Pouches + Silk Mark Certification",
    image: "assets/images/kanchipuram_crimson.webp",
    isActive: true
  },
  {
    id: "BLK-PKG-03",
    title: "Royal Father & Son Handloom Dhoti & Angavastram Troupe Set",
    category: "Corporate Gifting",
    badge: "🏛️ Temple & Troupe Set",
    moq: 20,
    unitLabel: "Pairs",
    wholesalePrice: 2400,
    retailMrp: 5200,
    discountPercent: 54,
    timeline: "5-7 Working Days",
    fabric: "Pure Mulberry Handloom Silk (8 Muzham double dhoti + 4 Muzham matching angavastram)",
    description: "Traditional pure handloom white & cream silk dhotis woven with genuine temple gold zari borders. Ideal for music academies, wedding mandapam troupes, and traditional festivals.",
    inclusions: "20 Sets of 8-Muzham Pure Silk Dhoti & Matching Angavastram Shawl + Protective Box Packaging",
    image: "assets/images/men_dhoti_angavastram.webp",
    isActive: true
  },
  {
    id: "BLK-PKG-04",
    title: "Girls Heritage Pattu Pavadai Handloom Boutique Lot",
    category: "Boutique Reseller",
    badge: "✨ Scratch-Free Guarantee",
    moq: 30,
    unitLabel: "Sets",
    wholesalePrice: 1650,
    retailMrp: 3600,
    discountPercent: 54,
    timeline: "7-10 Working Days",
    fabric: "Pure Handloom Art Silk with Breathable 100% Organic Soft Cotton Inner Lining",
    description: "Comfort-engineered traditional South Indian pattu pavadai lehenga choli sets for girls aged 1 to 14 years. Features soft cotton lining preventing zari itchiness during long ceremonies.",
    inclusions: "30 Sets in assorted age sizes (2-4Y, 4-6Y, 6-8Y, 8-10Y, 10-14Y) with matching ready-to-wear contrast blouses",
    image: "assets/images/girls_pattu_pavadai.webp",
    isActive: true
  }
];

