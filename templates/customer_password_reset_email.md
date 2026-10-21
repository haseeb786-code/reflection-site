# Reflection Elite: Customer Password Reset Email Template

> **Subject:** Welcome to the new Reflection Elite store! Please set your new password  
> **From:** Reflection Elite <info@reflectionelite.com>  
> **Trigger:** Sent to existing customers upon WooCommerce store launch  

---

## Email Copy:

Dear {{ customer.first_name | default: "Valued Customer" }},

We are thrilled to announce that we have upgraded the **Reflection Elite** website to provide you with an even faster, smoother shopping experience for our handcrafted luxury mirrors.

Because we take your privacy and data security seriously, **we never store or transfer plain-text passwords**. Your account details and order history have been safely moved to our new platform, but you will need to set a new password to access your account.

### 👉 How to access your upgraded account:
1. Click the secure link below:  
   **[Reset My Password]({{ reset_password_url }})**
2. Choose your new secure password.
3. You are all set! You can log in and view our full handcrafted mirror collection.

If you have any questions or need assistance with a past order, simply reply to this email or contact us via WhatsApp at **+91 [YOUR PHONE NUMBER]**.

Thank you for being a valued part of the Reflection Elite family.

Warm regards,  
**The Reflection Elite Team**  
*Bespoke Handcrafted Mirrors*  
[https://reflectionelite.com](https://reflectionelite.com)
