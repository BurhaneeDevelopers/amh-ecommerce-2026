# Ad Placements Guide

## Overview
This guide explains all available ad placements in your MSI E-Commerce website and how to use them.

---

## Homepage Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER / NAVBAR                       │
├──────────────┬──────────────────────────┬───────────────────┤
│              │                          │                   │
│ LEFT COLUMN  │     MAIN CONTENT         │  RIGHT COLUMN     │
│              │                          │                   │
│ ┌──────────┐ │ ┌──────────────────────┐ │ ┌───────────────┐│
│ │Categories│ │ │  [1] banner_slider   │ │ │ Bestsellers   ││
│ └──────────┘ │ │  (Main Carousel)     │ │ │ (Dynamic)     ││
│              │ └──────────────────────┘ │ └───────────────┘│
│ ┌──────────┐ │                          │                   │
│ │[4]       │ │ ┌──────────────────────┐ │ ┌───────────────┐│
│ │shop_now  │ │ │  Featured Products   │ │ │[6] homepage   ││
│ │          │ │ │  (Product Grid)      │ │ │_right_banner  ││
│ └──────────┘ │ └──────────────────────┘ │ └───────────────┘│
│              │                          │                   │
│ Newsletter   │ ┌──────────────────────┐ │ ┌───────────────┐│
│              │ │  Testimonials        │ │ │[3] off_product││
│              │ └──────────────────────┘ │ │ (Promo Banner)││
│              │                          │ └───────────────┘│
│              │ ┌──────────────────────┐ │                   │
│              │ │  Blog Posts          │ │ ┌───────────────┐│
│              │ └──────────────────────┘ │ │[8] featured   ││
│              │                          │ │_deal          ││
│              │                          │ │ (NEW!)        ││
│              │                          │ └───────────────┘│
│              │                          │                   │
│              │                          │ ┌───────────────┐│
│              │                          │ │[7] homepage   ││
│              │                          │ │_right_banner_2││
│              │                          │ └───────────────┘│
└──────────────┴──────────────────────────┴───────────────────┘
│                        FOOTER                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Ad Placement Details

### 1. `banner_slider` - Main Banner Carousel
**Location:** Top of main content area  
**Size:** Full width of main column  
**Format:** Image/Video carousel  
**Purpose:** Primary promotional space, hero banners  
**Best For:** Major sales, new product launches, brand campaigns  
**Recommended Size:** 1920x600px (desktop), responsive  

**Dashboard Setup:**
- Placement: `banner_slider`
- Multiple ads will rotate in carousel
- Set `order_index` for slide order

---

### 2. `deal_of_the_day` - Reserved for Future Use
**Status:** Currently not displayed  
**Purpose:** Reserved for special daily deals feature  
**Note:** Can be activated later for time-limited offers  

---

### 3. `off_product` - Promotional Banner
**Location:** Right column, middle section  
**Size:** Tall vertical banner  
**Format:** Image with overlay  
**Purpose:** Special offers, discounts  
**Best For:** "Flat 30% OFF" type promotions  
**Recommended Size:** 400x512px  

**Dashboard Setup:**
- Placement: `off_product`
- Add title (e.g., "Power Bits")
- Add description (e.g., "Flat 30% OFF on")
- Add click URL for shop page

**Example:**
```
Title: Power Bits
Description: Flat 30% OFF on
Click URL: /products/power-bits
```

---

### 4. `shop_now` - Left Column Banner
**Location:** Left sidebar, below categories  
**Size:** Medium rectangular banner  
**Format:** Image with CTA button  
**Purpose:** Category promotions, featured collections  
**Best For:** Driving traffic to specific product categories  
**Recommended Size:** 300x200px  

**Dashboard Setup:**
- Placement: `shop_now`
- Add compelling title
- Add description
- Add click URL

---

### 5. `mobile_deals` - Mobile Special Offers
**Location:** Mobile view only, below main content  
**Size:** Full width cards  
**Format:** Image cards with badges  
**Purpose:** Mobile-specific promotions  
**Best For:** App downloads, mobile-exclusive deals  
**Recommended Size:** 800x300px  

**Dashboard Setup:**
- Placement: `mobile_deals`
- Can add multiple ads (shows up to 3)
- Displays with "Hot Deal", "Limited", "Special" badges

---

### 6. `homepage_right_banner` - Right Column Ad #1
**Location:** Right column, top section (below bestsellers)  
**Size:** Medium rectangular banner  
**Format:** Image with gradient overlay  
**Purpose:** Secondary promotions, brand awareness  
**Best For:** New arrivals, featured brands  
**Recommended Size:** 400x320px  

**Dashboard Setup:**
- Placement: `homepage_right_banner`
- Add title and description
- Add "Learn More" click URL

---

### 7. `homepage_right_banner_2` - Right Column Ad #2
**Location:** Right column, bottom section  
**Size:** Medium rectangular banner  
**Format:** Image with gradient overlay  
**Purpose:** Additional promotional space  
**Best For:** Seasonal offers, clearance sales  
**Recommended Size:** 400x320px  

**Dashboard Setup:**
- Placement: `homepage_right_banner_2`
- Same format as homepage_right_banner
- Different content for variety

---

### 8. `featured_deal` - Featured Deal Section (NEW!)
**Location:** Right column, between off_product and homepage_right_banner_2  
**Size:** Square product showcase  
**Format:** Product image with "HOT DEAL" badge  
**Purpose:** Highlight single product with special offer  
**Best For:** Flash sales, limited-time deals, clearance items  
**Recommended Size:** 500x500px (square)  

**Dashboard Setup:**
- Placement: `featured_deal`
- Add product name as title
- Add model/description
- Add product page URL as click_url

**Example:**
```
Title: Cordless Drill Pro 2000
Description: Professional Grade - 50% OFF Today Only
Click URL: /products/cordless-drill-pro-2000
Media: Square product image (500x500px)
```

**Design Features:**
- Orange-to-red gradient header with sparkles icon
- "HOT DEAL" badge with pulse animation
- Square aspect ratio for product image
- "Get This Deal" CTA button

**This replaces the old "Dealer's Choice" section**

---

## Quick Reference Table

| Placement Name | Location | Size | Priority | Best For |
|---------------|----------|------|----------|----------|
| `banner_slider` | Main top | XL | Highest | Hero banners, major campaigns |
| `homepage_right_banner` | Right top | M | High | Featured products, brands |
| `off_product` | Right middle | L | High | Discount promotions |
| `featured_deal` | Right middle | M | High | Single product deals |
| `homepage_right_banner_2` | Right bottom | M | Medium | Secondary promotions |
| `shop_now` | Left middle | M | Medium | Category promotions |
| `mobile_deals` | Mobile only | L | Medium | Mobile-exclusive offers |
| `deal_of_the_day` | Reserved | - | - | Future use |

---

## How to Create Ads in Dashboard

### Step 1: Navigate to Ads Management
Go to your admin dashboard → Ads section

### Step 2: Create New Ad
Click "Create New Ad" button

### Step 3: Fill in Details
- **Title:** Product/offer name (required)
- **Description:** Additional details (optional)
- **Media URL:** Upload image or enter URL (required)
- **Click URL:** Where users go when clicking (optional)
- **Placement:** Select from dropdown (required)
- **Type:** Image or Video
- **Start Date:** When ad becomes active (optional)
- **End Date:** When ad expires (optional)
- **Is Active:** Toggle on to display
- **Order Index:** For carousels, lower = first (optional)

### Step 4: Save and Activate
- Click "Save"
- Toggle "Is Active" to ON
- Ad will appear immediately on the website

---

## Best Practices

### Image Specifications:
- **Format:** JPG or PNG (WebP for better performance)
- **Quality:** High resolution, optimized for web
- **File Size:** Under 500KB for fast loading
- **Aspect Ratio:** Match recommended sizes above

### Content Guidelines:
- **Title:** Clear, concise, action-oriented
- **Description:** Brief, highlight key benefit
- **CTA:** Use action verbs (Shop Now, Get Deal, Learn More)
- **Urgency:** Add time limits when applicable

### Performance Tips:
- Rotate ads regularly to prevent banner blindness
- A/B test different images and copy
- Use high-quality product photos
- Ensure click URLs work correctly
- Set expiration dates for time-limited offers

### Mobile Optimization:
- Test all ads on mobile devices
- Ensure text is readable on small screens
- Use mobile-specific placements when needed
- Keep file sizes small for faster loading

---

## Troubleshooting

### Ad Not Showing?
1. Check "Is Active" is toggled ON
2. Verify placement name is exactly correct
3. Check start/end dates are valid
4. Ensure media URL is accessible
5. Clear browser cache and refresh

### Wrong Ad Showing?
1. Check `order_index` for carousels
2. Verify only one ad per placement (except carousel)
3. Check if multiple ads are active for same placement

### Image Not Loading?
1. Verify media URL is correct and accessible
2. Check image file format (JPG, PNG, WebP)
3. Ensure image is uploaded to public storage
4. Check file permissions

---

## Examples

### Example 1: Flash Sale Banner
```
Placement: banner_slider
Title: 48-Hour Flash Sale
Description: Up to 70% OFF Power Tools
Media: /images/flash-sale-banner.jpg
Click URL: /products?sale=true
Is Active: Yes
Order Index: 1
```

### Example 2: Featured Deal
```
Placement: featured_deal
Title: Professional Drill Set
Description: Complete 20-piece set - Limited Stock
Media: /images/drill-set-square.jpg
Click URL: /products/professional-drill-set
Is Active: Yes
```

### Example 3: Category Promotion
```
Placement: shop_now
Title: New Welding Equipment
Description: Professional grade, best prices
Media: /images/welding-promo.jpg
Click URL: /products?category=welding
Is Active: Yes
```

---

## Support

For questions or issues with ad placements:
1. Check this guide first
2. Verify placement names match exactly
3. Test on different devices
4. Contact technical support if issues persist

**Last Updated:** 2025  
**Version:** 2.0 (with featured_deal placement)
