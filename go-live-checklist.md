# Reflection Elite: Comprehensive Pre-Launch & Go-Live Checklist

> **Phase:** Phase 5 — Pre-Launch Verification & Quality Assurance  
> **Target Store:** Reflection Elite (Luxury Handcrafted Mirrors)  
> **Currency:** INR (₹)  
> **Status:** Review Mode — Verify each box before Phase 6 Cutover  

---

## 1. Catalog & Product Verification
- [ ] **All 9 Mirror Products Present**: Verified that all 9 products are published and visible in the catalog.
- [ ] **Variable Product Dropdowns**: 
  - *Modern Victorian*: Color dropdown switches between Silver (₹58,787.00) and Geometric (₹58,787.00).
  - *Mosaic Mirror Art*: Size & frame dropdown correctly updates prices between ₹2,500.00 and ₹7,500.00.
- [ ] **High-Resolution Images**: Each product has its primary featured image and secondary gallery images loading sharply.
- [ ] **Currency & Pricing**: Store currency is strictly set to Indian Rupee (`INR` / `₹`) with standard Indian numbering formatting.

---

## 2. Cart & Checkout Simulation
- [ ] **Add to Cart & Mini-Cart**: Clicking "Add to Cart" smoothly updates the cart drawer/header without page freeze.
- [ ] **Quantity & Deletion**: Modifying quantities or removing items recalculates cart totals instantly.
- [ ] **Indian Address Fields**: Pincode (6 digits), State dropdown, and Phone Number fields are required and properly validated.
- [ ] **Coupon / Discount Code Test**: Verified that creating and applying a test discount code (e.g. `WELCOME10`) correctly deducts from the subtotal.

---

## 3. Payment Gateway Configuration
- [ ] **Cash on Delivery (COD)**:
  - Enabled in WooCommerce > Settings > Payments.
  - Optional safety rule: Set an upper price limit for COD (e.g. disable COD for orders over ₹30,000 to prevent delivery refusal on custom mirrors).
- [ ] **Razorpay Payment Gateway (UPI / Cards / NetBanking)**:
  - Official `WooCommerce Razorpay` plugin installed.
  - Tested in **Test Mode** (Sandbox) using Razorpay test API keys (`rzp_test_...`) to verify that the popup launches and marks the order as "Processing".
  - Live API keys entered and saved before public launch.

---

## 4. Shipping Rules (Fragile Glass Handling)
- [ ] **Shipping Zones**: Configured for domestic India delivery (WooCommerce > Settings > Shipping).
- [ ] **Shipping Rates**: Set Free Shipping threshold (e.g. Orders over ₹20,000) or Flat Rate for heavy crated mirror packaging.
- [ ] **Fragile Transit Notice**: Clear disclaimer added to product pages or checkout regarding reinforced wooden crate packaging and unboxing inspection policies.

---

## 5. Automated Email Confirmations
- [ ] **Customer Order Receipt**: Tested that when an order is placed, an automated branded invoice email arrives in the customer's inbox.
- [ ] **Admin New Order Alert**: Store owner receives an instant notification email (`info@reflectionelite.com`) with customer contact and order items.
- [ ] **SMTP Email Delivery**: Installed free **WP Mail SMTP** or **FluentSMTP** plugin with a free Gmail/SendGrid account so notification emails never land in customer spam folders.

---

## 6. Mobile Optimization & Speed
- [ ] **Mobile Responsiveness**: Tested site layout on mobile view (navigation drawer, readable typography, tap-friendly buttons).
- [ ] **Sticky 'Buy Now' / 'Add to Cart'**: Smooth scrolling on mobile product pages.
- [ ] **Image Optimization**: Verified that images are compressed (.webp / optimized jpg) and load under 2 seconds.

---

## 7. Security, SSL & Automated Backups
- [ ] **SSL (HTTPS)**: Padlock icon active across all pages, especially cart and checkout (`https://reflectionelite.com`).
- [ ] **Automated Backups (100% Free)**:
  - Installed free **UpdraftPlus** plugin.
  - Linked to a free Google Drive or Dropbox account for automated weekly backups of database and media files.
- [ ] **Security Hardening**: Installed free **Wordfence Security** or **Solid Security** to block brute-force login attempts.

---

## 8. SEO & 301 Redirect Check
- [ ] **301 Redirects Active**: Tested old Shopify URL (e.g. `/products/antique-venetian-cushion`) to verify it automatically forwards to `/product/antique-venetian-cushion/`.
- [ ] **XML Sitemap Ready**: Sitemap URL (`/wp-sitemap.xml` or Rank Math / Yoast sitemap) ready for submission to Google Search Console upon domain cutover.
