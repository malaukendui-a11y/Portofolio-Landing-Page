---
name: Heritage Editorial
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#56423f'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#89726e'
  outline-variant: '#dcc0bc'
  surface-tint: '#9f3f34'
  primary: '#812920'
  on-primary: '#ffffff'
  primary-container: '#a04035'
  on-primary-container: '#ffcec7'
  inverse-primary: '#ffb4a9'
  secondary: '#635d5a'
  on-secondary: '#ffffff'
  secondary-container: '#e6ded9'
  on-secondary-container: '#67625e'
  tertiary: '#5e4301'
  on-tertiary: '#ffffff'
  tertiary-container: '#785a1a'
  on-tertiary-container: '#fdd487'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4a9'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#802820'
  secondary-fixed: '#e9e1dc'
  secondary-fixed-dim: '#cdc5c0'
  on-secondary-fixed: '#1e1b18'
  on-secondary-fixed-variant: '#4b4642'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c176'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4201'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is a sophisticated fusion of Batak cultural heritage and high-end editorial aesthetics. It is designed to feel like a living archive—authoritative, timeless, and deeply rooted in identity. The target audience includes family members across generations, researchers, and cultural enthusiasts who value dignity and clarity.

The visual style leans into **Minimalism** with **Modern Editorial** influences. It prioritizes expansive whitespace, intentional asymmetrical layouts, and a curated color palette. Rather than literal depictions of heritage, the system uses abstraction and refined textures to evoke a sense of "preciousness" and legacy. All interactions should feel deliberate and calm, avoiding rapid animations or distracting transitions.

## Colors

The palette is derived from the "Gorga" colors—the traditional Batak wood carvings—reinterpreted for a premium digital experience. 

- **Primary (Terracotta):** Used for key actions, brand identity, and structural accents. It represents life and the earth.
- **Secondary (Charcoal):** Used for primary typography and deep grounding elements. It provides the necessary weight for an authoritative feel.
- **Accent (Muted Gold):** Used sparingly for highlighting lineage, special honors, or premium metadata.
- **Background (Ivory):** The foundational canvas. It provides a warmer, more "paper-like" feel than pure white, enhancing readability and the archival theme.

Functional colors (Success, Error, Info) should be muted to match the desaturated nature of the core palette, ensuring they do not break the sophisticated atmosphere.

## Typography

This design system utilizes a high-contrast typographic pairing to balance tradition with modernity.

**Playfair Display** is reserved for headlines and large display elements. It carries a sense of literary history and importance. For maximum impact, use it with slightly tighter letter spacing in larger sizes.

**Inter** provides a utilitarian, highly readable counterpart for body copy and data-heavy family trees. Its neutral character ensures that the focus remains on the content. 

For accessibility, the default body size is 18px on desktop to accommodate elderly users. Captions and labels should maintain high contrast (Charcoal on Ivory) even at smaller scales.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** system for desktop to maintain editorial control, transitioning to a fluid model for smaller devices. 

- **Desktop:** 12-column grid with generous 64px outer margins. This creates an intentional "frame" around the content, reminiscent of a prestige book.
- **Rhythm:** Use an 8px base unit. Vertical rhythm is critical; spacing between sections should be expansive (80px, 120px, or 160px) to allow the content to breathe.
- **Lineage Views:** The "Tarombo" (family tree) feature uses a horizontal-scroll fluid container with fixed-width nodes to ensure tree structures remain legible regardless of depth.

## Elevation & Depth

To maintain a premium, flat-editorial aesthetic, the design system avoids heavy drop shadows. Instead, it uses **Tonal Layers** and **Subtle Outlines**.

- **Level 0 (Base):** Ivory background.
- **Level 1 (Cards/Containers):** Pure white background with a very thin (1px) border in a lightened version of Charcoal (#E5E4E2) or a soft 2px blurred shadow with 5% opacity.
- **Level 2 (Modals/Popovers):** A more defined 1px border in Charcoal, suggesting a physical document laid over another.

Background blurs are used only for navigation overlays to maintain focus on the text beneath while providing a contemporary feel.

## Shapes

The shape language is primarily **Sharp** to **Soft**. Sharp corners on large structural containers (headers, hero sections) convey a sense of architectural strength and tradition.

Smaller interactive elements like buttons and input fields use a subtle 4px (Soft) radius. This prevents the UI from feeling too aggressive while maintaining a serious, disciplined tone. Large "Pill" shapes are avoided to distance the design from casual consumer apps.

## Components

### Buttons
- **Primary:** Solid Terracotta (#A04035) with White text. Rectangular with 4px rounding. High-contrast.
- **Secondary:** Transparent with a 1.5px Gold (#C5A059) border and Gold text.
- **Tertiary:** Charcoal text with a small Gold underline or icon suffix.

### Cards
Cards are the primary vehicle for family member profiles. They should feature generous internal padding (32px), using the Ivory/White tonal shift rather than heavy shadows to denote boundaries. 

### Search & Filters
For the Tarombo search, use a large, centered input field with the Playfair Display font. Use a 1px Charcoal bottom-border rather than a box for a more sophisticated, "form-like" appearance.

### Lineage Nodes
Individual nodes in the family tree are styled as minimalist rectangles. Direct lineage is indicated by solid Terracotta lines, while secondary branches use Charcoal.

### Patterns & Dividers
Use horizontal rules sparingly. When used, integrate subtle Batak "Gorga" geometric patterns (specifically the *Oloan* or *Ipon-Ipon* motifs) as ultra-thin, low-opacity dividers in Muted Gold to separate major sections.