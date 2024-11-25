import React from 'react';
import { LineChart, ShoppingBag, TrendingUp, PieChart } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: LineChart,
      title: 'Real-time Analytics',
      description: 'Get instant insights into your sales performance with our real-time analytics dashboard.',
    },
    {
      icon: ShoppingBag,
      title: 'Inventory Management',
      description: 'Track your stock levels and get automated alerts when inventory runs low.',
    },
    {
      icon: TrendingUp,
      title: 'Sales Forecasting',
      description: 'Make data-driven decisions with our advanced sales forecasting tools.',
    },
    {
      icon: PieChart,
      title: 'Visual Reports',
      description: 'Generate beautiful, easy-to-understand visual reports with just a few clicks.',
    },
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to grow your business
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Powerful tools to help you manage your shop more efficiently and make better business decisions.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}