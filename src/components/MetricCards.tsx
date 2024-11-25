import { MetricsSummary } from '../lib/types';
import { Package, BarChart2, TrendingUp ,IndianRupee} from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricsSummary;
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      title: 'Total Products',
      value: metrics.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Revenue',
      value: `₹${metrics.totalRevenue.toFixed(2)}`,
      icon: IndianRupee,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Stock Sold',
      value: metrics.totalSoldStock,
      icon: BarChart2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Avg. Profit Margin',
      value: `${metrics.averageProfitMargin.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}