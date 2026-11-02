# THE H CORP — Official Website

> **"You Imagine, We Deliver."**

Official responsive corporate web platform for **THE H CORP**, delivering integrated technology, business, accounting (CA), and legal solutions under one roof for modern enterprises, startups, and founders across India and globally.

---

## Brand Aesthetic & Identity

- **Color Palette:** Executive Obsidian (`#040405`, `#0d0d12`) paired with Metallic Champagne Gold (`#dfb76c`, `#f5e2ad`, `#c59b4c`).
- **Typography:** Instrument Sans, Plus Jakarta Sans, and Outfit.
- **Tone:** Authoritative, high-trust, luxury corporate advisory & engineering.

---

## Key Features

1. **Luxury Logo Intro:**
   - Full-screen ambient golden logo reveal with zero borders.
   - Smooth dissolve on completion or instant fade on user scroll/touch/interaction.

2. **Executive Minimalist Button System:**
   - Sleek 6px micro-radius chamfered buttons with metallic gold gradients, liquid shimmer sweeps, and subtle 3D magnetic cursor tilt.

3. **16 Corporate Services Across 2 Divisions:**
   - **Division 01 — Technology & Digital Systems (8 Services):** Website Design & Development, UI/UX & App Design, Mobile App Development, Custom Software Engineering, E-Commerce Solutions, SEO, Website Maintenance, and Cybersecurity & Authorized Pen-Testing.
   - **Division 02 — Business, CA & Legal Services (8 Services):** Business Formation Support, GST Registration & Returns, Accounting & Bookkeeping, Tax & Compliance Support, Payroll Management, Legal Consultation, Contracts & Agreements, and Trademark Protection.
   - Every service card is equipped with high-resolution editorial photography, dark vignette overlays, and floating glassmorphic icon badges.

4. **Lenis Momentum & Inertia Smooth Scrolling:**
   - Integrated **Lenis** engine with exponential deceleration physics for silky gliding up and down.
   - Zero layout thrashing: cached section geometry with 60fps/120Hz display refresh coordination.

5. **3D Magazine Unfolding System:**
   - Cards and dual-page gatefolds unfold smoothly into the viewport with GPU-composited 3D perspective transforms.

6. **Interactive Modules:**
   - Interactive consultation booking form with auto-service selection.
   - Dynamic FAQ accordion with Motion expand/collapse.
   - Modal dialogs for Legal & Privacy policies with automatic background scroll lock.
   - Mobile responsive navigation drawer.

---

## Project Structure

```
thehcorp/
├── index.html                   # Main single-page application entry point
├── assets/
│   ├── css/
│   │   └── style.css            # Executive obsidian & champagne gold styling
│   ├── js/
│   │   └── script.js            # Core interactions, Lenis engine & Motion orchestration
│   ├── images/
│   │   ├── logo-transparent.png # High-res official emblem
│   │   ├── logo-mark.jpg        # Favicon and brand mark
│   │   └── services/            # Editorial photography for all 16 services
│   └── vendor/
│       ├── lenis/               # Lenis smooth scroll engine (min.js & css)
│       └── motion/              # Motion animation engine
├── package.json
└── README.md
```

---

## Quick Start

Open `index.html` directly in any modern browser, or run a local static server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node (npx)
npx serve .
```

Navigate to `http://localhost:8000/`.

---

© 2026 THE H CORP. All rights reserved.

