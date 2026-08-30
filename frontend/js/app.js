// Main Application Controller & Bootloader
// Srinivasa Textiles Multi-Gender E-Commerce Platform

// ==========================================================================
// ROYAL OPENING LOGO ANIMATION & SPLASH ENGINE
// ==========================================================================
function initOpeningLogoAnimation(forceReplay = false) {
  const preloader = document.getElementById("sitePreloader");
  if (!preloader) return;

  // If user is navigating back between pages in the same session, enter seamlessly
  if (!forceReplay && sessionStorage.getItem("st_intro_seen") === "true") {
    preloader.style.display = "none";
    document.body.classList.remove("preloader-active");
    window.dispatchEvent(new CustomEvent("siteOpened"));
    return;
  }

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
    { pct: 100, text: "✨ Heritage Weave Complete • Tap to Enter", time: 1500 }
  ];

  let isDismissed = false;

  const dismissPreloader = () => {
    if (isDismissed) return;
    isDismissed = true;
    sessionStorage.setItem("st_intro_seen", "true");

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
    }, step.time);
  });

  // ENTER STORE on button click
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

document.addEventListener("DOMContentLoaded", () => {
  // Start Opening Logo Animation
  initOpeningLogoAnimation();

  // Header Scroll Shadow Effect
  const header = document.getElementById("mainHeader");
  window.addEventListener("scroll", () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
  });

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
});

