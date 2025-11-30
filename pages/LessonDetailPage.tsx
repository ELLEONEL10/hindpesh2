import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Download, FileText, Info } from 'lucide-react';
import { lessonsAPI } from '../services/api';
import { Lesson } from '../types';
import AudioPlayer from '../components/AudioPlayer';

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    const fetchLesson = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const fetchedLesson = await lessonsAPI.getById(id);
        setLesson(fetchedLesson);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'فشل تحميل الدرس');
        console.error('Error fetching lesson:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center dark:text-white">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">الدرس غير موجود</h2>
        <p className="text-brand-grey dark:text-gray-400 mb-6">
          {error || 'عذراً، لم نتمكن من العثور على الدرس الذي تبحث عنه.'}
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-hover transition-colors font-bold"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-brand-grey dark:text-gray-400 hover:text-brand-blue dark:hover:text-sky-400 transition-colors font-medium"
        >
          <ArrowRight size={20} className="ml-2" />
          العودة إلى قائمة الدروس
        </Link>
      </div>

      <div className="bg-white dark:bg-bg-card-dark rounded-3xl shadow-sm border border-brand-grey-light dark:border-gray-700 overflow-hidden transition-colors duration-300">
        
        {/* Header Section inside Card */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
           <div className="flex items-center gap-3 mb-2">
              <span className="bg-brand-blue-light dark:bg-sky-900/40 text-brand-blue dark:text-sky-400 px-3 py-1 rounded-full text-sm font-bold border border-brand-blue/20 dark:border-sky-500/20">
                الدرس {lesson.number}
              </span>
           </div>
           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">
             {lesson.title}
           </h1>
           <p className="text-lg text-brand-grey dark:text-gray-300 leading-relaxed max-w-3xl">
             {lesson.description}
           </p>
        </div>

        {/* Video Player Section */}
        <div className="bg-black aspect-video w-full relative group">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1&showinfo=0&autoplay=0`}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Resources Section */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Audio Player Block */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
              المقطع الصوتي
            </h3>
            <div className="bg-brand-blue-light/30 dark:bg-gray-800/50 p-4 rounded-2xl border border-transparent dark:border-gray-700">
               {/* 
                 In a real scenario, the src would be: `/api/stream-audio/${lesson.audioFileId}/`
               */}
              <AudioPlayer 
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
                title={`تسجيل صوتي: ${lesson.title}`} 
              />
              <div className="mt-2 text-xs text-brand-grey dark:text-gray-500 flex items-center gap-1">
                <Info size={14} />
                <span>يتم بث الصوت بشكل آمن عبر خوادمنا الخاصة</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Downloads Block */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
              المواد الدراسية
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#" 
                className="flex items-center justify-between p-4 border border-brand-grey-light dark:border-gray-600 rounded-xl hover:border-brand-blue dark:hover:border-sky-500 hover:bg-brand-blue-light/20 dark:hover:bg-gray-700 transition-all group w-full sm:w-auto sm:min-w-[300px]"
                onClick={(e) => { e.preventDefault(); alert("Mock Download Triggered for: " + lesson.pdfFileId); }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-2 rounded-lg">
                    <FileText size={24} />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-blue dark:group-hover:text-sky-400">ورقة_عمل_القواعد.pdf</div>
                    <div className="text-xs text-brand-grey dark:text-gray-400">مستند PDF • 2.4 ميجابايت</div>
                  </div>
                </div>
                <Download size={20} className="text-brand-grey dark:text-gray-500 group-hover:text-brand-blue dark:group-hover:text-sky-400" />
              </a>

               <a 
                href="#" 
                className="flex items-center justify-between p-4 border border-brand-grey-light dark:border-gray-600 rounded-xl hover:border-brand-blue dark:hover:border-sky-500 hover:bg-brand-blue-light/20 dark:hover:bg-gray-700 transition-all group w-full sm:w-auto sm:min-w-[300px]"
                onClick={(e) => { e.preventDefault(); alert("Mock Download Triggered"); }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 dark:bg-sky-900/20 text-brand-blue dark:text-sky-400 p-2 rounded-lg">
                    <FileText size={24} />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-blue dark:group-hover:text-sky-400">قائمة_المفردات.docx</div>
                    <div className="text-xs text-brand-grey dark:text-gray-400">مستند وورد • 1.5 ميجابايت</div>
                  </div>
                </div>
                <Download size={20} className="text-brand-grey dark:text-gray-500 group-hover:text-brand-blue dark:group-hover:text-sky-400" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;