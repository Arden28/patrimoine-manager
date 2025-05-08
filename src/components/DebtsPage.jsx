import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import Modal from './Modal';
import Header from './Header';
import { AppContext } from '../AppContext';

const DebtsPage = ({ user, debts, onAddDebt, onEditDebt, onDeleteDebt, onLogout }) => {
  const { t, formatCurrency } = useContext(AppContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', category: 'Mortgage', amount: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', category: 'Mortgage', amount: '' });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredDebts = debts.filter(
    debt =>
      debt.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterCategory || debt.category === filterCategory)
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddDebt({ ...addForm, amount: parseFloat(addForm.amount), id: Date.now() });
    setAddForm({ name: '', category: 'Mortgage', amount: '' });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEditDebt({ ...editForm, amount: parseFloat(editForm.amount) });
    setEditForm({ id: null, name: '', category: 'Mortgage', amount: '' });
    setIsEditModalOpen(false);
  };

  const handleEditClick = (debt) => {
    setEditForm({ id: debt.id, name: debt.name, category: debt.category, amount: debt.amount });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteDebt(id);
    }
  };

  const handleDownloadDeclaration = () => {
    alert(t('downloadDeclarationPlaceholder'));
    // Placeholder: To be implemented with LaTeX PDF generation
  };

  const userName = user && typeof user.email === 'string' ? user.email.split('@')[0] : 'User';
  const text = `${t('debts')}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Debts" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
      <Header onText={text} onLogout={onLogout} onHandleDownloadDeclaration={handleDownloadDeclaration} />
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
                  <option>{t('mortgage')}</option>
                  <option>{t('carLoan')}</option>
                  <option>{t('creditCard')}</option>
                  <option>{t('other')}</option>
                </select>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
              >
                {t('addDebt')}
              </button>
            </div>
            <div className="space-y-4">
              {filteredDebts.map(debt => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{debt.name}</p>
                    <p className="text-sm text-gray-600">{debt.category}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-gray-900 font-medium">{formatCurrency(debt.amount)}</p>
                  </div>
                  <div className="flex-1 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(debt)}
                      className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(debt.id)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('addDebt')}>
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
              <option>{t('mortgage')}</option>
              <option>{t('carLoan')}</option>
              <option>{t('creditCard')}</option>
              <option>{t('other')}</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('amount')}</label>
            <input
              type="number"
              value={addForm.amount}
              onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            {t('addDebt')}
          </button>
        </form>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('editDebt')}>
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
              <option>{t('mortgage')}</option>
              <option>{t('carLoan')}</option>
              <option>{t('creditCard')}</option>
              <option>{t('other')}</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('amount')}</label>
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            {t('saveChanges')}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default DebtsPage;