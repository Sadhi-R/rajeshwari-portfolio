# Rajeswari Duvvuru — Portfolio

Personal portfolio website for **Rajeswari Duvvuru**, Senior UI/UX Product Designer.

**Live site:** [https://rajeshwari-duvvuru.vercel.app/](https://rajeshwari-duvvuru.vercel.app/)

## Overview

A responsive, single-page portfolio showcasing UI/UX work, experience, and contact information. The site highlights 6+ years of product design experience across enterprise web and mobile products for NITYA Software Solutions, Faciligo USA, and more.

## Features

- **Hero & About** — Introduction, stats, and availability status
- **Hire Me** — Services and resume download
- **Projects** — Filterable project gallery (Mobile, Web, Enterprise)
- **Experience** — Work history and education timeline
- **Contact** — Email form with direct contact links
- **Dark / Light theme** — Toggle with preference saved in `localStorage`
- **Animated background** — Canvas-based ambient effects
- **Accessible** — Skip link, ARIA labels, keyboard-friendly navigation

## Tech Stack

- HTML5
- CSS3 (custom properties, responsive layout)
- Vanilla JavaScript (no build step)
- [Google Fonts](https://fonts.google.com/) — Archivo & Space Grotesk
- Deployed on [Vercel](https://vercel.com/)

## Project Structure

```
portfolio/
├── index.html          # Main page
├── css/
│   └── styles.css      # Styles & theme tokens
├── js/
│   ├── data.js         # Projects, services, tools data
│   ├── main.js         # UI logic, theme, filters, modals
│   └── background.js   # Canvas background animation
└── assets/             # Project images & resume (if present)
```

## Local Development

No install or build step is required. Serve the project with any static file server:

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node (npx)
npx serve .

# Option 3: VS Code Live Server extension
# Open index.html and use "Go Live"
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Updating Content

Edit `js/data.js` to update projects, services, tools, and experience. Styles and layout live in `css/styles.css` and `index.html`.

## Deployment

The site is deployed on Vercel. Push changes to the connected Git repository to trigger a new deployment, or deploy manually with the [Vercel CLI](https://vercel.com/docs/cli).

## Contact

- **Email:** rajeswari.chappidi2320@gmail.com
- **Phone:** +91 63013 13359
- **Location:** Hyderabad, India · Open to remote & on-site

## License

© 2026 Rajeswari Duvvuru. All rights reserved.
