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
js/analytics.js                 Visit + event tracking (off until you add your code)
js/vendor/                      GSAP, ScrollTrigger, Lenis (bundled, minified)
assets/mariia.jpg               Portrait (already cropped + optimised)
```

Case study URLs on the live site: `/disaster-recovery/`, `/support-workload/`, `/planning-system/`, `/kyc-configuration/` — each cleanly shareable in applications.

## What the motion layer does

Smooth inertia scrolling (Lenis), choreographed hero entrances and scroll-triggered section reveals (GSAP + ScrollTrigger), animated stat counters on each case study's "at a glance" strip, diagrams that draw themselves in as you scroll to them, soft page fades between pages in supporting browsers, hover micro-interactions on tiles. Everything is skipped automatically for `prefers-reduced-motion`, and the site works fully with JavaScript disabled (content is pre-rendered).

## Optional switches (off by default)

**Intro video:** in `index.html`, find the `.video-slot` element in the About section. Delete the `hidden` attribute and put your YouTube video ID in `data-youtube-id` (the part after `watch?v=` in the URL). It renders as a click-to-play thumbnail using youtube-nocookie.com, so no YouTube cookies load until a visitor clicks play.

**Analytics:** all five pages already load `js/analytics.js`. It uses [GoatCounter](https://www.goatcounter.com) — free, cookieless, and no personal data, so the site needs no cookie banner. It is switched off until you do one thing:

1. Create a free account at goatcounter.com and pick a code (say `mariia`, giving you a dashboard at `https://mariia.goatcounter.com`).
2. Put that code between the quotes at the top of `js/analytics.js`:

```js
var GOATCOUNTER_CODE = "mariia";
```

Until that string is filled in the file does nothing at all — no requests, no errors. Once it is set you get, on every page:

- **Pageviews**, with referrer, so you can tell a LinkedIn click from a recruiter following a link in an application.
- **`contact-email` / `contact-linkedin`** events when someone clicks your email address or LinkedIn link — the signal that the site actually did its job.
- **`read-<page>`** once a visitor has scrolled through 75% of a page (`read-kyc-configuration`, `read-home`, …), which separates a real read from a bounce.
- **`ref-<label>`** when someone opens a personal link such as `https://mariia-vasylieva-ba.github.io/?r=payuk` (works on any page). The label sticks for the rest of that visit, so you also get `ref-payuk:read-support-workload`, `ref-payuk:contact-email` and so on. The `?r=` part is stripped from the address bar before the pageview is counted. Use lowercase letters, digits and dashes for labels; one label per company or recruiter.

Events show up under the *Events* tab of the dashboard. Your own local previews are never counted (`localhost` and `file://` are skipped), and visitors who send a Do Not Track header are skipped too.

## Deploy

Copy everything into the root of your `mariia-vasylieva-ba.github.io` repo:

```
git add .
git commit -m "Portfolio v2: separate case study pages + motion"
git push
```

## Swapping the photo later

Replace `assets/mariia.jpg` with any portrait-orientation JPG of the same name.
