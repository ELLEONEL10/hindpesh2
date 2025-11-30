import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LessonDetailPage from './pages/LessonDetailPage';

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen transition-colors duration-300">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lesson/:id" element={<LessonDetailPage />} />
          </Routes>
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-white dark:bg-bg-card-dark border-t border-brand-grey-light dark:border-gray-700 py-8 mt-auto transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-brand-grey dark:text-gray-400 text-sm font-medium">
              &copy; {new Date().getFullYear()} HindPesh Education. جميع الحقوق محفوظة.
            </p>
            <div className="mt-4 text-xs text-brand-grey/70 dark:text-gray-500 flex flex-col items-center gap-2">
              <span>صمم لدعم المحتوى التعليمي المطبوع</span>
              <span className="w-10 h-px bg-gray-200 dark:bg-gray-700 my-1"></span>
              <span className="flex items-center gap-1 font-semibold" dir="ltr">
                Developed by | <span className="text-brand-blue dark:text-sky-400">Fadi Abbara</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
