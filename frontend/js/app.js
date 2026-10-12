// Main Application Controller & Bootloader
// Srinivasa Textiles Multi-Gender E-Commerce Platform

// ==========================================================================
// ROYAL OPENING LOGO ANIMATION & SPLASH ENGINE
// ==========================================================================
function isPageReload() {
  try {
    const navEntries = performance.getEntriesByType && performance.getEntriesByType("navigation");
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type === "reload";
    }
    if (window.performance && window.performance.navigation) {
      return window.performance.navigation.type === 1; // TYPE_RELOAD
    }
  } catch (e) {
    console.warn("Navigation timing check error:", e);
  }
  return false;
}

function initOpeningLogoAnimation(forceReplay = false) {
  const preloader = document.getElementById("sitePreloader");
  if (!preloader) return;

  // Check if head already flagged to skip for this single internal navigation
  const isSkipActive = !forceReplay && document.documentElement.classList.contains("st-preloader-skip");
  if (isSkipActive) {
    document.documentElement.classList.remove("st-preloader-skip");
    sessionStorage.removeItem("st_skip_intro_once");
    preloader.style.display = "none";
    document.body.classList.remove("preloader-active");
    window.dispatchEvent(new CustomEvent("siteOpened"));
    return;
  }

  // Active opening sequence (initial visit or page refresh): ALWAYS PLAY
  sessionStorage.removeItem("st_skip_intro_once");
  document.documentElement.classList.remove("st-preloader-skip");
  preloader.style.display = "flex";
  preloader.classList.remove("fade-out", "curtain-open");
  document.body.classList.add("preloader-active");

  const progressFill = document.getElementById("preloaderProgressFill");
  const statusText = document.getElementById("preloaderStatusText");
  const enterBtn = document.getElementById("preloaderEnterBtn") || document.getElementById("preloaderSkipBtn");

  if (progressFill) progressFill.style.width = "0%";
  if (statusText) statusText.textContent = "Weaving Pure Heritage Silk...";

  const milestones = [
    { pct: 30, text: "Spun from Pure Mulberry Silk...", time: 300 },
    { pct: 65, text: "Weaving Zari Borders & Warp...", time: 700 },
    { pct: 90, text: "Silk Mark (SMOI) Authenticated...", time: 1100 },
    { pct: 100, text: "✨ Heritage Weave Complete • Click ENTER STORE to Explore", time: 1400 }
  ];

  let isDismissed = false;

  const dismissPreloader = () => {
    if (isDismissed) return;
    isDismissed = true;

    if (progressFill) progressFill.style.width = "100%";
    if (statusText) statusText.textContent = "Entering Srinivasa Textiles...";

    // Step 1: Smooth content fade & subtle scale
    preloader.classList.add("fade-out");

    // Step 2: Velvet curtain split reveal
    setTimeout(() => {
      preloader.classList.add("curtain-open");
    }, 200);

    // Step 3: Cleanup and unlock scrolling
    setTimeout(() => {
      document.body.classList.remove("preloader-active");
      preloader.style.display = "none";

      // Dispatch custom event for page hero animations
      window.dispatchEvent(new CustomEvent("siteOpened"));
    }, 950);
  };

  // Run progress sequence to ready state
  milestones.forEach((step) => {
    setTimeout(() => {
      if (isDismissed) return;
      if (progressFill) progressFill.style.width = `${step.pct}%`;
      if (statusText) statusText.textContent = step.text;
      if (step.pct === 100 && enterBtn) {
        enterBtn.classList.add("ready-pulse");
      }
    }, step.time);
  });

  // STRICT REQUIREMENT: DO NOT auto-reveal. The store ONLY opens when the user clicks ENTER STORE!
  if (enterBtn) {
    enterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismissPreloader();
    });
  }

  // Also support Keyboard Enter key to enter
  const handleKeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (!isDismissed) {
        dismissPreloader();
        window.removeEventListener("keydown", handleKeydown);
      }
    }
  };
  window.addEventListener("keydown", handleKeydown);
}

// Global helper to replay intro animation if desired
window.replayIntroLogoAnimation = function () {
  initOpeningLogoAnimation(true);
};

function initApp() {
  // Start Opening Logo Animation
  initOpeningLogoAnimation();

  // Header Scroll Shadow Effect (Harmonized with storefront.js)
  const header = document.getElementById("mainHeader");
  let appHeaderTicking = false;
  window.addEventListener("scroll", () => {
    if (!appHeaderTicking) {
      requestAnimationFrame(() => {
        if (header) {
          const y = window.scrollY;
          if (y > 85) header.classList.add("scrolled");
          else if (y < 25) header.classList.remove("scrolled");
        }
        appHeaderTicking = false;
      });
      appHeaderTicking = true;
    }
  }, { passive: true });

  // Top Banner Quotes Rotation
  const quoteTextEl = document.getElementById("topQuoteText");
  if (quoteTextEl) {
    const quotes = [
      "Every thread woven with pure devotion, every saree a timeless family legacy of love & tradition.",
      "Pure Silk Mark Certified Purity • Crafted by Master Weavers with authentic zari and heirloom grace.",
      "Draping generations in royal elegance and handloom perfection since 1978.",
      "Where pure Kanchipuram mulberry silk meets traditional south-Indian weaving artistry."
    ];
    let quoteIndex = 0;
    setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      quoteTextEl.style.opacity = "0";
      quoteTextEl.style.transition = "opacity 0.4s ease";
      setTimeout(() => {
        quoteTextEl.textContent = quotes[quoteIndex];
        quoteTextEl.style.opacity = "1";
      }, 400);
    }, 6000);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// ==========================================================================
// INSTANT SPECULATIVE PREFETCHER & ZERO-LAG SMOOTH NAVIGATION
// Pre-caches destination pages on hover/touch for instant 0ms load
// ==========================================================================
(function initZeroLagPrefetchEngine() {
  const prefetched = new Set();
  function prefetch(url) {
    if (!url || prefetched.has(url)) return;
    prefetched.add(url);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    link.as = "document";
    document.head.appendChild(link);
  }

  // Preload on idle
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      prefetch(window.location.pathname.includes("shop.html") ? "index.html" : "shop.html");
    });
  } else {
    setTimeout(() => {
      prefetch(window.location.pathname.includes("shop.html") ? "index.html" : "shop.html");
    }, 1200);
  }

  // Preload immediately on pointer hover or touch start
  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest("a[href*='shop.html'], [onclick*='shop.html'], [data-tab-action='shop'], [data-page]");
    if (el) prefetch("shop.html");
  }, { passive: true });

  document.addEventListener("touchstart", (e) => {
    const el = e.target.closest("a[href*='shop.html'], [onclick*='shop.html'], [data-tab-action='shop'], [data-page]");
    if (el) prefetch("shop.html");
  }, { passive: true });

  // Intercept clicks leading to shop.html or index.html for a silky smooth fade transition
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link || link.target === "_blank") return;
    const href = link.getAttribute("href");
    if (!href) return;

    if (href.startsWith("shop.html") && !window.location.pathname.includes("shop.html")) {
      e.preventDefault();
      document.body.classList.add("page-transitioning");
      setTimeout(() => {
        window.location.href = href;
      }, 50);
    } else if (href === "index.html" && window.location.pathname.includes("shop.html")) {
      e.preventDefault();
      sessionStorage.setItem("st_skip_intro_once", "true");
      document.body.classList.add("page-transitioning");
      setTimeout(() => {
        window.location.href = href;
      }, 50);
    }
  });
})();

