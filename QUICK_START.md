# Quick Start Guide - A.M Hydraulics E-Commerce

## Prerequisites
1. Supabase project with the schema from `001_initial_schema.sql`
2. Seed data loaded from `002_seed_data.sql`
3. Environment variables configured:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Installation
```bash
npm install
# or
bun install
```

## Running the Application
```bash
npm run dev
# or
bun dev
```

## Key Routes

### Categories
- `/categories` - View all main categories
- `/category/[id]` - View category with subcategories and products

### Products
- `/products` - All products listing
- `/products/[id]` - Product details with specifications table

## Testing the Implementation

### 1. View Categories
Navigate to `http://localhost:3000/categories`
- Should see 14 main categories from seed data
- Each category has icon, color, and description
- Click any category to view its products

### 2. Browse Category with Subcategories
Click on "Hydraulic Hoses" category
- Left sidebar shows subcategories:
  - Braided Hoses
  - Spiral Hoses
  - Textile Hoses
  - PTFE Hoses
- Click subcategory to filter products
- Search bar filters products in real-time

### 3. View Product Details
Click on any product (e.g., "Spiral Hose EN 856 4SP - DN 10")
- Product information displayed
- Specifications table shows:
  - Internal Diameter: 10.0 mm
  - Max Operating Pressure: 420.0 bar
  - Standard: EN 856 4SP
- Each row has "Get Quote" button

### 4. Request Quote
Click "Get Quote" on any specification row
- Modal opens with product pre-filled
- Fill in contact details
- Submit quote request

## Data Flow

```
Categories Page
    ↓
Main Category Page (with subcategories sidebar)
    ↓
Product Listing (filtered by subcategory)
    ↓
Product Details (with specifications table)
    ↓
Quote Request (per specification row)
```

## Customization

### Styling
All components use Tailwind CSS classes. Modify colors in:
- `tailwind.config.js` - Global theme colors
- Component files - Individual component styles

### Adding New Categories
Use Supabase dashboard or SQL:
```sql
INSERT INTO categories (name, description, color, icon, is_main, parent_id)
VALUES ('New Category', 'Description', '#3b82f6', '🔧', true, NULL);
```

### Adding New Products
```sql
-- 1. Create product
INSERT INTO products (name, sku, description, category_id, status)
VALUES ('Product Name', 'SKU-001', 'Description', 'category-uuid', 'active');

-- 2. Link to master values
INSERT INTO product_master_values (product_id, master_value_id)
VALUES ('product-uuid', 'master-value-uuid');
```

## Troubleshooting

### Products not showing
- Check product status is 'active'
- Verify category_id is correct
- Check RLS policies in Supabase

### Specifications table empty
- Ensure product has product_master_values
- Verify master_values have master_fields
- Check master_fields have masters

### Categories not loading
- Verify Supabase connection
- Check environment variables
- Review browser console for errors

## Mobile Responsiveness
- Categories: Grid adjusts from 3 columns to 1
- Sidebar: Collapses on mobile, shows above products
- Specifications: Table converts to cards on mobile
- All touch-friendly with proper spacing

## Performance
- React Query caching (5 minutes stale time)
- Lazy loading with Suspense
- Optimized Supabase queries with joins
- No refetch on window focus

## Security
- Row Level Security (RLS) enabled on all tables
- Public read access for active products
- Authenticated access for admin features
- No sensitive data exposed in client

## Support
For issues or questions:
1. Check IMPLEMENTATION_GUIDE.md for detailed documentation
2. Review Supabase logs for database errors
3. Check browser console for client-side errors
4. Verify seed data is loaded correctly
