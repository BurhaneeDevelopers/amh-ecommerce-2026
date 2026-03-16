export interface ReportProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  pcsPerCarton: number;
  stock: number;
  image?: string;
}

export interface ReportMeta {
  dealerName: string;
  dealerCode: string;
  generatedAt: string;
  totalProducts: number;
  totalValue: number;
}
