import React, { createContext, useState, useEffect } from 'react';
import { translations } from './data/translation';
import { conversionRates, currencySymbols } from './data/currencyRates';


  export const AppContext = createContext();

  export const AppProvider = ({ children }) => {
    // Initialize from localStorage or default values
    const [language, setLanguage] = useState(() => {
      const savedLanguage = localStorage.getItem('language');
      return savedLanguage && ['en', 'fr'].includes(savedLanguage) ? savedLanguage : 'fr';
    });
    const [currency, setCurrency] = useState(() => {
      const savedCurrency = localStorage.getItem('currency');
      return savedCurrency && ['USD', 'EUR', 'KES'].includes(savedCurrency) ? savedCurrency : 'EUR';
    });

    // Save to localStorage on change
    useEffect(() => {
      localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
      localStorage.setItem('currency', currency);
    }, [currency]);

    const t = (key) => translations[language][key] || key;

    const convertCurrency = (amount, fromCurrency) => {
      if (typeof amount !== 'number' || !fromCurrency || !conversionRates[fromCurrency]) return 0;
      const rate = conversionRates[fromCurrency][currency];
      return Number((amount * rate).toFixed(2));
    };

    const formatCurrency = (amount, fromCurrency) => {
      const converted = convertCurrency(amount, fromCurrency);
      return `${currencySymbols[currency]}${converted.toLocaleString()}`;
    };


  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatCurrency }}>
      {children}
    </AppContext.Provider>
  );
};