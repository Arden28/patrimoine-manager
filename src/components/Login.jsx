import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';

const Login = ({ onLogin }) => {
  const { t, language } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1511892633604-29b01e8f0b03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      alt: 'Family smiling together'
    },
    {
      src: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      alt: 'Family walking in park'
    },
    {
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      alt: 'Family at beach'
    }
  ];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });

    if (!email.includes('@') || email.trim() === '') {
      setError(t('invalidEmail')?.[language] || 'Invalid Email');
      return;
    }
    if (password.trim() === '') {
      setError(t('invalidPassword')?.[language] || 'Invalid Password');
      return;
    }

    const user = { email };
    console.log('Calling onLogin with user:', user);
    onLogin(email, password);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Placeholder for future routing
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Placeholder for OAuth
  };

  const handleLinkedInLogin = () => {
    console.log('LinkedIn login clicked');
    // Placeholder for OAuth
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left: Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-left mb-4">
            <svg
              className="h-10 w-10 text-teal-600"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" />
              <text x="12" y="16" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">
                A
              </text>
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('login')?.[language] || 'Login'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t('accessYourPersonalFile')?.[language] || 'Access your personal file'}
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
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
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 sm:text-sm"
                  placeholder={t('email')?.[language] || 'Email'}
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white/80 focus-within:ring-2 focus-within:ring-teal-500">
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
                    d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.402 1.376 1 1.723V15a1 1 0 001 1h1a1 1 0 001-1v-2.277c.598-.347 1-.985 1-1.723zm0 0V9a4 4 0 10-8 0v2m0 0h8m-8 0v6a4 4 0 008 0v-6"
                  />
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 appearance-none bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 sm:text-sm"
                  placeholder={t('password')?.[language] || 'Password'}
                  required
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                {t('login')?.[language] || 'Login'}
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white/80 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147.933-2.893 1.827-6.053 1.827-4.8 0-8.867-3.893-8.867-8.72s4.067-8.72 8.867-8.72c2.24 0 3.867.613 5.093 1.827l2.307-2.307C17.867 1.093 15.307 0 12.48 0 5.867 0 0 5.867 0 12.48s5.867 12.48 12.48 12.48c6.133 0 10.867-4.307 10.867-10.92 0-1.227-.24-2.4-.72-3.48h-10.147z"
                    fill="#4285F4"
                  />
                  <path
                    d="M2.88 7.093l2.88 2.12c.72-2.12 2.64-3.733 5.04-4.44-1.226-1.214-2.853-1.827-5.093-1.827-2.24 0-4.24.72-5.76 1.92l2.933 2.227z"
                    fill="#34A853"
                  />
                  <path
                    d="M12.48 5.04c2.24 0 4.24.72 5.76 1.92l-2.307 2.307c-1.226-1.214-2.853-1.827-5.093-1.827-2.4.707-4.32 2.32-5.04 4.44l-2.88-2.12c1.52-3.2 4.56-5.76 9.56-5.76z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M5.76 14.64c-.24.827-.36 1.68-.36 2.56 0 .88.12 1.733.36 2.56l-2.933-2.227c-.24-.827-.36-1.68-.36-2.56s.12-1.733.36-2.56l2.933 2.227z"
                    fill="#EA4335"
                  />
                </svg>
                {t('signInWithGoogle')?.[language] || 'Sign in with Google'}
              </button>
              <button
                onClick={handleLinkedInLogin}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white/80 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                    fill="#0A66C2"
                  />
                </svg>
                {t('signInWithLinkedIn')?.[language] || 'Sign in with LinkedIn'}
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={handleForgotPassword}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200"
              >
                {t('forgotPassword')?.[language] || 'Forgot Password?'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Right: Family Gallery Carousel */}
      <div className="md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-500 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImage ? 'bg-teal-500' : 'bg-gray-200'
                } hover:bg-teal-400 transition-colors duration-200`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;