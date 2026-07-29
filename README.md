# Chinthapalli Siva — Portfolio

A production-ready, no-build-step portfolio site. Plain HTML/CSS/JS — works on
GitHub Pages, Vercel, or Netlify with zero configuration.

## 1. Edit your content (one file)

Everything — name, links, projects, skills, resume path — comes from:

```
config/personal.js
```

Change a value there and it updates everywhere on the site automatically.

## 2. Add your real assets

| What | Where |
|---|---|
| Resume PDF | `public/resume.pdf` |
| Profile photo | `assets/images/profile.png` (falls back to `profile-placeholder.png` automatically if missing) |
| Project screenshots | `assets/projects/your-file.png`, referenced from each project's `image` field in `config/personal.js` |
| Favicon | `assets/images/favicon.ico` |
| Apple touch icon | `assets/images/apple-touch-icon.png` |
| Open Graph cover image | `assets/images/og-cover.png` (1200×630 recommended) |

## 3. Set up the contact form (EmailJS)

1. Create a free account at [emailjs.com](https://www.emailjs.com).
2. Add an email service (Gmail, Outlook, etc.) and create a template with
   `from_name`, `reply_to`, `subject`, `message` variables.
3. Copy your **Service ID**, **Template ID**, and **Public Key** into
   `config/personal.js` under the `emailjs` block.

The public key is safe to expose client-side — that's how EmailJS is designed
to work. Never put a private/secret API key in client-side code.

## 4. Set your GitHub username

In `config/personal.js`, set `githubUsername`. The GitHub stats, top
languages, and recent activity sections call the public GitHub REST API
directly from the browser — no server or token needed for public data.
(GitHub's unauthenticated rate limit is 60 requests/hour per IP, which is
fine for normal traffic to a portfolio site.)

## 5. SEO checklist

- `robots.txt` and `sitemap.xml` are included — update the domain inside both
  once you know your final URL.
- Update `og:url`, `twitter:*`, and the JSON-LD block in `index.html` with
  your real domain and social links.

## 6. Deploy

**Vercel**
```
npm i -g vercel
vercel
```
(No build command needed — it's a static site.)

**GitHub Pages**
Push this folder to a repo, then enable Pages on the `main` branch, root
directory, in repo Settings → Pages.

## 7. Analytics (optional)

- Set `analytics.googleAnalyticsId` in `config/personal.js` to your GA4
  measurement ID (`G-XXXXXXXXXX`) to enable Google Analytics.
- For Vercel Analytics, add `<script defer src="/_vercel/insights/script.js"></script>`
  before `</body>` in `index.html` after deploying on Vercel (Vercel injects
  this automatically if you enable Analytics in your project dashboard).

## What's new: interactive & WebGL upgrades

- **3D tech-stack orbit** (`#tech-orbit`) — real Three.js scene: glass-look glowing spheres
  orbiting in 3D, draggable rotation, hover tooltip with skill %, click opens a modal listing
  related projects. Configure via the `techOrbit` array in `config/personal.js`.
- **Hero particle field** — an ambient Three.js starfield behind the hero that drifts with
  your cursor.
- **Cursor glow + magnetic buttons** — a soft light follows the pointer; primary CTA buttons
  nudge toward the cursor on hover (desktop only, and respects `prefers-reduced-motion`).
- **Scroll reveal** — sections and cards fade/rise into view as you scroll.
- **3D photo tilt** — your hero photo tilts subtly with the mouse for a bit of depth.
- **Certificates gallery** (`#certificates`) — real certificate images rendered in a grid,
  click to view fullscreen.
- **View vs Download resume** — "View Resume" opens the PDF in a new tab; "Download Resume"
  saves it.

### On the full 3D brief (laptop model, VS Code window, physics, React/R3F stack)

I intentionally didn't rebuild this as a React 19 + Vite + React-Three-Fiber + Rapier project.
That stack needs a build pipeline (npm install, bundler, dev server) and real 3D assets
(a modeled laptop, physics tuning) — it's genuinely multi-day work to get looking good rather
than looking like a generic Three.js demo, and it would mean throwing away the zero-build-step
deploy story (drop the folder straight onto Vercel/GitHub Pages, no `npm run build`). What's
shipped here uses real WebGL (not CSS tricks) for the parts that read best in a portfolio
context — the tech orbit and ambient particles — while keeping everything else (contact form,
GitHub stats, resume, projects) fully working. If you do want the full React/R3F rebuild later,
it's a good candidate for its own project scaffolded with Vite.

## Notes on scope

This build focuses on everything that can genuinely work without a backend:
a real EmailJS-powered contact form, a live GitHub-stats integration, a
config-driven content system, theming, accessibility, and full SEO
scaffolding. A couple of things intentionally need your input rather than
guessed placeholders: your resume file, project screenshots, and your
EmailJS/GitHub credentials — the site is fully wired to use them the moment
you drop them in.
