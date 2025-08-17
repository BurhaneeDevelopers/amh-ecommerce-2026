export interface Category {
    id: string
    name: string
    slug: string
    parent_id: string | null
    order: number
    icon?: string | null
    created_at?: string
    type: 'sub' | 'main'
}

export interface Brand {
    id: string
    name: string
    slug: string
    created_at?: string
}

export interface Product {
    id: string
    model_tally_name: string // unique internal identifier linking to warehouse stock
    product_name: string
    product_image?: string
    model_number: string
    specifications: string
    accessories?: string[] // optional for future multi-tag linking
    spares?: string[] // optional for future multi-tag linking
    photos: string[] // array of URLs
    videos?: string[] // optional array of URLs
    brand_id: string // FK to Brand
    category_id: string // FK to Category (main or sub)
    capacity?: string // e.g., 'DIY', 'Professional', 'Industrial'
    tag: 'on sale' | 'out of stock' | 'featured'
    isFeatured: boolean
    on_hand_qty: number
    stock_status?: boolean
    created_at?: string
    updated_at?: string
}

// Wishlist Table
export interface Wishlist {
    id: string
    user_id: string // FK to Users table
    products: string[] // FK to Products table
    created_at?: string
}

// User Accounts (Portal)
export interface User_Profile {
    id?: string // matches Supabase Auth user_id
    full_name?: string
    email: string
    password: string
    phone?: string
    company_name?: string
    profile_image?: string
}

// Enquiry History (if implemented later)
export interface Enquiry {
    id: string
    user_id: string // FK to Users
    products: string[] // FK to Product
    order_date: string
    status: 'pending' | 'completed' | 'cancelled'
    created_at?: string
}

// NewsLetter
export interface NewsLetter {
    id: string
    email: string
    created_at?: string
}
