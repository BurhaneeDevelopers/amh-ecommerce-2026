import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import path from 'path';
import fs from 'fs';
import React from 'react';
import ProductReportPDF from '@/components/pdf/ProductReportPDF';
import { ReportProduct, ReportMeta } from '@/types/report';
import { Product } from '@/supabase/schema/schema.type';

function deriveStatus(onHandQty: number, stockStatus?: boolean): ReportProduct['status'] {
  if (!stockStatus || onHandQty === 0) return 'out_of_stock';
  if (onHandQty <= 5) return 'low_stock';
  return 'in_stock';
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { products: clientProducts, dealerCode, dealerName } = body as {
    products: Product[];
    dealerCode: string;
    dealerName: string;
  };

  // Resolve letterhead image — convert to base64 data URI for @react-pdf/renderer
  const pngPath = path.join(process.cwd(), 'public', 'report-template.png');
  let letterheadImagePath = '';
  
  if (fs.existsSync(pngPath)) {
    const imageBuffer = fs.readFileSync(pngPath);
    const base64Image = imageBuffer.toString('base64');
    letterheadImagePath = `data:image/png;base64,${base64Image}`;
    console.log('✅ Letterhead loaded:', pngPath, '- Size:', imageBuffer.length, 'bytes');
  } else {
    console.warn('⚠️ Letterhead PNG not found at:', pngPath);
  }

  // Map client products to report format
  const products: ReportProduct[] = clientProducts.map((p) => {
    const qty = p.on_hand_qty ?? 0;
    return {
      id: p.id ?? '',
      name: p.product_name ?? '',
      sku: p.model_number ?? p.model_tally_name ?? '',
      category: p.category?.category_name ?? '—',
      price: 0, // No price in schema yet
      pcsPerCarton: p.pcs_per_crtn ?? 0,
      stock: qty,
      status: deriveStatus(qty, p.stock_status),
    };
  });

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const timestamp = new Date();

  const meta: ReportMeta = {
    dealerName: dealerName || dealerCode,
    dealerCode,
    generatedAt: timestamp.toLocaleString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    totalProducts: products.length,
    totalValue,
  };

  const element = React.createElement(ProductReportPDF, {
    products,
    meta,
    letterheadImagePath,
  });

  const buffer = await renderToBuffer(element);

  const safeCode = dealerCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const ts = timestamp.toISOString().slice(0, 10);
  const filename = `product-report-${safeCode}-${ts}.pdf`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
