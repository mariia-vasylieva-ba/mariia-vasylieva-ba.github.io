/* Mariia Vasylieva — portfolio analytics (GoatCounter)
   Privacy-friendly and cookieless, so the site needs no consent banner.

   ─────────────────────────────────────────────────────────────────────
   SETUP — one step:
     1. Make a free account at https://www.goatcounter.com
     2. Put the code you chose there between the quotes below and save.
        If your dashboard is at https://mariia.goatcounter.com,
        your code is "mariia".
   Until that string is filled in, this file does nothing at all —
   no requests, no errors.
   ───────────────────────────────────────────────────────────────────── */
var GOATCOUNTER_CODE = "defly";

(function () {
  "use strict";

  if (!GOATCOUNTER_CODE) return;

  // Don't record your own local previews.
  var host = location.hostname;
  if (location.protocol === "file:" || host === "localhost" || host === "127.0.0.1") return;

  // Honour Do Not Track.
  var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt === "1" || dnt === "yes") return;

  var endpoint = "https://" + GOATCOUNTER_CODE + ".goatcounter.com/count";

  /* ---------- Per-recipient links ----------
     Send each company or recruiter their own link, e.g.
       https://mariia-vasylieva-ba.github.io/?r=payuk
     The label is remembered for the rest of that visit (sessionStorage),
     so later events say who did them: "ref-payuk", "ref-payuk:read-kyc-configuration".
     The ?r= part is removed from the address bar before the pageview is
     counted, so page stats stay clean. Labels: lowercase letters, digits, dashes. */
  var REF_KEY = "mv-ref";
  var ref = "";
  var refIsNew = false;
  try {
    var params = new URLSearchParams(location.search);
    var raw = (params.get("r") || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
    if (raw) {
      ref = raw;
      refIsNew = true;
      try {
        refIsNew = sessionStorage.getItem(REF_KEY) !== raw;
        sessionStorage.setItem(REF_KEY, raw);
      } catch (e) { /* no storage: still count this open */ }
      params.delete("r");
      var rest = params.toString();
      history.replaceState(null, "", location.pathname + (rest ? "?" + rest : "") + location.hash);
    } else {
      ref = sessionStorage.getItem(REF_KEY) || "";
    }
  } catch (e) { /* storage blocked or old browser: just no labels */ }

  var tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://gc.zgo.at/count.js";
  tag.setAttribute("data-goatcounter", endpoint);
  document.head.appendChild(tag);

  /* Record a named event. If count.js hasn't loaded yet, retry for a few
     seconds instead of dropping the event; never throws. */
  function send(name, title, tries) {
    if (window.goatcounter && typeof window.goatcounter.count === "function") {
      window.goatcounter.count({ path: name, title: title || name, event: true });
    } else if (tries > 0) {
      setTimeout(function () { send(name, title, tries - 1); }, 500);
    }
  }

  /* Every event is also recorded with the visitor's label, if they came via a ?r= link. */
  function track(name, title) {
    send(name, title, 10);
    if (ref) send("ref-" + ref + ":" + name, ref + ": " + (title || name), 10);
  }

  /* Page slug used to label events, e.g. "/kyc-configuration/" -> "kyc-configuration",
     and the home page -> "home". */
  function pageSlug() {
    var parts = location.pathname.split("/").filter(Boolean);
    var last = parts[parts.length - 1] || "home";
    return last.replace(/\.html$/, "") || "home";
  }

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  onReady(function () {
    /* Someone opened a personal link: record it once per visit. */
    if (ref && refIsNew) {
      send("ref-" + ref, "Opened link for " + ref + " (" + pageSlug() + ")", 10);
    }

    /* ---------- Contact intent ----------
       These are the events worth knowing about: someone liked the work
       enough to reach out. Neither link unloads the page (mailto hands off
       to a mail client, LinkedIn opens in a new tab), so the request has
       time to complete.

       Case-study tile clicks are deliberately not tracked — each case study
       records its own pageview, which says the same thing more reliably. */
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.addEventListener("click", function () {
        track("contact-email", "Clicked email address");
      });
    });

    document.querySelectorAll('a[href*="linkedin.com"]').forEach(function (a) {
      a.addEventListener("click", function () {
        track("contact-linkedin", "Clicked LinkedIn");
      });
    });

    /* ---------- Did they actually read it? ----------
       A pageview only says someone arrived. This fires once, when 75% of the
       page has been seen, which separates a real read from a bounce. */
    var fired = false;
    function checkDepth() {
      if (fired) return;
      var scrolled = window.scrollY + window.innerHeight;
      var full = document.documentElement.scrollHeight;
      if (full <= window.innerHeight) return; // page too short to scroll
      if (scrolled / full >= 0.75) {
        fired = true;
        window.removeEventListener("scroll", checkDepth);
        track("read-" + pageSlug(), "Read 75% of " + pageSlug());
      }
    }
    window.addEventListener("scroll", checkDepth, { passive: true });
  });
})();
