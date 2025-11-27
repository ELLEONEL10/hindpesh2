import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, FileText, Music, ChevronLeft } from 'lucide-react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  return (
    <Link 
      to={`/lesson/${lesson.id}`}
      className="group bg-bg-surface dark:bg-bg-card-dark rounded-2xl border border-darker-white dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-brand-blue/30 dark:hover:border-sky-500/30 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Lesson Number Badge */}
        <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-brand-blue-light dark:bg-sky-900/40 flex items-center justify-center text-brand-blue dark:text-sky-400 font-bold text-lg border border-brand-blue/20 dark:border-sky-500/20 group-hover:bg-brand-blue group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-white transition-colors">
          {lesson.number}
        </div>

        <div className="mt-2 mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors line-clamp-1">
            {lesson.title}
          </h3>
          <p className="text-brand-grey dark:text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Icons for Content Types */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-secondary-gray dark:border-gray-700">
          <div className="flex gap-3 text-brand-grey dark:text-gray-500">
            <div className="flex items-center gap-1 text-xs" title="فيديو">
              <PlayCircle size={16} className="text-brand-blue dark:text-sky-500" />
              <span>فيديو</span>
            </div>
            <div className="flex items-center gap-1 text-xs" title="صوت">
              <Music size={16} className="text-brand-blue dark:text-sky-500" />
              <span>صوت</span>
            </div>
            <div className="flex items-center gap-1 text-xs" title="PDF">
              <FileText size={16} className="text-brand-blue dark:text-sky-500" />
              <span>ملف</span>
            </div>
          </div>
          <div className="mr-auto text-brand-blue dark:text-sky-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
            <ChevronLeft size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LessonCard;