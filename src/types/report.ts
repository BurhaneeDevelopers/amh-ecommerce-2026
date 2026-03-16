export interface ReportProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  pcsPerCarton: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface ReportMeta {
  dealerName: string;
  dealerCode: string;
  generatedAt: string;
  totalProducts: number;
  totalValue: number;
}
