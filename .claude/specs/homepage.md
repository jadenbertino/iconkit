# Homepage Implementation Spec

## Context

IconKit is a Next.js application that aggregates SVG icons from 11 popular icon libraries into a searchable database. The existing search functionality has been moved to `/search` and we need to create a new marketing landing page at the root `/` route.

## Project Structure (Relevant Files)

- `src/constants/provider.ts` - Contains `ICON_PROVIDERS` object and `ICON_LIBRARY_COUNT` constant (already added)
- `src/app/search/page.tsx` - Existing search functionality (moved from root)
- `src/app/(home)/` - New directory for homepage components (needs to be created)
- `src/components/Layout.tsx` - Contains `Container` and `Row` components
- `src/components/Navbar.tsx` - Navigation component
- `src/components/SearchBar.tsx` - Search input component
- `src/components/ui/button.tsx` - Button component with variants

## Implementation Steps

### 1. Create Directory Structure
Create `src/app/(home)/` directory with the following files:
- `page.tsx` - Main homepage component
- `HeroSection.tsx` - Hero section with header + search + paragraph
- `LibraryCarousel.tsx` - Carousel showing icon library names
- `BenefitsSection.tsx` - Benefits explanation section
- `ThreeCardSection.tsx` - Three benefit cards
- `PricingSection.tsx` - Pricing section with CTA

### 2. Component Content & Copy

#### HeroSection.tsx
```
Header: "IconKit"
Subheader: "40,000+ icons. {ICON_LIBRARY_COUNT}+ libraries. one search bar."
Search bar component (should navigate to /search with query)
Paragraph: "Find any icon from Hero Icons, Lucide, Font Awesome, Simple Icons, and 8 more libraries—all in one search."
```

#### LibraryCarousel.tsx
Display library names from `ICON_PROVIDERS` constant in a horizontal carousel/grid.

#### BenefitsSection.tsx
```
Header: "Your favorite icons, all in one place."

Paragraph 1: "IconKit searches every major open-source library at once, so you find what you need in seconds. No more bookmarking 6 different icon sites or settling for 'close enough' icons."

Subheader: "One search replaces all your icon workflow:"
Bullet points:
• Find the perfect icon instantly
• Browse 40,000+ icons from top libraries  
• Copy as SVG or JSX with one click
```

#### ThreeCardSection.tsx
Three cards with these headers and content:

**Card 1: "40,000+ Icons. 1 Search Bar"**
"Browse icons from Hero Icons, Lucide, Simple Icons, Font Awesome, Feather, Remix Icon, and 5 more popular libraries—all in one search."
Icon placeholder: `<Search Icon>`

**Card 2: "100% Open Source"** 
"Every icon comes from trusted open-source libraries with permissive licenses. No subscriptions, no premium tiers, no gotchas."
Icon placeholder: `<Package Icon>`

**Card 3: "Easy Attribution"**
"See each icon's license and attribution requirements upfront. Stay compliant without the legal guesswork."
Icon placeholder: `<Shield Icon>`

#### PricingSection.tsx
```
Header: "Pricing"
Subheader: "Just kidding!"
Paragraph: "IconKit is 100% free—no subscriptions, no premium tiers, no catch. We built this because we got tired of paying for icons too."
CTA Button: "Search 40,000+ Icons Now" (should navigate to /search)
```

### 3. Technical Requirements

- Use existing `Container` and `Row` components from `src/components/Layout.tsx`
- Import `ICON_LIBRARY_COUNT` and `ICON_PROVIDERS` from `src/constants/provider.ts`
- Use existing `Button` component from `src/components/ui/button.tsx`
- Follow existing code conventions:
  - All exports at bottom of file
  - Use `'use client'` for client components that need interactivity
  - Follow existing className patterns
- Navigation:
  - Search bar should navigate to `/search` with query parameter
  - CTA button should navigate to `/search`
  - Use Next.js `useRouter` for navigation

### 4. Styling Guidelines

- Follow existing design patterns and className conventions
- Use responsive design (ensure mobile-friendly)
- Use existing color scheme and typography
- Cards should be displayed in a grid layout (3 columns on desktop, stacked on mobile)
- Maintain visual hierarchy with proper spacing

### 5. Current Todo Status

Completed:
- ✅ Added `ICON_LIBRARY_COUNT` constant to `src/constants/provider.ts`

Remaining:
- [ ] Create `src/app/(home)` directory structure
- [ ] Create `HeroSection.tsx` component  
- [ ] Create `LibraryCarousel.tsx` component
- [ ] Create `BenefitsSection.tsx` component
- [ ] Create `ThreeCardSection.tsx` component
- [ ] Create `PricingSection.tsx` component
- [ ] Create main `page.tsx` that imports all sections
- [ ] Test navigation between homepage and search page
- [ ] Run prettier on all new files

### 6. Key Integration Points

- The search functionality already exists at `/search` - don't modify it
- Use the existing `SearchBar` component but wire it to navigate to `/search`
- Reference actual library names from `ICON_PROVIDERS` object
- Use `ICON_LIBRARY_COUNT` constant instead of hardcoding "11"

### 7. Expected File Structure After Implementation

```
src/app/
├── (home)/
│   ├── page.tsx
│   ├── HeroSection.tsx
│   ├── LibraryCarousel.tsx
│   ├── BenefitsSection.tsx
│   ├── ThreeCardSection.tsx
│   └── PricingSection.tsx
├── search/
│   └── page.tsx
└── ...
```

### 8. Notes

- Icon placeholders like `<Search Icon>` should be actual text for now - real icons can be added later
- Focus on getting the content and structure right first
- The homepage should feel like a marketing landing page that leads users to try the search functionality
- Ensure all copy matches exactly what's specified in this document