import React, { useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { AppContext } from '../AppContext';
import { handleGenerateDeclaration } from '../components/PdfDeclarationGenerator';

const PersonalInfoPage = ({ user, onUpdateUser, onAddBankAccount, onAddChild, onAddNextOfKin, onLogout, onUpdateChild, onUpdateNextOfKin }) => {
  const { t, language, formatCurrency } = useContext(AppContext);

  // Mock user data (replace with real data from props/context/API)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    dateOfBirth: user?.dateOfBirth || '1980-01-01',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1-555-123-4567',
    street: user?.street || '123 Main St',
    city: user?.city || 'Springfield',
    state: user?.state || 'IL',
    zip: user?.zip || '62701',
    country: user?.country || 'USA',
    annualIncome: user?.annualIncome || 100000,
    netWorth: user?.netWorth || 500000,
    taxId: user?.taxId || '123-45-6789',
    bankAccounts: user?.bankAccounts || [
        {
          accountName: "Compte 1",
          bankName: 'Banque Lumière',
          accountType: 'Compte courant',
          accountNumber: 'FR76 1234 5678 9123 4567 8901 234',
          approxBalance: "5 320.75",
        },
    ],
    maritalStatus: user?.maritalStatus || 'Married',
    spouse: user?.spouse || {
      birthName: 'Jane Smith',
      usedName: 'Jane Doe',
      firstNames: 'Jane Elizabeth',
      dateOfBirth: '1982-03-15',
      placeOfBirth: 'Chicago, IL',
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'USA',
      phone: '+1-555-987-6543',
      email: 'jane.doe@example.com',
      status: 'Married'
    },
    children: user?.children || [
      {
        id: 1,
        birthName: 'Emily Doe',
        usedName: '',
        firstNames: 'Emily Grace',
        dateOfBirth: '2010-06-20',
        placeOfBirth: 'Springfield, IL',
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
        country: 'USA',
        phone: '',
        email: ''
      }
    ],
    nextOfKin: user?.nextOfKin || [
      {
        id: 1,
        birthName: 'Mary Johnson',
        usedName: '',
        firstNames: 'Mary Anne',
        dateOfBirth: '1955-09-10',
        placeOfBirth: 'Chicago, IL',
        street: '456 Oak St',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        country: 'USA',
        phone: '+1-555-111-2222',
        email: 'mary.johnson@example.com',
        relationship: 'Mother'
      }
    ]
  });

  const [editForm, setEditForm] = useState(formData);
  const [addBankAccountForm, setAddBankAccountForm] = useState({
    accountName: '',
    bankName: '',
    accountType: '',
    accountNumber: '',
    approxBalance: ''
  });
  const [addChildForm, setAddChildForm] = useState({
    birthName: '',
    usedName: '',
    firstNames: '',
    dateOfBirth: '',
    placeOfBirth: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
    email: ''
  });
  const [addNextOfKinForm, setAddNextOfKinForm] = useState({
    birthName: '',
    usedName: '',
    firstNames: '',
    dateOfBirth: '',
    placeOfBirth: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
    email: '',
    relationship: ''
  });
  const [editChildForm, setEditChildForm] = useState(null);
  const [editNextOfKinForm, setEditNextOfKinForm] = useState(null);
  const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false);
  const [isEditNextOfKinModalOpen, setIsEditNextOfKinModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddBankAccountModalOpen, setIsAddBankAccountModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isAddNextOfKinModalOpen, setIsAddNextOfKinModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [bankAccountError, setBankAccountError] = useState('');
  const [childError, setChildError] = useState('');
  const [nextOfKinError, setNextOfKinError] = useState('');
  const [success, setSuccess] = useState('');
  const [bankAccountSuccess, setBankAccountSuccess] = useState('');
  const [childSuccess, setChildSuccess] = useState('');
  const [nextOfKinSuccess, setNextOfKinSuccess] = useState('');

  const handleEditClick = () => {
    setEditForm(formData);
    setIsEditModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('spouse.')) {
      const field = name.split('.')[1];
      setEditForm((prev) => ({
        ...prev,
        spouse: { ...prev.spouse, [field]: value }
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateEditForm = () => {
    if (!editForm.firstName.trim()) {
      setError(t('requiredField')?.[language] || 'First Name is required');
      return false;
    }
    if (!editForm.lastName.trim()) {
      setError(t('requiredField')?.[language] || 'Last Name is required');
      return false;
    }
    if (!editForm.email.trim() || !editForm.email.includes('@')) {
      setError(t('invalidEmail')?.[language] || 'Invalid Email');
      return false;
    }
    if (editForm.maritalStatus === 'Married' || editForm.maritalStatus === 'Partnered') {
      if (!editForm.spouse.birthName.trim()) {
        setError(t('requiredField')?.[language] || 'Spouse Birth Name is required');
        return false;
      }
      if (!editForm.spouse.firstNames.trim()) {
        setError(t('requiredField')?.[language] || 'Spouse First Name(s) is required');
        return false;
      }
      if (editForm.spouse.email && !editForm.spouse.email.includes('@')) {
        setError(t('invalidEmail')?.[language] || 'Invalid Spouse Email');
        return false;
      }
    }
    return true;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEditForm()) return;

    const updatedData = {
      ...editForm,
      annualIncome: parseFloat(editForm.annualIncome) || 0,
      netWorth: parseFloat(editForm.netWorth) || 0
    };
    console.log('Updating personal info:', updatedData);
    setFormData(updatedData);
    onUpdateUser(updatedData);
    setSuccess(t('saveSuccess')?.[language] || 'Personal information saved successfully');
    setIsEditModalOpen(false);
  };

  

  const handleAddChildChange = (e) => {
    const { name, value } = e.target;
    setAddChildForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateChildForm = () => {
    if (!addChildForm.birthName.trim()) {
      setChildError(t('requiredField')?.[language] || 'Birth Name is required');
      return false;
    }
    if (!addChildForm.firstNames.trim()) {
      setChildError(t('requiredField')?.[language] || 'First Name(s) is required');
      return false;
    }
    if (addChildForm.email && !addChildForm.email.includes('@')) {
      setChildError(t('invalidEmail')?.[language] || 'Invalid Email');
      return false;
    }
    return true;
  };

  
  const handleAddBankAccountChange = (e) => {
    const { name, value } = e.target;
    setAddBankAccountForm((prev) => ({ ...prev, [name]: value }));
  };


  const validateBankAccountForm = () => {
    if (!addBankAccountForm.bankName.trim()) {
      setBankAccountError(t('requiredField'));
      return false;
    }
    if (!addBankAccountForm.accountNumber.trim()) {
      setBankAccountError(t('requiredField'));
      return false;
    }
    return true;
  };
  const handleAddBankAccountSubmit = (e) => {
    e.preventDefault();
    setBankAccountError('');
    setBankAccountSuccess('');

    if (!validateBankAccountForm()) return;

    const newBankAccount = { ...addBankAccountForm, id: Date.now() };
    console.log('Adding bank account:', newBankAccount);
    onAddBankAccount(newBankAccount);
    setFormData((prev) => ({ ...prev, bankAccounts: [...prev.bankAccounts, newBankAccount] }));
    setAddBankAccountForm({
        accountName: '',
        bankName: '',
        accountType: '',
        accountNumber: '',
        approxBalance: ''
    });
    setBankAccountSuccess(t('BankAccountSaveSuccess'));
    setIsAddBankAccountModalOpen(false);
  };

  const handleAddChildSubmit = (e) => {
    e.preventDefault();
    setChildError('');
    setChildSuccess('');

    if (!validateChildForm()) return;

    const newChild = { ...addChildForm, id: Date.now() };
    console.log('Adding child:', newChild);
    onAddChild(newChild);
    setFormData((prev) => ({ ...prev, children: [...prev.children, newChild] }));
    setAddChildForm({
      birthName: '',
      usedName: '',
      firstNames: '',
      dateOfBirth: '',
      placeOfBirth: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      email: ''
    });
    setChildSuccess(t('childSaveSuccess')?.[language] || 'Child added successfully');
    setIsAddChildModalOpen(false);
  };

  const handleAddNextOfKinChange = (e) => {
    const { name, value } = e.target;
    setAddNextOfKinForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateNextOfKinForm = () => {
    if (!addNextOfKinForm.birthName.trim()) {
      setNextOfKinError(t('requiredField')?.[language] || 'Birth Name is required');
      return false;
    }
    if (!addNextOfKinForm.firstNames.trim()) {
      setNextOfKinError(t('requiredField')?.[language] || 'First Name(s) is required');
      return false;
    }
    if (addNextOfKinForm.email && !addNextOfKinForm.email.includes('@')) {
      setNextOfKinError(t('invalidEmail')?.[language] || 'Invalid Email');
      return false;
    }
    return true;
  };

  const handleAddNextOfKinSubmit = (e) => {
    e.preventDefault();
    setNextOfKinError('');
    setNextOfKinSuccess('');

    if (!validateNextOfKinForm()) return;

    const newNextOfKin = { ...addNextOfKinForm, id: Date.now() };
    console.log('Adding next of kin:', newNextOfKin);
    onAddNextOfKin(newNextOfKin);
    setFormData((prev) => ({ ...prev, nextOfKin: [...prev.nextOfKin, newNextOfKin] }));
    setAddNextOfKinForm({
      birthName: '',
      usedName: '',
      firstNames: '',
      dateOfBirth: '',
      placeOfBirth: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      email: '',
      relationship: ''
    });
    setNextOfKinSuccess(t('nextOfKinSaveSuccess')?.[language] || 'Next of kin added successfully');
    setIsAddNextOfKinModalOpen(false);
  };

  const handleEditChildClick = (child) => {
    setEditChildForm(child);
    setIsEditChildModalOpen(true);
    setChildError('');
    setChildSuccess('');
  };

  const handleEditNextOfKinClick = (kin) => {
    setEditNextOfKinForm(kin);
    setIsEditNextOfKinModalOpen(true);
    setNextOfKinError('');
    setNextOfKinSuccess('');
  };

  const handleEditChildChange = (e) => {
    const { name, value } = e.target;
    setEditChildForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditNextOfKinChange = (e) => {
    const { name, value } = e.target;
    setEditNextOfKinForm((prev) => ({ ...prev, [name]: value }));
  };

//   const validateChildForm = (form) => {
//     if (!form.birthName.trim()) {
//       setChildError(t('requiredField')?.[language] || 'Birth Name is required');
//       return false;
//     }
//     if (!form.firstNames.trim()) {
//       setChildError(t('requiredField')?.[language] || 'First Name(s) is required');
//       return false;
//     }
//     if (form.email && !form.email.includes('@')) {
//       setChildError(t('invalidEmail')?.[language] || 'Invalid Email');
//       return false;
//     }
//     return true;
//   };

//   const validateNextOfKinForm = (form) => {
//     if (!form.birthName.trim()) {
//       setNextOfKinError(t('requiredField')?.[language] || 'Birth Name is required');
//       return false;
//     }
//     if (!form.firstNames.trim()) {
//       setNextOfKinError(t('requiredField')?.[language] || 'First Name(s) is required');
//       return false;
//     }
//     if (form.email && !form.email.includes('@')) {
//       setNextOfKinError(t('invalidEmail')?.[language] || 'Invalid Email');
//       return false;
//     }
//     return true;
//   };

  const handleEditChildSubmit = (e) => {
    e.preventDefault();
    setChildError('');
    setChildSuccess('');

    if (!validateChildForm(editChildForm)) return;

    console.log('Updating child:', editChildForm);
    onUpdateChild(editChildForm);
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.id === editChildForm.id ? editChildForm : child
      )
    }));
    setChildSuccess(t('childSaveSuccess')?.[language] || 'Child updated successfully');
    setIsEditChildModalOpen(false);
  };

  const handleEditNextOfKinSubmit = (e) => {
    e.preventDefault();
    setNextOfKinError('');
    setNextOfKinSuccess('');

    if (!validateNextOfKinForm(editNextOfKinForm)) return;

    console.log('Updating next of kin:', editNextOfKinForm);
    onUpdateNextOfKin(editNextOfKinForm);
    setFormData((prev) => ({
      ...prev,
      nextOfKin: prev.nextOfKin.map((kin) =>
        kin.id === editNextOfKinForm.id ? editNextOfKinForm : kin
      )
    }));
    setNextOfKinSuccess(t('nextOfKinSaveSuccess')?.[language] || 'Next of kin updated successfully');
    setIsEditNextOfKinModalOpen(false);
  };

  const handleDownloadDeclaration = () => {
    console.log('Download declaration clicked');
    alert(t('downloadDeclarationPlaceholder')?.[language] || 'Downloading declaration...');
  };

  const userName = user && typeof user.email === 'string' ? user.email.split('@')[0] : 'User';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Personal Info" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8">
        <Header
          onText={t('personalInformation')}
          onUserName={userName}
          onLogout={onLogout}
          onHandleDownloadDeclaration={handleDownloadDeclaration}
        />
        <div className="animate-fade-in w-full max-w-4xl mx-auto">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('personalInformation')}
              </h2>
              <button
                onClick={() => handleGenerateDeclaration(formData, t, language, setSuccess, setError)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
                >
                {t('generateDeclaration')}
                </button>
              <button
                onClick={handleEditClick}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
              >
                {t('edit')}
              </button>
            </div>
            {success && (
              <div className="text-green-500 text-sm text-center mb-4">
                {success}
              </div>
            )}
            {/* Personal Details */}
            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('personalDetails')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('firstName')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.firstName}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('lastName')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.lastName}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('dateOfBirth')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Information */}
            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('contactInformation')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('email')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                      />
                    </svg>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('phone')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                      />
                    </svg>
                    <input
                      type="tel"
                      value={formData.phone}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('street')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.street}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('city')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.city}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('state')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.state}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zip')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.zip}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('country')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.country}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Financial Information */}
            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('financialInformation')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('annualIncome')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formatCurrency(formData.annualIncome)}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('netWorth')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formatCurrency(formData.netWorth)}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('taxId')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 14l-2-2m0 0l2-2m-2 2h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={formData.taxId}
                      disabled
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            {/* Bank Accounts */}
            <div className="space-y-4 mt-6">
                <h4 className="text-md font-medium text-gray-800">
                  {t('bankAccounts')}
                </h4>
                {formData.bankAccounts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.bankAccounts.map((account) => (
                      <div
                        key={account.accountNumber}
                        className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 hover:-translate-y-1 transition-all duration-200"
                      >
                        <p className="text-gray-900 font-medium">{account.accountName}</p>
                        <p className="text-sm text-gray-600">{t('bankName')}: {account.bankName}</p>
                        <p className="text-sm text-gray-600">{t('accountType')}: {account.accountType}</p>
                        <p className="text-sm text-gray-600">{t('accountNumber')}: {account.accountNumber}</p>
                        <p className="text-sm text-gray-600">{t('approxBalance')}: {account.approxBalance}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">{t('noBankAccounts')}</p>
                )}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setIsAddBankAccountModalOpen(true)}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
                  >
                    {t('addBankAccount')}
                  </button>
                </div>
            </div>
            </div>
            {/* Family Section */}
            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('family')}
              </h3>
              {/* Family Situation */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">
                  {t('maritalStatus')}
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                      <svg
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                        />
                      </svg>
                      <input
                        type="text"
                        value={formData.maritalStatus}
                        disabled
                        className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Spouse/Partner */}
              {formData.spouse && (
                <div className="space-y-4 mt-6">
                  <h4 className="text-md font-medium text-gray-800">
                    {t('spouse')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('birthName')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.birthName}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('usedName')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 14"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.usedName}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('firstNames')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.firstNames}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('dateOfBirth')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <input
                          type="date"
                          value={formData.spouse.dateOfBirth}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('placeOfBirth')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.placeOfBirth}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('status')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.status}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('street')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.street}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('city')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.city}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('state')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.state}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('zip')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.zip}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('country')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <input
                          type="text"
                          value={formData.spouse.country}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('phone')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                          />
                        </svg>
                        <input
                          type="tel"
                          value={formData.spouse.phone}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('email')}
                      </label>
                      <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                          />
                        </svg>
                        <input
                          type="email"
                          value={formData.spouse.email}
                          disabled
                          className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Children */}
              <div className="space-y-4 mt-6">
                <h4 className="text-md font-medium text-gray-800">
                  {t('children')}
                </h4>
                {formData.children.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.children.map((child) => (
                      <div
                        key={child.id}
                        className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 hover:-translate-y-1 transition-all duration-200"
                      >
                        <p className="text-gray-900 font-medium">{child.firstNames}</p>
                        <p className="text-sm text-gray-600">{t('birthName')}: {child.birthName}</p>
                        {child.dateOfBirth && (
                          <p className="text-sm text-gray-600">{t('dateOfBirth')}: {child.dateOfBirth}</p>
                        )}
                        {child.email && (
                          <p className="text-sm text-gray-600">{t('email')}: {child.email}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">{t('noChildren')}</p>
                )}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setIsAddChildModalOpen(true)}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
                  >
                    {t('addChild')}
                  </button>
                </div>
              </div>
            </div>
            {/* Next of Kin Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('nextOfKin')}
              </h3>
              {formData.nextOfKin.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.nextOfKin.map((kin) => (
                    <div
                      key={kin.id}
                      className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 hover:-translate-y-1 transition-all duration-200"
                    >
                      <p className="text-gray-900 font-medium">{kin.firstNames}</p>
                      <p className="text-sm text-gray-600">{t('birthName')}: {kin.birthName}</p>
                      {kin.relationship && (
                        <p className="text-sm text-gray-600">{t('relationship')}: {kin.relationship}</p>
                      )}
                      {kin.email && (
                        <p className="text-sm text-gray-600">{t('email')}: {kin.email}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">{t('noNextOfKin')}</p>
              )}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setIsAddNextOfKinModalOpen(true)}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
                >
                  {t('addNextOfKin')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t('edit')}
        modalWidth="max-w-6xl"
        padding="p-8"
        maxHeight="max-h-[80vh] overflow-y-auto"
      >
        <form onSubmit={handleEditSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('personalDetails')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('firstName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('lastName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('dateOfBirth')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editForm.dateOfBirth}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('contactInformation')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('phone')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('street')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="street"
                    value={editForm.street}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('city')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('state')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <input
                  type="text"
                  name="state"
                  value={editForm.state}
                  onChange={handleEditChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('zip')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <input
                  type="text"
                  name="zip"
                  value={editForm.zip}
                  onChange={handleEditChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('country')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <input
                  type="text"
                  name="country"
                  value={editForm.country}
                  onChange={handleEditChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('financialInformation')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('annualIncome')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                  />
                </svg>
                <input
                  type="number"
                  name="annualIncome"
                  value={editForm.annualIncome}
                  onChange={handleEditChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('netWorth')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                  />
                </svg>
                <input
                  type="number"
                  name="netWorth"
                  value={editForm.netWorth}
                  onChange={handleEditChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('taxId')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 14l-2-2m0 0l2-2m-2 2h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="text"
                  name="taxId"
                  value={editForm.taxId}
                  onChange={handleEditChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
              
          </div>
        </div>
        {/* Family Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('family')}
          </h3>
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-800">
              {t('maritalStatus')}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                    />
                  </svg>
                  <select
                    name="maritalStatus"
                    value={editForm.maritalStatus}
                    onChange={handleEditChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  >
                    <option value="Single">{t('single')}</option>
                    <option value="Married">{t('married')}</option>
                    <option value="Partnered">{t('partnered')}</option>
                    <option value="Divorced">{t('divorced')}</option>
                    <option value="Widowed">{t('widowed')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {(editForm.maritalStatus === 'Married' || editForm.maritalStatus === 'Partnered') && (
            <div className="space-y-4 mt-6">
              <h4 className="text-md font-medium text-gray-800">
                {t('spouse')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('birthName')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.birthName"
                      value={editForm.spouse.birthName}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('usedName')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.usedName"
                      value={editForm.spouse.usedName}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('firstNames')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.firstNames"
                      value={editForm.spouse.firstNames}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('dateOfBirth')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="date"
                      name="spouse.dateOfBirth"
                      value={editForm.spouse.dateOfBirth}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('placeOfBirth')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.placeOfBirth"
                      value={editForm.spouse.placeOfBirth}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('status')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.status"
                      value={editForm.spouse.status}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('street')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.street"
                      value={editForm.spouse.street}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('city')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.city"
                      value={editForm.spouse.city}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('state')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.state"
                      value={editForm.spouse.state}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zip')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.zip"
                      value={editForm.spouse.zip}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('country')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      name="spouse.country"
                      value={editForm.spouse.country}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('phone')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                      />
                    </svg>
                    <input
                      type="tel"
                      name="spouse.phone"
                      value={editForm.spouse.phone}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('email')}
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                      />
                    </svg>
                    <input
                      type="email"
                      name="spouse.email"
                      value={editForm.spouse.email}
                      onChange={handleEditChange}
                      className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </Modal>
    {/* Add Child Modal */}
    <Modal
        isOpen={isAddBankAccountModalOpen}
        onClose={() => setIsAddBankAccountModalOpen(false)}
        title={t('addBankAccount')?.[language] || 'Add Bank Account'}
        modalWidth="max-w-6xl"
        padding="p-8"
        maxHeight="max-h-[80vh] overflow-y-auto"
    >
        <form onSubmit={handleAddBankAccountSubmit} className="space-y-6">
            {bankAccountError && (
            <div className="text-red-500 text-sm text-center">{bankAccountError}</div>
            )}
            {bankAccountSuccess && (
            <div className="text-green-500 text-sm text-center">{bankAccountSuccess}</div>
            )}
            <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
                {t('bankAccountDetails')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    {t('accountName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6h18M3 10h18M3 14h18M3 18h18"
                    />
                    </svg>
                    <input
                    type="text"
                    name="accountName"
                    value={addBankAccountForm.accountName}
                    onChange={handleAddBankAccountChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    {t('bankName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                    </svg>
                    <input
                    type="text"
                    name="bankName"
                    value={addBankAccountForm.bankName}
                    onChange={handleAddBankAccountChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    {t('accountType')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6h18M3 10h18M3 14h18M3 18h18"
                    />
                    </svg>
                    <input
                    type="text"
                    name="accountType"
                    value={addBankAccountForm.accountType}
                    onChange={handleAddBankAccountChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    {t('accountNumber')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6h18M3 10h18M3 14h18M3 18h18"
                    />
                    </svg>
                    <input
                    type="text"
                    name="accountNumber"
                    value={addBankAccountForm.accountNumber}
                    onChange={handleAddBankAccountChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    {t('approxBalance')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                    <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    </svg>
                    <input
                    type="text"
                    name="approxBalance"
                    value={addBankAccountForm.approxBalance}
                    onChange={handleAddBankAccountChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                    />
                </div>
                </div>
            </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
            <button
                type="button"
                onClick={() => setIsAddBankAccountModalOpen(false)}
                className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
            >
                {t('cancel')}
            </button>
            <button
                type="submit"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
            >
                {t('save')}
            </button>
            </div>
        </form>
    </Modal>

    {/* Add Child Modal */}
    <Modal
      isOpen={isAddChildModalOpen}
      onClose={() => setIsAddChildModalOpen(false)}
      title={t('addChild')?.[language] || 'Add Child'}
      modalWidth="max-w-6xl"
      padding="p-8"
      maxHeight="max-h-[80vh] overflow-y-auto"
    >
      <form onSubmit={handleAddChildSubmit} className="space-y-6">
        {childError && (
          <div className="text-red-500 text-sm text-center">{childError}</div>
        )}
        {childSuccess && (
          <div className="text-green-500 text-sm text-center">{childSuccess}</div>
        )}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('childDetails')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('birthName')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  name="birthName"
                  value={addChildForm.birthName}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('usedName')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  name="usedName"
                  value={addChildForm.usedName}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('firstNames')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  name="firstNames"
                  value={addChildForm.firstNames}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('dateOfBirth')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={addChildForm.dateOfBirth}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('placeOfBirth')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={addChildForm.placeOfBirth}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('street')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <input
                  type="text"
                  name="street"
                  value={addChildForm.street}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('city')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <input
                  type="text"
                  name="city"
                  value={addChildForm.city}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('state')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <input
                  type="text"
                  name="state"
                  value={addChildForm.state}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('zip')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <input
                  type="text"
                  name="zip"
                  value={addChildForm.zip}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('country')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <input
                  type="text"
                  name="country"
                  value={addChildForm.country}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('phone')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                  />
                </svg>
                <input
                  type="tel"
                  name="phone"
                  value={addChildForm.phone}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={addChildForm.email}
                  onChange={handleAddChildChange}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => setIsAddChildModalOpen(false)}
            className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </Modal>
    
      {/* Add Next of Kin Modal */}
      <Modal
        isOpen={isAddNextOfKinModalOpen}
        onClose={() => setIsAddNextOfKinModalOpen(false)}
        title={t('addNextOfKin')}
        modalWidth="max-w-6xl"
        padding="p-8"
        maxHeight="max-h-[80vh] overflow-y-auto"
      >
        <form onSubmit={handleAddNextOfKinSubmit} className="space-y-6">
          {nextOfKinError && (
            <div className="text-red-500 text-sm text-center">{nextOfKinError}</div>
          )}
          {nextOfKinSuccess && (
            <div className="text-green-500 text-sm text-center">{nextOfKinSuccess}</div>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('nextOfKinDetails')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('birthName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="birthName"
                    value={addNextOfKinForm.birthName}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('usedName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="usedName"
                    value={addNextOfKinForm.usedName}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('firstNames')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="firstNames"
                    value={addNextOfKinForm.firstNames}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('dateOfBirth')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={addNextOfKinForm.dateOfBirth}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('placeOfBirth')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={addNextOfKinForm.placeOfBirth}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('relationship')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                    />
                  </svg>
                  <input
                    type="text"
                    name="relationship"
                    value={addNextOfKinForm.relationship}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('street')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="street"
                    value={addNextOfKinForm.street}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('city')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="city"
                    value={addNextOfKinForm.city}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('state')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="state"
                    value={addNextOfKinForm.state}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('zip')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="zip"
                    value={addNextOfKinForm.zip}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('country')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="country"
                    value={addNextOfKinForm.country}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('phone')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    value={addNextOfKinForm.phone}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={addNextOfKinForm.email}
                    onChange={handleAddNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsAddNextOfKinModalOpen(false)}
              className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
      {/* Edit Child Modal */}
      <Modal
        isOpen={isEditChildModalOpen}
        onClose={() => setIsEditChildModalOpen(false)}
        title={t('editChild')}
        modalWidth="max-w-6xl"
        padding="p-8"
        maxHeight="max-h-[80vh] overflow-y-auto"
      >
        <form onSubmit={handleEditChildSubmit} className="space-y-6">
          {childError && (
            <div className="text-red-500 text-sm text-center">{childError}</div>
          )}
          {childSuccess && (
            <div className="text-green-500 text-sm text-center">{childSuccess}</div>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('childDetails')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('birthName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="birthName"
                    value={editChildForm?.birthName || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('usedName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="usedName"
                    value={editChildForm?.usedName || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('firstNames')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="firstNames"
                    value={editChildForm?.firstNames || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('dateOfBirth')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editChildForm?.dateOfBirth || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('placeOfBirth')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={editChildForm?.placeOfBirth || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('street')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="street"
                    value={editChildForm?.street || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('city')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="city"
                    value={editChildForm?.city || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('state')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="state"
                    value={editChildForm?.state || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('zip')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="zip"
                    value={editChildForm?.zip || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('country')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="country"
                    value={editChildForm?.country || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('phone')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    value={editChildForm?.phone || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={editChildForm?.email || ''}
                    onChange={handleEditChildChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditChildModalOpen(false)}
              className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
      {/* Edit Next of Kin Modal */}
      <Modal
        isOpen={isEditNextOfKinModalOpen}
        onClose={() => setIsEditNextOfKinModalOpen(false)}
        title={t('editNextOfKin')}
        modalWidth="max-w-6xl"
        padding="p-8"
        maxHeight="max-h-[80vh] overflow-y-auto"
      >
        <form onSubmit={handleEditNextOfKinSubmit} className="space-y-6">
          {nextOfKinError && (
            <div className="text-red-500 text-sm text-center">{nextOfKinError}</div>
          )}
          {nextOfKinSuccess && (
            <div className="text-green-500 text-sm text-center">{nextOfKinSuccess}</div>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('nextOfKinDetails')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('birthName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="birthName"
                    value={editNextOfKinForm?.birthName || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('usedName')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="usedName"
                    value={editNextOfKinForm?.usedName || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('firstNames')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="firstNames"
                    value={editNextOfKinForm?.firstNames || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('dateOfBirth')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editNextOfKinForm?.dateOfBirth || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('placeOfBirth')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={editNextOfKinForm?.placeOfBirth || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('relationship')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                    />
                  </svg>
                  <input
                    type="text"
                    name="relationship"
                    value={editNextOfKinForm?.relationship || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('street')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="street"
                    value={editNextOfKinForm?.street || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('city')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="city"
                    value={editNextOfKinForm?.city || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('state')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="state"
                    value={editNextOfKinForm?.state || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('zip')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="zip"
                    value={editNextOfKinForm?.zip || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('country')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    name="country"
                    value={editNextOfKinForm?.country || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('phone')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5h18M9 3v2m6-2v2M3 19h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    value={editNextOfKinForm?.phone || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={editNextOfKinForm?.email || ''}
                    onChange={handleEditNextOfKinChange}
                    className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditNextOfKinModalOpen(false)}
              className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PersonalInfoPage;