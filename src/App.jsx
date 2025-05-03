import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AssetsPage from './components/AssetsPage';
import DebtsPage from './components/DebtsPage';
import DocumentsPage from './components/DocumentsPage';
import NotificationsPage from './components/NotificationsPage';
import FamilySharingPage from './components/FamilySharingPage';
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
    <Router>
      <div className="min-h-screen">
        {user ? (
          <Routes>
            <Route
              path="/"
              element={
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
              }
            />
            <Route
              path="/assets"
              element={
                <AssetsPage
                  user={user}
                  assets={assets}
                  onAddAsset={handleAddAsset}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/debts"
              element={
                <DebtsPage
                  user={user}
                  debts={debts}
                  onAddDebt={handleAddDebt}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/documents"
              element={
                <DocumentsPage
                  user={user}
                  assets={assets}
                  onUploadDocument={handleUploadDocument}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/notifications"
              element={
                <NotificationsPage
                  user={user}
                  notifications={notifications}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/family-sharing"
              element={
                <FamilySharingPage
                  user={user}
                  familyMembers={familyMembers}
                  onAddFamilyMember={handleAddFamilyMember}
                  onLogout={handleLogout}
                />
              }
            />
          </Routes>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;