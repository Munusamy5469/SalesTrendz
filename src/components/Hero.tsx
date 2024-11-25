import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, PieChart, Database, ArrowRight } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white pt-16 pb-32 overflow-hidden">
      <div className="relative">
        <div className="lg:mx-auto lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24 lg:px-8">
          <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
            <div>
              <div className="mt-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Empowering Shop Owners</span>
                  <span className="block text-indigo-600">with Data-Driven Insights</span>
                </h1>
                <p className="mt-6 text-xl text-gray-500">
                  Transform your business decisions with powerful analytics. Track sales, monitor inventory, and visualize trends - all in one place.
                </p>
                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={() => navigate('/signup')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate('/features')}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="grid grid-cols-3 gap-8">
                {[
                  { icon: TrendingUp, title: 'Sales Analytics', desc: 'Track performance in real-time' },
                  { icon: PieChart, title: 'Visual Reports', desc: 'Beautiful, intuitive charts' },
                  { icon: Database, title: 'Data Storage', desc: 'Secure cloud backup' },
                ].map((feature, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg font-medium text-gray-900">{feature.title}</p>
                    <p className="mt-2 ml-16 text-base text-gray-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
              <img
                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2426&q=80"
                alt="Analytics Dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}