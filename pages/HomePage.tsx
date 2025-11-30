import React from 'react';
import LessonCard from '../components/LessonCard';
import { MOCK_LESSONS, SLOGAN, APP_NAME_AR } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white dark:bg-bg-card-dark border-b border-brand-grey-light dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
           <div className="inline-flex items-center justify-center p-4 bg-brand-blue-light dark:bg-sky-900/30 rounded-full mb-6">
              <img 
                src="/favico.png" 
                alt="HindPesh Logo" 
                className="w-16 h-16 object-contain"
              />
           </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-grey-dark dark:text-white mb-4">
            {APP_NAME_AR}
          </h1>
          <p className="text-xl md:text-2xl text-brand-grey dark:text-gray-400 font-medium max-w-2xl mx-auto">
            {SLOGAN}
          </p>
        </div>
      </section>

      {/* Lessons List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="w-2 h-8 bg-brand-blue dark:bg-sky-500 rounded-full inline-block"></span>
            فهرس المحتويات
          </h2>
          <span className="text-brand-grey dark:text-gray-500 text-sm font-semibold">
            {MOCK_LESSONS.length} دروس متاحة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LESSONS.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;