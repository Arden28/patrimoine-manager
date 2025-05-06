import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PersonalInfoPage from './pages/PersonalInfoPage';
import AssetsPage from './components/AssetsPage';
import DebtsPage from './components/DebtsPage';
import DocumentsPage from './components/DocumentsPage';
import NotificationsPage from './components/NotificationsPage';
import FamilySharingPage from './components/FamilySharingPage';
import { AppProvider } from './AppContext';
import { assets, debts, notifications, familyMembers } from './fakeData';

const App = () => {
  const [user, setUser] = useState(null);
  const [assetsState, setAssetsState] = useState(assets);
  const [debtsState, setDebtsState] = useState(debts);
  const [notificationsState, setNotificationsState] = useState(notifications);
  const [familyMembersState, setFamilyMembersState] = useState(familyMembers);

  const handleLogin = (email, password) => {
    if (typeof email === 'string' && email.includes('@')) {
      setUser({ email });
    } else {
      console.error('Invalid email:', email);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Asset Handlers
  const handleAddAsset = (newAsset) => {
    setAssetsState([...assetsState, newAsset]);
  };

  const handleEditAsset = (updatedAsset) => {
    setAssetsState(
      assetsState.map(asset =>
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
    );
  };

  const handleDeleteAsset = (assetId) => {
    setAssetsState(assetsState.filter(asset => asset.id !== assetId));
  };

  // Debt Handlers
  const handleAddDebt = (newDebt) => {
    setDebtsState([...debtsState, newDebt]);
  };

  const handleEditDebt = (updatedDebt) => {
    setDebtsState(
      debtsState.map(debt =>
        debt.id === updatedDebt.id ? updatedDebt : debt
      )
    );
  };

  const handleDeleteDebt = (debtId) => {
    setDebtsState(debtsState.filter(debt => debt.id !== debtId));
  };

  // Document Handlers
  const handleUploadDocument = (assetId, document) => {
    setAssetsState(
      assetsState.map(asset =>
        asset.id === assetId
          ? { ...asset, documents: [...asset.documents, document] }
          : asset
      )
    );
  };

  const handleDeleteDocument = (assetId, document) => {
    setAssetsState(
      assetsState.map(asset =>
        asset.id === assetId
          ? { ...asset, documents: asset.documents.filter(doc => doc !== document) }
          : asset
      )
    );
  };

  // Notification Handlers
  const handleDeleteNotification = (notificationId) => {
    setNotificationsState(
      notificationsState.filter(notification => notification.id !== notificationId)
    );
  };

  // Family Member Handlers
  const handleAddFamilyMember = (newMember) => {
    setFamilyMembersState([...familyMembersState, newMember]);
  };

  const handleEditFamilyMember = (updatedMember) => {
    setFamilyMembersState(
      familyMembersState.map(member =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  const handleDeleteFamilyMember = (memberId) => {
    setFamilyMembersState(
      familyMembersState.filter(member => member.id !== memberId)
    );
  };

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <Dashboard
                  user={user}
                  assets={assetsState}
                  debts={debtsState}
                  notifications={notificationsState}
                  familyMembers={familyMembersState}
                  onAddAsset={handleAddAsset}
                  onAddDebt={handleAddDebt}
                  onUploadDocument={handleUploadDocument}
                  onAddFamilyMember={handleAddFamilyMember}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/assets"
            element={
              user ? (
                <AssetsPage
                  user={user}
                  assets={assetsState}
                  onAddAsset={handleAddAsset}
                  onEditAsset={handleEditAsset}
                  onDeleteAsset={handleDeleteAsset}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/personal-info"
            element={
              user ? (
                <PersonalInfoPage
                  user={user}
                  assets={assetsState}
                  onAddAsset={handleAddAsset}
                  onEditAsset={handleEditAsset}
                  onDeleteAsset={handleDeleteAsset}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/debts"
            element={
              user ? (
                <DebtsPage
                  user={user}
                  debts={debtsState}
                  onAddDebt={handleAddDebt}
                  onEditDebt={handleEditDebt}
                  onDeleteDebt={handleDeleteDebt}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/documents"
            element={
              user ? (
                <DocumentsPage
                  user={user}
                  assets={assetsState}
                  onUploadDocument={handleUploadDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              user ? (
                <NotificationsPage
                  user={user}
                  notifications={notificationsState}
                  onDeleteNotification={handleDeleteNotification}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/family-sharing"
            element={
              user ? (
                <FamilySharingPage
                  user={user}
                  familyMembers={familyMembersState}
                  onAddFamilyMember={handleAddFamilyMember}
                  onEditFamilyMember={handleEditFamilyMember}
                  onDeleteFamilyMember={handleDeleteFamilyMember}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;