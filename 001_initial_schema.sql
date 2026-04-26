-- =====================================================
-- FastenersPro / A.M Hydraulics Complete Database Schema
-- =====================================================
-- This file represents the final consolidated schema
-- including Categories (with subcategories), Relational Masters,
-- Products, Brands, Blogs, Ads, Testimonials, and more.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CATEGORIES TABLE (Supports Subcategories)
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    is_main BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT categories_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    CONSTRAINT categories_description_length CHECK (char_length(description) >= 5 AND char_length(description) <= 500)
);

CREATE INDEX idx_categories_created_at ON categories(created_at DESC);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_main ON categories(is_main);

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MASTERS TABLE
-- =====================================================
CREATE TABLE masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT masters_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100)
);

CREATE INDEX idx_masters_category_id ON masters(category_id);
CREATE TRIGGER update_masters_updated_at BEFORE UPDATE ON masters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MASTER FIELDS TABLE
-- =====================================================
CREATE TABLE master_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    master_id UUID NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'select',
    unit TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT master_fields_type_check CHECK (type IN ('select', 'text', 'number', 'color')),
    CONSTRAINT master_fields_label_length CHECK (char_length(label) >= 1 AND char_length(label) <= 100)
);

CREATE INDEX idx_master_fields_master_id ON master_fields(master_id);

-- =====================================================
-- MASTER VALUES TABLE
-- =====================================================
CREATE TABLE master_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    master_field_id UUID NOT NULL REFERENCES master_fields(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT master_values_master_field_id_value_key UNIQUE (master_field_id, value)
);

CREATE INDEX idx_master_values_master_field_id ON master_values(master_field_id);
CREATE INDEX idx_master_values_value ON master_values(value);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active',
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT products_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 200),
    CONSTRAINT products_sku_length CHECK (char_length(sku) >= 3 AND char_length(sku) <= 100),
    CONSTRAINT products_status_check CHECK (status IN ('active', 'inactive', 'draft')),
    CONSTRAINT products_image_url_length CHECK (image_url IS NULL OR char_length(image_url) <= 500)
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PRODUCT MASTER VALUES TABLE (Junction Table)
-- =====================================================
CREATE TABLE product_master_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    master_value_id UUID NOT NULL REFERENCES master_values(id) ON DELETE CASCADE,
    
    CONSTRAINT product_master_values_product_master_unique UNIQUE (product_id, master_value_id)
);

CREATE INDEX idx_product_master_values_product_id ON product_master_values(product_id);

-- =====================================================
-- BRANDS TABLE
-- =====================================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    website_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT brands_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100)
);
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ADS TABLE
-- =====================================================
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    click_url TEXT,
    placement TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'image',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_scrolling BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- BLOG CATEGORIES & BLOGS TABLES
-- =====================================================
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    gallery_images TEXT[],
    author_name TEXT NOT NULL,
    author_image TEXT,
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    tags TEXT[],
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    publish_date TIMESTAMPTZ,
    meta_title TEXT,
    meta_description TEXT,
    read_time INTEGER,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_designation TEXT,
    company_name TEXT,
    testimonial_text TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    client_image TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- WISHLIST TABLE
-- =====================================================
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- =====================================================
-- ENQUIRIES TABLE
-- =====================================================
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    products UUID[] NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    quantity TEXT NOT NULL,
    city TEXT,
    company_name TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PRODUCT COMMENTS TABLE
-- =====================================================
CREATE TABLE product_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL,
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    pros TEXT[],
    cons TEXT[],
    is_verified_purchase BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT false,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_product_comments_updated_at BEFORE UPDATE ON product_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE comment_helpful (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES product_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

CREATE TABLE comment_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES product_comments(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL,
    reply_text TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_comment_replies_updated_at BEFORE UPDATE ON comment_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) ENABLEMENT
-- =====================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_master_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_helpful ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_replies ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Public Read Access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON masters FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON master_fields FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON master_values FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON products FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON product_master_values FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON brands FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON ads FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON announcements FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON blogs FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON testimonials FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON product_comments FOR SELECT USING (status = 'approved' OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON comment_replies FOR SELECT USING (is_public = true OR auth.role() = 'authenticated');

-- Modify Policies (Admin only placeholder, configure via Supabase Auth)
-- ... Note: Insert/Update/Delete policies generally use `auth.role() = 'authenticated'`
