import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';
import Layout from '../components/Layout';

interface SalesData {
  saleDate: string;
  productName: string;
  productId: string;
  price: number;
  stockSold: number;
  profitMargin: number;
  stockBalance: number;
}

export default function ProfileUpload() {
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesData>({
    saleDate: '',
    productName: '',
    productId: '',
    price: 0,
    stockSold: 0,
    profitMargin: 0,
    stockBalance: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'sales'), {
        ...salesData,
        userId: auth.currentUser.uid,
        timestamp: new Date().toISOString(),
      });
      toast.success('Sales data added successfully!');
      // Reset form
      setSalesData({
        saleDate: '',
        productName: '',
        productId: '',
        price: 0,
        stockSold: 0,
        profitMargin: 0,
        stockBalance: 0,
      });
    } catch (error) {
      toast.error('Failed to add sales data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Sales Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={salesData.saleDate}
                onChange={(e) => setSalesData({ ...salesData, saleDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={salesData.productName}
                onChange={(e) => setSalesData({ ...salesData, productName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product ID</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={salesData.productId}
                onChange={(e) => setSalesData({ ...salesData, productId: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={salesData.price}
                onChange={(e) => setSalesData({ ...salesData, price: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Sold</label>
              <input
                type="number"
                required
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={salesData.stockSold}
                onChange={(e) => setSalesData({ ...salesData, stockSold: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profit Margin (%)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={salesData.profitMargin}
                onChange={(e) => setSalesData({ ...salesData, profitMargin: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Balance</label>
              <input
                type="number"
                required
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={salesData.stockBalance}
                onChange={(e) => setSalesData({ ...salesData, stockBalance: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Sales Data'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}