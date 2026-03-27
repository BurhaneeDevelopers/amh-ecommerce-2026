import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { ReportProduct, ReportMeta } from '@/types/report';

// Fallback placeholder — a tiny 1×1 transparent PNG as base64
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const BRAND_PRIMARY = '#ff6b35';
const BRAND_SECONDARY = '#8b5cf6';

// ── Adjust these to match your letterhead's actual header/footer height ──────
const HEADER_HEIGHT = 110;
const FOOTER_HEIGHT = 80;
const SIDE_MARGIN   = 40;

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#111827',
    // NO margin/padding here — we handle spacing with fixed spacers below
  },

  // Letterhead fills the whole page on every page
  letterhead: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  // Fixed spacer at the top — reserves header space on EVERY page
  headerSpacer: {
    height: HEADER_HEIGHT,
  },

  // Fixed spacer at the bottom — reserves footer space on EVERY page
  footerSpacer: {
    height: FOOTER_HEIGHT,
  },

  // Scrollable content area — sits between the two fixed spacers
  content: {
    flex: 1,
    marginLeft: SIDE_MARGIN,
    marginRight: SIDE_MARGIN,
  },

  // Title row
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleLeft: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: BRAND_PRIMARY,
    marginBottom: 2,
  },
  dealerInfo: {
    fontSize: 9,
    color: '#6B7280',
  },
  generatedDate: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'right',
  },

  // Summary chips
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: BRAND_PRIMARY,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 80,
  },
  chipValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  chipLabel: {
    fontSize: 7,
    color: '#FFEDD5',
    marginTop: 1,
  },

  // Table
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_PRIMARY,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 2,
    marginBottom: 1,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tableRowEven: {
    backgroundColor: '#F3F4F6',
  },
  tableRowOdd: {
    backgroundColor: '#FFFFFF',
  },
  colImage:       { width: 64 },
  colProduct:     { flex: 3 },
  colSku:         { flex: 2 },
  colCategory:    { flex: 2.5 },
  colPrice:       { flex: 1 },
  colPcsPerCarton:{ flex: 1 },
  colStock:       { flex: 0.7 },
  headerCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    paddingRight: 4,
  },
  cell: {
    fontSize: 8,
    color: '#374151',
    paddingRight: 4,
  },

  // Product thumbnail
  productImage: {
    width: 52,
    height: 52,
    objectFit: 'contain',
    borderRadius: 2,
  },

  // Page number (bottom right, above footer)
  pageNumber: {
    fontSize: 7,
    color: '#9CA3AF',
    textAlign: 'right',
    marginRight: SIDE_MARGIN,
    marginBottom: 4,
  },
});

const formatCurrency = (val: number) =>
  `RS ${val.toLocaleString('en-IN')}`;

interface Props {
  products: ReportProduct[];
  meta: ReportMeta;
  letterheadImagePath: string;
}

export default function ProductReportPDF({ products, meta, letterheadImagePath }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Letterhead: repeats on every page via fixed ── */}
        {letterheadImagePath && (
          <Image src={letterheadImagePath} style={styles.letterhead} fixed />
        )}

        {/* ── Header spacer: fixed, pushes content below letterhead header ── */}
        <View style={styles.headerSpacer} fixed />

        {/* ── Scrollable content ── */}
        <View style={styles.content}>

          {/* Title row */}
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.title}>Product Price List</Text>
              <Text style={styles.dealerInfo}>
                {meta.dealerName}  ·  {meta.dealerCode}
              </Text>
            </View>
            <Text style={styles.generatedDate}>
              Generated: {meta.generatedAt}
            </Text>
          </View>

          {/* Table header — repeats on every page via fixed */}
          <View style={styles.tableHeader} fixed>
            <Text style={[styles.headerCell, styles.colImage]}>Image</Text>
            <Text style={[styles.headerCell, styles.colProduct]}>Product</Text>
            <Text style={[styles.headerCell, styles.colSku]}>SKU</Text>
            <Text style={[styles.headerCell, styles.colCategory]}>Category</Text>
            <Text style={[styles.headerCell, styles.colPrice]}>Price</Text>
            <Text style={[styles.headerCell, styles.colPcsPerCarton]}>Pcs/Ctn</Text>
            <Text style={[styles.headerCell, styles.colStock]}>Stock</Text>
          </View>

          {/* Table rows */}
          {products.map((product, i) => (
            <View
              key={product.id}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
              wrap={false}
            >
              <View style={styles.colImage}>
                <Image
                  src={product.image || PLACEHOLDER_IMAGE}
                  style={styles.productImage}
                />
              </View>
              <Text style={[styles.cell, styles.colProduct]}>{product.name}</Text>
              <Text style={[styles.cell, styles.colSku]}>{product.sku}</Text>
              <Text style={[styles.cell, styles.colCategory]}>{product.category}</Text>
              <Text style={[styles.cell, styles.colPrice]}>{formatCurrency(product.price)}</Text>
              <Text style={[styles.cell, styles.colPcsPerCarton]}>{product.pcsPerCarton}</Text>
              <Text style={[styles.cell, styles.colStock]}>{product.stock}</Text>
            </View>
          ))}

        </View>

        {/* ── Page number: sits just above the footer spacer ── */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />

        {/* ── Footer spacer: fixed, keeps content above letterhead footer ── */}
        <View style={styles.footerSpacer} fixed />

      </Page>
    </Document>
  );
}