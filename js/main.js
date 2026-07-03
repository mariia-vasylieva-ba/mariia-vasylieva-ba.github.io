/* Mariia Vasylieva — portfolio v2 interactions
   Progressive: everything degrades gracefully if GSAP/Lenis fail to load,
   and all motion is skipped under prefers-reduced-motion. */
(function () {
  "use strict";

  var html = document.documentElement;
  html.classList.add("js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) html.classList.add("no-motion");

  var hasGsap = typeof window.gsap !== "undefined";
  var hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";
  var useMotion = !reducedMotion && hasGsap && hasST;

  if (hasGsap && hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Theme toggle ---------- */
  var toggle = document.getElementById("theme-toggle");

  function currentTheme() {
    return html.getAttribute("data-theme") === "dark" ? "dark" : "light";
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
      if (next === "dark") html.setAttribute("data-theme", "dark");
      else html.removeAttribute("data-theme");
      try { localStorage.setItem("theme", next); } catch (e) {}
      updateToggleLabel();
    });
    updateToggleLabel();
  }

  /* ---------- Sticky header border ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Lenis smooth (inertia) scrolling ---------- */
  if (!reducedMotion && hasLenis) {
    var lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    if (useMotion) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      })(0);
    }
    // Keep in-page anchor links smooth through Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.querySelector(a.getAttribute("href"));
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -70 });
        }
      });
    });
  }

  /* ---------- Hero entrance choreography ---------- */
  var staggerRoots = document.querySelectorAll("[data-stagger]");
  if (useMotion) {
    staggerRoots.forEach(function (root) {
      gsap.fromTo(
        root.children,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.12, delay: 0.1 }
      );
    });
  } else {
    staggerRoots.forEach(function (root) {
      Array.prototype.forEach.call(root.children, function (el) {
        el.style.opacity = 1;
      });
    });
  }

  /* ---------- Scroll-triggered reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (useMotion) {
    revealEls.forEach(function (el) {
      gsap.set(el, { clearProps: "all" });
      gsap.fromTo(
        el,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true }
        }
      );
    });
  } else if (!reducedMotion && "IntersectionObserver" in window) {
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
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated stat counters ----------
     Markup: <span data-count-to="20" data-count-from="0" data-count-suffix="+"
                   data-count-decimals="0">20+</span>
     Final value is pre-rendered in the HTML for no-JS / reduced motion. */
  var counters = document.querySelectorAll("[data-count-to]");
  function animateCounter(el) {
    var to = parseFloat(el.getAttribute("data-count-to"));
    var from = parseFloat(el.getAttribute("data-count-from") || "0");
    var suffix = el.getAttribute("data-count-suffix") || "";
    var prefix = el.getAttribute("data-count-prefix") || "";
    var decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
    var obj = { v: from };
    gsap.to(obj, {
      v: to,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: function () {
        el.textContent = prefix + obj.v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
      },
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  }
  if (useMotion) {
    counters.forEach(animateCounter);
  }
  /* Without motion, the pre-rendered text stays as-is. */

  /* ---------- Diagram draw-in ---------- */
  var figures = document.querySelectorAll(".diagram-figure");
  if (useMotion) {
    figures.forEach(function (fig) {
      ScrollTrigger.create({
        trigger: fig,
        start: "top 82%",
        once: true,
        onEnter: function () { fig.classList.add("in"); }
      });
    });
  } else if (!reducedMotion && "IntersectionObserver" in window) {
    var ioFig = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            ioFig.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    figures.forEach(function (fig) { ioFig.observe(fig); });
  } else {
    figures.forEach(function (fig) { fig.classList.add("in"); });
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

  /* ---------- Intro video (click-to-play facade) ----------
     Enable by removing the `hidden` attribute from .video-slot and setting
     data-youtube-id to the YouTube video ID (the part after watch?v=). */
  var slot = document.querySelector(".video-slot");
  if (slot && !slot.hidden) {
    var vid = slot.getAttribute("data-youtube-id");
    if (vid) {
      var facade = slot.querySelector(".video-facade");
      var thumb = slot.querySelector(".video-facade img");
      if (thumb) thumb.src = "https://img.youtube.com/vi/" + vid + "/maxresdefault.jpg";
      if (facade) {
        facade.addEventListener("click", function () {
          var iframe = document.createElement("iframe");
          iframe.src = "https://www.youtube-nocookie.com/embed/" + vid + "?autoplay=1";
          iframe.title = "Intro video — Mariia Vasylieva";
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.setAttribute("allowfullscreen", "");
          facade.replaceWith(iframe);
        });
      }
    } else {
      slot.hidden = true; // no ID configured yet — keep it out of the page
    }
  }

  /* ---------- Portrait fallback ---------- */
  var img = document.getElementById("portrait-img");
  var portrait = document.getElementById("portrait");
  if (img && portrait) {
    img.addEventListener("error", function () { portrait.classList.add("no-photo"); });
    if (img.complete && img.naturalWidth === 0) portrait.classList.add("no-photo");
  }
})();
