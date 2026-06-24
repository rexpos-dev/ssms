---
name: Academic Structure
colors:
  surface: '#f4faff'
  surface-dim: '#cfdce4'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e9f6fd'
  surface-container: '#e3f0f8'
  surface-container-high: '#ddeaf2'
  surface-container-highest: '#d7e4ec'
  on-surface: '#111d23'
  on-surface-variant: '#454652'
  inverse-surface: '#263238'
  inverse-on-surface: '#e6f3fb'
  outline: '#767683'
  outline-variant: '#c6c5d4'
  surface-tint: '#4c56af'
  primary: '#000666'
  on-primary: '#ffffff'
  primary-container: '#1a237e'
  on-primary-container: '#8690ee'
  inverse-primary: '#bdc2ff'
  secondary: '#4a626d'
  on-secondary: '#ffffff'
  secondary-container: '#cde6f4'
  on-secondary-container: '#506873'
  tertiary: '#181b23'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c3039'
  on-tertiary-container: '#9597a2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#343d96'
  secondary-fixed: '#cde6f4'
  secondary-fixed-dim: '#b1cad7'
  on-secondary-fixed: '#051e28'
  on-secondary-fixed-variant: '#334a55'
  tertiary-fixed: '#e0e2ee'
  tertiary-fixed-dim: '#c4c6d2'
  on-tertiary-fixed: '#181b24'
  on-tertiary-fixed-variant: '#434750'
  background: '#f4faff'
  on-background: '#111d23'
  surface-variant: '#d7e4ec'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1440px
---

## Brand & Style

The brand personality for this design system is **authoritative, institutional, and dependable**. Designed for "Bridges Academy," it focuses on the concept of stability and the transition from learning to achievement. 

The design style follows a **Corporate / Modern** aesthetic with a lean toward **Minimalism**. It prioritizes high-quality typography and structured whitespace to reduce the cognitive load inherent in complex school management tasks. The visual language is intentionally "un-flashy," favoring clarity and logic over decorative trends. The goal is to evoke a sense of calm efficiency for administrators, teachers, and parents alike.

## Colors

The palette is anchored by **Indigo Navy (#1A237E)**, representing institutional trust and history. This is complemented by **Bridge Steel (#78909C)**, a metallic-inspired slate blue that serves as a secondary accent for secondary actions and structural elements.

- **Primary:** Used for main branding, primary buttons, and active states.
- **Secondary:** Used for icon backgrounds, secondary buttons, and decorative accents.
- **Surface/Tertiary:** A very light indigo wash (#E8EAF6) used for large background containers and subtle sectioning.
- **Neutral:** A deep charcoal (#263238) for high-contrast typography and essential UI borders.
- **Functional:** Standardized Red (Error), Amber (Warning), and Emerald (Success) should be used sparingly but with high saturation to ensure visibility against the muted primary palette.

## Typography

This design system utilizes **Inter** exclusively to ensure a systematic, utilitarian, and neutral feel across all platforms. The typeface was chosen for its exceptional legibility in data-heavy environments like gradebooks and attendance sheets.

Key typographic rules:
- **Headlines:** Use tighter letter spacing for large titles to maintain a professional, compact appearance.
- **Body Text:** Always prioritize the `body-md` (16px) for instructional content to ensure accessibility for all age groups.
- **Labels:** Uppercase labels should only be used for small, non-critical metadata to avoid a "shouting" tone.
- **Mobile Scaling:** Headlines scale down on mobile devices (32px becomes 24px) to prevent awkward word wrapping in narrow viewports.

## Layout & Spacing

The layout is based on a **12-column fixed grid** for desktop and a **4-column fluid grid** for mobile. A consistent 4px baseline unit drives all spacing decisions.

- **Desktop (1024px+):** 12 columns, 24px gutters, 48px side margins. Max container width of 1440px.
- **Tablet (768px - 1023px):** 8 columns, 24px gutters, 32px side margins.
- **Mobile (Up to 767px):** 4 columns, 16px gutters, 16px side margins.

Content should be organized in logical "zones." Sidebars for navigation are fixed at 260px on desktop, while data tables and forms occupy the primary fluid workspace. Use `xl` (32px) padding for primary container internal spacing to maintain an airy, professional feel.

## Elevation & Depth

To maintain an institutional and structured feel, this design system uses **Tonal Layers** and **Low-contrast Outlines** rather than heavy shadows.

- **Level 0 (Base):** The default background color (White or Tertiary Indigo Wash).
- **Level 1 (Cards):** 1px solid border (#E0E0E0) with a very subtle, large-radius shadow (4% opacity Navy) to distinguish sections.
- **Level 2 (Popovers/Modals):** A slightly more pronounced shadow (8% opacity Navy) with 12px blur to indicate temporary interaction layers.
- **Interaction:** Hover states on interactive cards should transition to a 1px border of the Secondary color (#78909C) rather than increasing shadow depth.

## Shapes

The shape language is **Soft** but disciplined. 
- **Standard Radius:** 4px for small components like checkboxes, tags, and small buttons.
- **Container Radius:** 8px (rounded-lg) for main cards, input fields, and modal containers.
- **Extreme Radius:** 12px (rounded-xl) should be used only for large "dashboard-style" widgets.

Avoid pill-shaped buttons; rectangular buttons with a 4px or 6px radius convey more authority and align better with the grid-based institutional look.

## Components

### Buttons
- **Primary:** Solid Navy (#1A237E) with White text. 4px border radius. Heavy weight label.
- **Secondary:** Ghost style with 1px border of Steel Blue (#78909C) and Steel Blue text.
- **Tertiary:** Text-only in Navy, used for "Cancel" or low-priority navigation.

### Input Fields
- Use "Outlined" style. 1px border (#CFD8DC) that turns Primary Navy on focus. 
- Labels should be persistent or floating, never disappearing, to maintain accessibility.

### Cards
- White background, 1px border, 8px corner radius. 
- Headers within cards should have a subtle bottom border (#F5F5F5) to separate titles from content.

### Data Tables (Crucial for SMS)
- No vertical borders between columns; use horizontal borders only (#F5F5F5).
- Alternate row striping using the Tertiary color (#E8EAF6) at 50% opacity.
- Header row should be uppercase `label-sm` with a slightly darker neutral background.

### Status Chips
- Small, 4px radius. 
- Use a "Light" background (10% opacity of the functional color) with a "Dark" text (100% opacity of the functional color) for high readability without visual noise.