import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { SalesData, ForecastData } from '../lib/types';
import Layout from '../components/Layout';
import { formatDate } from '../utils/dateUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Calculator, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Forecast() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [minMonth, setMinMonth] = useState('');

  useEffect(() => {
    // Set the minimum month to the current month (in YYYY-MM format)
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setMinMonth(currentMonth);

    fetchSalesData();
  }, []);

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

  const generateForecast = () => {
    if (!selectedMonth) {
      toast.error('Please select a month and year');
      return;
    }

    const [year, month] = selectedMonth.split('-').map(Number);
    const selectedMonthIndex = month - 1; // Adjusting month to zero-based index

    const historicalData = salesData
      .filter(sale => new Date(sale.saleDate).getMonth() === selectedMonthIndex)
      .map(sale => ({
        date: new Date(sale.saleDate),
        product: sale.productName,
        quantitySold: sale.stockSold,
      }));

    if (historicalData.length < 1) {
      toast.error('Insufficient data for forecasting. At least 1 years of data is required.');
      return;
    }

    const productSales = {} as Record<string, number[]>;
    historicalData.forEach((entry) => {
      if (!productSales[entry.product]) {
        productSales[entry.product] = [];
      }
      productSales[entry.product].push(entry.quantitySold);
    });

    const forecast: ForecastData[] = [];
    Object.keys(productSales).forEach((productName) => {
      const productQuantities = productSales[productName];
      const avgSales = productQuantities.reduce((acc, curr) => acc + curr, 0) / productQuantities.length;
      forecast.push({
        product: productName,
        predictedStock: Math.round(avgSales),
        confidence: 95,
      });
    });

    setForecastData(forecast);
    toast.success('Forecast generated successfully');
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Forecast Report', 10, 10);
    autoTable(doc, {
      head: [['Product', 'Predicted Stock', 'Confidence']],
      body: forecastData.map(({ product, predictedStock, confidence }) => [
        product,
        predictedStock,
        `${confidence}%`,
      ]),
    });
    doc.save('forecast-report.pdf');
  };

  const exportAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(forecastData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Forecast');
    XLSX.writeFile(workbook, 'forecast-report.xlsx');
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
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Forecast</h2>

          <div className="flex items-end space-x-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month and Year for Forecast
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                min={minMonth} // Restrict to future months
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={generateForecast}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Generate Forecast
            </button>
          </div>

          {forecastData.length > 0 && (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Forecast Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {forecastData.map((forecast, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">{forecast.product}</p>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {forecast.predictedStock} units
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Confidence: {forecast.confidence}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="predictedStock" stroke="#0088FE" name="Predicted Stock" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="predictedStock" fill="#82ca9d" name="Predicted Stock" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={exportAsPDF}
                  className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                >
                  Export as PDF
                </button>
                <button
                  onClick={exportAsExcel}
                  className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                >
                  Export as Excel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
