import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { AppContext } from '../AppContext';

const Dashboard = ({
  user,
  assets,
  debts,
  notifications,
  familyMembers,
  onAddAsset,
  onAddDebt,
  onUploadDocument,
  onAddFamilyMember,
  onLogout,
}) => {
  const { t, language, setLanguage, currency, setCurrency, formatCurrency } = useContext(AppContext);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [assetForm, setAssetForm] = useState({ name: '', category: 'Real Estate', value: '' });
  const [debtForm, setDebtForm] = useState({ name: '', category: 'Mortgage', amount: '' });
  const [documentForm, setDocumentForm] = useState({ assetId: '', file: null });
  const [familyForm, setFamilyForm] = useState({ name: '', email: '', role: 'Viewer' });

  useEffect(() => {
    console.log('Dashboard user:', user);
  }, [user]);

  const totalAssets = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  const totalDebts = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0);
  const netWorth = totalAssets - totalDebts;

  const handleAssetSubmit = (e) => {
    e.preventDefault();
    onAddAsset({
      id: Date.now(),
      name: assetForm.name,
      category: assetForm.category,
      value: parseFloat(assetForm.value) || 0,
      documents: [],
    });
    setAssetForm({ name: '', category: 'Real Estate', value: '' });
    setIsAssetModalOpen(false);
  };

  const handleDebtSubmit = (e) => {
    e.preventDefault();
    onAddDebt({
      id: Date.now(),
      name: debtForm.name,
      category: debtForm.category,
      amount: parseFloat(debtForm.amount) || 0,
    });
    setDebtForm({ name: '', category: 'Mortgage', amount: '' });
    setIsDebtModalOpen(false);
  };

  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    if (documentForm.file && documentForm.assetId && documentForm.file.type === 'application/pdf') {
      onUploadDocument(documentForm.assetId, documentForm.file.name);
      setDocumentForm({ assetId: '', file: null });
      setIsDocumentModalOpen(false);
    } else {
      alert(t('onlyPDF'));
    }
  };

  const handleFamilySubmit = (e) => {
    e.preventDefault();
    onAddFamilyMember({
      id: Date.now(),
      name: familyForm.name,
      email: familyForm.email,
      role: familyForm.role,
    });
    setFamilyForm({ name: '', email: '', role: 'Viewer' });
    setIsFamilyModalOpen(false);
  };

  const handleDownloadDeclaration = () => {
    // Placeholder for asset declaration generation (to be implemented)
    alert(t('downloadDeclarationPlaceholder'));
  };

  const userName = user && typeof user.email === 'string' ? user.email.split('@')[0] : 'User';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Dashboard" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('welcome')}, {userName}
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 hover:bg-gray-50"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇺🇳 English</option>
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 hover:bg-gray-50"
            >
              <option value="EUR">EUR €</option>
              <option value="USD">USD $</option>
              <option value="KES">KES KSh</option>
            </select>
            {/* <button
              onClick={handleDownloadDeclaration}
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
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
            </button> */}
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
        </header>
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('netWorth')}</h2>
              <p className="text-3xl font-bold text-primary">{formatCurrency(netWorth)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('totalAssets')}</h2>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalAssets)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('totalDebts')}</h2>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalDebts)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{t('recentAssets')}</h2>
                <button
                  onClick={() => setIsAssetModalOpen(true)}
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  {t('addAsset')}
                </button>
              </div>
              {assets.length > 0 ? (
                <div className="space-y-4">
                  {assets.slice(0, 3).map(asset => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">{asset.name}</p>
                        <p className="text-sm text-gray-600">{t(asset.category.toLowerCase())}</p>
                      </div>
                      <p className="text-gray-900 font-medium">{formatCurrency(asset.value)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">{t('noAssets')}</p>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{t('recentDebts')}</h2>
                <button
                  onClick={() => setIsDebtModalOpen(true)}
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  {t('addDebt')}
                </button>
              </div>
              {debts.length > 0 ? (
                <div className="space-y-4">
                  {debts.slice(0, 3).map(debt => (
                    <div
                      key={debt.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">{debt.name}</p>
                        <p className="text-sm text-gray-600">{t(debt.category.toLowerCase())}</p>
                      </div>
                      <p className="text-gray-900 font-medium">{formatCurrency(debt.amount)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">{t('noDebts')}</p>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{t('notifications')}</h2>
                <a href="/notifications" className="text-primary hover:text-primary-600 font-medium">
                  {t('viewNotifications')}
                </a>
              </div>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.slice(0, 3).map(notification => (
                    <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{notification.message}</p>
                      <p className="text-sm text-gray-600">{notification.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">{t('noNotifications')}</p>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{t('familyMembers')}</h2>
                <button
                  onClick={() => setIsFamilyModalOpen(true)}
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  {t('addFamilyMember')}
                </button>
              </div>
              {familyMembers.length > 0 ? (
                <div className="space-y-4">
                  {familyMembers.slice(0, 3).map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                      <p className="text-gray-600">{t(member.role.toLowerCase())}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">{t('noFamilyMembers')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} title={t('addAsset')}>
        <form onSubmit={handleAssetSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              value={assetForm.name}
              onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('category')}</label>
            <select
              value={assetForm.category}
              onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
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
              value={assetForm.value}
              onChange={(e) => setAssetForm({ ...assetForm, value: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            {t('addAsset')}
          </button>
        </form>
      </Modal>
      <Modal isOpen={isDebtModalOpen} onClose={() => setIsDebtModalOpen(false)} title={t('addDebt')}>
        <form onSubmit={handleDebtSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              value={debtForm.name}
              onChange={(e) => setDebtForm({ ...debtForm, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('category')}</label>
            <select
              value={debtForm.category}
              onChange={(e) => setDebtForm({ ...debtForm, category: e.target.value })}
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
              value={debtForm.amount}
              onChange={(e) => setDebtForm({ ...debtForm, amount: e.target.value })}
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
      <Modal isOpen={isDocumentModalOpen} onClose={() => setIsDocumentModalOpen(false)} title={t('uploadDocument')}>
        <form onSubmit={handleDocumentSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('asset')}</label>
            <select
              value={documentForm.assetId}
              onChange={(e) => setDocumentForm({ ...documentForm, assetId: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">{t('selectAsset')}</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('document')}</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setDocumentForm({ ...documentForm, file: e.target.files[0] })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            {t('uploadDocument')}
          </button>
        </form>
      </Modal>
      <Modal isOpen={isFamilyModalOpen} onClose={() => setIsFamilyModalOpen(false)} title={t('addFamilyMember')}>
        <form onSubmit={handleFamilySubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              value={familyForm.name}
              onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
            <input
              type="email"
              value={familyForm.email}
              onChange={(e) => setFamilyForm({ ...familyForm, email: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('role')}</label>
            <select
              value={familyForm.role}
              onChange={(e) => setFamilyForm({ ...familyForm, role: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option>{t('viewer')}</option>
              <option>{t('editor')}</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            {t('addFamilyMember')}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;