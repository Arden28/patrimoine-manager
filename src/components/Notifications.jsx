import React from 'react';

const Notifications = ({ notifications }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Reminders</h2>
      {notifications.map(notif => (
        <div key={notif.id} className="mb-2 p-2 bg-yellow-100 rounded">
          <p>{notif.message}</p>
          <p className="text-sm text-gray-600">{notif.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;