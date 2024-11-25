import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { SalesData } from '../lib/types';
import Layout from '../components/Layout';
import { Save, Trash2, Plus } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function SalesManagement() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [filterData, setFilterData] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<SalesData>>({
    saleDate: new Date().toISOString().split('T')[0],
    productName: '',
    productId: '',
    price: 0,
    stockSold: 0,
    profitMargin: 0,
    stockBalance: 0
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
      setSalesData(sales.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()));
    } catch (error) {
      toast.error('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'sales'), {
        ...formData,
        userId: auth.currentUser.uid,
        timestamp: new Date().toISOString()
      });
      toast.success('Sales data added successfully!');
      setShowForm(false);
      setFormData({
        saleDate: new Date().toISOString().split('T')[0],
        productName: '',
        productId: '',
        price: 0,
        stockSold: 0,
        profitMargin: 0,
        stockBalance: 0
      });
      fetchSalesData();
    } catch (error) {
      toast.error('Failed to add sales data');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await deleteDoc(doc(db, 'sales', id));
      toast.success('Record deleted successfully');
      fetchSalesData();
    } catch (error) {
      toast.error('Failed to delete record');
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

  const handleFilter = (value: any) => {
    if (value) {
      const filtered = salesData.filter((sale) => 
        sale.productName.toLowerCase() === value.toLowerCase()
      );
      setFilterData(filtered.length ? filtered : []);
    } else {
      setFilterData(null);
    }
  };
  

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Sales Management</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Sale</>}
          </button>
        </div>
        <input className='px-2  py-1 min:w-[180px] h-[50px] rounded-md' onChange={(e) => handleFilter(e.target.value)} placeholder='filter by product'></input>
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sale Date</label>
                  <input
                    type="date"
                    required
                    value={formData.saleDate}
                    onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product ID</label>
                  <input
                    type="text"
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.stockSold}
                    onChange={(e) => setFormData({ ...formData, stockSold: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.profitMargin}
                    onChange={(e) => setFormData({ ...formData, profitMargin: parseFloat(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Balance</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stockBalance}
                    onChange={(e) => setFormData({ ...formData, stockBalance: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Sales Data
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filterData && filterData.length != 0 ? (
                  filterData.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(sale.saleDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{sale.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.stockSold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.profitMargin}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.stockBalance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => sale.id && handleDelete(sale.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                  ) : (
                  salesData.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(sale.saleDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{sale.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.stockSold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.profitMargin}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.stockBalance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => sale.id && handleDelete(sale.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}