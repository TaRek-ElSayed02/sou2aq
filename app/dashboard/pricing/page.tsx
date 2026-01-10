import React from 'react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: '$14.99',
      features: [
        { name: 'Free Setup', included: true },
        { name: 'Bandwidth Limit 10 GB', included: true },
        { name: '20 User Connection', included: true },
        { name: 'Analytics Report', included: false },
        { name: 'Public API Access', included: false },
        { name: 'Plugins Integration', included: false },
        { name: 'Custom Content Management', included: false }
      ],
      buttonStyle: 'outline'
    },
    {
      name: 'Standard',
      price: '$49.99',
      features: [
        { name: 'Free Setup', included: true },
        { name: 'Bandwidth Limit 10 GB', included: true },
        { name: '20 User Connection', included: true },
        { name: 'Analytics Report', included: true },
        { name: 'Public API Access', included: true },
        { name: 'Plugins Integration', included: false },
        { name: 'Custom Content Management', included: false }
      ],
      buttonStyle: 'outline'
    },
    {
      name: 'Premium',
      price: '$89.99',
      features: [
        { name: 'Free Setup', included: true },
        { name: 'Bandwidth Limit 10 GB', included: true },
        { name: '20 User Connection', included: true },
        { name: 'Analytics Report', included: true },
        { name: 'Public API Access', included: true },
        { name: 'Plugins Integration', included: true },
        { name: 'Custom Content Management', included: true }
      ],
      buttonStyle: 'solid'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Pricing</h1>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-8 flex flex-col">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h2>
                <p className="text-sm text-gray-500 mb-4">Monthly Charge</p>
                <p className="text-5xl font-bold text-blue-600">{plan.price}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-8 mb-8 flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className={`text-sm text-center ${feature.included ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
                    >
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-8 flex flex-col items-center gap-4">
                <button 
                  className={`w-full max-w-xs py-3 px-6 rounded-full font-medium transition-colors ${
                    plan.buttonStyle === 'solid' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Get Started
                </button>
                <a href="#" className="text-sm text-gray-900 underline hover:text-blue-600">
                  Start Your 30 Day Free Trial
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}