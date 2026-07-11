# NexusStudio — Portfolio Website

A modern, fully responsive portfolio website built from scratch with vanilla HTML5, CSS3, and JavaScript. No frameworks, no dependencies.

## Live Demo

🔗 [View Live Site](https://nexusstudio.rs)

## Features

### Animations & Effects
- **Custom cursor glow** — radial gradient that smoothly follows the mouse
- **Page loader** — three spinning rings with pulsing brand text
- **Scroll reveal animations** — elements fade in from up/left/right using IntersectionObserver
- **Particle canvas system** — 60 floating particles with connecting lines (constellation effect)
- **3D tilt effect** — service cards tilt toward the cursor using CSS perspective
- **Parallax backgrounds** — gradient orbs move at different speeds on scroll
- **Magnetic buttons** — primary buttons subtly follow the cursor
- **Counter animation** — stats count up from 0 when scrolled into view

### Sections
- **Hero** — full-viewport landing with animated background, gradient text, stats
- **About** — company intro, value cards, decorative code block
- **Services** — 6 service cards in a responsive grid
- **Projects** — portfolio grid with hover overlays
- **Testimonials** — auto-playing slider with touch swipe support
- **CTA** — call-to-action banner with animated orbs
- **Contact** — form with client-side validation + contact info
- **Footer** — navigation, services, contact links

### SEO
- Semantic HTML5 structure (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`)
- Open Graph meta tags (Facebook, LinkedIn)
- Twitter Card meta tags
- JSON-LD structured data (Schema.org Organization)
- Canonical URL
- Meta description, keywords, robots directives
- ARIA labels and roles for accessibility

### Cross-Browser & Mobile
- Fully responsive (desktop, tablet, mobile)
- Touch device detection (disables cursor effects on mobile)
- Safe area insets for notched phones (iPhone X+, Android)
- Reduced motion preference support (`prefers-reduced-motion`)
- PWA manifest for "Add to Home Screen"
- Backdrop filter fallback for older browsers
- Input zoom prevention on iOS (16px font-size)
- Orientation change handling
- VisualViewport API for accurate mobile viewport height
- High contrast mode support
- Samsung Internet, Opera Mini, Firefox compatibility

### Performance
- Zero dependencies — pure vanilla JS
- Passive event listeners on scroll/touch
- `will-change` hints for animated elements
- Debounced resize handlers
- Visibility API — pauses animations when tab is hidden
- DNS prefetch for external resources
- Font preconnect for faster loading

## Tech Stack

- **HTML5** — semantic markup, ARIA accessibility
- **CSS3** — custom properties, grid, flexbox, animations, keyframes
- **JavaScript (ES6+)** — IntersectionObserver, Canvas API, requestAnimationFrame, EventListener

## Project Structure

```
├── index.html        # Main HTML file with SEO meta tags
├── styles.css        # All CSS styles and animations
├── script.js         # All JavaScript interactions
├── manifest.json     # PWA manifest for mobile install
└── README.md         # This file
```

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/Jenic02/website.git
   ```

2. Open `index.html` in your browser

That's it. No build tools, no npm install, no dependencies.

## Customization

- **Colors** — edit CSS variables in `styles.css` (`:root` section)
- **Content** — edit text directly in `index.html`
- **Animations** — adjust timing/duration in CSS and JS files
- **Projects** — replace gradient placeholders with real project images

## Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome  | Yes |
| Firefox | Yes |
| Safari  | Yes |
| Edge    | Yes |
| Samsung Internet | Yes |
| Opera Mini | Yes |
| IE 11   | Partial (no IntersectionObserver, polyfilled) |

## License

Feel free to use this for your own portfolio.
