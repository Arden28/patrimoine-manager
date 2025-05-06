import React, { useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { AppContext } from '../AppContext';

const PersonalInfoPage = ({ user, onUpdateUser, onLogout }) => {
  const { t, language, formatCurrency } = useContext(AppContext);

  // Mock user data (replace with real data from props/context/API)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    dateOfBirth: user?.dateOfBirth || '1980-01-01',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1-555-123-4567',
    street: user?.street || '123 Main St',
    city: user?.city || 'Springfield',
    state: user?.state || 'IL',
    zip: user?.zip || '62701',
    country: user?.country || 'USA',
    annualIncome: user?.annualIncome || 100000,
    netWorth: user?.netWorth || 500000,
    taxId: user?.taxId || '123-45-6789'
  });

  const [editForm, setEditForm] = useState(formData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEditClick = () => {
    setEditForm(formData);
    setIsEditModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!editForm.firstName.trim()) {
      setError(t('requiredField')?.[language] || 'First Name is required');
      return false;
    }
    if (!editForm.lastName.trim()) {
      setError(t('requiredField')?.[language] || 'Last Name is required');
      return false;
    }
    if (!editForm.email.trim() || !editForm.email.includes('@')) {
      setError(t('invalidEmail')?.[language] || 'Invalid Email');
      return false;
    }
    return true;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const updatedData = {
      ...editForm,
      annualIncome: parseFloat(editForm.annualIncome) || 0,
      netWorth: parseFloat(editForm.netWorth) || 0
    };
    console.log('Updating personal info:', updatedData);
    setFormData(updatedData);
    onUpdateUser(updatedData);
    setSuccess(t('saveSuccess')?.[language] || 'Personal information saved successfully');
    setIsEditModalOpen(false);
  };

  const handleDownloadDeclaration = () => {
    console.log('Download declaration clicked');
    alert(t('downloadDeclarationPlaceholder')?.[language] || 'Downloading declaration...');
  };

  const userName = user && typeof user.email === 'string' ? user.email.split('@')[0] : 'User';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Personal Info" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
        <Header
          onText={t('personalInformation')?.[language] || 'Personal Information'}
          onUserName={userName}
          onLogout={onLogout}
          onHandleDownloadDeclaration={handleDownloadDeclaration}
        />
        <div className="animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('personalInformation')?.[language] || 'Personal Information'}
              </h2>
              <button
                onClick={handleEditClick}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 font-medium"
              >
                {t('edit')?.[language] || 'Edit'}
              </button>
            </div>
            {success && (
              <div className="text-green-500 text-sm text-center mb-4">
                {success}
              </div>
            )}
            {/* Personal Details */}
            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('personalDetails')?.[language] || 'Personal Details'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('firstName')?.[language] || 'First Name'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.firstName}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('lastName')?.[language] || 'Last Name'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.lastName}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('dateOfBirth')?.[language] || 'Date of Birth'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Information */}
            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('contactInformation')?.[language] || 'Contact Information'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('email')?.[language] || 'Email'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                      />
                    </svg>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('phone')?.[language] || 'Phone Number'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                      />
                    </svg>
                    <input
                      type="tel"
                      value={formData.phone}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('street')?.[language] || 'Street Address'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.street}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('city')?.[language] || 'City'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.city}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('state')?.[language] || 'State'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.state}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zip')?.[language] || 'ZIP Code'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.zip}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('country')?.[language] || 'Country'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.country}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('financialInformation')?.[language] || 'Financial Information'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('annualIncome')?.[language] || 'Annual Income'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formatCurrency(formData.annualIncome)}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('netWorth')?.[language] || 'Net Worth'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formatCurrency(formData.netWorth)}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('taxId')?.[language] || 'Tax ID Number'}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 14l-2-2m0 0l2-2m-2 2h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.taxId}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t('edit')?.[language] || 'Edit Personal Information'}
      >
        <form onSubmit={handleEditSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('personalDetails')?.[language] || 'Personal Details'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('firstName')?.[language] || 'First Name'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('lastName')?.[language] || 'Last Name'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('dateOfBirth')?.[language] || 'Date of Birth'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editForm.dateOfBirth}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('contactInformation')?.[language] || 'Contact Information'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('email')?.[language] || 'Email'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('phone')?.[language] || 'Phone Number'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('street')?.[language] || 'Street Address'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="street"
                    value={editForm.street}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('city')?.[language] || 'City'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('state')?.[language] || 'State'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="state"
                    value={editForm.state}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('zip')?.[language] || 'ZIP Code'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="zip"
                    value={editForm.zip}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('country')?.[language] || 'Country'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="country"
                    value={editForm.country}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('financialInformation')?.[language] || 'Financial Information'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('annualIncome')?.[language] || 'Annual Income'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                    />
                  </svg>
                  <input
                    type="number"
                    name="annualIncome"
                    value={editForm.annualIncome}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('netWorth')?.[language] || 'Net Worth'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                    />
                  </svg>
                  <input
                    type="number"
                    name="netWorth"
                    value={editForm.netWorth}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('taxId')?.[language] || 'Tax ID Number'}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 14l-2-2m0 0l2-2m-2 2h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="taxId"
                    value={editForm.taxId}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200"
            >
              {t('save')?.[language] || 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              {t('cancel')?.[language] || 'Cancel'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PersonalInfoPage;