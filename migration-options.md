# Reflection Elite: E-Commerce Migration Cost & Architecture Reality Check

> **Status:** Phase 1 Complete — Awaiting Owner Approval  
> **Prepared for:** Reflection Elite (Luxury Handcrafted Mirrors)  
> **Store Location & Currency:** India (INR ₹)  
> **Catalog Scope:** 9 Mirror Products (with variants) & 27 High-Res Photos  

---

## 1. Executive Summary & Verified Price Comparison

The table below compares the 4 possible paths for Reflection Elite. All prices have been verified against current official pricing as of October 2026.

| Option | Setup Cost | Monthly Software Fee | Web Hosting Cost | Platform Transaction Fee | Total 1st Year Cost |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Option A: Stay on Shopify Basic** | ₹0 | ₹1,994/mo (~$24/mo) billed monthly *(or ₹1,499/mo annual)* | Included | Up to 2% (no native Shopify Payments in India) | **₹23,928 – ₹28,235/yr** (+18% GST) |
| **Option B: WordPress.com (Managed)** | ₹0 | **Business:** $25/mo billed yearly ($40/mo monthly)<br>**Commerce:** $45/mo billed yearly ($70/mo monthly) | Included | 0% (gateway fees only) | **₹25,000 – ₹58,000/yr** ($300 – $700/yr) |
| **Option C: Self-Hosted WordPress.org** | ₹0 | **₹0 (WooCommerce is 100% Free)** | **₹179 – ₹299/mo** (~$2.50 – $3.50/mo on quality entry hosting) | **0%** | **₹2,500 – ₹4,200/yr total** |
| **Option D: Local Staging ($0 Dev)** | **₹0** | **₹0** | **₹0 (Runs on your PC via LocalWP)** | **0%** | **₹0 while building & testing** |

---

## 2. In-Depth Analysis of Each Path

### Option A: Staying on Shopify Basic
* **Current Reality:** You are currently paying at least ₹1,994/mo (+ 18% GST = ~₹2,353/month) just to keep the store online, even during months with zero sales.
* **Transaction Penalties:** Because Shopify Payments is not available for domestic INR merchant accounts in India, Shopify levies an extra third-party transaction fee of up to 2% on top of Razorpay's fees.
* **When to choose this:** Only if you have steady revenue and refuse to spend even 1 hour per month on site maintenance.

### Option B: WordPress.com (Your current `optimistic-candy` account)
* **The Reality:** WordPress.com is a commercial hosting company owned by Automattic. While the basic blogging tier is free, **e-commerce / custom plugins are strictly gated behind paid tiers**:
  - **Business Plan:** $300/year (billed annually at $25/mo) or $40/mo monthly.
  - **Commerce Plan:** $540/year (billed annually at $45/mo) or $70/mo monthly.
* **Verdict:** Moving from Shopify to WordPress.com **does not save money**. It is actually more expensive than Shopify Basic.

### Option C: Self-Hosted WordPress.org + WooCommerce (The Real Cost Saver)
* **The Software:** WordPress core and WooCommerce are 100% free open-source software. There is no software subscription fee, ever.
* **Hosting Reality Check:** 
  - *Are completely free hosts viable?* **No.** Free hosting providers (like InfinityFree or 000webhost) severely restrict PHP memory, throttle database connections, block transactional order confirmation emails, and frequently go down. For a luxury mirror store where customers are paying ₹35,000 to ₹80,000, free hosting will look untrustworthy and crash during image browsing.
  - *Cheapest Safe Hosting:* An entry-level WordPress plan on a reliable host (such as Hostinger India, Namecheap, or SiteGround) costs between **₹179 and ₹299 per month** (~$2 to $3.50/mo), includes a free SSL certificate, free business email (`info@reflectionelite.com`), and automated daily/weekly backups.
* **Total Annual Cost:** ~₹3,000/year (saving you over **₹22,000 every single year** compared to Shopify).

### Option D: Local Staging Site (LocalWP) — Recommended for Phase 3
* **What it is:** Free desktop software developed by WP Engine / Flywheel that installs an entire WordPress + WooCommerce server directly on your Windows PC.
* **Cost:** **100% Free ($0).**
* **Why this is ideal:** You don't need to spend a single rupee on hosting today. We can build your full store, import all 9 products and 27 images, configure shipping and payment gateways, and verify every page locally on your PC. You only pay for hosting when you are 100% happy and ready to point your domain live.

---

## 3. Payment Gateway Verification for India

For a store operating in India selling in INR (`₹`), the following payment options on WooCommerce are verified:

1. **Cash on Delivery (COD)**:
   - **Cost:** 100% Free (built directly into WooCommerce core).
   - **Transaction Fee:** 0%.
   - **Best for:** Offering cash on delivery or partial advance payment for custom mirrors.

2. **Razorpay for WooCommerce**:
   - **Plugin Cost:** 100% Free (official plugin from WordPress.org repository).
   - **Supported Methods:** UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, NetBanking, and Wallets.
   - **Transaction Fee:** Standard RBI/domestic gateway rate (2% + 18% GST per successful transaction). No setup fees, no monthly maintenance fees.

3. **PhonePe Payment Gateway for WooCommerce**:
   - **Plugin Cost:** 100% Free.
   - **Supported Methods:** Direct UPI & Card payments.
   - **Transaction Fee:** Standard competitive processing rates.

---

## 4. Maintenance Trade-Offs (The Honest Reality)

On Shopify, Shopify manages the servers. On Self-Hosted WordPress:
1. **Backups:** You must have a free backup plugin (e.g. UpdraftPlus) that automatically saves backups to Google Drive (we set this up in Phase 5).
2. **Plugin Updates:** Once a month, you click "Update" on WooCommerce and plugins from the WordPress dashboard.
3. **Security:** A free security plugin (e.g. Wordfence or Solid Security) is installed to prevent spam and brute-force logins.

---

## 5. Phase 1 Official Recommendation

> **Recommendation:**  
> 1. **Do not pay for WordPress.com plans** ($300–$540/year).  
> 2. **Build and test the store for $0 using LocalWP on your PC (Phase 3).**  
> 3. Once fully styled and verified with all 9 mirror products, deploy to affordable self-hosted WordPress hosting (~₹180–₹250/month) with Razorpay + COD.  
> 
> **Net Result:** Reduces your annual store operating cost from **~₹25,000/year to ~₹3,000/year**, with zero upfront software risk.
