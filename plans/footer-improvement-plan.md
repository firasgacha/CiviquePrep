# Footer Improvement Plan

## Objective

Add the contact email (france-prep@proton.me) to the app footer as a clickable mailto link.

## Current State

- Footer in [`App.tsx`](src/App.tsx:133) displays copyright text with an otter emoji
- Footer styled in [`App.css`](src/App.css:1505)

## Implementation Steps

### Step 1: Add Translation Strings

Add new translation keys to all locale files for the contact email text:

- `src/i18n/locales/en.json`
- `src/i18n/locales/fr.json`
- `src/i18n/locales/ar.json`
- `src/i18n/locales/es.json`
- `src/i18n/locales/it.json`
- `src/i18n/locales/uk.json`
- `src/i18n/locales/zh.json`

New keys to add:

- `contactUs`: "Contact us at" (or localized equivalent)
- `contactEmail`: "france-prep@proton.me" (email address - no translation needed)

### Step 2: Update Footer in App.tsx

Modify the footer in [`App.tsx`](src/App.tsx:133) to include:

- Existing copyright text
- New contact email with mailto link
- Better layout with flexbox or stacked elements

### Step 3: Add CSS Styling

Enhance [`App.css`](src/App.css:1505) to style the new footer elements:

- Style the email link
- Add proper spacing between elements
- Ensure responsive design
