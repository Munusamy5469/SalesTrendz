import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Package, Calendar, DollarSign, BarChart } from 'lucide-react';
import Layout from '../components/Layout';

interface SalesData {
  saleDate: string;
  productName: string;
  productId: string;
  price: number;
  stockSold: number;
  profitMargin: number;
  stockBalance: number;
  timestamp: string;
}

export default function ProfileDetails() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          const data = doc.data();
          // Ensure all required fields are present
          if (
            data.saleDate &&
            data.productName &&
            data.productId &&
            typeof data.price === 'number' &&
            typeof data.stockSold === 'number' &&
            typeof data.profitMargin === 'number' &&
            typeof data.stockBalance === 'number' &&
            data.timestamp
          ) {
            sales.push(data as SalesData);
          }
        });
        setSalesData(sales.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } catch (error) {
        console.error('Error fetching sales data:', error);
        toast.error('Failed to fetch sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (salesData.length === 0) {
    return (
      <Layout>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
          <p className="text-gray-500">No sales data available. Please upload sales details first.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 md:px-8">
          <h2 className="text-2xl font-bold text-white">Sales History</h2>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesData.map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.saleDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.productId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(sale.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.stockSold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.profitMargin}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.stockBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}