export interface SalesData {
  id?: string;
  saleDate: string;
  productName: string;
  productId: string;
  price: number;
  stockSold: number;
  profitMargin: number;
  stockBalance: number;
  timestamp: string;
  userId: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface MetricsSummary {
  totalProducts: number;
  totalSoldStock: number;
  totalBalanceStock: number;
  averageProfitMargin: number;
  totalRevenue: number;
}

export interface ForecastData {
  date: string;
  predictedStock: number;
  confidence: number;
}