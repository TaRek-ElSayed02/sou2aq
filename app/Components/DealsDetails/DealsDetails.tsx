import React from 'react';

export const DealsDetails = () => {
  const deals = [
    {
      id: 1,
      product: 'Apple Watch',
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=100&h=100&fit=crop',
      location: '6096 Marjolaine Landing',
      date: '12.09.2019 - 12:53 PM',
      piece: 423,
      amount: '$34,295',
      status: 'Delivered'
    },
    {
      id: 2,
      product: 'iPhone 13 Pro',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
      location: '1234 Tech Street',
      date: '15.10.2019 - 10:30 AM',
      piece: 156,
      amount: '$45,800',
      status: 'Pending'
    },
    {
      id: 3,
      product: 'MacBook Pro',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop',
      location: '5678 Innovation Ave',
      date: '20.11.2019 - 3:15 PM',
      piece: 89,
      amount: '$78,500',
      status: 'Delivered'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Deals Details</h2>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date - Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Piece</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={deal.image} alt={deal.product} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-sm font-medium text-gray-900">{deal.product}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{deal.location}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{deal.date}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{deal.piece}</td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-900">{deal.amount}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    deal.status === 'Delivered' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {deal.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {deals.map((deal) => (
          <div key={deal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <img src={deal.image} alt={deal.product} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{deal.product}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  deal.status === 'Delivered' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {deal.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Location</span>
                <span className="text-sm text-gray-900 text-right">{deal.location}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Date - Time</span>
                <span className="text-sm text-gray-900">{deal.date}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Piece</span>
                <span className="text-sm text-gray-900">{deal.piece}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-gray-500 font-medium">Amount</span>
                <span className="text-base font-bold text-gray-900">{deal.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsDetails;