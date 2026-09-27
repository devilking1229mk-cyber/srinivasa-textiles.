// ==========================================================================
// SRINIVASA TEXTILES - SCROLL REVEAL & MICRO-ANIMATION ENGINE
// Hardware-accelerated, mobile-friendly 60fps animations & counters
// ==========================================================================

(function () {
  'use strict';

  // State
  let observer = null;
  let statsAnimated = false;

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  function initScrollAnimations() {
    setupReadingProgressBar();
    setupBackToTopButton();
    prepareElementsForScrollReveal();
    initIntersectionObserver();
    observeDynamicGrids();

    // Listen for site opening preloader completion
    window.addEventListener('siteOpened', () => {
      // Trigger check for currently visible items
      checkInitialViewportElements();
    });

    // Run immediate check in case preloader was already dismissed or skipped
    setTimeout(checkInitialViewportElements, 150);
  }

  // ==========================================================================
  // 1. TOP GOLD SHIMMER READING PROGRESS BAR
  // ==========================================================================
  function setupReadingProgressBar() {
    if (document.getElementById('scrollProgressBar')) return;

    const container = document.createElement('div');
    container.className = 'scroll-progress-container';
    container.setAttribute('aria-hidden', 'true');

    const bar = document.createElement('div');
    bar.id = 'scrollProgressBar';
    bar.className = 'scroll-progress-bar';

    container.appendChild(bar);
    document.body.prepend(container);

    let progressTicking = false;
    window.addEventListener('scroll', () => {
      if (!progressTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (docHeight > 0) {
            const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
            bar.style.width = pct + '%';
          }
          progressTicking = false;
        });
        progressTicking = true;
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 2. FLOATING BACK-TO-TOP BUTTON
  // ==========================================================================
  function setupBackToTopButton() {
    if (document.getElementById('backToTopBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.title = 'Back to Top';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    `;

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    document.body.appendChild(btn);

    let bttTicking = false;
    window.addEventListener('scroll', () => {
      if (!bttTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollY > 340) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          bttTicking = false;
        });
        bttTicking = true;
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 3. AUTOMATIC ELEMENT TAGGING FOR SCROLL REVEALS
  // ==========================================================================
  function prepareElementsForScrollReveal() {
    // Section Headers
    document.querySelectorAll('.section-header').forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
    });

    // Hero content items
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const heroPill = heroContent.querySelector('.hero-pill');
      const heroTitle = heroContent.querySelector('.hero-title');
      const heroDesc = heroContent.querySelector('.hero-desc');
      const heroStats = heroContent.querySelector('.hero-stats-row');

      if (heroPill) heroPill.classList.add('reveal-on-scroll');
      if (heroTitle) heroTitle.classList.add('reveal-on-scroll');
      if (heroDesc) heroDesc.classList.add('reveal-on-scroll');
      if (heroStats) heroStats.classList.add('stagger-reveal');
    }

    // Building Showcase
    const buildingGrid = document.querySelector('.building-showcase-grid');
    if (buildingGrid) {
      const media = buildingGrid.querySelector('.building-media-card');
      const content = buildingGrid.querySelector('.building-content');
      if (media) media.classList.add('reveal-fade-left');
      if (content) content.classList.add('reveal-fade-right');
    }

    // Founder Showcase
    const ownerGrid = document.querySelector('.owner-showcase-grid');
    if (ownerGrid) {
      const media = ownerGrid.querySelector('.owner-media-box');
      const content = ownerGrid.querySelector('.owner-content');
      if (media) media.classList.add('reveal-fade-left');
      if (content) content.classList.add('reveal-fade-right');
    }

    // Heritage Story
    const heritageGrid = document.querySelector('.heritage-story-grid');
    if (heritageGrid) {
      const media = heritageGrid.querySelector('.heritage-media-box');
      const content = heritageGrid.querySelector('.heritage-content');
      const pillars = heritageGrid.querySelector('.heritage-pillars');
      if (media) media.classList.add('reveal-zoom-in');
      if (content) content.classList.add('reveal-on-scroll');
      if (pillars) pillars.classList.add('stagger-reveal');
    }

    // Explore CTA Card
    const exploreCta = document.querySelector('.explore-cta-card');
    if (exploreCta) {
      exploreCta.classList.add('reveal-zoom-in');
    }

    // Gender Gateways Grid
    const gatewaysGrid = document.querySelector('.gender-gateways-grid');
    if (gatewaysGrid) {
      gatewaysGrid.classList.add('stagger-reveal');
    }

    // Festive Vouchers Grid
    const vouchersGrid = document.querySelector('.festive-vouchers-grid');
    if (vouchersGrid) {
      vouchersGrid.classList.add('stagger-reveal');
    }

    // Customer Reviews Grid
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (reviewsGrid) {
      reviewsGrid.classList.add('stagger-reveal');
    }

    // Footer columns
    const footerGrid = document.querySelector('.footer-grid');
    if (footerGrid) {
      footerGrid.classList.add('stagger-reveal');
    }
  }

  // ==========================================================================
  // 4. INTERSECTION OBSERVER REVEAL CONTROLLER
  // ==========================================================================
  function initIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    };

    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('revealed');

          // If this is the hero stats row, animate numbers count up!
          if (el.classList.contains('hero-stats-row') || el.closest('.hero-stats-row')) {
            animateHeroStats();
          }

          // Unobserve once revealed to keep performance super high
          obs.unobserve(el);
        }
      });
    }, options);

    // Observe all tagged reveal targets
    registerTargets();
  }

  function registerTargets() {
    if (!observer) return;
    const selectors = [
      '.reveal-on-scroll',
      '.reveal-fade-left',
      '.reveal-fade-right',
      '.reveal-zoom-in',
      '.stagger-reveal'
    ];

    document.querySelectorAll(selectors.join(', ')).forEach((el) => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });
  }

  function checkInitialViewportElements() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.reveal-on-scroll, .reveal-fade-left, .reveal-fade-right, .reveal-zoom-in, .stagger-reveal').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh - 20) {
        el.classList.add('revealed');
        if (el.classList.contains('hero-stats-row') || el.closest('.hero-stats-row')) {
          animateHeroStats();
        }
      }
    });
  }

  // ==========================================================================
  // 5. ANIMATED NUMBER COUNTERS FOR HERO STATS
  // ==========================================================================
  function animateHeroStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const statItems = document.querySelectorAll('.hero-stat-item .hero-stat-number');
    statItems.forEach((statEl) => {
      const originalText = statEl.textContent.trim();

      // Extract number & format (e.g., "48+ Years", "10,000+", "100% SMOI", "50,000+")
      const match = originalText.match(/([\d,]+)/);
      if (!match) return;

      const numStr = match[1].replace(/,/g, '');
      const targetVal = parseInt(numStr, 10);
      if (isNaN(targetVal)) return;

      const prefix = originalText.slice(0, match.index);
      const suffix = originalText.slice(match.index + match[0].length);
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * targetVal);

        const formatted = currentVal.toLocaleString('en-IN');
        statEl.textContent = `${prefix}${formatted}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          statEl.textContent = originalText;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ==========================================================================
  // 6. DYNAMIC PRODUCTS GRID MUTATION OBSERVER (For filter & category changes)
  // ==========================================================================
  function observeDynamicGrids() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const gridObserver = new MutationObserver((mutations) => {
      let hasNewCards = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          hasNewCards = true;
        }
      });

      if (hasNewCards) {
        animateProductCards(productsGrid);
      }
    });

    gridObserver.observe(productsGrid, { childList: true });

    // Initial run if already populated
    animateProductCards(productsGrid);
  }

  function animateProductCards(container) {
    const cards = container.querySelectorAll('.product-card:not(.animate-in)');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${Math.min(index * 0.05, 0.6)}s`;
      card.classList.add('animate-in');
    });
  }

  // Expose global helper if storefront.js needs to refresh animations manually
  window.refreshScrollAnimations = function () {
    prepareElementsForScrollReveal();
    registerTargets();
    checkInitialViewportElements();
    const grid = document.getElementById('productsGrid');
    if (grid) animateProductCards(grid);
  };

})();
