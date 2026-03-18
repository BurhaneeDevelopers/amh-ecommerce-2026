import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import path from 'path';
import fs from 'fs';
import React from 'react';
import sharp from 'sharp';
import ProductReportPDF from '@/components/pdf/ProductReportPDF';
import { ReportProduct, ReportMeta } from '@/types/report';
import { Product } from '@/supabase/schema/schema.type';

// Fetch a remote image and convert to a base64 PNG data URI.
// Returns undefined on any failure so the PDF still renders with a placeholder.
async function fetchImageAsDataUri(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return undefined;

    const raw = Buffer.from(await res.arrayBuffer());

    // Resize + normalise via sharp — handles CMYK, EXIF, corrupt formats
    const png = await sharp(raw)
      .resize({ width: 64, height: 64, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toFormat('png')
      .toBuffer();

    return `data:image/png;base64,${png.toString('base64')}`;
  } catch {
    return undefined;
  }
}

const CONCURRENCY = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products: clientProducts, dealerCode, dealerName } = body as {
      products: Product[];
      dealerCode: string;
      dealerName: string;
    };

    // Letterhead
    const pngPath = path.join(process.cwd(), 'public', 'report-template.png');
    let letterheadImagePath = '';
    if (fs.existsSync(pngPath)) {
      const buf = fs.readFileSync(pngPath);
      letterheadImagePath = `data:image/png;base64,${buf.toString('base64')}`;
    }

    // Map products in batches to avoid OOM on large catalogs
    const reportProducts: ReportProduct[] = [];
    for (let i = 0; i < clientProducts.length; i += CONCURRENCY) {
      const chunk = clientProducts.slice(i, i + CONCURRENCY);
      const resolved = await Promise.all(
        chunk.map(async (p) => {
          const image = p.photos?.[0] ? await fetchImageAsDataUri(p.photos[0]) : undefined;
          return {
            id: p.id ?? '',
            name: p.product_name ?? '',
            sku: p.model_number ?? p.model_tally_name ?? '',
            category: p.category?.category_name ?? '—',
            price: p.price ?? 0,
            pcsPerCarton: p.pcs_per_crtn ?? 0,
            stock: p.on_hand_qty ?? 0,
            image,
          } satisfies ReportProduct;
        })
      );
      reportProducts.push(...resolved);
    }

    const timestamp = new Date();
    const meta: ReportMeta = {
      dealerName: dealerName || dealerCode,
      dealerCode,
      generatedAt: timestamp.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ' ' + timestamp.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      totalProducts: reportProducts.length,
      totalValue: reportProducts.reduce((sum, p) => sum + p.price * p.stock, 0),
    };

    const element = React.createElement(ProductReportPDF, {
      products: reportProducts,
      meta,
      letterheadImagePath,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(element as any);

    const safeCode = dealerCode.replace(/[^a-zA-Z0-9_-]/g, '_');
    const ts = timestamp.toISOString().slice(0, 10);
    const filename = `product-report-${safeCode}-${ts}.pdf`;

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[PDF export] Fatal error:', err);
    return NextResponse.json(
      { error: 'Failed to generate PDF', detail: String(err) },
      { status: 500 }
    );
  }
}
