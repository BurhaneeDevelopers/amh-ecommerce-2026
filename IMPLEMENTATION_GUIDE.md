# A.M Hydraulics E-Commerce Implementation Guide

## Overview
This implementation provides a complete e-commerce system for A.M Hydraulics with support for:
- Main categories and subcategories
- Dynamic product specifications using Masters system
- Product listing with filtering
- Detailed product pages with specification tables
- Quote request functionality per specification row

## Database Schema
The system uses the schema defined in:
- `001_initial_schema.sql` - Complete database structure
- `002_seed_data.sql` - Sample data for testing

### Key Tables
- `categories` - Main categories and subcategories (parent_id relationship)
- `masters` - Specification types (e.g., "Internal Diameter", "Pressure")
- `master_fields` - Fields within masters (e.g., "Operating Pressure")
- `master_values` - Possible values for fields (e.g., "420.0 bar")
- `products` - Product catalog
- `product_master_values` - Links products to their specifications

## New Files Created

### Services
1. **src/supabase/services/master-service.ts**
   - Handles master data retrieval
   - Gets masters by category
   - Fetches master fields and values

2. **src/api/master.service.ts**
   - React Query hooks for master data
   - `useGetMastersByCategory`
   - `useGetMasterWithFields`
   - `useGetAllMasters`

### Pages
1. **src/app/categories/page.tsx**
   - Lists all main categories
   - Card-based layout with icons and colors
   - Links to individual category pages

2. **src/app/category/[slug]/page.tsx** (Updated)
   - Shows main category with subcategories in sidebar
   - Filters products by selected subcategory
   - Search functionality
   - Responsive grid layout

### Components
1. **src/components/product/product-specifications-table.tsx**
   - Displays product specifications in table format
   - Each row has its own "Get Quote" button
   - Responsive design (table on desktop, cards on mobile)
   - Parses product_master_values into structured table

## Updated Files

### Schema Types
- **src/supabase/schema/schema.type.ts**
  - Updated `Category` interface to match new schema
  - Changed from `type: 'main' | 'sub'` to `is_main: boolean`
  - Removed `slug` field
  - Added `parent` and `product_count` joined data

### Services
- **src/supabase/services/category-service.ts**
  - Added `getMainCategories()` - Get only main categories
  - Added `getMainCategoriesWithSubcategories()` - Get main with nested subs
  - Added `getSubcategoriesByParentId()` - Get subcategories by parent
  - Added `getCategoryWithSubcategories()` - Get single category with subs
  - Updated `getSingleCategoryById()` to include parent and subcategories

### API Hooks
- **src/api/category.service.ts**
  - Added `useGetMainCategories`
  - Added `useGetMainCategoriesWithSubcategories`
  - Added `useGetSubcategoriesByParentId`
  - Added `useGetCategoryWithSubcategories`

### Pages
- **src/app/products/[id]/page.tsx**
  - Added `ProductSpecificationsTable` component
  - Added specification selection for quote requests
  - Improved layout and spacing

## Usage

### Viewing Categories
1. Navigate to `/categories` to see all main categories
2. Click on a category to view its subcategories and products
3. Use the sidebar to filter by subcategory
4. Search within the category using the search bar

### Product Details
1. Click on any product to view details
2. View specifications table (if product has master values)
3. Click "Get Quote" on any specification row
4. Fill out the quote form

### Data Structure Example

```typescript
// Product with specifications
{
  id: "uuid",
  name: "Spiral Hose EN 856 4SP - DN 10",
  sku: "SP-4SP-10",
  category_id: "subcategory-uuid",
  product_master_values: [
    {
      master_values: {
        value: "10.0",
        master_fields: {
          label: "Internal Diameter",
          unit: "mm",
          masters: {
            name: "Internal Diameter (ID)",
            icon: "⭕",
            color: "#3b82f6"
          }
        }
      }
    },
    // ... more specifications
  ]
}
```

## Responsive Design
- Desktop: Table view for specifications
- Mobile: Card-based view for specifications
- Sidebar collapses on mobile
- Grid layouts adjust based on screen size

## Features

### Category System
- Hierarchical structure (main → subcategories)
- Color-coded categories
- Icon support
- Product count per category

### Product Specifications
- Dynamic table generation from master values
- Multiple specification types per product
- Unit display (mm, bar, etc.)
- Row-level quote requests

### Quote System
- Quote requests per specification row
- Pre-filled product information
- Success confirmation modal
- Email notifications (via existing system)

## API Endpoints (Supabase)
All data is fetched via Supabase client with Row Level Security:
- Public read access for active products
- Authenticated access for drafts and admin features

## Next Steps
1. Add product images support
2. Implement advanced filtering (by master values)
3. Add comparison feature for products
4. Implement bulk quote requests
5. Add export functionality for specifications

## Reference Website
Design inspired by: https://www.hy-techengineers.com/din-metric-fittings.php
- Sidebar navigation for subcategories
- Specification tables with action buttons
- Clean, professional layout
