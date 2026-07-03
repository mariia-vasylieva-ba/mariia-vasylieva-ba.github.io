# Mariia Vasylieva — BA Portfolio (v2)

Static multi-page site for GitHub Pages. No build step; the animation libraries are bundled locally so there are no external JS dependencies.

## Structure

```
index.html                      Home: hero, 4 case-study tiles, About, contact
disaster-recovery/index.html    Case study 1
support-workload/index.html     Case study 2
planning-system/index.html      Case study 3
kyc-configuration/index.html    Case study 4
styles.css                      Shared design system (light + warm-dark themes)
js/main.js                      Interactions (theme, smooth scroll, animations)
js/vendor/                      GSAP, ScrollTrigger, Lenis (bundled, minified)
assets/mariia.jpg               Portrait (already cropped + optimised)
```

Case study URLs on the live site: `/disaster-recovery/`, `/support-workload/`, `/planning-system/`, `/kyc-configuration/` — each cleanly shareable in applications.

## What the motion layer does

Smooth inertia scrolling (Lenis), choreographed hero entrances and scroll-triggered section reveals (GSAP + ScrollTrigger), animated stat counters on each case study's "at a glance" strip, diagrams that draw themselves in as you scroll to them, soft page fades between pages in supporting browsers, hover micro-interactions on tiles. Everything is skipped automatically for `prefers-reduced-motion`, and the site works fully with JavaScript disabled (content is pre-rendered).

## Before pushing — 1 required edit

**Contact details:** search the project for `TODO` — the footer of every page has the same two placeholders (email and LinkedIn URL). Find-and-replace across all 5 HTML files.

## Optional switches (off by default)

**Intro video:** in `index.html`, find the `.video-slot` element in the About section. Delete the `hidden` attribute and put your YouTube video ID in `data-youtube-id` (the part after `watch?v=` in the URL). It renders as a click-to-play thumbnail using youtube-nocookie.com, so no YouTube cookies load until a visitor clicks play.

**Analytics:** `index.html` contains a commented-out block in the `<head>` with ready-to-use snippets for Microsoft Clarity (session recordings, time on page, scroll depth — free) and GoatCounter (simple privacy-friendly visit counts — free, no cookie banner needed). Sign up, replace the placeholder IDs, uncomment, and paste the same enabled snippets into the `<head>` of the four case study pages so visits there are counted too.

## Deploy

Copy everything into the root of your `mariia-vasylieva-ba.github.io` repo:

```
git add .
git commit -m "Portfolio v2: separate case study pages + motion"
git push
```

## Swapping the photo later

Replace `assets/mariia.jpg` with any portrait-orientation JPG of the same name.
