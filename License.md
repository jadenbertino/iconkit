# License Guide

This document explains the different licenses used by icon providers and the obligations for both IconKit (the website) and users of the icons.

## Overview

IconKit aggregates icons from various providers, each with their own licensing terms. As the website operator, you must comply with each provider's license, and users must understand their obligations when using icons from the site.

## License Types

### MIT License

**How it works:** MIT is a permissive license that allows almost unrestricted use, including commercial use, modification, and distribution.

**Website obligations:**
- Include the original license text when redistributing (satisfied by linking to provider's license URL)
- No attribution required in the UI

**User obligations:**
- None for end use
- If redistributing the actual icon files, must include the MIT license text
- No attribution required for normal icon usage

**Providers using MIT:** Hero Icons, Feather Icons, Octicons, Ionicons, Eva Icons, Tabler Icons

### ISC License

**How it works:** Similar to MIT, ISC is a permissive license that allows unrestricted use with minimal requirements.

**Website obligations:**
- Include the original license text when redistributing (satisfied by linking to provider's license URL)
- No attribution required in the UI

**User obligations:**
- None for end use
- If redistributing the actual icon files, must include the ISC license text
- No attribution required for normal icon usage

**Providers using ISC:** Lucide

### Creative Commons Attribution 4.0 (CC BY)

**How it works:** Requires attribution to the original creator when the work is used or distributed.

**Website obligations:**
- Provide clear attribution to the icon provider
- Include link to the original source
- Display license information prominently

**User obligations:**
- **Must provide attribution** when using these icons
- Attribution should include: creator name, source, and license type
- Example: "Icon by [Provider Name] (CC BY 4.0)"

**Providers using CC BY:** Font Awesome Free, Boxicons

### Creative Commons Zero (CC0)

**How it works:** Public domain dedication - creators waive all rights to the work.

**Website obligations:**
- None (work is in public domain)
- Can optionally provide attribution as courtesy

**User obligations:**
- None - icons can be used without any restrictions
- No attribution required (though it's appreciated)

**Providers using CC0:** Simple Icons

### Apache License 2.0

**How it works:** Permissive license similar to MIT but with explicit patent grants and trademark protections.

**Website obligations:**
- Include the original license text when redistributing
- No attribution required in the UI

**User obligations:**
- None for end use
- If redistributing the actual icon files, must include the Apache license text
- Cannot use provider's trademarks without permission
- No attribution required for normal icon usage

**Providers using Apache:** Remix Icon

## Implementation Notes

- Icons requiring attribution have `attributionRequired: true` in the database
- The website should display attribution requirements clearly for CC BY licensed icons
- Users should be directed to check individual icon licenses before commercial use
- License URLs are stored in the database for easy reference