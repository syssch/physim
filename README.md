# PhySim · Physics Simulations

Interactive physics simulations for HKDSE Physics and Junior Science at Sing Yin Secondary School.
Served by GitHub Pages at **https://syssch.github.io/physim/**.

The simulations used to be embedded on the school's Google Site
(`sites.google.com/singyin.edu.hk/physim`). Each one is now a standalone page that works on
computers, tablets and phones. The URLs use the same paths as the Google Site, for example:

| Google Site | GitHub Pages |
|---|---|
| `…/physim/physics/force-and-motion/free-fall-motion` | `syssch.github.io/physim/physics/force-and-motion/free-fall-motion/` |

## Folder layout

```
index.html                 Home page (search, topic chips, cards)
404.html                   "Page not found" page
favicon.svg
physics/<topic>/<sim>/index.html
junior-science/<sim>/index.html
physics/index.html, physics/<topic>/index.html   Redirects to the matching part of the home page
assets/
  sim.css, sim.js          Shared helpers: "All sims" button, collapsible control panels on phones
  sim-early.js             Stops sims resetting when a phone's address bar hides/shows; adds touch pan/pinch helper
  img/                     Earth textures (self-hosted)
  thumbs/                  Card thumbnails for the home page
  vendor/                  Local copies of Tailwind (compiled), Three.js, Chart.js, MathJax, Font Awesome, fonts
.nojekyll                  Tells GitHub Pages to serve files as-is
```

No page loads anything from a CDN, so the site also works on networks that block CDNs.

## Mobile-friendly changes

* Every sim has a phone layout. Below 900 px wide, the sim area stacks above its controls, and
  canvases get sensible heights instead of a fixed 16:9 box. The desktop layout is unchanged.
* Full-screen 3D sims (Cavendish, Orbits at Different Heights, Periscope) put their control panel in
  a bottom sheet with a **Hide/Show** button.
* Touch input: drag to pan and pinch to zoom on the projectile canvases. Taps work wherever clicks did.
* Fixes that also affected the old Google Site:
  * Orbits at Different Heights: its Earth texture links were dead, so it now uses self-hosted textures.
  * Interference Pattern: MathJax was being called before it had loaded.
  * Monkey & Hunter: the slider labels showed raw `$H$` / `$V_0$`.
  * Normal Reaction: the W and N labels overlapped.
  * Orbits under Gravity: its Earth image now comes from this site instead of freesvg.org.

## Editing a simulation

Open `…/<sim>/index.html`, edit it, and commit. A few things to know:

* **Tailwind classes:** `assets/vendor/tailwind.css` is pre-compiled. It only contains the classes the
  sims used when the site was built. If an edit adds Tailwind classes that aren't there yet, the
  simplest fix is to add this line to that page's `<head>`:
  `<script src="https://cdn.tailwindcss.com"></script>`
* Keep the `assets/sim-early.js`, `assets/sim.css` and `assets/sim.js` lines. They provide the
  home button and the phone helpers.
* Phone layout rules are in each page's `<style>`, under `/* ---- Phone / narrow-screen layout ---- */`.

## Adding a new simulation

1. Create a folder such as `physics/force-and-motion/my-new-sim/` and put the HTML in it as `index.html`.
   Self-contained HTML works fine, including pages that use the Tailwind CDN.
2. Optional: copy the three `assets/` lines from an existing sim, adjusting the number of `../`.
3. Add a card to `index.html`. Copy an existing `<a class="card …">` block and change the link,
   title and thumbnail.
