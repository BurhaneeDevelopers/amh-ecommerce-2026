-- Add is_featured and "order" columns to category table
-- Run this in your Supabase SQL Editor

ALTER TABLE category 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Create an index for better query performance on featured categories
CREATE INDEX IF NOT EXISTS idx_category_featured ON category(is_featured, "order") WHERE is_featured = true;

-- Optional: Update some existing categories to be featured (example)
-- UPDATE category SET is_featured = true, "order" = 1 WHERE category_name = 'Cordless Tools';
-- UPDATE category SET is_featured = true, "order" = 2 WHERE category_name = 'Power Tools';
-- UPDATE category SET is_featured = true, "order" = 3 WHERE category_name = 'Air Compressor';
-- UPDATE category SET is_featured = true, "order" = 4 WHERE category_name = 'Welding Machine';

-- Verify the changes
SELECT id, category_name, type, is_featured, "order" 
FROM category 
WHERE type = 'main' 
ORDER BY "order";
