import { BarChart3, Upload, List, TrendingUp, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function MenuBar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/profile', icon: UserCircle, label: 'Profile' },
    { path: '/sales', icon: Upload, label: 'Sales Management' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/forecast', icon: TrendingUp, label: 'Forecast' },
  ];

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-4 border-b-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}