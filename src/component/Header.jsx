import React, { useState, useEffect } from 'react';

// Reusable NavLink Component
const NavLink = ({ href, label, isDarkMode, isActive }) => (
  <a
    href={href}
    className={`text-lg font-medium relative transition-all duration-300 ease-in-out ${
      isDarkMode
        ? 'text-gray-300 hover:text-orange-400'
        : 'text-gray-800 hover:text-orange-500'
    } ${isActive ? 'underline underline-offset-4 decoration-orange-400' : ''}`}
  >
    {label}
  </a>
);

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
    const sections = ['home', 'features', 'about'];
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition <= offsetTop + offsetHeight) {
          setActiveSection(section);
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`h-16 z-50 fixed top-0 left-0 w-full transition-all duration-300 ease-in-out ${
        isDarkMode
          ? `bg-gray-900 ${isScrolled ? 'shadow-lg bg-opacity-90' : 'bg-opacity-100'}`
          : `bg-white ${isScrolled ? 'shadow-lg bg-opacity-90' : 'bg-opacity-100'}`
      }`}
    >
      <div className="container flex items-center justify-between max-w-screen-xl px-6 mx-auto">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <h1
            className={`text-3xl font-extrabold tracking-wide transform transition-all duration-300 ease-in-out ${
              isScrolled ? 'scale-95' : 'scale-100'
            } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            <span className="text-orange-500">🔒</span> PasswordGen
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-10 lg:flex">
          {['Home', 'Features', 'About'].map((item) => (
            <NavLink
              key={item}
              href={`#${item.toLowerCase()}`}
              label={item}
              isDarkMode={isDarkMode}
              isActive={activeSection === item.toLowerCase()}
            />
          ))}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="items-center hidden space-x-4 lg:flex">
          <span
            className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}
          >
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="relative inline-flex items-center transition-colors duration-300 bg-gray-400 rounded-full w-14 h-7 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <span
              className={`absolute w-6 h-6 transform rounded-full transition-transform duration-300 ${
                isDarkMode
                  ? 'translate-x-7 bg-orange-500'
                  : 'translate-x-1 bg-gray-200'
              }`}
            />
            <span className="sr-only">Toggle dark mode</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="text-2xl lg:hidden focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {isMobileMenuOpen ? '✖️' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div
          className={`lg:hidden absolute top-16 left-0 w-full h-screen bg-opacity-95 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } transition-transform duration-300 ease-in-out`}
        >
          <nav className="flex flex-col items-center py-8 space-y-6">
            {['Home', 'Features', 'About'].map((item) => (
              <NavLink
                key={item}
                href={`#${item.toLowerCase()}`}
                label={item}
                isDarkMode={isDarkMode}
                isActive={activeSection === item.toLowerCase()}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
