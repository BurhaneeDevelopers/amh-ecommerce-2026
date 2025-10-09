export interface Category {
  id?: string | null;
  category_name: string;
  slug: string;
  parent_id: string | null;
  order: number;
  icon?: string | null;
  created_at?: string;
  type: "sub" | "main";

  // ✅ New field for self join
  parent_category_name?: string | null;
}

export interface Brand {
  id?: string | null;
  brand_logo: string;
  brand_name: string;
  slug: string;
  created_at?: Date | string;
  updated_at?: Date | string | null;
}

export interface Product {
  id?: string | null;
  model_tally_name: string; // unique internal identifier linking to warehouse stock
  product_name: string;
  model_number: string;
  specifications: string[]; // array of specification strings
  pcs_per_crtn: number; // pieces per carton
  accessories?: string[]; // optional for future multi-tag linking
  spares?: string[]; // optional for future multi-tag linking
  photos: string[]; // array of URLs
  videos?: string[]; // optional array of URLs
  brand_id: string | null; // FK to Brand
  category_id: string | null; // FK to Category (main or sub)
  capacity?: string; // e.g., 'DIY', 'Professional', 'Industrial'
  is_on_sale: boolean;
  is_featured: boolean;
  on_hand_qty: number;
  stock_status?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  
  // Joined data from related tables
  brand?: {
    id: string;
    brand_name: string;
    brand_logo: string;
  };
  category?: {
    id: string;
    category_name: string;
    type: string;
  };
  capacity_data?: {
    id: string;
    capacity_name: string;
    slug: string;
  };
}

// Wishlist Table
export interface Wishlist {
  id?: string;
  user_id: string; // FK to Users table
  product_id: string // FK to Products table
  created_at?: string;
}

// Wishlist with joined Product data
export interface WishlistWithProduct {
  id?: string;
  user_id: string;
  product_id: string;
  created_at?: string;
  products: {
    id: string;
    product_name: string;
    model_number: string;
    model_tally_name: string;
    specifications: string[];
    photos: string[];
    brand_id: string | null;
    category_id: string | null;
    is_on_sale: boolean;
    is_featured: boolean;
    on_hand_qty: number;
    stock_status?: boolean;
  };
}

// User Accounts (Portal)
export interface User_Profile {
  id?: string; // matches Supabase Auth user_id
  full_name?: string;
  email: string;
  password: string;
  phone?: string;
  company_name?: string;
  profile_image?: string;
}

// Enquiry History (if implemented later)
export interface Enquiry {
  id?: string;
  user_id: string; // FK to Users
  products: string[]; // FK to Product
  full_name: string;
  email: string;
  phone_number: string;
  quantity: string;
  city: string;
  company_name: string;
  message: string;
}

// Capacity
export interface Capacity {
  id?: string | null;
  capacity_name: string;
  slug: string;
}

// Accessories
export interface Accessories {
  id?: string | null;
  accessory_name: string;
  category_id: string;
  accessory_image: string[];
  category?: {
    id: string;
    category_name: string;
  };
  slug: string;
}

// Spares
export interface Spares {
  id?: string | null;
  spare_name: string;
  spare_image: string[];
  category_id: string;
  category?: {
    id: string;
    category_name: string;
  };
  slug: string;
}

// NewsLetter
export interface NewsLetter {
  id: string;
  email: string;
  created_at?: string;
}

// Announcement
export interface Announcement {
  id?: string | null;
  headline: string;
  type: "danger" | "info" | "warning";
  is_scrolling: boolean;
  is_active: boolean;
  start_date: string;
  end_date: string;
  updated_at?: string;
}

// Ads
export type AdPlacement =
  | "banner_slider"
  | "deal_of_the_day"
  | "off_product"
  | "shop_now"
  | "mobile_deals"
  | "homepage_right_banner";

export type AdType = "image" | "video";

export interface Ad {
  id?: string | null;
  title: string;
  description?: string | null;
  media_url: string; // public URL to image/video
  click_url?: string | null; // optional CTA target
  placement: AdPlacement;
  type: AdType;
  start_date?: string | null;
  end_date?: string | null;
  is_active: boolean;
  order_index?: number | null; // for carousels, ascending priority
  created_at?: string;
  updated_at?: string | null;
}