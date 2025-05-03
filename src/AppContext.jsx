import React, { createContext, useState, useEffect } from 'react';

// Translation dictionaries
const translations = {
  en: {
    welcome: 'Welcome',
    logout: 'Logout',
    overview: 'Overview',
    netWorth: 'Net Worth',
    summary: 'Summary',
    totalAssets: 'Total Assets',
    totalDebts: 'Total Debts',
    notifications: 'Notifications',
    familyMembers: 'Family Members',
    viewAllAssets: 'View All Assets',
    viewAllDebts: 'View All Debts',
    viewNotifications: 'View Notifications',
    assetsDebts: 'Assets & Debts',
    recentAssets: 'Recent Assets',
    recentDebts: 'Recent Debts',
    addAsset: 'Add Asset',
    addDebt: 'Add Debt',
    documentVault: 'Document Vault',
    viewAllDocuments: 'View All Documents',
    manageFamily: 'Manage Family',
    assets: 'Assets',
    debts: 'Debts',
    documents: 'Documents',
    familySharing: 'Family Sharing',
    name: 'Name',
    category: 'Category',
    value: 'Value',
    amount: 'Amount',
    uploadDocument: 'Upload Document',
    addFamilyMember: 'Add Family Member',
    email: 'Email',
    role: 'Role',
    edit: 'Edit',
    delete: 'Delete',
    searchByEmail: 'Search by email...',
    allRoles: 'All Roles',
    viewer: 'Viewer',
    editor: 'Editor',
    saveChanges: 'Save Changes',
    login: 'Login',
    password: 'Password',
    asset: 'Asset',
    debt: 'Debt',
    date: 'Date',
    message: 'Message',
    view: 'View',
    language: 'Language',
    currency: 'Currency',
    onlyPDF: 'Only PDF files are allowed',
    uploadFile: 'Upload a file',
    orDragDrop: 'or drag and drop',
    pdfOnly: 'PDF only',
    selectAsset: 'Select an asset',
    noDocuments: 'No documents uploaded',
    pdfPreview: 'Previewing PDF:',
    pdfPlaceholder: 'PDF content for',
    confirmDelete: 'Are you sure you want to delete this?',
    searchByName: 'Search by name...',
    allCategories: 'All Categories',
    realEstate: 'Real Estate',
    stocks: 'Stocks',
    cash: 'Cash',
    other: 'Other',
    mortgage: 'Mortgage',
    carLoan: 'Car Loan',
    creditCard: 'Credit Card',
    uploadManageDocs: 'Upload and manage your important documents',
    stayUpdated: 'Stay updated with recent activities',
    manageFamilyAccess: 'Manage access for family members',
    for: 'for',
    invalidEmail: 'Please enter a valid email address',
    invalidPassword: 'Please enter a password',
    noNotifications: 'No notifications available',
    personalInfo: 'Personal Info',
  },
  fr: {
    welcome: 'Bienvenue',
    logout: 'Déconnexion',
    overview: 'Aperçu',
    netWorth: 'Valeur Nette',
    summary: 'Résumé',
    totalAssets: 'Actifs Totaux',
    totalDebts: 'Dettes Totales',
    notifications: 'Notifications',
    familyMembers: 'Membres de la Famille',
    viewAllAssets: 'Voir Tous les Actifs',
    viewAllDebts: 'Voir Toutes les Dettes',
    viewNotifications: 'Voir les Notifications',
    assetsDebts: 'Actifs & Dettes',
    recentAssets: 'Actifs Récents',
    recentDebts: 'Dettes Récentes',
    addAsset: 'Ajouter un Actif',
    addDebt: 'Ajouter une Dette',
    documentVault: 'Coffre-fort de Documents',
    viewAllDocuments: 'Voir Tous les Documents',
    manageFamily: 'Gérer la Famille',
    assets: 'Actifs',
    debts: 'Dettes',
    documents: 'Documents',
    familySharing: 'Partage Familial',
    name: 'Nom',
    category: 'Catégorie',
    value: 'Valeur',
    amount: 'Montant',
    uploadDocument: 'Télécharger un Document',
    addFamilyMember: 'Ajouter un Membre de la Famille',
    email: 'Email',
    role: 'Rôle',
    edit: 'Modifier',
    delete: 'Supprimer',
    searchByEmail: 'Rechercher par email...',
    allRoles: 'Tous les Rôles',
    viewer: 'Spectateur',
    editor: 'Éditeur',
    saveChanges: 'Enregistrer les Modifications',
    login: 'Connexion',
    password: 'Mot de passe',
    asset: 'Actif',
    debt: 'Dette',
    date: 'Date',
    message: 'Message',
    view: 'Voir',
    language: 'Langue',
    currency: 'Devise',
    onlyPDF: 'Seuls les fichiers PDF sont autorisés',
    uploadFile: 'Télécharger un fichier',
    orDragDrop: 'ou glisser-déposer',
    pdfOnly: 'PDF uniquement',
    selectAsset: 'Sélectionner un actif',
    noDocuments: 'Aucun document téléchargé',
    pdfPreview: 'Aperçu du PDF :',
    pdfPlaceholder: 'Contenu PDF pour',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci ?',
    searchByName: 'Rechercher par nom...',
    allCategories: 'Toutes les Catégories',
    realEstate: 'Immobilier',
    stocks: 'Actions',
    cash: 'Liquidités',
    other: 'Autre',
    mortgage: 'Hypothèque',
    carLoan: 'Prêt Auto',
    creditCard: 'Carte de Crédit',
    uploadManageDocs: 'Téléchargez et gérez vos documents importants',
    stayUpdated: 'Restez informé des activités récentes',
    manageFamilyAccess: 'Gérez l’accès pour les membres de la famille',
    for: 'pour',
    invalidEmail: 'Veuillez entrer une adresse email valide',
    invalidPassword: 'Veuillez entrer un mot de passe',
    noNotifications: 'Aucune notification disponible',
    personalInfo: 'Informations Personnelles',
  },
};

// Conversion rates (USD base)
const conversionRates = {
  USD: { USD: 1, EUR: 0.85, KES: 110 },
  EUR: { USD: 1.176, EUR: 1, KES: 129.41 },
  KES: { USD: 0.00909, EUR: 0.00773, KES: 1 },
};

// Currency symbols
const currencySymbols = {
  USD: '$',
  EUR: '€',
  KES: 'KSh',
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize from localStorage or default values
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage && ['en', 'fr'].includes(savedLanguage) ? savedLanguage : 'en';
  });
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('currency');
    return savedCurrency && ['USD', 'EUR', 'KES'].includes(savedCurrency) ? savedCurrency : 'USD';
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const t = (key) => translations[language][key] || key;

  const convertCurrency = (amount, fromCurrency = 'USD') => {
    if (typeof amount !== 'number') return 0;
    const rate = conversionRates[fromCurrency][currency];
    return Number((amount * rate).toFixed(2));
  };

  const formatCurrency = (amount, fromCurrency = 'USD') => {
    const converted = convertCurrency(amount, fromCurrency);
    return `${currencySymbols[currency]}${converted.toLocaleString()}`;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatCurrency }}>
      {children}
    </AppContext.Provider>
  );
};