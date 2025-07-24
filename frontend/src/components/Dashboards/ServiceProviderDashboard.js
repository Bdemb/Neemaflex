import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ServiceProviderDashboard = () => {
  const { user } = useAuth();
  const [providerProfile, setProviderProfile] = useState(null);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const serviceCategories = [
    'transport', 'delivery', 'video_consultation', 'home_services', 
    'real_estate', 'vehicles', 'ticketing', 'other'
  ];

  useEffect(() => {
    fetchProviderProfile();
  }, []);

  const fetchProviderProfile = async () => {
    try {
      const response = await axios.get(`${API}/service-providers/me`);
      setProviderProfile(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setShowCreateProfile(true);
      }
      console.error('Failed to fetch provider profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const CreateProfileForm = () => {
    const [formData, setFormData] = useState({
      business_name: '',
      service_categories: [],
      description: '',
      business_license: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleCategoryChange = (category) => {
      const updated = formData.service_categories.includes(category)
        ? formData.service_categories.filter(c => c !== category)
        : [...formData.service_categories, category];
      
      setFormData({
        ...formData,
        service_categories: updated
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const response = await axios.post(`${API}/service-providers`, formData);
        setProviderProfile(response.data);
        setShowCreateProfile(false);
      } catch (error) {
        console.error('Failed to create provider profile:', error);
        alert('Failed to create provider profile. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create Your Service Provider Profile
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.business_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Service Categories
              </label>
              <div className="grid grid-cols-2 gap-3">
                {serviceCategories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.service_categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {category.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your services..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="business_license" className="block text-sm font-medium text-gray-700">
                Business License (Optional)
              </label>
              <input
                type="text"
                id="business_license"
                name="business_license"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.business_license}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || formData.service_categories.length === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (showCreateProfile) {
    return <CreateProfileForm />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {providerProfile?.business_name || user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your services and grow your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">$4,250</p>
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
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {providerProfile?.rating?.toFixed(1) || '0.0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {providerProfile?.total_ratings || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Business Profile</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              providerProfile?.verification_status === 'verified' 
                ? 'bg-green-100 text-green-800' 
                : providerProfile?.verification_status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {providerProfile?.verification_status === 'verified' ? 'Verified' : 
               providerProfile?.verification_status === 'pending' ? 'Pending Verification' : 'Not Verified'}
            </span>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Business Name</h4>
              <p className="mt-1 text-sm text-gray-900">{providerProfile?.business_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Service Categories</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {providerProfile?.service_categories?.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {category.replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-sm text-gray-900">
                {providerProfile?.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Services</h3>
          <p className="text-gray-600 mb-4">Update your service offerings and pricing</p>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
            Coming Soon
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">View Orders</h3>
          <p className="text-gray-600 mb-4">Check new orders and manage existing ones</p>
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
            Coming Soon
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
          <p className="text-gray-600 mb-4">View your performance and earnings</p>
          <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;