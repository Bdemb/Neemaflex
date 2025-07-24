import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const services = [
    {
      icon: '🚗',
      title: 'Transport & Delivery',
      description: 'Book rides, carpooling, and delivery services with real-time tracking'
    },
    {
      icon: '📹',
      title: 'Video Consultations',
      description: 'Connect with medical professionals and consultants remotely'
    },
    {
      icon: '🏠',
      title: 'Home Services',
      description: 'Find trusted professionals for maintenance, cleaning, and more'
    },
    {
      icon: '🏢',
      title: 'Real Estate & Vehicles',
      description: 'Browse and list properties and vehicles with advanced search'
    },
    {
      icon: '🎫',
      title: 'Ticketing Platform',
      description: 'Book transport and event tickets with QR code generation'
    },
    {
      icon: '💳',
      title: 'Electronic Wallet',
      description: 'Secure digital payments, money transfers, and QR payments'
    },
    {
      icon: '📡',
      title: 'WiFi Zones',
      description: 'Access and manage internet connection points'
    },
    {
      icon: '⚽',
      title: 'Sports Predictions',
      description: 'Participate in sports predictions and competitions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-blue-600">Neemaflex</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your All-in-One
              <span className="block text-yellow-300">Service Platform</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              From transport and delivery to consultations and home services - 
              everything you need in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Services at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a customer looking for services or a provider ready to offer them,
              Neemaflex connects you seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Neemaflex for their daily service needs.
            Create your account today and experience the difference.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-xl font-semibold transition duration-300 inline-block"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Neemaflex</h3>
            <p className="text-gray-400">
              Your trusted multi-service platform for all your needs.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              © 2025 Neemaflex. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;