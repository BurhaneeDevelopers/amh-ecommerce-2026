# Database Migrations

This directory contains SQL migration files for the A.M. Hydraulics & Pneumatics e-commerce platform.

## Migration Files

### 001_hydraulics_catalog_schema.sql
**Core Product Catalog Schema**

This is the main schema for the product catalog system with hierarchical categories.

**Tables:**
- `categories` - Product categories with main/sub hierarchy
- `masters` - Attribute types (Size, Length, Material, etc.)
- `master_fields` - Specific fields for each master with options
- `products` - Actual products in the catalog

**Key Features:**
- Hierarchical categories (main categories with subcategories)
- Flexible master-based product attributes
- JSONB storage for dynamic product specifications
- Full-text search support
- Row Level Security (RLS) policies

**Helper Functions:**
- `get_category_masters(category_uuid)` - Get all masters for a category
- `search_products(search_term, category_filter, status_filter)` - Search products
- `get_subcategories(main_category_id)` - Get subcategories for a main category
- `get_category_hierarchy()` - Get complete category tree with subcategories

### 002_supporting_features_schema.sql
**Supporting Features Schema**

This schema includes all supporting features for the e-commerce platform.

**Tables:**
- `brands` - Brand information
- `ads` - Advertisement banners and promotional content
- `announcements` - Site-wide announcements
- `blog_categories` - Blog post categories
- `blogs` - Blog posts and articles
- `testimonials` - Customer testimonials
- `wishlist` - User wishlist items
- `enquiries` - Product enquiries and quote requests
- `product_comments` - Product reviews and ratings
- `comment_helpful` - Tracks helpful comments
- `comment_replies` - Admin replies to comments

**Key Features:**
- Complete blog system with categories
- Advertisement management with placement types
- Customer review and rating system
- Wishlist functionality
- Enquiry/quote request system
- Testimonials management

## Running Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `001_hydraulics_catalog_schema.sql`
4. Paste and run the SQL
5. Repeat for `002_supporting_features_schema.sql`

### Option 2: Supabase CLI
```bash
# Make sure you're in the project root
cd /path/to/amh-ecommerce-2026

# Run migration 001
supabase db push --file src/supabase/migrations/001_hydraulics_catalog_schema.sql

# Run migration 002
supabase db push --file src/supabase/migrations/002_supporting_features_schema.sql
```

### Option 3: Direct SQL Connection
If you have direct database access:
```bash
psql -h your-db-host -U postgres -d postgres -f src/supabase/migrations/001_hydraulics_catalog_schema.sql
psql -h your-db-host -U postgres -d postgres -f src/supabase/migrations/002_supporting_features_schema.sql
```

## Migration Order

**IMPORTANT:** Always run migrations in order:
1. First: `001_hydraulics_catalog_schema.sql` (Core catalog)
2. Second: `002_supporting_features_schema.sql` (Supporting features)

Migration 002 depends on tables created in migration 001 (specifically the `products` table for foreign keys).

## Category Hierarchy

The new schema supports a two-level category hierarchy:

```
Main Category (type='main', parent_id=NULL)
├── Subcategory 1 (type='sub', parent_id=main_category_id)
├── Subcategory 2 (type='sub', parent_id=main_category_id)
└── Subcategory 3 (type='sub', parent_id=main_category_id)
```

**Example:**
```
Die Springs (main)
├── Light Load Springs (sub)
└── Heavy Load Springs (sub)

Ejector Pins (main)
├── Standard Pins (sub)
└── Nitrided Pins (sub)
```

## Sample Data

Both migrations include seed data:

**Migration 001 includes:**
- 3 main categories (Die Springs, Ejector Pins, Hydraulic Tools)
- 4 subcategories
- 4 masters with fields

**Migration 002 includes:**
- No seed data (tables are created empty)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**Public Access:**
- Read access to active/published content
- Categories, products, blogs, ads, testimonials

**Authenticated Users:**
- Full CRUD on their own wishlist
- Create enquiries and comments
- View all content (including drafts)

**Admin Users:**
- Full CRUD on all tables
- Manage all content

## Database Functions

### Product Catalog Functions

**get_category_masters(category_uuid UUID)**
Returns all masters and their fields for a specific category.

**search_products(search_term TEXT, category_filter UUID, status_filter TEXT)**
Full-text search across products with filtering.

**get_subcategories(main_category_id UUID)**
Returns all subcategories for a main category.

**get_category_hierarchy()**
Returns complete category tree with nested subcategories as JSONB.

## Indexes

All tables include optimized indexes for:
- Primary keys (UUID)
- Foreign keys
- Frequently queried columns
- Sort/order columns
- JSONB fields (GIN indexes)

## Triggers

All tables with `updated_at` columns have automatic triggers to update the timestamp on row updates.

## Notes

- All IDs use UUID v4
- Timestamps use TIMESTAMPTZ (timezone-aware)
- JSONB is used for flexible data structures
- Text fields have length constraints
- Enum-like fields use CHECK constraints
- Cascading deletes are configured where appropriate

## Troubleshooting

**Error: "relation already exists"**
- Tables already exist. Drop them first or use `CREATE TABLE IF NOT EXISTS`

**Error: "function update_updated_at_column() does not exist"**
- Run migration 001 first, it creates this function

**Error: "foreign key constraint violation"**
- Ensure migration 001 is run before migration 002
- Check that referenced records exist

## Dashboard Integration

These schemas are designed to work with a separate admin dashboard application where you can:
- Manage categories and products
- Create and publish blogs
- Manage ads and announcements
- Review and respond to enquiries
- Moderate product comments
- Manage brands and testimonials

The RLS policies ensure that only authenticated admin users can modify content through the dashboard.
