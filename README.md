# CaféCraft — Simple Coffee Shop Template

---

## Files

- index.html
- styles.css
- app.js
- assets/hero-illustration.svg
- assets/about-photo.svg

**How to run locally (no build tools required):**

1. Create folder structure and files as instructed.
2. Open index.html by double-clicking it in your file manager OR:
   - For best JS behavior, serve via a local static server:
     - If you have Python installed: run `python -m http.server` in the project folder, then open http://[localhost:8000]
     - Not required — double-clicking index.html will work for most features.

## Notes

- Theme colors: #3b2f2f (deep), #a87f6f (light), #d9a15a (accent), #f7f2ea (cream)
- Fonts: Playfair Display for headings, Inter for body (Google Fonts URL included)
- Accessibility: semantic HTML, aria attributes, focus outlines preserved, Escape closes dialogs
- Performance: images are lightweight SVG placeholders and are lazy-loaded

**Recommendations to convert to React + Vite:**

1. `npm create vite@latest` -> choose React.
2. Move sections into separate components (Home, Menu, About, Contact, Modal, Drawer).
3. Use React state/context for modal/drawer and lazy-load large assets.
4. Keep CSS variables and breakpoints; consider CSS Modules or Tailwind for scoped styling.
