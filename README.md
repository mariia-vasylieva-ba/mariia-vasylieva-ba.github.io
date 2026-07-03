# Mariia Vasylieva — BA Portfolio

Static site for GitHub Pages. No build step, no dependencies.

## Files

- `index.html` — all content (hero, 4 case studies, About, footer)
- `styles.css` — design system (light + warm-dark themes, responsive, reduced-motion support)
- `main.js` — theme toggle, scroll reveals, tile hover highlight, photo fallback
- `assets/` — put your portrait photo here

## Before pushing — 1 required edit

**Contact details:** in `index.html`, search for `TODO` (two places in the footer) and replace the placeholder email and LinkedIn URL with your real ones.

The portrait is already included at `assets/mariia.jpg` (cropped to 4:5 and web-optimised, ~166 KB). To swap it later, just replace that file with any portrait-orientation JPG of the same name.

## Deploy

Copy these files into the root of your `mariia-vasylieva-ba.github.io` repo, then:

```
git add .
git commit -m "Portfolio site"
git push
```

GitHub Pages serves it automatically at https://mariia-vasylieva-ba.github.io

## Deep links

Each case study has a shareable anchor:
- /#disaster-recovery
- /#support-workload
- /#planning-system
- /#kyc-configuration
- /#about · /#contact
