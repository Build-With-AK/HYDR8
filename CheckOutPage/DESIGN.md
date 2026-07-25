---
name: Luminous Hydration
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#00668a'
  on-secondary: '#ffffff'
  secondary-container: '#40c2fd'
  on-secondary-container: '#004d6a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1d'
  on-tertiary-container: '#838486'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7cd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#e2e2e4'
  tertiary-fixed-dim: '#c6c6c8'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#454749'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 80px
    fontWeight: '700'
    lineHeight: 88px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
---

## Brand & Style
The design system is centered on the concept of "Liquid Purity." It targets a discerning audience that values wellness, high-end industrial design, and sustainability. The emotional response is one of clarity, calm, and technological precision.

The visual style is a fusion of **Minimalism** and **Glassmorphism**. It utilizes expansive white space, cinematic product photography, and subtle noise textures to emulate the physical properties of frosted glass and condensation. The interface acts as a quiet, sophisticated gallery for the product, prioritizing breathability and high-contrast editorial layouts.

## Colors
The palette is rooted in monochromatic purity with a singular, high-energy accent. 
- **Pure White (#FFFFFF):** Used for primary backgrounds and high-gloss surfaces.
- **Soft Gray (#F5F5F7):** Used for subtle section nesting and tertiary backgrounds.
- **Charcoal (#111111):** Reserved for high-impact editorial typography and primary UI actions.
- **Electric Blue (#3ABEF9):** A vibrant "Aqua" used sparingly for interactive highlights, status indicators, and mesh gradient focal points.

Apply a subtle 3% grain/noise texture over all background surfaces to prevent the white from feeling clinical and to add a tactile, paper-like or frosted feel.

## Typography
The typography system follows an editorial "Apple-inspired" hierarchy. 
- **Headlines:** Plus Jakarta Sans provides a contemporary, high-contrast feel. Display sizes should be oversized and tight-tracked to create a cinematic impact.
- **Body:** Inter is used for its utilitarian clarity and neutral tone, ensuring readability at any scale.
- **Labels/Technical Info:** JetBrains Mono is used for technical specs (e.g., volume, temperature, material info) to lean into the brand's "precision engineering" narrative.

## Layout & Spacing
This design system uses a **Fluid Grid** with generous margins to enforce a sense of luxury. 
- **Desktop:** 12-column grid with a 1440px max-width. Use extreme vertical padding (160px+) between sections to allow the product photography to breathe.
- **Mobile:** 4-column grid. Typography should reflow to the mobile-specific tokens defined in the Typography section.
- **Rhythm:** All spacing is based on an 8px base unit. Components should use 32px or 64px gaps to maintain the "airy" editorial feel.

## Elevation & Depth
Depth is created through **Glassmorphism** and layering rather than traditional drop shadows.
- **Glass Frost Material:** Surfaces use `rgba(255, 255, 255, 0.4)` with a `backdrop-filter: blur(20px)`. 
- **Layering:** Elements at higher elevations should have a subtle 1px inner border of `rgba(255, 255, 255, 0.5)` to simulate a light-catching edge on glass.
- **Shadows:** Use extremely soft, large-radius ambient shadows (Color: #111111 at 3% opacity) to ground product shots.
- **Mesh Gradients:** Use soft, blurred blobs of Electric Blue behind frosted layers to suggest movement and light refraction.

## Shapes
The shape language is "Soft-Tech." Elements use a consistent 0.5rem (8px) base radius, reflecting the precision-milled edges of high-end hardware. 
- Large containers and "Glass Frost" panels use `rounded-xl` (24px) to feel more organic.
- Interactive elements like buttons should never be fully pill-shaped; they should maintain a sophisticated, slightly structured radius.

## Components
- **Primary Buttons:** Solid Charcoal (#111111) with white typography. Hover state should include a subtle scale-up (1.02x) and a soft glow.
- **Glass Chips:** Frosted glass backgrounds with `label-sm` JetBrains Mono text. Use these for product features (e.g., "BPA FREE", "INSULATED").
- **Input Fields:** Minimalist under-line style or a very faint Soft Gray background with no border. Focus state is indicated by the Electric Blue accent.
- **Product Cards:** No visible borders. Use the Glass Frost material for the "info area" overlaying the bottom 20% of the product image.
- **Navigation:** A fixed, blurred glass header that persists during scroll, allowing the high-contrast typography to remain legible as it passes over images.
- **Micro-interactions:** Elements should fade and slide upward 20px on scroll. Interactive elements should use a "magnetic" hover effect to feel premium.