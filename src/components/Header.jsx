import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';

const Header = ({ onLogout, onText, onHandleDownloadDeclaration }) => {
  const { t, language, setLanguage, currency, setCurrency } = useContext(AppContext);


  return (

    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{onText}</h1>
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
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 hover:bg-gray-50"
        >
          <option value="EUR">EUR €</option>
          <option value="USD">USD $</option>
          <option value="KES">KES KSh</option>
        </select>
        {/* <button
          onClick={onHandleDownloadDeclaration}
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
  );
};

export default Header;