import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  const services = [
    {
      id: 'transport',
      title: 'Transport & Delivery',
      description: 'Book rides, carpooling, and delivery services',
      icon: '🚗',
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'video_consultation',
      title: 'Video Consultations',
      description: 'Connect with medical professionals and consultants',
      icon: '📹',
      color: 'bg-green-500',
      available: false
    },
    {
      id: 'home_services',
      title: 'Home Services',
      description: 'Find trusted professionals for maintenance and cleaning',
      icon: '🏠',
      color: 'bg-purple-500',
      available: false
    },
    {
      id: 'real_estate',
      title: 'Real Estate & Vehicles',
      description: 'Browse and list properties and vehicles',
      icon: '🏢',
      color: 'bg-orange-500',
      available: false
    },
    {
      id: 'ticketing',
      title: 'Ticketing',
      description: 'Book transport and event tickets',
      icon: '🎫',
      color: 'bg-pink-500',
      available: false
    },
    {
      id: 'wallet',
      title: 'Electronic Wallet',
      description: 'Manage payments and money transfers',
      icon: '💳',
      color: 'bg-indigo-500',
      available: false
    },
    {
      id: 'wifi',
      title: 'WiFi Zones',
      description: 'Access internet connection points',
      icon: '📡',
      color: 'bg-teal-500',
      available: false
    },
    {
      id: 'sports',
      title: 'Sports Predictions',
      description: 'Participate in sports predictions',
      icon: '⚽',
      color: 'bg-yellow-500',
      available: false
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'ride',
      title: 'Ride to City Center',
      date: '2025-01-20',
      status: 'completed',
      amount: '$25.50'
    },
    {
      id: 2,
      type: 'delivery',
      title: 'Food Delivery',
      date: '2025-01-19',
      status: 'completed',
      amount: '$15.75'
    },
    {
      id: 3,
      type: 'consultation',
      title: 'Medical Consultation',
      date: '2025-01-18',
      status: 'completed',
      amount: '$50.00'
    }
  ];

  const handleServiceClick = (service) => {
    if (service.available) {
      // Navigate to service page when implemented
      console.log(`Navigate to ${service.id} service`);
    } else {
      alert('This service will be available soon!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          What service can we help you with today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">$342.75</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6 ${
                !service.available ? 'opacity-60' : ''
              }`}
            >
              <div className={`inline-flex p-3 rounded-lg ${service.color} text-white text-2xl mb-4`}>
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {service.description}
              </p>
              {service.available ? (
                <span className="inline-flex items-center text-sm text-green-600">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-4">
                    {activity.amount}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;