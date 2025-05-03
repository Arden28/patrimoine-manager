import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { AppContext } from '../AppContext';
import Header from './Header';

const AssetsPage = ({ user, assets, onAddAsset, onEditAsset, onDeleteAsset, onLogout }) => {
  const { t, formatCurrency } = useContext(AppContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', category: 'Real Estate', value: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', category: 'Real Estate', value: '' });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredAssets = assets.filter(
    asset =>
      asset.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterCategory || asset.category === filterCategory)
  );

  const totalValue = filteredAssets.reduce((sum, asset) => sum + (asset.value || 0), 0);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddAsset({ ...addForm, value: parseFloat(addForm.value), id: Date.now() });
    setAddForm({ name: '', category: 'Real Estate', value: '' });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEditAsset({ ...editForm, value: parseFloat(editForm.value) });
    setEditForm({ id: null, name: '', category: 'Real Estate', value: '' });
    setIsEditModalOpen(false);
  };

  const handleEditClick = (asset) => {
    setEditForm({ id: asset.id, name: asset.name, category: asset.category, value: asset.value });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteAsset(id);
    }
  };

  const handleDownloadDeclaration = () => {
    alert(t('downloadDeclarationPlaceholder'));
    // Placeholder: To be implemented with LaTeX PDF generation
  };

  const userName = user && typeof user.email === 'string' ? user.email.split('@')[0] : 'User';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Assets" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
        {/* Header */}
      <Header onUserName={userName} onLogout={onLogout} onHandleDownloadDeclaration={handleDownloadDeclaration} />
        {/* <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('assets')} {t('for')} {userName}</h1>
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 hover:bg-gray-50"
            >
              <option value="en">🇺🇳 English</option>
              <option value="fr">🇫🇷 Français</option>
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 hover:bg-gray-50"
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="KES">KES KSh</option>
            </select>
            <button
              onClick={handleDownloadDeclaration}
              className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
              title={t('downloadDeclaration')}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </header> */}
        <div className="animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder={t('searchByName')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64 border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full sm:w-48 border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">{t('allCategories')}</option>
                  <option>{t('realEstate')}</option>
                  <option>{t('stocks')}</option>
                  <option>{t('cash')}</option>
                  <option>{t('other')}</option>
                </select>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 font-medium"
              >
                {t('addAsset')}
              </button>
            </div>
            <div className="space-y-4">
              {filteredAssets.length > 0 ? (
                filteredAssets.map(asset => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1 shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{asset.name}</p>
                      <p className="text-sm text-gray-600">{asset.category}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-gray-900 font-medium">{formatCurrency(asset.value)}</p>
                    </div>
                    <div className="flex-1 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(asset)}
                        className="text-teal-500 hover:text-teal-600 font-medium"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(asset.id)}
                        className="text-red-500 hover:text-red-600 font-medium"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">{t('noAssets')}</p>
              )}
              {filteredAssets.length > 0 && (
                <div className="text-gray-900 font-medium text-right mt-4">
                  {t('total')}: {formatCurrency(totalValue)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('addAsset')}>
        <form onSubmit={handleAddSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('category')}</label>
            <select
              value={addForm.category}
              onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option>{t('realEstate')}</option>
              <option>{t('stocks')}</option>
              <option>{t('cash')}</option>
              <option>{t('other')}</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('value')}</label>
            <input
              type="number"
              value={addForm.value}
              onChange={(e) => setAddForm({ ...addForm, value: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200"
          >
            {t('addAsset')}
          </button>
        </form>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('editAsset')}>
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('category')}</label>
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option>{t('realEstate')}</option>
              <option>{t('stocks')}</option>
              <option>{t('cash')}</option>
              <option>{t('other')}</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('value')}</label>
            <input
              type="number"
              value={editForm.value}
              onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200"
          >
            {t('saveChanges')}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AssetsPage;