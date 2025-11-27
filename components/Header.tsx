import React, { useState } from 'react';
import { Menu, X, BookOpen, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_NAME_AR, APP_NAME_EN } from '../constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-bg-card-dark shadow-sm sticky top-0 z-50 transition-colors duration-300 border-b border-brand-grey-light dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center overflow-hidden">
               <img 
                 src="/logo.png" 
                 alt="HindPesh Logo" 
                 className="w-full h-full object-contain"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextElementSibling?.classList.remove('hidden');
                 }}
               />
               <div className="hidden w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  className="w-8 h-8 text-brand-blue"
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 22c4.97 0 9-4.03 9-9 0-4.97-9-13-9-13S3 8.03 3 13c0 4.97 4.03 9 9 9z" />
                  <path d="M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  <path d="M12 22v-9" />
                </svg>
               </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-brand-blue dark:text-sky-400 leading-none">{APP_NAME_AR}</span>
              <span className="text-xs text-brand-grey dark:text-gray-400 font-bold tracking-widest uppercase mt-1">{APP_NAME_EN}</span>
            </div>
          </Link>

          {/* Actions & Navigation */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-sm font-bold transition-colors text-brand-blue dark:text-sky-400"
              >
                <BookOpen size={18} />
                <span>الدروس</span>
              </Link>
            </nav>

            <div className="h-6 w-px bg-brand-grey-light dark:bg-gray-700 hidden md:block"></div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-brand-grey dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-blue dark:hover:text-sky-400 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-brand-grey dark:text-gray-400 hover:text-brand-blue focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-bg-card-dark border-t border-brand-grey-light dark:border-gray-700 py-2">
          <div className="px-4 space-y-2">
             <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-4 rounded-md text-base font-medium bg-brand-blue-light dark:bg-sky-900/30 text-brand-blue dark:text-sky-400"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={20} />
                الدروس
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;