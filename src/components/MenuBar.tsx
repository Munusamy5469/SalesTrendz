import { BarChart3, Upload, List, TrendingUp, UserCircle, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function MenuBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State to toggle the mobile menu

  const menuItems = [
    { path: '/profile', icon: UserCircle, label: 'Profile' },
    { path: '/sales', icon: Upload, label: 'Sales Management' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/forecast', icon: TrendingUp, label: 'Forecast' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between">
          <h1 className="text-xl font-bold">Menu</h1>
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-gray-50 border-t mt-2 shadow-lg">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-4 border-b text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)} // Close menu after navigation
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
