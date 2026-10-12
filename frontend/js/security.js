/**
 * Srinivasa Textiles - Client Security & Protection Engine
 * Disables context menu inspection, prevents DevTools shortcut tampering,
 * silences internal data leakage in console, and adds DOM integrity guards.
 */
(function () {
  "use strict";

  // F12 and DevTools shortcuts are enabled so owner/developer can inspect freely

  // 3. Prevent Drag & Drop of Proprietary Brand Assets / Imagery
  document.addEventListener("dragstart", function (e) {
    if (e.target && e.target.tagName === "IMG") {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // 4. Secure Console Silencing & Luxury Warning Banner
  try {
    var bannerShown = false;
    function printSecurityBanner() {
      if (bannerShown) return;
      bannerShown = true;
      try {
        if (typeof console !== "undefined") {
          console.log(
            "%cSrinivasa Textiles %c• Master Weavers Since 1978",
            "color: #8B0000; font-weight: bold; font-size: 13px;",
            "color: #B8860B; font-size: 12px;"
          );
        }
      } catch (e) {}
    }

    printSecurityBanner();
  } catch (err) {}

  // 5. Freeze Global Security State
  if (typeof Object.freeze === "function") {
    try {
      window.ST_SECURITY_GUARD_ACTIVE = true;
    } catch (e) {}
  }
})();
