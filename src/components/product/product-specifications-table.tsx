"use client";

import { Product } from "@/supabase/schema/schema.type";
import { Button } from "@/components/ui/button";

interface ProductSpecificationsTableProps {
  product: Product;
  onGetQuote: (rowData?: { index: number; cells: { label: string; value: string; unit: string | null }[] }) => void;
}

interface SpecificationRow {
  [key: string]: string;
}

export default function ProductSpecificationsTable({
  product,
  onGetQuote,
}: ProductSpecificationsTableProps) {
  // Check if product uses variants (new system) or legacy master values
  const hasVariants = product.product_variants && product.product_variants.length > 0;

  if (hasVariants) {
    return <VariantSpecificationsTable product={product} onGetQuote={onGetQuote} />;
  } else {
    return <LegacySpecificationsTable product={product} onGetQuote={onGetQuote} />;
  }
}

// =====================================================
// VARIANT-BASED SPECIFICATIONS TABLE (NEW SYSTEM)
// =====================================================
function VariantSpecificationsTable({
  product,
  onGetQuote,
}: ProductSpecificationsTableProps) {
  const variants = product.product_variants || [];

  if (variants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No specifications available for this product
        </p>
      </div>
    );
  }

  // Extract all unique master fields (columns) from all variants
  const columnMap = new Map<string, { label: string; unit: string | null; sortOrder: number }>();

  variants.forEach((variant) => {
    variant.product_variant_values?.forEach((vv) => {
      if (vv.master_field) {
        const fieldId = vv.master_field.id!;
        if (!columnMap.has(fieldId)) {
          columnMap.set(fieldId, {
            label: vv.master_field.label,
            unit: vv.master_field.unit || null,
            sortOrder: vv.master_field.sort_order || 0,
          });
        }
      }
    });
  });

  // Convert to array and sort by sort_order
  const columns = Array.from(columnMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (columns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No specifications available for this product
        </p>
      </div>
    );
  }

  // Build rows from variants
  const rows = variants
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((variant) => {
      const row: { [key: string]: string } = {};
      
      variant.product_variant_values?.forEach((vv) => {
        if (vv.master_field) {
          row[vv.master_field.id!] = vv.value;
        }
      });

      return {
        variantId: variant.id!,
        variantName: variant.variant_name,
        data: row,
      };
    });

  const handleGetQuoteForRow = (rowIndex: number) => {
    const row = rows[rowIndex];
    const cells = columns.map((col) => ({
      label: col.label,
      value: row.data[col.id] || '-',
      unit: col.unit,
    }));

    onGetQuote({ index: rowIndex, cells });
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-300"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border border-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.variantId}
                className={`hover:bg-gray-50 transition-colors ${
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className="px-4 py-3 text-sm text-gray-900 border border-gray-300"
                  >
                    {row.data[col.id] || '-'}
                    {col.unit && row.data[col.id] && row.data[col.id] !== '-' && (
                      <span className="text-gray-600"> {col.unit}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-center border border-gray-300">
                  <Button
                    onClick={() => handleGetQuoteForRow(rowIdx)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Quote
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {rows.map((row, rowIdx) => (
          <div
            key={row.variantId}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            {row.variantName && (
              <div className="mb-3 pb-2 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-900">
                  {row.variantName}
                </span>
              </div>
            )}
            <div className="space-y-3">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {col.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {row.data[col.id] || '-'}
                    {col.unit && row.data[col.id] && row.data[col.id] !== '-' && (
                      <span className="text-gray-600"> {col.unit}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <Button
                onClick={() => handleGetQuoteForRow(rowIdx)}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Quote
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// LEGACY SPECIFICATIONS TABLE (OLD SYSTEM)
// =====================================================
function LegacySpecificationsTable({
  product,
}: ProductSpecificationsTableProps) {
  // Parse product master values into table structure
  // The key is to group master values that belong together (same row)
  
  // First, collect all unique master fields (columns)
  const columns: { id: string; label: string; unit: string | null; sortOrder: number }[] = [];
  const columnMap = new Map<string, { label: string; unit: string | null; sortOrder: number }>();

  product.product_master_values?.forEach((pmv) => {
    const masterValue = pmv.master_values;
    if (!masterValue?.master_fields) return;

    const field = masterValue.master_fields;
    const fieldId = field.id!;

    if (!columnMap.has(fieldId)) {
      columnMap.set(fieldId, {
        label: field.label,
        unit: field.unit || null,
        sortOrder: field.sort_order || 0
      });
      columns.push({
        id: fieldId,
        label: field.label,
        unit: field.unit || null,
        sortOrder: field.sort_order || 0
      });
    }
  });

  // Sort columns by sort_order
  columns.sort((a, b) => a.sortOrder - b.sortOrder);

  if (columns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No specifications available for this product
        </p>
      </div>
    );
  }

  // Group master values into rows
  // We need to figure out which values belong to the same row
  // Strategy: Group by the number of values per field
  // If we have 10 values for "Tube O.D." field, we should have 10 rows
  
  const fieldValues = new Map<string, string[]>();
  
  product.product_master_values?.forEach((pmv) => {
    const masterValue = pmv.master_values;
    if (!masterValue?.master_fields) return;

    const fieldId = masterValue.master_fields.id!;
    
    if (!fieldValues.has(fieldId)) {
      fieldValues.set(fieldId, []);
    }
    
    fieldValues.get(fieldId)!.push(masterValue.value);
  });

  // Determine number of rows (max values in any field)
  let maxRows = 0;
  fieldValues.forEach((values) => {
    maxRows = Math.max(maxRows, values.length);
  });

  // Create rows
  const rows: SpecificationRow[] = [];
  for (let i = 0; i < maxRows; i++) {
    const row: SpecificationRow = {};
    columns.forEach((col) => {
      const values = fieldValues.get(col.id) || [];
      row[col.id] = values[i] || '-';
    });
    rows.push(row);
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-300"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`hover:bg-gray-50 transition-colors ${
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className="px-4 py-3 text-sm text-gray-900 border border-gray-300"
                  >
                    {row[col.id]}
                    {col.unit && row[col.id] !== '-' && (
                      <span className="text-gray-600"> {col.unit}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="space-y-3">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {col.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {row[col.id]}
                    {col.unit && row[col.id] !== '-' && (
                      <span className="text-gray-600"> {col.unit}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
