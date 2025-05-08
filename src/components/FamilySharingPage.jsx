import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import Modal from './Modal';
import Header from './Header';
import { AppContext } from '../AppContext';

const FamilySharingPage = ({ user, familyMembers, onAddFamilyMember, onEditFamilyMember, onDeleteFamilyMember, onLogout }) => {
  const { t } = useContext(AppContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', role: 'Viewer' });
  const [editForm, setEditForm] = useState({ id: null, name: '', email: '', role: 'Viewer' });
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const handleDownloadDeclaration = () => {
    alert(t('downloadDeclarationPlaceholder'));
    // Placeholder: To be implemented with LaTeX PDF generation
  };

  // Log familyMembers for debugging
  console.log('familyMembers:', familyMembers);

  const filteredMembers = familyMembers.filter(
    member => {
      // Check if member is defined and has email property
      if (!member || typeof member.email !== 'string') {
        return false;
      }
      return (
        member.email.toLowerCase().includes(search.toLowerCase()) &&
        (!filterRole || member.role === filterRole)
      );
    }
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddFamilyMember({ ...addForm, id: Date.now() });
    setAddForm({ name: '', email: '', role: 'Viewer' });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEditFamilyMember(editForm);
    setEditForm({ id: null, name: '', email: '', role: 'Viewer' });
    setIsEditModalOpen(false);
  };

  const handleEditClick = (member) => {
    setEditForm({ id: member.id, name: member.name, email: member.email, role: member.role });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to remove this family member?')) {
      onDeleteFamilyMember(id);
    }
  };

  const text = t('familySharing');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Family Sharing" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
      <Header onText={text} onLogout={onLogout} onHandleDownloadDeclaration={handleDownloadDeclaration} />
        <div className="animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64 border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full sm:w-48 border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">All Roles</option>
                  <option>Viewer</option>
                  <option>Editor</option>
                </select>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
              >
                Add Family Member
              </button>
            </div>
            <div className="space-y-4">
              {filteredMembers.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-gray-900 font-medium">{member.role}</p>
                  </div>
                  <div className="flex-1 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(member)}
                      className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(member.id)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Add Family Member Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Family Member">
        <form onSubmit={handleAddSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={addForm.email}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={addForm.role}
              onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option>Viewer</option>
              <option>Editor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            Add Family Member
          </button>
        </form>
      </Modal>
      {/* Edit Family Member Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Family Member">
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option>Viewer</option>
              <option>Editor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FamilySharingPage;