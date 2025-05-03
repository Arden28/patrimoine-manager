import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AppContext } from '../AppContext';

const NotificationsPage = ({ user, notifications, onDeleteNotification, onLogout }) => {
  const { t, setLanguage, setCurrency } = useContext(AppContext);

  const handleDeleteClick = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteNotification(id);
    }
  };

  const handleDownloadDeclaration = () => {
    alert(t('downloadDeclarationPlaceholder'));
    // Placeholder: To be implemented with LaTeX PDF generation
  };
  
  const userName = user && typeof user.email === 'string' ? user.email.split('@')[0] : 'User';
  const text = t('notifications');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Notifications" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
      <Header onText={text} onLogout={onLogout} onHandleDownloadDeclaration={handleDownloadDeclaration} />
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