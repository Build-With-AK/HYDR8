# 🫧 AURA — Liquid Purity

> A premium, editorial-grade water bottle e-commerce web application built with React, Tailwind CSS v4, Three.js, and WebGL.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Design System](#design-system)

---

## 🌊 About the Project

**AURA** is a high-end, luxury water bottle brand experience built as a fully responsive single-page application. It combines immersive WebGL shaders, Three.js 3D particle systems, and editorial-quality design to create a premium digital storefront that feels like a magazine come to life.

Every page features:
- **Interactive WebGL backgrounds** with mouse-reactive liquid shader effects
- **Three.js particle systems** with floating spheres and animated torus rings
- **Scroll-reveal animations** using `IntersectionObserver`
- **Magnetic hover effects** on interactive elements
- **Glassmorphism UI** via a custom `.glass-frost` design token

---

## ✨ Features

- 🎨 **Premium Editorial Design** — Dark/light glassmorphism, curated color palettes, and smooth micro-animations
- 🌐 **WebGL Shader Backgrounds** — Custom GLSL fragment shaders with interactive water ripple effects on every page
- 📦 **Three.js 3D Scenes** — Animated particle environments that react to mouse movement
- 📱 **Fully Responsive** — Optimized for mobile phones, tablets, laptops, and large desktop displays using Tailwind `sm:`, `md:`, `lg:`, `xl:` breakpoints
- 🔀 **Client-Side Routing** — React Router v7 with a shared public layout and standalone pages
- 🛒 **E-Commerce Flow** — Cart, Checkout, and Categories pages with product displays
- 📝 **Editorial Blog** — Story panels, reading progress indicator, and newsletter subscription
- 🗺️ **Contact & About** — Floating sculpture animations, contact forms, and location displays
- 🔐 **Authentication UI** — Login and Sign Up pages with animated water-fill interactions

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | `^19.2.7` | UI component library |
| **React DOM** | `^19.2.7` | React rendering for the web |
| **React Router DOM** | `^7.18.1` | Client-side routing |
| **Tailwind CSS** | `^4.3.2` | Utility-first styling framework |
| **@tailwindcss/vite** | `^4.3.2` | Tailwind v4 Vite integration |
| **Three.js** | `^0.185.1` | 3D particle systems and WebGL scenes |
| **Vite** | `^8.1.1` | Build tool and development server |
| **ESLint** | `^10.6.0` | Code linting |

---

## 📁 Project Structure

```
BOTTLE/
├── public/                       # Static assets
├── src/
│   ├── assets/                   # Images and static files
│   ├── components/               # Reusable UI components
│   │   ├── CTABanner.jsx         # Call-to-action banner section
│   │   ├── FAQs.jsx              # Accordion FAQ section
│   │   ├── FeaturedProducts.jsx  # Product showcase grid
│   │   ├── Footer.jsx            # Global site footer
│   │   ├── Landing.jsx           # Hero landing section
│   │   ├── Nav.jsx               # Global navigation bar
│   │   ├── ShopByCategory.jsx    # Category bento grid
│   │   ├── SignUp.jsx            # Sign up page component
│   │   ├── Statics.jsx           # Brand statistics section
│   │   ├── WebGLBackground.jsx   # Reusable WebGL shader canvas
│   │   └── WhyChooseUs.jsx       # Features / benefits section
│   ├── layouts/
│   │   └── PublicLayout.jsx      # Shared layout (Nav + Outlet + Footer)
│   ├── pages/
│   │   ├── AboutUs.jsx           # Brand story page (5 editorial chapters)
│   │   ├── Blog.jsx              # Editorial journal page
│   │   ├── Cart.jsx              # Shopping cart page
│   │   ├── Categories.jsx        # Product category explorer
│   │   ├── Checkout.jsx          # Checkout & payment form
│   │   ├── ContactUs.jsx         # Contact form & atelier info
│   │   ├── Error404.jsx          # 404 not found page
│   │   ├── Home.jsx              # Main homepage (composites all sections)
│   │   └── Login.jsx             # User login page
│   ├── App.jsx                   # Router configuration
│   ├── index.css                 # Global styles & design tokens
│   └── main.jsx                  # React app entry point
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── eslint.config.js              # ESLint configuration
└── package.json                  # Project metadata and dependencies
```

---

## 🗺️ Pages & Routes

| Route | Component | Layout | Description |
|---|---|---|---|
| `/` | `Home.jsx` | Public | Homepage composing all hero sections |
| `/about` | `AboutUs.jsx` | Public | Brand story told in 5 editorial chapters |
| `/categories` | `Categories.jsx` | Standalone | Scroll-driven product category showcase |
| `/blog` | `Blog.jsx` | Public | Editorial journal with story panels |
| `/cart` | `Cart.jsx` | Public | Shopping cart with Three.js background |
| `/checkout` | `Checkout.jsx` | Standalone | Multi-step checkout & order summary |
| `/contact` | `ContactUs.jsx` | Public | Contact form, atelier map & social links |
| `/login` | `Login.jsx` | Public | User login with animated water-fill effect |
| `/signup` | `SignUp.jsx` | Public | User registration page |
| `*` | `Error404.jsx` | Standalone | Full-screen 404 with floating bottle animation |

---

## 🧩 Components

### `WebGLBackground.jsx`
A reusable canvas component that accepts a custom GLSL fragment shader and renders it full-screen. Every page passes its own unique shader for distinct atmospheric effects. Supports `opacity` and `className` props.

### `Landing.jsx`
The hero section of the homepage featuring the main headline, floating bottle imagery, and an animated gradient background.

### `Nav.jsx`
The global navigation bar with links to all primary pages. Includes a scroll-aware transparency effect.

### `ShopByCategory.jsx`
A responsive bento-grid layout showcasing product categories with hover animations and image reveals.

### `FeaturedProducts.jsx`
An editorial product grid with float animations, magnetic hover effects, and category filtering.

### `WhyChooseUs.jsx`
A features section highlighting brand pillars with icon-driven cards and scroll-reveal animations.

### `Statics.jsx`
Animated counter section displaying key brand statistics such as bottles sold and sustainability metrics.

### `CTABanner.jsx`
A full-width call-to-action banner with a magnetic button and gradient overlay.

### `FAQs.jsx`
An animated accordion FAQ component with smooth expand/collapse transitions.

### `Footer.jsx`
The global site footer with navigation links, social icons, and copyright information.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **npm** `>= 9.x` (or `pnpm` / `yarn`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/aura-hydration.git
   cd aura-hydration
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Build the optimized production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

---

## 🎨 Design System

AURA uses a custom design token system defined in `src/index.css` via Tailwind CSS v4's `@theme` directive.

### Color Palette

| Token | Usage |
|---|---|
| `primary` | Deep dark tones — main brand color |
| `secondary` | Aqua / teal accent color |
| `surface` | Light off-white background |
| `on-surface` | Text on surface background |
| `on-surface-variant` | Subdued / secondary text |

### Typography Scale

| Token | Usage |
|---|---|
| `font-display-xl` | Hero headlines (desktop) |
| `font-display-xl-mobile` | Hero headlines (mobile) |
| `font-headline-lg` | Section headings |
| `font-body-lg` | Lead paragraphs |
| `font-body-md` | Body text |
| `font-label-sm` | Labels, captions, tags |

### Key Custom Classes

| Class | Description |
|---|---|
| `.glass-frost` | Glassmorphism card (`backdrop-blur` + translucent white background) |
| `.reveal-up` | Scroll-reveal fade-up animation via `IntersectionObserver` |
| `.magnetic-hover` | Magnetic cursor attraction on interactive elements |
| `.noise-overlay` | Subtle grain / noise texture overlay |

### Spacing & Layout Tokens

| Token | Purpose |
|---|---|
| `px-margin-mobile` | Horizontal padding on mobile |
| `px-margin-desktop` | Horizontal padding on desktop |
| `max-w-container-max` | Maximum content container width |
| `gap-gutter` | Consistent grid gutter spacing |

---

## 📄 License

This project is intended for educational and portfolio purposes.

---

<div align="center">
  <strong>AURA — Engineered for Liquid Purity</strong><br/>
  <em>Every vessel tells a story. Make yours extraordinary.</em>
</div>
