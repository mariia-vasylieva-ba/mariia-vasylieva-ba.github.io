/* Mariia Vasylieva — portfolio interactions */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var toggle = document.getElementById("theme-toggle");

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateToggleLabel() {
    if (!toggle) return;
    toggle.setAttribute(
      "aria-label",
      currentTheme() === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      if (next === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode etc. */ }
      updateToggleLabel();
    });
    updateToggleLabel();
  }

  /* ---------- Sticky header border on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-triggered reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Tile cursor highlight ---------- */
  if (!reducedMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tile").forEach(function (tile) {
      tile.addEventListener("mousemove", function (e) {
        var rect = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        tile.style.setProperty("--my", (e.clientY - rect.top) + "px");
      });
    });
  }

  /* ---------- Portrait fallback if the photo file is missing ---------- */
  var img = document.getElementById("portrait-img");
  var portrait = document.getElementById("portrait");
  if (img && portrait) {
    img.addEventListener("error", function () {
      portrait.classList.add("no-photo");
    });
    // Handle the case where the error fired before this script ran
    if (img.complete && img.naturalWidth === 0) {
      portrait.classList.add("no-photo");
    }
  }
})();
