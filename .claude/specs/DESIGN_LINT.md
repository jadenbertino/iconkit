# Design System ESLint Rules Implementation

## Overview

This ticket covers implementing ESLint rules to enforce design system adherence across the codebase. The goal is to prevent developers from using raw Tailwind utilities that bypass our semantic design tokens.

## Background

Our design system uses semantic token classes (defined in `src/lib/tokens/*.css`) instead of raw Tailwind utilities to ensure:
- Consistency across components
- Easier theming and maintenance
- Semantic meaning in class names

Current design system documentation: `docs/DESIGN_SYSTEM.md`

## Requirements

### 1. Reorganize Existing Rule
- Move `eslint-custom-plugin/no-tailwind-font-sizes.cjs` to new `eslint-custom-plugin/design/` directory
- Update import path in `eslint-custom-plugin/index.js`

### 2. Create New Design System Rules

#### Rule: `no-tailwind-colors`
**Purpose**: Prevent raw Tailwind text colors in favor of semantic design tokens

**Forbidden utilities**: 
- Text colors: `text-gray-*`, `text-slate-*`, `text-red-*`, `text-green-*`, `text-blue-*`, `text-yellow-*`, `text-purple-*`, etc.
- All Tailwind color variants with opacity: `text-gray-400/50`, `text-red-500/75`

**Approved tokens**:
```css
/* Text colors */
text-neutral-high    /* Headlines, key actions */
text-neutral        /* Normal body text */
text-neutral-low    /* Muted, secondary text */
text-neutral-lowest /* Subtle, tertiary text */
text-success        /* Success messages */
text-error          /* Error messaging */
text-warning        /* Caution/alert messaging */
text-info           /* Informational notices */
```

#### Rule: `no-tailwind-backgrounds`
**Purpose**: Prevent raw Tailwind background colors in favor of semantic design tokens

**Forbidden utilities**:
- Background colors: `bg-gray-*`, `bg-slate-*`, `bg-red-*`, `bg-green-*`, `bg-blue-*`, `bg-yellow-*`, `bg-purple-*`, etc.
- All Tailwind background variants with opacity: `bg-gray-100/50`, `bg-blue-500/75`

**Approved tokens**:
```css
/* Structural backgrounds */
bg-canvas     /* Full-page/app background */
bg-surface    /* Cards, modals, main surfaces */
bg-overlay    /* Tooltips, dropdowns, popovers */
bg-inset      /* Input fields, code blocks */
bg-inverse    /* High-contrast sections */

/* State backgrounds */
bg-hover      /* Hover states */
bg-disabled   /* Disabled elements */

/* Semantic backgrounds */
bg-success    /* Success messages */
bg-error      /* Error messages */
bg-warning    /* Warning messages */
bg-info       /* Info messages */
```

## Technical Implementation

### File Structure
```
eslint-custom-plugin/
├── design/
│   ├── no-tailwind-font-sizes.cjs    (moved from root)
│   ├── no-tailwind-colors.cjs        (new)
│   └── no-tailwind-backgrounds.cjs   (new)
├── api-routes/
└── index.js
```

### Rule Implementation Pattern
Each rule should:
1. Follow the same pattern as existing `no-tailwind-font-sizes.cjs`
2. Handle multiple className formats:
   - `className="text-gray-400"`
   - `className={'text-gray-400'}`
   - `className={\`text-gray-400 ${variable}\`}`
3. Support responsive variants (e.g., `sm:text-gray-400`, `lg:bg-blue-500`)
4. Support opacity variants (e.g., `text-gray-400/50`, `bg-blue-500/75`)
5. Provide clear error messages suggesting approved alternatives

### Error Message Format
```
Use design system [type] tokens instead of Tailwind utilities. Replace "[utility]" with one of: [approved-tokens]
```

## Testing & Validation

### Manual Testing
After implementation:
1. Create test JSX with forbidden utilities
2. Run `pnpm lint` to verify rules trigger
3. Verify error messages are clear and helpful

### Existing Codebase
1. Run `pnpm lint` after implementation
2. Fix any violations found in the codebase
3. Ensure all lint issues are resolved

## Acceptance Criteria

- [ ] `eslint-custom-plugin/design/` directory created
- [ ] `no-tailwind-font-sizes.cjs` moved to design directory
- [ ] `no-tailwind-colors.cjs` implemented with comprehensive color detection
- [ ] `no-tailwind-backgrounds.cjs` implemented with comprehensive background detection
- [ ] `eslint-custom-plugin/index.js` updated with new paths
- [ ] All rules auto-enabled in ESLint config
- [ ] `pnpm lint` passes without design system violations
- [ ] Error messages provide clear guidance on approved alternatives

## Context Files to Review

- `docs/DESIGN_SYSTEM.md` - Complete design system specification
- `src/lib/tokens/*.css` - Current design token definitions
- `eslint-custom-plugin/no-tailwind-font-sizes.cjs` - Reference implementation
- `eslint.config.mjs` - ESLint configuration

## Notes

- Rules should be comprehensive but not overly restrictive
- Focus on commonly misused utilities first
- Consider responsive variants and opacity modifiers
- Error messages should educate developers about the design system