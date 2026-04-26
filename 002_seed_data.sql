-- =====================================================
-- A.M Hydraulics - Complete Seed Data
-- =====================================================

-- Clean existing seed data
TRUNCATE product_comments, comment_helpful, comment_replies, enquiries, wishlist, 
         testimonials, blogs, blog_categories, announcements, ads, brands,
         product_master_values, products, master_values, master_fields, masters, categories CASCADE;

-- =====================================================
-- 1. CATEGORIES & SUBCATEGORIES
-- =====================================================
INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
  ('Hydraulic Hoses',        'Complete range of hydraulic hoses for high and low pressure applications', '#3b82f6', '🔵', true, NULL),
  ('Hose Fittings',          'Precision fittings for hydraulic and industrial hose connections', '#8b5cf6', '🔩', true, NULL),
  ('Industrial Hoses',       'Specialized hoses for industrial fluid transfer applications', '#10b981', '🟢', true, NULL),
  ('Couplings',              'Quick-release and threaded couplings for fluid systems', '#f59e0b', '🔗', true, NULL),
  ('Tubes',                  'Precision steel and stainless steel tubes for hydraulic systems', '#ec4899', '🔧', true, NULL),
  ('Adapters',               'Hydraulic adapters for connecting different thread types', '#6366f1', '🔀', true, NULL),
  ('Ball Valves',            'High-pressure ball valves for hydraulic circuit control', '#ef4444', '🔴', true, NULL),
  ('Flanges',                'SAE and ISO flanges for high-pressure hydraulic connections', '#14b8a6', '⭕', true, NULL),
  ('Hydraulic Components',   'Pumps, motors, cylinders and hydraulic system components', '#a855f7', '⚙️', true, NULL),
  ('Filtration',             'Hydraulic filters and filtration systems for fluid cleanliness', '#64748b', '🔬', true, NULL),
  ('Measuring Technology',   'Pressure gauges, flow meters and diagnostic instruments', '#0ea5e9', '📊', true, NULL),
  ('Sealing Equipment',      'O-rings, gaskets and sealing solutions for hydraulic systems', '#d946ef', '🛡️', true, NULL),
  ('Fastening Technology',   'Clamps, brackets and fastening solutions for hose routing', '#78716c', '📎', true, NULL),
  ('Accessories and Tools',  'Tools, kits and accessories for hydraulic maintenance', '#84cc16', '🧰', true, NULL);

DO $$
DECLARE
  cat_hyd_hoses UUID;
  cat_fittings UUID;
  cat_ind_hoses UUID;
  cat_couplings UUID;
  cat_tubes UUID;
  cat_adapters UUID;
  cat_ball_valves UUID;
  cat_flanges UUID;
BEGIN
  SELECT id INTO cat_hyd_hoses FROM categories WHERE name='Hydraulic Hoses' AND is_main=true;
  SELECT id INTO cat_fittings FROM categories WHERE name='Hose Fittings' AND is_main=true;
  SELECT id INTO cat_ind_hoses FROM categories WHERE name='Industrial Hoses' AND is_main=true;
  SELECT id INTO cat_couplings FROM categories WHERE name='Couplings' AND is_main=true;
  SELECT id INTO cat_tubes FROM categories WHERE name='Tubes' AND is_main=true;
  SELECT id INTO cat_adapters FROM categories WHERE name='Adapters' AND is_main=true;
  SELECT id INTO cat_ball_valves FROM categories WHERE name='Ball Valves' AND is_main=true;
  SELECT id INTO cat_flanges FROM categories WHERE name='Flanges' AND is_main=true;

  -- Hydraulic Hoses subcategories
  INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
    ('Braided Hoses',      'Single and double wire braided hydraulic hoses EN853', '#3b82f6', '〰️', false, cat_hyd_hoses),
    ('Spiral Hoses',       'Four and six spiral wire hydraulic hoses EN856 for high pressure', '#2563eb', '🌀', false, cat_hyd_hoses),
    ('Textile Hoses',      'Textile reinforced low-pressure hydraulic hoses', '#60a5fa', '🧵', false, cat_hyd_hoses),
    ('PTFE Hoses',         'PTFE-lined hoses for chemical and high-temperature applications', '#93c5fd', '🧪', false, cat_hyd_hoses);

  -- Hose Fittings subcategories
  INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
    ('Metric Fittings',    'DKL, DKOL, DKS metric thread fittings for standard hoses', '#8b5cf6', '📐', false, cat_fittings),
    ('BSP Fittings',       'British Standard Pipe thread fittings', '#7c3aed', '🇬🇧', false, cat_fittings),
    ('JIC Fittings',       'JIC 37-degree flare fittings per SAE J514', '#a78bfa', '🔧', false, cat_fittings);

  -- Industrial Hoses subcategories
  INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
    ('Air Hoses',          'Compressed air and pneumatic hoses', '#10b981', '💨', false, cat_ind_hoses),
    ('Water Hoses',        'Hot and cold water transfer hoses', '#059669', '🚿', false, cat_ind_hoses);

  -- Couplings subcategories
  INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
    ('Quick Couplings',    'Quick-disconnect couplings for rapid connection', '#f59e0b', '⚡', false, cat_couplings),
    ('Camlock Couplings',  'Cam and groove couplings for industrial applications', '#d97706', '🔐', false, cat_couplings);

  -- Tubes subcategories
  INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
    ('Precision Steel Tubes',    'Cold-drawn seamless precision steel tubes', '#ec4899', '🔩', false, cat_tubes),
    ('Stainless Steel Tubes',    'Stainless steel tubes for corrosive environments', '#db2777', '✨', false, cat_tubes);

  -- Adapters subcategories
  INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
    ('Metric Adapters',    'Metric thread adapters for hydraulic connections', '#6366f1', '🔀', false, cat_adapters),
    ('BSP Adapters',       'BSP thread hydraulic adapters', '#4f46e5', '🔄', false, cat_adapters);

  -- Ball Valves subcategories
  INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
    ('2-Way Ball Valves',  'Standard 2-way high-pressure ball valves', '#ef4444', '2️⃣', false, cat_ball_valves),
    ('3-Way Ball Valves',  'Three-way directional ball valves', '#dc2626', '3️⃣', false, cat_ball_valves);

  -- Flanges subcategories
  INSERT INTO categories (name, description, color, icon, is_main, parent_id) VALUES
    ('SAE Flanges',        'SAE code 61 and code 62 split flanges', '#14b8a6', '🔘', false, cat_flanges),
    ('ISO Flanges',        'ISO 6162 hydraulic flanges', '#0d9488', '🌐', false, cat_flanges);
END $$;

-- =====================================================
-- 2. MASTERS, FIELDS, VALUES AND PRODUCTS
-- =====================================================
DO $$
DECLARE
  sub_cat_spiral UUID;
  sub_cat_braided UUID;
  sub_cat_metric UUID;
  m_id UUID;
  
  -- Field IDs
  f_spiral_id UUID; f_spiral_press UUID; f_spiral_std UUID;
  f_braided_id UUID; f_braided_press UUID; f_braided_std UUID;
  f_metric_thread UUID; f_metric_series UUID; f_metric_shape UUID;
  
  -- Master Value IDs (Spiral)
  v_spiral_id_10 UUID; v_spiral_id_12 UUID; v_spiral_id_25 UUID;
  v_spiral_press_420 UUID; v_spiral_press_400 UUID; v_spiral_press_350 UUID;
  v_spiral_std_4sp UUID; v_spiral_std_4sh UUID;
  
  -- Master Value IDs (Braided)
  v_braided_id_6 UUID; v_braided_id_10 UUID; v_braided_id_12 UUID;
  v_braided_press_400 UUID; v_braided_press_275 UUID; v_braided_press_215 UUID;
  v_braided_std_1sn UUID; v_braided_std_2sn UUID;
  
  -- Master Value IDs (Metric)
  v_metric_th_16 UUID; v_metric_th_22 UUID;
  v_metric_ser_l UUID; v_metric_ser_s UUID;
  v_metric_sh_st UUID; v_metric_sh_90 UUID;
  
  p_id UUID;
BEGIN
  SELECT id INTO sub_cat_spiral FROM categories WHERE name='Spiral Hoses' AND is_main=false;
  SELECT id INTO sub_cat_braided FROM categories WHERE name='Braided Hoses' AND is_main=false;
  SELECT id INTO sub_cat_metric FROM categories WHERE name='Metric Fittings' AND is_main=false;

  -- MASTERS & FIELDS FOR SPIRAL HOSES
  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Internal Diameter (ID)', 'Inner diameter of the hose', '#3b82f6', '⭕', sub_cat_spiral) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Internal Diameter', 'select', 'mm', 0) RETURNING id INTO f_spiral_id;

  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Max Operating Pressure', 'Maximum working pressure', '#ef4444', '💥', sub_cat_spiral) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Operating Pressure', 'select', 'bar', 0) RETURNING id INTO f_spiral_press;

  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Standard', 'Applicable international standard', '#10b981', '📜', sub_cat_spiral) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Standard', 'select', NULL, 0) RETURNING id INTO f_spiral_std;
    
  INSERT INTO master_values (master_field_id, value) VALUES (f_spiral_id, '10.0') RETURNING id INTO v_spiral_id_10;
  INSERT INTO master_values (master_field_id, value) VALUES (f_spiral_id, '12.0') RETURNING id INTO v_spiral_id_12;
  INSERT INTO master_values (master_field_id, value) VALUES (f_spiral_id, '25.0') RETURNING id INTO v_spiral_id_25;
  INSERT INTO master_values (master_field_id, value) VALUES (f_spiral_press, '420.0') RETURNING id INTO v_spiral_press_420;
  INSERT INTO master_values (master_field_id, value) VALUES (f_spiral_press, '400.0') RETURNING id INTO v_spiral_press_400;
  INSERT INTO master_values (master_field_id, value) VALUES (f_spiral_press, '350.0') RETURNING id INTO v_spiral_press_350;
  INSERT INTO master_values (master_field_id, value) VALUES (f_spiral_std, 'EN 856 4SP') RETURNING id INTO v_spiral_std_4sp;
  INSERT INTO master_values (master_field_id, value) VALUES (f_spiral_std, 'EN 856 4SH') RETURNING id INTO v_spiral_std_4sh;

  -- MASTERS & FIELDS FOR BRAIDED HOSES
  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Internal Diameter (ID)', 'Inner diameter of the hose', '#3b82f6', '⭕', sub_cat_braided) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Internal Diameter', 'select', 'mm', 0) RETURNING id INTO f_braided_id;

  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Max Operating Pressure', 'Maximum working pressure', '#ef4444', '💥', sub_cat_braided) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Operating Pressure', 'select', 'bar', 0) RETURNING id INTO f_braided_press;

  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Standard', 'Applicable international standard', '#10b981', '📜', sub_cat_braided) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Standard', 'select', NULL, 0) RETURNING id INTO f_braided_std;
    
  INSERT INTO master_values (master_field_id, value) VALUES (f_braided_id, '6.0') RETURNING id INTO v_braided_id_6;
  INSERT INTO master_values (master_field_id, value) VALUES (f_braided_id, '10.0') RETURNING id INTO v_braided_id_10;
  INSERT INTO master_values (master_field_id, value) VALUES (f_braided_id, '12.0') RETURNING id INTO v_braided_id_12;
  INSERT INTO master_values (master_field_id, value) VALUES (f_braided_press, '400.0') RETURNING id INTO v_braided_press_400;
  INSERT INTO master_values (master_field_id, value) VALUES (f_braided_press, '275.0') RETURNING id INTO v_braided_press_275;
  INSERT INTO master_values (master_field_id, value) VALUES (f_braided_press, '215.0') RETURNING id INTO v_braided_press_215;
  INSERT INTO master_values (master_field_id, value) VALUES (f_braided_std, 'EN 853 1SN') RETURNING id INTO v_braided_std_1sn;
  INSERT INTO master_values (master_field_id, value) VALUES (f_braided_std, 'EN 853 2SN') RETURNING id INTO v_braided_std_2sn;

  -- MASTERS & FIELDS FOR METRIC FITTINGS
  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Thread Size', 'Connection thread size', '#f59e0b', '🔩', sub_cat_metric) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Thread', 'select', NULL, 0) RETURNING id INTO f_metric_thread;

  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Series', 'Pipe series', '#8b5cf6', '🔄', sub_cat_metric) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Series', 'select', NULL, 0) RETURNING id INTO f_metric_series;

  INSERT INTO masters (name, description, color, icon, category_id) VALUES ('Shape', 'Fitting shape', '#14b8a6', '📐', sub_cat_metric) RETURNING id INTO m_id;
  INSERT INTO master_fields (master_id, label, type, unit, sort_order) VALUES (m_id, 'Shape', 'select', NULL, 0) RETURNING id INTO f_metric_shape;
    
  INSERT INTO master_values (master_field_id, value) VALUES (f_metric_thread, 'M 16 x 1.5') RETURNING id INTO v_metric_th_16;
  INSERT INTO master_values (master_field_id, value) VALUES (f_metric_thread, 'M 22 x 1.5') RETURNING id INTO v_metric_th_22;
  INSERT INTO master_values (master_field_id, value) VALUES (f_metric_series, 'L (Light)') RETURNING id INTO v_metric_ser_l;
  INSERT INTO master_values (master_field_id, value) VALUES (f_metric_series, 'S (Heavy)') RETURNING id INTO v_metric_ser_s;
  INSERT INTO master_values (master_field_id, value) VALUES (f_metric_shape, 'Straight') RETURNING id INTO v_metric_sh_st;
  INSERT INTO master_values (master_field_id, value) VALUES (f_metric_shape, '90° Elbow') RETURNING id INTO v_metric_sh_90;

  -- INSERT PRODUCTS & LINK TO VALUES
  INSERT INTO products (name, sku, description, category_id, status) VALUES ('Spiral Hose EN 856 4SP - DN 10', 'SP-4SP-10', 'High pressure hydraulic hose with 4 steel wire spirals', sub_cat_spiral, 'active') RETURNING id INTO p_id;
  INSERT INTO product_master_values (product_id, master_value_id) VALUES (p_id, v_spiral_id_10), (p_id, v_spiral_press_420), (p_id, v_spiral_std_4sp);
     
  INSERT INTO products (name, sku, description, category_id, status) VALUES ('Spiral Hose EN 856 4SP - DN 12', 'SP-4SP-12', 'High pressure hydraulic hose with 4 steel wire spirals', sub_cat_spiral, 'active') RETURNING id INTO p_id;
  INSERT INTO product_master_values (product_id, master_value_id) VALUES (p_id, v_spiral_id_12), (p_id, v_spiral_press_400), (p_id, v_spiral_std_4sp);
     
  INSERT INTO products (name, sku, description, category_id, status) VALUES ('Spiral Hose EN 856 4SH - DN 25', 'SP-4SH-25', 'Very high pressure hydraulic hose with 4 steel wire spirals', sub_cat_spiral, 'active') RETURNING id INTO p_id;
  INSERT INTO product_master_values (product_id, master_value_id) VALUES (p_id, v_spiral_id_25), (p_id, v_spiral_press_350), (p_id, v_spiral_std_4sh);

  INSERT INTO products (name, sku, description, category_id, status) VALUES ('Braided Hose EN 853 2SN - DN 06', 'BR-2SN-06', 'Medium pressure hydraulic hose with 2 steel wire braids', sub_cat_braided, 'active') RETURNING id INTO p_id;
  INSERT INTO product_master_values (product_id, master_value_id) VALUES (p_id, v_braided_id_6), (p_id, v_braided_press_400), (p_id, v_braided_std_2sn);
     
  INSERT INTO products (name, sku, description, category_id, status) VALUES ('Braided Hose EN 853 2SN - DN 12', 'BR-2SN-12', 'Medium pressure hydraulic hose with 2 steel wire braids', sub_cat_braided, 'active') RETURNING id INTO p_id;
  INSERT INTO product_master_values (product_id, master_value_id) VALUES (p_id, v_braided_id_12), (p_id, v_braided_press_275), (p_id, v_braided_std_2sn);
     
  INSERT INTO products (name, sku, description, category_id, status) VALUES ('Braided Hose EN 853 1SN - DN 10', 'BR-1SN-10', 'Low/medium pressure hydraulic hose with 1 steel wire braid', sub_cat_braided, 'active') RETURNING id INTO p_id;
  INSERT INTO product_master_values (product_id, master_value_id) VALUES (p_id, v_braided_id_10), (p_id, v_braided_press_215), (p_id, v_braided_std_1sn);

  INSERT INTO products (name, sku, description, category_id, status) VALUES ('DKOL Metric Fitting Straight M16x1.5', 'DKOL-S-16', 'Metric light series straight female fitting with O-ring', sub_cat_metric, 'active') RETURNING id INTO p_id;
  INSERT INTO product_master_values (product_id, master_value_id) VALUES (p_id, v_metric_th_16), (p_id, v_metric_ser_l), (p_id, v_metric_sh_st);
     
  INSERT INTO products (name, sku, description, category_id, status) VALUES ('DKOS Metric Fitting 90° M22x1.5', 'DKOS-90-22', 'Metric heavy series 90-degree female fitting with O-ring', sub_cat_metric, 'active') RETURNING id INTO p_id;
  INSERT INTO product_master_values (product_id, master_value_id) VALUES (p_id, v_metric_th_22), (p_id, v_metric_ser_s), (p_id, v_metric_sh_90);
END $$;

-- =====================================================
-- 3. BRANDS, ANNOUNCEMENTS, TESTIMONIALS, BLOGS
-- =====================================================

-- Brands
INSERT INTO brands (name, logo_url, description, website_url, is_featured, sort_order) VALUES
  ('HANSA-FLEX', NULL, 'Leading supplier of fluid technology systems and hydraulic components globally.', 'https://shop.hansa-flex.com/', true, 1),
  ('Parker Hannifin', NULL, 'Global leader in motion and control technologies, offering precision-engineered solutions.', 'https://www.parker.com/', true, 2),
  ('Eaton', NULL, 'Power management company providing energy-efficient hydraulic systems and services.', 'https://www.eaton.com/', true, 3),
  ('Stauff', NULL, 'Developer, manufacturer and supplier of pipework equipment and hydraulic components.', 'https://stauff.com/', true, 4),
  ('KTR', NULL, 'Manufacturer of high-quality drive components, brake systems and cooling systems.', 'https://www.ktr.com/', false, 5);

-- Announcements
INSERT INTO announcements (headline, type, is_scrolling, is_active) VALUES
  ('Welcome to A.M Hydraulics! Explore our new high-pressure EN 856 4SH Spiral Hoses, now in stock.', 'info', true, true);

-- Testimonials
INSERT INTO testimonials (client_name, client_designation, company_name, testimonial_text, rating, is_featured) VALUES
  ('Rajesh Kumar', 'Maintenance Engineer', 'Heavy Earth Movers Ltd', 'The EN 856 4SP spiral hoses we procured from A.M Hydraulics have been exceptionally durable in our excavators. Great quality, fast delivery, and perfect fit.', 5, true),
  ('Amit Sharma', 'Procurement Manager', 'Industrial Systems & Automation', 'Highly reliable metric fittings and adapters. They ensure a leak-free operation in our hydraulic power units. Highly recommended for critical operations.', 5, true),
  ('Vikram Singh', 'Operations Head', 'SteelWorks India', 'A.M Hydraulics has always delivered on time. Their range of high-pressure braided hoses saved our production line during an emergency breakdown.', 4, true);

-- Blog Categories
INSERT INTO blog_categories (category_name, slug, description) VALUES
  ('Technical Guides', 'technical-guides', 'Technical guides, best practices, and tutorials for hydraulic systems'),
  ('Industry News', 'industry-news', 'Latest news, innovations, and updates from the fluid technology industry');

-- Blogs
DO $$
DECLARE
  tech_cat_id UUID;
  news_cat_id UUID;
BEGIN
  SELECT id INTO tech_cat_id FROM blog_categories WHERE slug = 'technical-guides';
  SELECT id INTO news_cat_id FROM blog_categories WHERE slug = 'industry-news';

  INSERT INTO blogs (title, slug, excerpt, content, author_name, category_id, is_published, is_featured, read_time) VALUES
    ('How to Choose the Right Hydraulic Hose for High-Pressure Applications', 
     'how-to-choose-right-hydraulic-hose', 
     'Selecting the correct hydraulic hose is critical for system safety and efficiency. Learn the key factors to consider.', 
     '<p>When selecting a hydraulic hose, you must consider the <strong>STAMPED</strong> criteria: Size, Temperature, Application, Material, Pressure, Ends, and Delivery.</p><p>For extreme pressure, spiral hoses (like EN 856 4SH) are generally preferred over braided hoses due to their superior resistance to pressure impulses. Always ensure that the fittings match the hose specifications to prevent catastrophic failures.</p>',
     'Technical Team', tech_cat_id, true, true, 5),
     
    ('Understanding Metric and BSP Fittings in Hydraulic Systems', 
     'understanding-metric-bsp-fittings', 
     'A comprehensive guide to identifying and utilizing Metric and British Standard Pipe (BSP) fittings.', 
     '<p>Thread identification is one of the most challenging aspects of hydraulic maintenance. Metric fittings, defined by their parallel threads and O-ring seals (like DKOL/DKOS), are standard in modern European machinery.</p><p>Conversely, BSP fittings remain common in legacy systems. Knowing how to measure thread pitch and diameter is essential for creating leak-free hydraulic circuits.</p>',
     'Engineering Dept', tech_cat_id, true, false, 4),
     
    ('A.M Hydraulics Expands Catalog with New HANSA-FLEX Components', 
     'amh-expands-catalog-hansa-flex', 
     'We are proud to announce the addition of premium HANSA-FLEX hydraulic components to our inventory.', 
     '<p>In our ongoing effort to provide the highest quality products to our customers, A.M Hydraulics has expanded its product line to include premium hoses and fittings from <strong>HANSA-FLEX</strong>.</p><p>This addition ensures that our clients have access to globally recognized, certified, and rigorously tested fluid technology systems for their most demanding applications.</p>',
     'Admin', news_cat_id, true, true, 3);
END $$;
