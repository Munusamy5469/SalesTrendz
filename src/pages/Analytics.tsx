import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { SalesData, MetricsSummary, DateRange } from '../lib/types';
import Layout from '../components/Layout';
import DateRangeFilter from '../components/DateRangeFilter';
import MetricCards from '../components/MetricCards';
import SalesCharts from '../components/SalesCharts';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { Download } from 'lucide-react';

export default function Analytics() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });

  const fetchSalesData = async () => {
    if (!auth.currentUser) return;
    
    try {
      const q = query(
        collection(db, 'sales'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const sales: SalesData[] = [];
      querySnapshot.forEach((doc) => {
        sales.push({ id: doc.id, ...doc.data() } as SalesData);
      });
      setSalesData(sales);
    } catch (error) {
      toast.error('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const filteredSales = salesData.filter(sale => {
    const saleDate = new Date(sale.saleDate);
    return saleDate >= dateRange.startDate && saleDate <= dateRange.endDate;
  });

  const metrics: MetricsSummary = {
    totalProducts: new Set(filteredSales.map(sale => sale.productId)).size,
    totalSoldStock: filteredSales.reduce((sum, sale) => sum + sale.stockSold, 0),
    totalBalanceStock: filteredSales.reduce((sum, sale) => sum + sale.stockBalance, 0),
    averageProfitMargin: filteredSales.reduce((sum, sale) => sum + sale.profitMargin, 0) / (filteredSales.length || 1),
    totalRevenue: filteredSales.reduce((sum, sale) => sum + (sale.price * sale.stockSold), 0)
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    const title = `Sales Report ${format(dateRange.startDate, 'MMM dd, yyyy')} - ${format(dateRange.endDate, 'MMM dd, yyyy')}`;
    if (type === 'pdf') {
      exportToPDF(filteredSales, title);
    } else {
      exportToExcel(filteredSales, title);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </button>
          </div>
        </div>

        <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
        <MetricCards metrics={metrics} />
        <SalesCharts salesData={filteredSales} />
      </div>
    </Layout>
  );
}