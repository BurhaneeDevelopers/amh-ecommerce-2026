// =====================================================
// A.M. Hydraulics & Pneumatics Catalog Schema Types
// Based on: 001_hydraulics_catalog_schema.sql
// =====================================================

// =====================================================
// CATALOG SYSTEM TYPES
// =====================================================

export interface Category {
  id?: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
}

export interface Master {
  id?: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  category_id?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Joined data
  fields?: MasterField[];
}

export interface MasterField {
  id?: string;
  master_id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'color';
  options: string[]; // Array of options for select type
  unit?: string | null;
  sort_order: number;
  created_at?: string;
}

export interface Product {
  id?: string;
  name: string;
  sku: string;
  description?: string | null;
  category_id: string;
  status: 'active' | 'inactive' | 'draft';
  master_values: Record<string, string[]>; // { "field_id": ["value1", "value2"] }
  created_at?: string;
  updated_at?: string;
  
  // Joined data
  category?: Category;
}

// Legacy Brand types (kept for backward compatibility if needed)
export interface Brand {
  id?: string;
  name: string;
  logo_url?: string | null;
  description?: string | null;
  website_url?: string | null;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductBrand {
  id?: string;
  product_id: string;
  brand_id: string;
  created_at?: string;
}

// =====================================================
// EXISTING SYSTEM TYPES (Keep for compatibility)
// =====================================================

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
  city?: string;
  state?: string;
  profile_image?: string;
  role?: "customer" | "dealer" | "admin"; // user role
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
  | "homepage_right_banner"
  | "homepage_right_banner_2"
  | "featured_deal";

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

// Testimonials
export interface Testimonial {
  id?: string | null;
  client_name: string;
  client_designation?: string | null;
  company_name?: string | null;
  testimonial_text: string;
  rating: number; // 1-5 star rating
  client_image?: string | null; // optional client photo
  is_featured: boolean;
  is_active: boolean;
  order_index?: number | null; // for display ordering
  created_at?: string;
  updated_at?: string | null;
}

// Blog Categories
export interface BlogCategory {
  id?: string | null;
  category_name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string | null;
}

// Blog Posts
export interface Blog {
  id?: string | null;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string; // rich text content
  featured_image?: string | null;
  gallery_images?: string[]; // additional images
  author_name: string;
  author_image?: string | null;
  category_id: string | null; // FK to BlogCategory
  tags?: string[]; // array of tags
  is_published: boolean;
  is_featured: boolean;
  publish_date?: string | null;
  meta_title?: string | null; // SEO
  meta_description?: string | null; // SEO
  read_time?: number | null; // estimated read time in minutes
  views_count?: number; // track article views
  created_at?: string;
  updated_at?: string | null;

  // Joined fields
  category?: BlogCategory;
}

// Product Comments/Feedback System
export type CommentStatus = "pending" | "approved" | "rejected";

export interface ProductComment {
  id?: string | null;
  product_id: string; // FK to Product
  user_id: string; // FK to User_Profile
  rating: number; // 1-5 star rating
  title: string; // Comment title/summary
  comment: string; // Detailed feedback
  pros?: string[]; // Array of positive points
  cons?: string[]; // Array of negative points
  is_verified_purchase?: boolean; // If user actually purchased the product
  status: CommentStatus;
  admin_notes?: string | null; // Internal notes for admin
  approved_by?: string | null; // Admin user ID who approved/rejected
  approved_at?: string | null;
  is_featured?: boolean; // Highlight exceptional reviews
  helpful_count?: number; // Number of users who found this helpful
  created_at?: string;
  updated_at?: string | null;

  // Joined fields
  user?: User_Profile;
  product?: Product;
  admin?: User_Profile; // Admin who approved/rejected
}

// Comment Helpfulness tracking
export interface CommentHelpful {
  id?: string | null;
  comment_id: string; // FK to ProductComment
  user_id: string; // FK to User_Profile
  is_helpful: boolean; // true for helpful, false for not helpful
  created_at?: string;
}

// Comment Replies (for admin responses)
export interface CommentReply {
  id?: string | null;
  comment_id: string; // FK to ProductComment
  admin_id: string; // FK to User_Profile (admin)
  reply_text: string;
  is_public: boolean; // Whether to show publicly or keep internal
  created_at?: string;
  updated_at?: string | null;

  // Joined fields
  admin?: User_Profile;
  comment?: ProductComment;
}