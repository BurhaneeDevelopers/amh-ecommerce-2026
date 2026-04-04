-- =====================================================
-- Supporting Features Schema
-- =====================================================
-- This schema includes:
-- - Brands
-- - Ads/Banners
-- - Announcements
-- - Blogs & Blog Categories
-- - Testimonials
-- - Wishlist
-- - Enquiries
-- - Product Comments/Reviews
-- =====================================================

-- =====================================================
-- BRANDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS brands (
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

CREATE INDEX idx_brands_sort_order ON brands(sort_order);
CREATE INDEX idx_brands_is_featured ON brands(is_featured);

-- =====================================================
-- ADS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ads (
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT ads_placement_check CHECK (placement IN (
        'banner_slider', 'deal_of_the_day', 'off_product', 'shop_now',
        'mobile_deals', 'homepage_right_banner', 'homepage_right_banner_2', 'featured_deal'
    )),
    CONSTRAINT ads_type_check CHECK (type IN ('image', 'video'))
);

CREATE INDEX idx_ads_placement ON ads(placement);
CREATE INDEX idx_ads_is_active ON ads(is_active);
CREATE INDEX idx_ads_order_index ON ads(order_index);

-- =====================================================
-- ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_scrolling BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT announcements_type_check CHECK (type IN ('danger', 'info', 'warning'))
);

CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_dates ON announcements(start_date, end_date);

-- =====================================================
-- BLOG CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT blog_categories_name_length CHECK (char_length(category_name) >= 2 AND char_length(category_name) <= 100)
);

CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_categories_is_active ON blog_categories(is_active);

-- =====================================================
-- BLOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blogs (
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT blogs_title_length CHECK (char_length(title) >= 5 AND char_length(title) <= 200)
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_category_id ON blogs(category_id);
CREATE INDEX idx_blogs_is_published ON blogs(is_published);
CREATE INDEX idx_blogs_is_featured ON blogs(is_featured);
CREATE INDEX idx_blogs_publish_date ON blogs(publish_date DESC);

-- =====================================================
-- TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT testimonials_rating_check CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX idx_testimonials_order_index ON testimonials(order_index);

-- =====================================================
-- WISHLIST TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);

-- =====================================================
-- ENQUIRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS enquiries (
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT enquiries_status_check CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'))
);

CREATE INDEX idx_enquiries_user_id ON enquiries(user_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);

-- =====================================================
-- PRODUCT COMMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_comments (
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT product_comments_rating_check CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT product_comments_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX idx_product_comments_product_id ON product_comments(product_id);
CREATE INDEX idx_product_comments_user_id ON product_comments(user_id);
CREATE INDEX idx_product_comments_status ON product_comments(status);
CREATE INDEX idx_product_comments_is_featured ON product_comments(is_featured);

-- =====================================================
-- COMMENT HELPFULNESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS comment_helpful (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES product_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_comment_helpful_comment_id ON comment_helpful(comment_id);
CREATE INDEX idx_comment_helpful_user_id ON comment_helpful(user_id);

-- =====================================================
-- COMMENT REPLIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS comment_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES product_comments(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL,
    reply_text TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comment_replies_comment_id ON comment_replies(comment_id);
CREATE INDEX idx_comment_replies_admin_id ON comment_replies(admin_id);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at
    BEFORE UPDATE ON ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
    BEFORE UPDATE ON blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at
    BEFORE UPDATE ON enquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_comments_updated_at
    BEFORE UPDATE ON product_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comment_replies_updated_at
    BEFORE UPDATE ON comment_replies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

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

-- Public read policies
CREATE POLICY "Brands are viewable by everyone" ON brands FOR SELECT USING (true);
CREATE POLICY "Active ads are viewable by everyone" ON ads FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Active announcements are viewable by everyone" ON announcements FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Blog categories are viewable by everyone" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Published blogs are viewable by everyone" ON blogs FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Active testimonials are viewable by everyone" ON testimonials FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Approved comments are viewable by everyone" ON product_comments FOR SELECT USING (status = 'approved' OR auth.role() = 'authenticated');
CREATE POLICY "Comment replies are viewable by everyone" ON comment_replies FOR SELECT USING (is_public = true OR auth.role() = 'authenticated');

-- Wishlist policies
CREATE POLICY "Users can view their own wishlist" ON wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to their own wishlist" ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own wishlist" ON wishlist FOR DELETE USING (auth.uid() = user_id);

-- Enquiry policies
CREATE POLICY "Users can view their own enquiries" ON enquiries FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create enquiries" ON enquiries FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Comment policies
CREATE POLICY "Users can create comments" ON product_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON product_comments FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (for all tables)
CREATE POLICY "Authenticated users can manage brands" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage ads" ON ads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage announcements" ON announcements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage blog categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage enquiries" ON enquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage comments" ON product_comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage comment replies" ON comment_replies FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE brands IS 'Brand information for products';
COMMENT ON TABLE ads IS 'Advertisement banners and promotional content';
COMMENT ON TABLE announcements IS 'Site-wide announcements and notifications';
COMMENT ON TABLE blog_categories IS 'Categories for blog posts';
COMMENT ON TABLE blogs IS 'Blog posts and articles';
COMMENT ON TABLE testimonials IS 'Customer testimonials and reviews';
COMMENT ON TABLE wishlist IS 'User wishlist items';
COMMENT ON TABLE enquiries IS 'Product enquiries and quote requests';
COMMENT ON TABLE product_comments IS 'Product reviews and ratings';
COMMENT ON TABLE comment_helpful IS 'Tracks which users found comments helpful';
COMMENT ON TABLE comment_replies IS 'Admin replies to product comments';
