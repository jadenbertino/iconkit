# Icon Providers

This document lists all icon providers configured in `ICON_PROVIDERS` from `/src/constants/provider.ts`.

## Provider List

1. **Hero Icons** (`hero_icons`)

   - Git: https://github.com/tailwindlabs/heroicons.git
   - Branch: master
   - Icons Directory: optimized
   - **Generated Tags**: Extract style from icon filepath (e.g. `optimized/20/solid/academic-cap.svg` → ["solid"])

2. **Lucide** (`lucide`)

   - Git: https://github.com/lucide-icons/lucide.git
   - Branch: main
   - Icons Directory: icons
   - Metadata: **Rich** - Adjacent JSON files per icon (e.g., `accessibility.json` next to `accessibility.svg`)
   - ✅ Tags - Access: `icons/accessibility.json` → `tags` array
   - ✅ Categories - Access: `icons/accessibility.json` → `categories` array
   - ✅ Contributors - Access: `icons/accessibility.json` → `contributors` array
   - **Generated Tags**: Combine `tags` + `categories` + `contributors` arrays (e.g., ["disability", "disabled", "dda", "wheelchair", "accessibility", "medical", "karsa-mistmere", "jguddas"])
   - Example metadata (`accessibility.json`):
     ```json
     {
       "$schema": "../icon.schema.json",
       "contributors": ["karsa-mistmere", "jguddas"],
       "tags": ["disability", "disabled", "dda", "wheelchair"],
       "categories": ["accessibility", "medical"]
     }
     ```

3. **Simple Icons** (`simple_icons`)

   - Git: https://github.com/simple-icons/simple-icons.git
   - Branch: master
   - Icons Directory: icons
   - Metadata: **Brand information** - Central JSON file at `data/simple-icons.json`
   - ✅ Aliases - Access: `data/simple-icons.json` → find by `title` → `aliases.aka` array (some icons only)
   - **Generated Tags**: Use `aliases.aka` if it exists
   - Example metadata (from `data/simple-icons.json`):
     ```json
     {
       "title": ".ENV",
       "hex": "ECD53F",
       "source": "https://github.com/motdotla/dotenv/blob/40e75440337d1de2345dc8326d6108331f583fd8/dotenv.svg",
       "aliases": {
         "aka": ["Dotenv"]
       }
     }
     ```

4. **Feather Icons** (`feather_icons`)

   - Git: https://github.com/feathericons/feather.git
   - Branch: main
   - Icons Directory: icons
   - Metadata: **Tags only** - Central JSON file at `src/tags.json` mapping icon names to search tags
   - ✅ Tags - Access: `src/tags.json` → `[icon-name]` array
   - **Generated Tags**: Use `tags` array directly + split filename (e.g., for "activity": ["pulse", "health", "action", "motion", "activity"])
   - Example metadata (from `src/tags.json`):
     ```json
     {
       "activity": ["pulse", "health", "action", "motion"],
       "alert-circle": ["warning", "alert", "danger"],
       "at-sign": ["mention", "at", "email", "message"],
       "award": ["achievement", "badge"]
     }
     ```

5. **Font Awesome Free** (`font_awesome_free`)

   - Git: https://github.com/FortAwesome/Font-Awesome.git
   - Branch: 6.x
   - Icons Directory: svgs
   - Metadata: **Extensive** - Central JSON file at `metadata/icons.json`
   - ✅ Tags - Access: `metadata/icons.json` → `[icon-name].search.terms` array
   - **Generated Tags**: Use `search.terms` array + `label` + split filename (e.g., for "0": ["0", "zero", "Digit Zero", "nada", "none", "zilch"])
   - Example metadata (from `metadata/icons.json`):
     ```json
     {
       "0": {
         "changes": ["6.0.0"],
         "search": {
           "terms": ["0", "zero"]
         },
         "styles": ["solid"],
         "unicode": "30",
         "label": "0",
         "svg": {
           "solid": {
             "width": 320,
             "height": 512,
             "path": "M0 192C0 103.6 71.6 32 160 32s160 71.6 160 160V320c0 88.4-71.6 160-160 160S0 408.4 0 320V192zM160 96c-53 0-96 43-96 96V320c0 53 43 96 96 96s96-43 96-96V192c0-53-43-96-96-96z"
           }
         }
       }
     }
     ```

6. **Remix Icon** (`remix_icon`)

   - Git: https://github.com/Remix-Design/remixicon.git
   - Branch: master
   - Icons Directory: icons
   - Metadata: **Categorized tags** - Central JSON file at `tags.json` organized by categories with multilingual support
   - ✅ Categories - Access: `tags.json` → category keys (e.g., "System", "Business", etc.)
   - **Generated Tags**: Find icon in category then use category name (e.g., for "add-box-fill": ["System"])
   - Example metadata (from `tags.json`):
     ```json
     {
       "System": {
         "cn": "系统",
         "en": "System",
         "icons": [
           "add-box-fill",
           "add-box-line",
           "add-circle-fill",
           "add-circle-line"
         ]
       }
     }
     ```

7. **Octicons** (`octicons`)

   - Git: https://github.com/primer/octicons.git
   - Branch: main
   - Icons Directory: icons
   - **Generated Tags**: Use `keywords.json` file. Structure is { [icon-name]: [keyword1, keyword2, ...] }. (e.g., for "accessibility": ["wheelchair", "disability"])
   - Example `keywords.json`:
     ```json
     {
      "agent": ["agents", "ai", "cloud", "cloudecode", "code"],
      "ai-model": ["ai", "model", "llm", "models", "copilot"],
      "alert": ["warning", "triangle", "exclamation", "point"],
      ...
     }
     ```

8. **Boxicons** (`boxicons`)

   - Git: https://github.com/atisawd/boxicons.git
   - Branch: master
   - Icons Directory: svg
   - Metadata: **Package-based** - Only package.json metadata available
   - **Generated Tags**: Split filepath (e.g., for "svg/regular/bx-home.svg": ["regular"])

9. **Ionicons** (`ionicons`)

   - Git: https://github.com/ionic-team/ionicons.git
   - Branch: main
   - Icons Directory: src/svg
   - Metadata: **Build-generated** - Central JSON file at `src/data.json`
   - ✅ Tags - Access: `src/data.json` → `icons[].tags` array
   - **Generated Tags**: Use `tags` array (e.g., for "airplane": ["flight", "plane", "travel", "transportation"])
   - Example metadata (from `src/data.json`):
     ```json
     {
       "icons": [
         {
           "name": "add",
           "tags": ["plus", "create", "new"]
         },
         {
           "name": "airplane",
           "tags": ["flight", "plane", "travel", "transportation"]
         }
       ]
     }
     ```

10. **Eva Icons** (`eva_icons`)

    - Git: https://github.com/akveo/eva-icons.git
    - Branch: master
    - Icons Directory: package/icons
    - Metadata: **None** - Only SVG files organized by fill/outline styles
    - **Generated Tags**: Use filepath (e.g., for "package/icons/outline/activity.svg": ["outline"])

11. **Tabler Icons** (`tabler_icons`)
    - Git: https://github.com/tabler/tabler-icons.git
    - Branch: main
    - Icons Directory: icons
    - Metadata: **Tags only** - Central JSON file at `aliases.json`
    - ✅ Tags - Access: `aliases.json` → `[icon-name]` array
    - **Generated Tags**: Use tags array (e.g., for "2fa": ["login", "safe", "secure", "security", "two-factor", "authentication"])
    - Example metadata (from `aliases.json`):
    ```json
    {
      "2fa": [
        "login",
        "safe",
        "secure",
        "security",
        "two-factor",
        "authentication"
      ],
      "a-b": [
        "letters",
        "alphabet",
        "test",
        "testing",
        "text",
        "type",
        "typography"
      ]
    }
    ```

## Cloning Instructions

Example to clone a repository to the correct location:

```bash
git clone --depth 1 --branch master https://github.com/tailwindlabs/heroicons.git tmp/repos/hero_icons
```

## Notes

- Typicons is commented out due to issues
- Total library count: 11 active providers
- All repositories should be cloned to `tmp/repos/<provider_name>` using snake_case names

# Current status summary:

Provider breakdown (sorted by tag detection rate)
octicons: 363/657 (55%)
simple_icons: 3209/3336 (96%)
remix_icon: 3006/3058 (98%)
hero_icons: 1288/1288 (100%)
lucide: 1614/1614 (100%)
feather_icons: 287/287 (100%)
font_awesome_free: 2060/2060 (100%)
boxicons: 1634/1634 (100%)
ionicons: 1357/1357 (100%)
eva_icons: 490/490 (100%)
tabler_icons: 5945/5945 (100%)

# TODO

- [ ] Ensure tags are uploaded to the database
  - [x] Add `tags` column to `icon` table
  - [ ] Update tests to verify that icons have tags