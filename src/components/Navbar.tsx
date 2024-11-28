import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">SalesTrendz HI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
