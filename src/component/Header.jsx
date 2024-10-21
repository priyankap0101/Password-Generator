import React, { useState } from 'react';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className={`w-full py-4 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container flex items-center justify-between px-4 mx-auto">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-orange-500">🔒</span> My Password Generator
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden space-x-6 md:flex">
          <a href="#home" className={`text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-900 hover:text-orange-500'}`}>
            Home
          </a>
          <a href="#features" className={`text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-900 hover:text-orange-500'}`}>
            Features
          </a>
          <a href="#about" className={`text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-900 hover:text-orange-500'}`}>
            About
          </a>
        </nav>

        {/* Dark Mode Toggle */}
        <div className="flex items-center space-x-4">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleDarkMode}
            className="relative inline-flex items-center w-12 h-6 transition-colors duration-300 bg-gray-400 rounded-full focus:outline-none"
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={`inline-block w-5 h-5 transform rounded-full transition-transform duration-300 ${isDarkMode ? 'translate-x-6 bg-orange-500' : 'translate-x-1 bg-gray-200'}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex justify-center mt-3 space-x-6 md:hidden">
        <a href="#home" className={`text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-900 hover:text-orange-500'}`}>
          Home
        </a>
        <a href="#features" className={`text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-900 hover:text-orange-500'}`}>
          Features
        </a>
        <a href="#about" className={`text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-900 hover:text-orange-500'}`}>
          About
        </a>
      </nav>
    </header>
  );
};

export default Header;
