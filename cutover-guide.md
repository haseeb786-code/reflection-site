# Reflection Elite: Live Cutover & Safe Shopify Deactivation Guide

> **Phase:** Phase 6 — Production Cutover & Safe Decommissioning  
> **Target Store:** Reflection Elite (`reflectionelite.com`)  
> **Golden Rule:** NEVER cancel or pause Shopify until your new WooCommerce store has successfully processed a real, verified live test order.  

---

## 1. Step-by-Step Production Cutover Order

Follow this exact chronological sequence to ensure **zero store downtime** and **zero lost orders**:

### Step 1: Deploy to Production Web Hosting (~₹180–₹250/mo)
1. Purchase entry-level WordPress hosting on a reliable provider (e.g., **Hostinger India WordPress Starter** or **Namecheap Shared**).
2. Install a fresh WordPress site with 1 click from your hosting control panel.
3. Migrate your completed local site to your live host using the free **All-in-One WP Migration** or **Duplicator** plugin:
   - On LocalWP: Export your site file.
   - On Live Host: Import the site file. Everything (theme, products, images, settings) is transferred in under 3 minutes.

### Step 2: Point Domain DNS Records (Zero Downtime)
Depending on where your domain was registered:
* **If domain is registered inside Shopify**:
  1. Go to Shopify Admin > **Settings > Domains**.
  2. Click on your custom domain > **DNS Settings**.
  3. Update the **A Record (@)** to your new web hosting server IP address.
  4. Update the **CNAME (www)** to your new hosting server hostname.
* **If domain is with a registrar (GoDaddy, Namecheap, Cloudflare)**:
  1. Open your DNS management dashboard.
  2. Change the `@` A Record to point to your new hosting IP.
  *Note: DNS propagation usually takes between 15 minutes to 2 hours.*

### Step 3: Enable Free SSL Certificate (HTTPS)
1. In your new hosting control panel, click **SSL > Install Free Let's Encrypt SSL**.
2. Verify that visiting `https://reflectionelite.com` shows the secure padlock icon with zero browser warnings.

### Step 4: Verify 301 Redirects on the Live Domain
1. Test opening an old Shopify link in an incognito window:  
   `https://reflectionelite.com/products/antique-venetian-cushion`
2. Verify that your browser automatically forwards to:  
   `https://reflectionelite.com/product/antique-venetian-cushion/`
3. Verify that Google and social media traffic will smoothly land on the correct product pages.

---

## 2. Mandatory End-to-End Live Test Order

Before touching your Shopify plan, perform one real transaction:

1. Open your live site on a smartphone (disconnected from your home Wi-Fi, using mobile data).
2. Select a product (or a test product priced at ₹10).
3. Add to cart and proceed to checkout.
4. Complete the payment using a real UPI or Card transaction via Razorpay (or select Cash on Delivery).
5. **Verify the 3 results**:
   - [ ] Customer receives automated branded email invoice.
   - [ ] Store owner receives new order notification email.
   - [ ] Order appears in WooCommerce > Orders with "Processing" status.
6. Once verified, issue an immediate refund for your test order from the WooCommerce or Razorpay dashboard.

---

## 3. Safe Shopify Deactivation Protocol

Only after Step 2 confirms a successful live order, proceed with Shopify:

### Step 1: Archive Shopify Data for Tax & Legal Records
1. Go to Shopify Admin > **Orders > Export** > Export all orders as CSV.
2. Go to **Customers > Export** > Export all customer records.
3. Keep these files in your `c:\Users\haseeb\Desktop\shopify to wordpress\data\` folder for your 7-year accounting and GST records.

### Step 2: Choose Shopify Pause vs. Cancel
* **Option A: Pause and Build Plan ($9/month)**:
  - If you want to keep your Shopify admin accessible as a safety archive for 30–60 days, switch to the "Pause and Build" plan for $9/mo instead of the full $39/mo. Your storefront will be closed, but your backend data remains instantly accessible.
* **Option B: Full Cancellation ($0/month)**:
  - Go to Shopify Admin > **Settings > Plan**.
  - Click **Deactivate store** (or Cancel subscription).
  - Select a reason (e.g. "Migrated to another platform").
  - Confirm deactivation. You will never be billed by Shopify again.

---

## 4. Post-Cutover Maintenance Schedule (100% Free)

To keep your new store running fast and smoothly at zero software cost:

| Frequency | Task | Time Required |
| :--- | :--- | :--- |
| **Weekly** | UpdraftPlus automated backup runs automatically to Google Drive | 0 min (Automated) |
| **Monthly** | Log into WP Admin, review and update WooCommerce and plugins | 5 min |
| **Quarterly** | Check Google Search Console for any 404 crawl errors and add redirects | 10 min |
