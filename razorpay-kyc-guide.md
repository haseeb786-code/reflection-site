# Reflection Elite: Razorpay KYC & Indian E-Commerce Setup Guide

> **Prepared for:** Reflection Elite  
> **Target Payment Solution:** Razorpay (UPI, RuPay, Cards, NetBanking) + Safe COD  
> **Purpose:** Ensure 100% first-time approval for Razorpay merchant activation without rejections.  

---

## 1. Why Razorpay KYC is Mandatory
Under Reserve Bank of India (RBI) guidelines, all payment aggregators must complete strict merchant identity and business verification before settling customer funds to your bank account.

---

## 2. Mandatory Verification Documents

Have these clear PDF/photo copies ready:
1. **Business Owner PAN Card**: (Individual/Proprietor PAN or Business PAN).
2. **Identity & Address Proof**: Aadhaar Card, Passport, or Voter ID.
3. **Bank Account Proof**: Cancelled cheque or bank statement showing:
   - Account Holder Name (Must match PAN).
   - Account Number & IFSC Code.
4. **GSTIN (If registered)**: GST Certificate (mandatory if annual turnover exceeds ₹40 Lakhs for goods, or if selling inter-state).

---

## 3. Mandatory Website Compliance (We Already Generated These for You!)
Razorpay will inspect your website before activating live payments. They reject websites missing any of these 5 items:

- [x] **Refund & Cancellation Policy**: Generated in [`templates/refund_and_cancellation_policy.md`](templates/refund_and_cancellation_policy.md).
- [x] **Shipping & Delivery Policy**: Generated in [`templates/shipping_and_delivery_policy.md`](templates/shipping_and_delivery_policy.md).
- [x] **Terms & Conditions**: Generated in [`templates/terms_and_conditions.md`](templates/terms_and_conditions.md).
- [x] **Privacy Policy**: Generated in [`templates/privacy_policy.md`](templates/privacy_policy.md).
- [ ] **Contact Us Page**: Must display your official email, phone/WhatsApp number, and physical workshop/business address in India.

---

## 4. Crucial Business Rule: Protecting Against COD Losses on Mirrors

> [!CAUTION]
> **Do NOT offer unlimited Cash on Delivery for expensive mirrors!**  
> If an ₹81,500 Venetian mirror is ordered via COD and rejected at the doorstep, you lose:
> - Heavy two-way crated freight charges (~₹3,000–₹5,000).
> - Severe risk of glass breakage during return transit.
> 
> **Recommended COD Settings in WooCommerce:**
> 1. Set an **Upper Order Limit** for COD (e.g. Max ₹5,000 to ₹10,000 for accessories/decor only).
> 2. For custom or high-value mirrors (₹30,000+), require 100% online prepayment via Razorpay (UPI/Card), or a 20% non-refundable advance deposit.

---

## 5. Domain Transfer & Shopify Trap Checklist

If you purchased your custom domain (e.g. `reflectionelite.com`) through Shopify:
1. **60-Day Lock Rule**: ICANN prohibits transferring domains to another registrar within 60 days of purchase.
2. **Zero Downtime Solution**: You do **not** have to transfer the domain right away. You can simply change the **DNS A Record** in Shopify to point to your new hosting server. The website will load instantly from your new host while your domain stays safe.
