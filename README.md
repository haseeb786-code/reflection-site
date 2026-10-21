# Reflection Elite — Shopify to WordPress / WooCommerce Migration

Comprehensive migration, automation, and custom styling repository for **Reflection Elite** luxury mirrors and decor (`https://reflectionelite.com`).

---

## Overview

This repository contains the full engineering suite used to migrate Reflection Elite from Shopify to WordPress / WooCommerce, including:
- **Custom Plugins**: Luxury styling, Bitcoin/Crypto payment gateway, and UI customization plugins.
- **Migration & ETL Scripts**: Automated Shopify export, product transformation, media downloads, and REST/Puppeteer loaders.
- **Visual & Functional Audits**: Automated visual testing, responsive viewport verification (desktop, tablet, mobile), and checkout gateway auditing.
- **Custom Templates & Assets**: Luxury typography, custom banner slides, and high-conversion landing page layouts.

---

## Directory Structure

- `plugins/` & `reflection-elite-*/`: Custom WordPress/WooCommerce plugins for luxury styling and payments.
- `scripts/`: Node.js scripts for migration, visual regression, audit, and WordPress REST API interactions.
- `assets/` & `ad_creative_pictures/`: Media, mirror imagery, badges, and creative assets.
- `data/`: Exported and transformed product catalogs, category definitions, and migration mappings.
- `templates/`: Custom templates, headers, footers, and layouts.
- `tests/`: End-to-end and integration tests.
- `mcp-server/`: Model Context Protocol server tools for WordPress automation.

---

## Setup & Prerequisites

1. **Clone the repository:**
   ```bash
   git clone https://github.com/haseeb786-code/reflection-site.git
   cd reflection-site
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy the example environment file and populate your credentials:
   ```bash
   cp .env.example .env
   ```

---

## Available NPM Scripts

- `npm run export`: Export products and data from Shopify.
- `npm run download-media`: Download product media from Shopify CDN.
- `npm run transform`: Transform exported Shopify JSON into WooCommerce-compliant schema.
- `npm run migrate`: Push transformed products and attributes to WordPress via REST API.
- `npm run audit`: Run comprehensive WordPress storefront and checkout audit.
- `npm run test`: Run end-to-end test suite.
- `npm run test:live`: Run live production verification tests.

---

## Security

- Sensitive credentials, API keys, and session cookies are strictly excluded from source control via `.gitignore`.
- Always use environment variables (`.env`) for local execution.
