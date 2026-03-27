-- =====================================================
-- A.M. Hydraulics & Pneumatics Catalog Schema
-- =====================================================
-- This schema supports a hydraulics & pneumatics catalog management system
-- with Categories, Masters (attributes), and Products
-- 
-- Hierarchy:
-- 1. Categories (e.g., "Hydraulic Hoses", "Pneumatic Fittings")
-- 2. Masters (e.g., "Size", "Pressure Rating", "Material") - linked to Categories
-- 3. Products - belong to one Category, have values from its Masters
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
-- Categories represent product types (e.g., Hydraulic Hoses, Pneumatic Fittings)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT categories_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    CONSTRAINT categories_description_length CHECK (char_length(description) >= 5 AND char_length(description) <= 500)
);

-- Index for faster queries
CREATE INDEX idx_categories_created_at ON categories(created_at DESC);
CREATE INDEX idx_categories_name ON categories(name);

-- =====================================================
-- MASTERS TABLE
-- =====================================================
-- Masters represent attribute types (e.g., Size, Pressure Rating, Material)
-- that can be linked to multiple categories
CREATE TABLE masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT masters_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    CONSTRAINT masters_description_length CHECK (char_length(description) >= 5 AND char_length(description) <= 500)
);

-- Indexes
CREATE INDEX idx_masters_category_id ON masters(category_id);
CREATE INDEX idx_masters_created_at ON masters(created_at DESC);
CREATE INDEX idx_masters_name ON masters(name);

-- =====================================================
-- MASTER FIELDS TABLE
-- =====================================================
-- Fields define the specific attributes for each master
-- (e.g., Master "Size" has field "Size" with options ["1/4\"", "3/8\"", "1/2\""])
CREATE TABLE master_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    master_id UUID NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'select',
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    unit TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT master_fields_type_check CHECK (type IN ('select', 'text', 'number', 'color')),
    CONSTRAINT master_fields_label_length CHECK (char_length(label) >= 1 AND char_length(label) <= 100)
);

-- Indexes
CREATE INDEX idx_master_fields_master_id ON master_fields(master_id);
CREATE INDEX idx_master_fields_sort_order ON master_fields(master_id, sort_order);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
-- Products are the actual items in the catalog
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active',
    master_values JSONB NOT NULL DEFAULT '{}'::jsonb,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT products_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 200),
    CONSTRAINT products_sku_length CHECK (char_length(sku) >= 3 AND char_length(sku) <= 100),
    CONSTRAINT products_status_check CHECK (status IN ('active', 'inactive', 'draft'))
);

-- Indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_is_featured ON products(is_featured);

-- GIN index for JSONB master_values for efficient querying
CREATE INDEX idx_products_master_values ON products USING GIN (master_values);

-- =====================================================
-- BRANDS TABLE (for authorized stockists)
-- =====================================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    website_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT brands_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100)
);

CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_brands_is_featured ON brands(is_featured);
CREATE INDEX idx_brands_sort_order ON brands(sort_order);

-- =====================================================
-- PRODUCT BRANDS JUNCTION TABLE
-- =====================================================
CREATE TABLE product_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(product_id, brand_id)
);

CREATE INDEX idx_product_brands_product_id ON product_brands(product_id);
CREATE INDEX idx_product_brands_brand_id ON product_brands(brand_id);

-- =====================================================
-- KEEP EXISTING TABLES (User, Wishlist, Enquiry, etc.)
-- =====================================================
-- These tables remain unchanged as they're still needed

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
-- Automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_masters_updated_at
    BEFORE UPDATE ON masters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_brands ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CATEGORIES RLS POLICIES
-- =====================================================
-- Public read access
CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert categories"
    ON categories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Authenticated users can update categories"
    ON categories FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete categories"
    ON categories FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- MASTERS RLS POLICIES
-- =====================================================
CREATE POLICY "Masters are viewable by everyone"
    ON masters FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert masters"
    ON masters FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update masters"
    ON masters FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete masters"
    ON masters FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- MASTER FIELDS RLS POLICIES
-- =====================================================
CREATE POLICY "Master fields are viewable by everyone"
    ON master_fields FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert master fields"
    ON master_fields FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update master fields"
    ON master_fields FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete master fields"
    ON master_fields FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- PRODUCTS RLS POLICIES
-- =====================================================
-- Public can view active products
CREATE POLICY "Active products are viewable by everyone"
    ON products FOR SELECT
    USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products"
    ON products FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products"
    ON products FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products"
    ON products FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- BRANDS RLS POLICIES
-- =====================================================
CREATE POLICY "Brands are viewable by everyone"
    ON brands FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage brands"
    ON brands FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- PRODUCT BRANDS RLS POLICIES
-- =====================================================
CREATE POLICY "Product brands are viewable by everyone"
    ON product_brands FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage product brands"
    ON product_brands FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- SEED DATA - Hydraulics & Pneumatics
-- =====================================================
-- Insert sample categories
INSERT INTO categories (name, description, color, icon) VALUES
('Hydraulic Hoses', 'High-pressure hydraulic hoses for fluid power systems', '#ff6b35', '🔗'),
('Hydraulic Fittings', 'Connectors and adapters for hydraulic systems', '#8b5cf6', '🔧'),
('Pneumatic Fittings', 'Air fittings and connectors for pneumatic systems', '#a855f7', '⚙️'),
('Hydraulic Pumps', 'Hydraulic pumps and power units', '#ec4899', '⚡'),
('Pneumatic Valves', 'Control valves for pneumatic systems', '#10b981', '🎛️');

-- Get the category IDs and insert masters
DO $$
DECLARE
    cat_hoses_id UUID;
    cat_h_fittings_id UUID;
    cat_p_fittings_id UUID;
    cat_pumps_id UUID;
    cat_valves_id UUID;
    master_size_id UUID;
    master_pressure_id UUID;
    master_material_id UUID;
    master_thread_id UUID;
    master_flow_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO cat_hoses_id FROM categories WHERE name = 'Hydraulic Hoses';
    SELECT id INTO cat_h_fittings_id FROM categories WHERE name = 'Hydraulic Fittings';
    SELECT id INTO cat_p_fittings_id FROM categories WHERE name = 'Pneumatic Fittings';
    SELECT id INTO cat_pumps_id FROM categories WHERE name = 'Hydraulic Pumps';
    SELECT id INTO cat_valves_id FROM categories WHERE name = 'Pneumatic Valves';
    
    -- Insert sample masters for Hydraulic Hoses
    INSERT INTO masters (name, description, color, icon, category_id) VALUES
    ('Size', 'Hose diameter specification', '#ff6b35', '📐', cat_hoses_id)
    RETURNING id INTO master_size_id;
    
    INSERT INTO masters (name, description, color, icon, category_id) VALUES
    ('Pressure Rating', 'Maximum working pressure', '#f59e0b', '⚡', cat_hoses_id)
    RETURNING id INTO master_pressure_id;
    
    INSERT INTO masters (name, description, color, icon, category_id) VALUES
    ('Material', 'Hose material composition', '#10b981', '🔧', cat_hoses_id)
    RETURNING id INTO master_material_id;
    
    -- Insert sample masters for Hydraulic Fittings
    INSERT INTO masters (name, description, color, icon, category_id) VALUES
    ('Thread Type', 'Thread specification', '#8b5cf6', '🔩', cat_h_fittings_id)
    RETURNING id INTO master_thread_id;
    
    -- Insert sample masters for Pneumatic Valves
    INSERT INTO masters (name, description, color, icon, category_id) VALUES
    ('Flow Rate', 'Air flow capacity', '#ec4899', '💨', cat_valves_id)
    RETURNING id INTO master_flow_id;
    
    -- Insert sample master fields
    INSERT INTO master_fields (master_id, label, type, options, unit, sort_order) VALUES
    (master_size_id, 'Size', 'select', '["1/4\"", "3/8\"", "1/2\"", "5/8\"", "3/4\"", "1\""]'::jsonb, 'inch', 0),
    (master_pressure_id, 'Pressure Rating', 'select', '["2000 PSI", "3000 PSI", "4000 PSI", "5000 PSI", "6000 PSI"]'::jsonb, 'PSI', 0),
    (master_material_id, 'Material', 'select', '["Rubber", "Thermoplastic", "PTFE", "Stainless Steel Braided"]'::jsonb, NULL, 0),
    (master_thread_id, 'Thread Type', 'select', '["NPT", "BSP", "JIC", "SAE", "Metric"]'::jsonb, NULL, 0),
    (master_flow_id, 'Flow Rate', 'select', '["50 L/min", "100 L/min", "200 L/min", "500 L/min"]'::jsonb, 'L/min', 0);
    
    -- Insert sample brands (authorized stockists)
    INSERT INTO brands (name, description, is_featured, sort_order) VALUES
    ('Parker', 'Parker Hannifin - Global leader in motion and control technologies', TRUE, 1),
    ('Polyhose', 'Polyhose India - Providing flexible solutions globally', TRUE, 2),
    ('Yuken', 'Yuken India - Hydraulic equipment manufacturer', TRUE, 3),
    ('Rexroth', 'Bosch Rexroth - Drive and control technologies', TRUE, 4),
    ('Boss Hydraulics', 'Boss Hydraulics - Hydraulic components', TRUE, 5),
    ('Torque', 'Torque - Industrial hydraulic solutions', TRUE, 6),
    ('Polyhydron', 'Polyhydron - Hydraulic systems', TRUE, 7),
    ('Hydroline Products', 'Hydroline - Hydraulic products', TRUE, 8),
    ('Micro Pre Temp', 'Micro Pre Temp - Precision hydraulic components', TRUE, 9),
    ('H-T', 'H-T - Hydraulic and pneumatic fittings', TRUE, 10);
    
END $$;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================
-- Function to get all masters for a category
CREATE OR REPLACE FUNCTION get_category_masters(category_uuid UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    color TEXT,
    icon TEXT,
    fields JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.name,
        m.description,
        m.color,
        m.icon,
        jsonb_agg(
            jsonb_build_object(
                'id', mf.id,
                'label', mf.label,
                'type', mf.type,
                'options', mf.options,
                'unit', mf.unit
            ) ORDER BY mf.sort_order
        ) as fields
    FROM masters m
    LEFT JOIN master_fields mf ON m.id = mf.master_id
    WHERE m.category_id = category_uuid
    GROUP BY m.id, m.name, m.description, m.color, m.icon;
END;
$$ LANGUAGE plpgsql;

-- Function to search products
CREATE OR REPLACE FUNCTION search_products(
    search_term TEXT,
    category_filter UUID DEFAULT NULL,
    status_filter TEXT DEFAULT 'active'
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    sku TEXT,
    description TEXT,
    category_id UUID,
    status TEXT,
    master_values JSONB,
    images TEXT[],
    price DECIMAL,
    stock_quantity INTEGER,
    is_featured BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.sku,
        p.description,
        p.category_id,
        p.status,
        p.master_values,
        p.images,
        p.price,
        p.stock_quantity,
        p.is_featured,
        p.created_at
    FROM products p
    WHERE 
        (search_term IS NULL OR search_term = '' OR 
         p.name ILIKE '%' || search_term || '%' OR 
         p.sku ILIKE '%' || search_term || '%')
        AND (category_filter IS NULL OR p.category_id = category_filter)
        AND (status_filter IS NULL OR p.status = status_filter)
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get products with brands
CREATE OR REPLACE FUNCTION get_products_with_brands()
RETURNS TABLE (
    id UUID,
    name TEXT,
    sku TEXT,
    description TEXT,
    category_id UUID,
    status TEXT,
    master_values JSONB,
    images TEXT[],
    price DECIMAL,
    stock_quantity INTEGER,
    is_featured BOOLEAN,
    brands JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.sku,
        p.description,
        p.category_id,
        p.status,
        p.master_values,
        p.images,
        p.price,
        p.stock_quantity,
        p.is_featured,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', b.id,
                    'name', b.name,
                    'logo_url', b.logo_url
                )
            ) FILTER (WHERE b.id IS NOT NULL),
            '[]'::jsonb
        ) as brands,
        p.created_at
    FROM products p
    LEFT JOIN product_brands pb ON p.id = pb.product_id
    LEFT JOIN brands b ON pb.brand_id = b.id
    WHERE p.status = 'active'
    GROUP BY p.id
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE categories IS 'Product categories (e.g., Hydraulic Hoses, Pneumatic Fittings)';
COMMENT ON TABLE masters IS 'Attribute types (e.g., Size, Pressure Rating, Material) that can be linked to categories';
COMMENT ON TABLE master_fields IS 'Specific fields for each master with their options';
COMMENT ON TABLE products IS 'Actual products in the catalog';
COMMENT ON TABLE brands IS 'Authorized brands/stockists (Parker, Polyhose, Yuken, etc.)';
COMMENT ON TABLE product_brands IS 'Junction table linking products to brands';
COMMENT ON COLUMN products.master_values IS 'JSONB object storing selected values for each master field. Format: {"field_id": ["value1", "value2"]}';
COMMENT ON COLUMN products.status IS 'Product status: active (visible to public), inactive (hidden), draft (work in progress)';
