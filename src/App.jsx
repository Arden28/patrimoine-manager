import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { fakeAssets, fakeDebts, fakeNotifications, fakeFamilyMembers } from './fakeData';

const App = () => {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState(fakeAssets);
  const [debts, setDebts] = useState(fakeDebts);
  const [notifications, setNotifications] = useState(fakeNotifications);
  const [familyMembers, setFamilyMembers] = useState(fakeFamilyMembers);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddAsset = (newAsset) => {
    setAssets([...assets, newAsset]);
    setNotifications([...notifications, {
      id: Date.now(),
      message: `New asset "${newAsset.name}" added`,
      date: new Date().toISOString().split('T')[0],
    }]);
  };

  const handleAddDebt = (newDebt) => {
    setDebts([...debts, newDebt]);
    setNotifications([...notifications, {
      id: Date.now(),
      message: `New debt "${newDebt.name}" added`,
      date: new Date().toISOString().split('T')[0],
    }]);
  };

  const handleUploadDocument = (assetId, fileName) => {
    if (!fileName) return;
    setAssets(assets.map(asset =>
      asset.id === assetId
        ? { ...asset, documents: [...asset.documents, fileName] }
        : asset
    ));
    setNotifications([...notifications, {
      id: Date.now(),
      message: `Document "${fileName}" uploaded for asset`,
      date: new Date().toISOString().split('T')[0],
    }]);
  };

  const handleAddFamilyMember = (newMember) => {
    setFamilyMembers([...familyMembers, newMember]);
    setNotifications([...notifications, {
      id: Date.now(),
      message: `Family member "${newMember.name}" added as ${newMember.role}`,
      date: new Date().toISOString().split('T')[0],
    }]);
  };

  return (
    <div className="min-h-screen">
      {user ? (
        <Dashboard
          user={user}
          assets={assets}
          debts={debts}
          notifications={notifications}
          familyMembers={familyMembers}
          onAddAsset={handleAddAsset}
          onAddDebt={handleAddDebt}
          onUploadDocument={handleUploadDocument}
          onAddFamilyMember={handleAddFamilyMember}
          onLogout={handleLogout}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;