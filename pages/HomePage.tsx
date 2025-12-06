import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LessonCard from '../components/LessonCard';
import { SLOGAN, APP_NAME_AR } from '../constants';
import { lessonsAPI } from '../services/api';
import { Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import { normalizeArabic } from '../utils/textUtils';

interface HomePageProps {
  searchTerm?: string;
}

const HomePage: React.FC<HomePageProps> = ({ searchTerm = '' }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (user && token) {
      fetch('http://localhost:8000/api/progress/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const completed = new Set(data.filter((p: any) => p.is_completed).map((p: any) => p.lesson));
          setCompletedLessons(completed);
        }
      })
      .catch(err => console.error('Error fetching progress:', err));
    } else {
      setCompletedLessons(new Set());
    }
  }, [user, token]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        const fetchedLessons = await lessonsAPI.getAll();
        // Ensure stable sort by lesson number
        const sortedLessons = fetchedLessons.sort((a, b) => a.number - b.number);
        setLessons(sortedLessons);
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

  const filteredLessons = useMemo(() => {
    const normalizedSearch = normalizeArabic(searchTerm.toLowerCase());
    return lessons.filter(lesson => {
      const normalizedTitle = normalizeArabic(lesson.title.toLowerCase());
      const normalizedDesc = lesson.description ? normalizeArabic(lesson.description.toLowerCase()) : '';
      
      return normalizedTitle.includes(normalizedSearch) || normalizedDesc.includes(normalizedSearch);
    });
  }, [lessons, searchTerm]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-bg-card-dark border-b border-brand-grey-light dark:border-gray-800 transition-colors duration-300 overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               rotate: [0, 90, 0],
             }}
             transition={{ 
               duration: 20,
               repeat: Infinity,
               ease: "linear" 
             }}
             className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-blue blur-3xl"
           />
           <motion.div 
             animate={{ 
               scale: [1, 1.5, 1],
               x: [0, 50, 0],
             }}
             transition={{ 
               duration: 15,
               repeat: Infinity,
               ease: "easeInOut" 
             }}
             className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-purple-500 blur-3xl"
           />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", stiffness: 260, damping: 20 }}
             className="inline-flex items-center justify-center p-4 bg-brand-blue-light dark:bg-sky-900/30 rounded-full mb-6"
           >
              <img 
                src="/favico.png" 
                alt="HindPesh Logo" 
                className="w-16 h-16 object-contain"
              />
           </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-brand-grey-dark dark:text-white mb-4"
          >
            {APP_NAME_AR}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-brand-grey dark:text-gray-400 font-medium max-w-2xl mx-auto"
          >
            {SLOGAN}
          </motion.p>
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
            {isLoading ? 'جاري التحميل...' : error ? 'خطأ' : `${filteredLessons.length} دروس متاحة`}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-lg mb-6">
            <div className="font-bold mb-2">خطأ</div>
            <div>{error}</div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-12 text-brand-grey dark:text-gray-400">
            {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد دروس متاحة حالياً'}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredLessons.map((lesson) => (
                <motion.div 
                  layout
                  key={lesson.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <LessonCard 
                    lesson={lesson} 
                    isCompleted={completedLessons.has(Number(lesson.id))}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default HomePage;