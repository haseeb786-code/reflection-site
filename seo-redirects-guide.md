# Reflection Elite: SEO Preservation & 301 Redirect Guide

> **Phase:** Phase 4 — SEO & Traffic Preservation  
> **Target:** 16 Redirect Rules (9 Products, 5 Categories, 2 Pages)  
> **Cost:** 100% Free  

---

## 1. Why 301 Redirects are Crucial
On Shopify, products and collections use these URL structures:
- Shopify Products: `/products/handle`
- Shopify Collections: `/collections/handle`
- Shopify Pages: `/pages/handle`

On WooCommerce, standard WordPress permalinks use:
- WooCommerce Products: `/product/handle/`
- WooCommerce Categories: `/product-category/handle/`
- Standard Pages: `/handle/`

Without 301 redirects, any customer clicking an old link from Google search, Instagram, Pinterest, or WhatsApp will hit an ugly **"404 Not Found"** error, and Google will drop your search rankings. A **301 Redirect** permanently tells browsers and Google: *"This page has moved permanently to the new WooCommerce URL. Transfer 100% of the SEO ranking juice here."*

---

## 2. Free Method 1: The "Redirection" Plugin (Recommended for Beginners)

The **Redirection** plugin by John Godley is the most popular, 100% free redirect plugin for WordPress (no premium upsells, no ads).

### How to use it:
1. In your WordPress admin dashboard (local or live), go to **Plugins > Add New**.
2. Search for **Redirection**, click **Install Now** and **Activate**.
3. Go to **Tools > Redirection** and complete the quick 1-minute setup wizard.
4. Click the **Import/Export** tab at the top of the Redirection screen.
5. In the **Import** section, click **Choose File** and select:  
   `C:\Users\haseeb\Desktop\shopify to wordpress\data\seo_301_redirects.csv`
6. Click **Upload**.
7. All 16 redirects are immediately active! When someone visits `/products/antique-venetian-cushion`, they will instantly and automatically land on `/product/antique-venetian-cushion/`.

---

## 3. Free Method 2: Server-Level Redirects (.htaccess or Nginx)

If you prefer server-level redirects without installing any plugin:
- For **Apache / Litespeed servers**: Copy the contents of [`seo_redirects.htaccess`](file:///c:/Users/haseeb/Desktop/shopify%20to%20wordpress/seo_redirects.htaccess) into the root `.htaccess` file of your WordPress hosting.
- Server-level redirects execute in less than 5 milliseconds before WordPress even loads.

---

## 4. The Realistic SEO Traffic Fluctuation Warning

> [!WARNING]
> **Expect a Temporary Search Traffic Dip (Normal & Temporary):**  
> Even with 100% flawless 301 redirects, migrating from Shopify to WooCommerce changes server IP, SSL certificates, HTML markup, and page rendering structures.  
> 
> - **Week 1 to Week 3:** Google's search crawlers must visit your old URLs, register the `301 Moved Permanently` header, and index the new URLs. You may experience a temporary **5% to 15% fluctuation in organic search impressions**.
> - **Week 4 to Week 8:** Google completes the index transfer, ranking power stabilizes, and rankings return to normal (often improving due to faster load speeds and cleaner WooCommerce code).
> - **Recommendation:** Do not make major content changes or alter meta titles during the first 30 days after cutover. Let Google cleanly recognize the new site first.
