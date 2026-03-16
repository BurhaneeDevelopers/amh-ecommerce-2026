import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import path from 'path';
import fs from 'fs';
import React from 'react';
import sharp from 'sharp';
import ProductReportPDF from '@/components/pdf/ProductReportPDF';
import { ReportProduct, ReportMeta } from '@/types/report';
import { Product } from '@/supabase/schema/schema.type';

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

  // Fetch product images server-side and convert to base64 data URIs
  // so @react-pdf/renderer doesn't have to make external requests
  async function fetchImageAsDataUri(url: string): Promise<string | undefined> {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) {
        console.warn(`⚠️ Image fetch failed [${res.status}]: ${url}`);
        return undefined;
      }
      const raw = Buffer.from(await res.arrayBuffer());
      // Convert to PNG via sharp — normalises CMYK, EXIF, ICC profiles
      // that @react-pdf/renderer can't handle
      const png = await sharp(raw).toFormat('png').toBuffer();
      return `data:image/png;base64,${png.toString('base64')}`;
    } catch (err) {
      console.warn(`⚠️ Image fetch error: ${url}`, err);
      return undefined;
    }
  }

  // Map client products to report format
  const products: ReportProduct[] = await Promise.all(
    clientProducts.map(async (p) => {
      const rawImage = p.photos?.[0];
      const image = rawImage ? await fetchImageAsDataUri(rawImage) : undefined;
      return {
        id: p.id ?? '',
        name: p.product_name ?? '',
        sku: p.model_number ?? p.model_tally_name ?? '',
        category: p.category?.category_name ?? '—',
        price: 0,
        pcsPerCarton: p.pcs_per_crtn ?? 0,
        stock: p.on_hand_qty ?? 0,
        image,
      };
    })
  );

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
