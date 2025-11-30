import React, { useState, useEffect } from 'react';
import LessonCard from '../components/LessonCard';
import { SLOGAN, APP_NAME_AR } from '../constants';
import { lessonsAPI } from '../services/api';
import { Lesson } from '../types';

const HomePage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        const fetchedLessons = await lessonsAPI.getAll();
        setLessons(fetchedLessons);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'فشل تحميل الدروس');
        console.error('Error fetching lessons:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, []);

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
            {isLoading ? 'جاري التحميل...' : error ? 'خطأ' : `${lessons.length} دروس متاحة`}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12 text-brand-grey dark:text-gray-400">
            لا توجد دروس متاحة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;