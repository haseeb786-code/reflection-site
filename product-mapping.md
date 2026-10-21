# Reflection Elite: Shopify to WooCommerce Product Field Mapping

> **Phase:** Phase 3 — Staging & Import Preparation  
> **Source:** `data/shopify_export.json` & Shopify Admin CSV  
> **Target:** `data/woocommerce_products.csv` (WooCommerce Core CSV Format)  

---

## 1. Column-by-Column Schema Mapping

| Shopify Field | WooCommerce CSV Column | Transformation / Rule Applied | Reflection Elite Example |
| :--- | :--- | :--- | :--- |
| `Title` | `Name` | Direct mapping | `Antique venetian cushion` |
| `Handle` | *Slug* | Lowercase, hyphen-delimited | `antique-venetian-cushion` |
| `Body (HTML)` | `Description` | Preserved rich HTML, specifications & dimensions | Handcrafted glass description |
| `Variant SKU` | `SKU` | Auto-generated standardized store SKU prefix (`REF-`) | `REF-ANTIQUE-VENETIAN-CUSHION` |
| `Variant Price` | `Regular price` | Preserved exact price in INR (`₹`) | `81500.00` |
| `Product Category` | `Categories` | Mapped to WooCommerce taxonomy | `Venetian Mirrors > Antique Venetian` |
| `Tags` | `Tags` | Comma-separated search tags | `mirror, luxury, venetian` |
| `Images` | `Images` | Filename mapping to local assets in `assets/images/` | `antique-venetian-cushion-1.webp` |
| `Option 1 Name` | `Attribute 1 name` | Variable attribute name (e.g., Size, Dimension) | `Size` |
| `Option 1 Value` | `Attribute 1 value(s)` | Variant values for dropdown selection | `42x48 inches` |
| *Product Structure* | `Type` | Set to `simple` for single products, or `variable` for parents and `variation` for children | `variable` & `variation` |
| `Variant Inventory Qty` | `Stock` | Set stock quantity or default in-stock status | `In stock? = 1` |

---

## 2. Product Catalog Breakdown (9 Total)

### A. Simple Products (7 Products)
1. **Antique Venetian Cushion** — Price: ₹81,500.00 | SKU: `REF-ANTIQUE-VENETIAN-CUSHION`
2. **Customised Mirror** — Price: ₹55,000.00 | SKU: `REF-CUSTOMISED-MIRROR`
3. **High Strength Metal Materials** — Price: ₹45,000.00 | SKU: `REF-HIGH-STRENGTH-METAL`
4. **Premium Upholstered Frame** — Price: ₹38,000.00 | SKU: `REF-PREMIUM-UPHOLSTERED`
5. **Rococo Floral Pattern** — Price: ₹14,000.00 | SKU: `REF-ROCOCO-FLORAL`
6. **Silver Crown Framed** — Price: ₹35,900.00 | SKU: `REF-SILVER-CROWN-FRAMED`
7. **Venetian Mirror** — Price: ₹62,000.00 | SKU: `REF-VENETIAN-MIRROR`

### B. Variable Products with Options (2 Products, 4 Variants)
1. **Modern Victorian** (Parent: `REF-MODERN-VICTORIAN`)
   - Variant 1: ₹58,787.00
   - Variant 2: ₹64,500.00
2. **Mosaic Mirror Art** (Parent: `REF-MOSAIC-MIRROR-ART`)
   - Variant 1 (42x48 inches): ₹7,500.00
   - Variant 2 (48x60 inches): ₹9,800.00

---

## 3. Test Batch Import Strategy (3 Products)
Before importing all 9 products into WooCommerce, we import this 3-product test batch:
1. `Antique venetian cushion` (tests luxury simple product layout + multi-image gallery).
2. `Modern victorian` (tests 2-variant dropdown selection and dynamic pricing).
3. `Mosaic mirror art` (tests dimensional size variations).
