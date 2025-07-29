# Design System

## Tailwind vs Design Tokens

- Tailwind is fast to use but has drawbacks compared to design system:
  - less semantic (e.g. `text-gray-400` vs `text-body`)
  - harder to maintain consistency across components (e.g. just update the `text-body` definition)
  - harder to build theme variations (i.e. light / dark mode)
- Solution: a hybrid approach
  - Use **token classes** for values that must be semantic and/or consistent:
    - colors — text, background, border, etc
    - typography — font size, line height, etc
    - theme variations (i.e. light / dark mode)
  - Use **tailwind** utilities for everything else:
    - margin
    - padding
    - flexbox & grid utilities
    - prototyping quickly
    - small tweaks in leaf components
    - overrides for tailwind defaults
- Semantic tokens are stored in `src/lib/tokens/*.css`, and are defined as custom CSS classes that map to Tailwind utilities:

  ```css
  /* src/lib/tokens/typography.css */

  .text-body {
    @apply text-base text-neutral;
  }
  .text-heading {
    @apply text-2xl font-semibold text-neutral-high;
  }
  ```

## Color

### Color Palette

- Neutral - slate & white
- Success - green
- Error - red
- Warning - yellow
- Info - purple

### Text Colors

**Neutral colors:**

> Text color naming is based on contrast level against the background

- `text-neutral-high` — Headlines, key actions
- `text-neutral` — Normal body text
- `text-neutral-low` — Muted, secondary text
- `text-neutral-lowest` — Subtle, tertiary text

**Semantic colors:**

- `text-success` — Success message
- `text-error` — Error messaging or form validation
- `text-warning` — Caution or alert messaging
- `text-info` — Informational notices

### Background Colors

**Structural colors:**

- `bg-canvas` — Full-page or app background (e.g. app shell, page background)
- `bg-surface` — Main surfaces like cards and modals (e.g. containers, dialogs, panels)
- `bg-overlay` — Elevated floating layers (e.g. tooltips, dropdowns, popovers)
- `bg-inset` — Nested zones inside components (e.g. input fields, chart containers, code blocks)
- `bg-inverse` — A high-contrast background meant to visually break the light flow of the page (e.g. separating pricing table or feature grid)

**State-based colors:**

- `bg-hover` — Hover state for interactive elements (e.g. buttons, menu items)
- `bg-disabled` — Disabled background for UI elements (e.g. disabled input, button)

**Semantic colors:**

- `bg-success` — Success message
- `bg-error` — Error messaging or form validation
- `bg-warning` — Caution or alert messaging
- `bg-info` — Informational notices

### Border & Ring Colors

- `border-default` — Input and container outlines
- `border-muted` — Divider lines, table rows
- `ring-focus` — Default focus ring color for interactive components
- `ring-error` — Focus ring for error states (e.g. invalid inputs)
- `ring-hover` — Hover state for interactive elements (e.g. buttons, menu items)

## Typography

### Font Size & Line Height

- `text-hero` — For hero headlines or large promo banners
- `text-impact` — For large, bold headings
- `text-heading` — For primary section headings
- `text-subheading` — For secondary or supporting headings
- `text-body` — For main paragraph content
- `text-small` — For small text, labels, and captions

### Font Weight

> Uses [Tailwind defaults](https://tailwindcss.com/docs/font-weight):

- `font-normal` — Default for body text and UI content
- `font-medium` — Used for buttons, labels, or subheadings
- `font-semibold` — Section headers or emphasized text blocks
- `font-bold` — Titles, callouts, or hero headlines

# Layout

> Just use tailwind defaults

- [radius](https://tailwindcss.com/docs/border-radius)
- [shadow](https://tailwindcss.com/docs/box-shadow)
- [margin](https://tailwindcss.com/docs/margin)
- [padding](https://tailwindcss.com/docs/padding)
- [flexbox & grid](https://tailwindcss.com/docs/flex)
- [z-index](https://tailwindcss.com/docs/z-index)
