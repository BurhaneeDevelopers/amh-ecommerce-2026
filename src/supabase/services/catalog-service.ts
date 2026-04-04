import { createClient } from '../client';
import type { Category, Master, MasterField, Product } from '../schema/schema.type';

const supabase = createClient();

// =====================================================
// CATEGORY SERVICES
// =====================================================

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// =====================================================
// MASTER SERVICES
// =====================================================

export async function getMastersByCategory(categoryId: string): Promise<Master[]> {
  const { data, error } = await supabase
    .from('masters')
    .select(`
      *,
      fields:master_fields(*)
    `)
    .eq('category_id', categoryId)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getAllMasters(): Promise<Master[]> {
  const { data, error } = await supabase
    .from('masters')
    .select(`
      *,
      fields:master_fields(*)
    `)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function createMaster(master: Omit<Master, 'id' | 'created_at' | 'updated_at'>): Promise<Master> {
  const { data, error } = await supabase
    .from('masters')
    .insert(master)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateMaster(id: string, updates: Partial<Master>): Promise<Master> {
  const { data, error } = await supabase
    .from('masters')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteMaster(id: string): Promise<void> {
  const { error } = await supabase
    .from('masters')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// =====================================================
// MASTER FIELD SERVICES
// =====================================================

export async function createMasterField(field: Omit<MasterField, 'id' | 'created_at'>): Promise<MasterField> {
  const { data, error } = await supabase
    .from('master_fields')
    .insert(field)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateMasterField(id: string, updates: Partial<MasterField>): Promise<MasterField> {
  const { data, error } = await supabase
    .from('master_fields')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteMasterField(id: string): Promise<void> {
  const { error } = await supabase
    .from('master_fields')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// =====================================================
// PRODUCT SERVICES
// =====================================================

export async function getAllProducts(filters?: {
  categoryId?: string;
  status?: 'active' | 'inactive' | 'draft';
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `);
  
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  return data;
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('sku', sku)
    .single();
  
  if (error) throw error;
  
  return data;
}

export async function searchProducts(searchTerm: string, categoryId?: string): Promise<Product[]> {
  const { data, error } = await supabase
    .rpc('search_products', {
      search_term: searchTerm,
      category_filter: categoryId || null,
      status_filter: 'active'
    });
  
  if (error) throw error;
  return data || [];
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Get all masters with fields for a specific category
export async function getCategoryMasters(categoryId: string): Promise<Master[]> {
  const { data, error } = await supabase
    .rpc('get_category_masters', { category_uuid: categoryId });
  
  if (error) throw error;
  return data || [];
}