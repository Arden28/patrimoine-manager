import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { AppContext } from '../AppContext';

const NotificationsPage = ({ user, notifications, onDeleteNotification, onLogout }) => {
  const { t, setLanguage, setCurrency } = useContext(AppContext);

  const handleDeleteClick = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteNotification(id);
    }
  };

  const userName = user && typeof user.email === 'string' ? user.email.split('@')[0] : 'User';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Notifications" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('notifications')} {t('for')} {userName}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                className="border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">{t('language')}: English</option>
                <option value="fr">{t('language')}: Français</option>
              </select>
            </div>
            <div className="relative">
              <select
                className="border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">{t('currency')}: USD</option>
                <option value="EUR">{t('currency')}: EUR</option>
                <option value="KES">{t('currency')}: KES</option>
              </select>
            </div>
            <button onClick={onLogout} className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </header>
        <div className="animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('notifications')}</h2>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{notification.message}</p>
                      <p className="text-sm text-gray-600">{notification.date}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(notification.id)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      {t('delete')}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">{t('noNotifications')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;