import React, { useState, useEffect } from 'react';
import { Save, QrCode, Plus, Trash2, Link as LinkIcon, Youtube, Music, FileText, Edit2, X, AlertCircle } from 'lucide-react';
import { lessonsAPI } from '../services/api';
import { Lesson } from '../types';

const AdminPage: React.FC = () => {
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [youtubeId, setYoutubeId] = useState('');
  const [audioFileId, setAudioFileId] = useState('');
  const [pdfFileId, setPdfFileId] = useState('');
  const [duration, setDuration] = useState('00:00');
  const [thumbnail, setThumbnail] = useState('');
  
  // UI State
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch lessons on mount
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const fetchedLessons = await lessonsAPI.getAll();
      setLessons(fetchedLessons);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل الدروس');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setNumber('');
    setYoutubeId('');
    setAudioFileId('');
    setPdfFileId('');
    setDuration('00:00');
    setThumbnail('');
    setEditingLesson(null);
    setGeneratedQR(null);
    setShowForm(false);
    setError(null);
    setSuccess(null);
  };

  const loadLessonForEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setDescription(lesson.description);
    setNumber(lesson.number);
    setYoutubeId(lesson.youtubeId);
    setAudioFileId(lesson.audioFileId);
    setPdfFileId(lesson.pdfFileId);
    setDuration(lesson.duration);
    setThumbnail(lesson.thumbnail || '');
    setGeneratedQR(null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (!title || !description || !number) {
        throw new Error('الرجاء ملء جميع الحقول المطلوبة');
      }

      const lessonData = {
        number: typeof number === 'number' ? number : parseInt(number.toString()),
        title,
        description,
        youtubeId: youtubeId.trim(),
        audioFileId: audioFileId.trim(),
        pdfFileId: pdfFileId.trim(),
        duration: duration.trim() || '00:00',
        thumbnail: thumbnail.trim() || undefined,
      };

      let savedLesson: Lesson;
      if (editingLesson) {
        // Update existing lesson
        savedLesson = await lessonsAPI.update(editingLesson.id.toString(), lessonData);
        setSuccess('تم تحديث الدرس بنجاح');
      } else {
        // Create new lesson
        savedLesson = await lessonsAPI.create(lessonData);
        setSuccess('تم إنشاء الدرس بنجاح');
      }

      // Generate QR code
      const baseUrl = window.location.origin;
      const qrUrl = `${baseUrl}/lesson/${savedLesson.id}`;
      setGeneratedQR(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`);

      // Refresh lessons list
      await fetchLessons();
      
      // Reset form after a delay
      setTimeout(() => {
        if (!editingLesson) {
          resetForm();
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الدرس');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (lessonId: string | number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      return;
    }

    try {
      await lessonsAPI.delete(lessonId.toString());
      setSuccess('تم حذف الدرس بنجاح');
      await fetchLessons();
      if (editingLesson && editingLesson.id === lessonId) {
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حذف الدرس');
    }
  };

  const handleNewLesson = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-bg-main dark:bg-bg-dark text-gray-800 dark:text-white p-4 md:p-8 font-sans transition-colors duration-300" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            <p className="text-brand-grey dark:text-gray-400 text-sm mt-1">إدارة الدروس والمحتوى الرقمي</p>
          </div>
          <button 
            onClick={handleNewLesson}
            className="bg-brand-blue hover:bg-brand-blue-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-md"
          >
            <Plus size={18} />
            <span>درس جديد</span>
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-300 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {showForm && (
              <div className="bg-white dark:bg-bg-card-dark rounded-xl p-6 border border-brand-grey-light dark:border-gray-700 shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="text-brand-blue dark:text-sky-400" size={20} />
                    {editingLesson ? 'تعديل الدرس' : 'بيانات الدرس الأساسية'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-brand-grey hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">رقم الدرس</label>
                      <input 
                        type="number" 
                        value={number}
                        onChange={(e) => setNumber(e.target.value ? parseInt(e.target.value) : '')}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                        placeholder="1"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">مدة الدرس</label>
                      <input 
                        type="text" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all dir-ltr text-left"
                        placeholder="10:00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">عنوان الدرس</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                      placeholder="مثال: مقدمة في الحروف العربية"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">وصف الدرس</label>
                    <textarea 
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                      placeholder="اكتب وصفاً مختصراً لمحتوى الدرس..."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">
                      <div className="flex items-center gap-2">
                        <Youtube size={16} className="text-red-500" />
                        رابط يوتيوب (Video ID)
                      </div>
                    </label>
                    <input 
                      type="text" 
                      value={youtubeId}
                      onChange={(e) => setYoutubeId(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all dir-ltr text-left font-mono text-sm"
                      placeholder="e.g. dQw4w9WgXcQ"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">
                        <div className="flex items-center gap-2">
                          <Music size={16} className="text-brand-blue dark:text-sky-400" />
                          Google Drive Audio ID
                        </div>
                      </label>
                      <input 
                        type="text" 
                        value={audioFileId}
                        onChange={(e) => setAudioFileId(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all dir-ltr text-left font-mono text-sm"
                        placeholder="File ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">
                        <div className="flex items-center gap-2">
                          <LinkIcon size={16} className="text-brand-blue dark:text-sky-400" />
                          Google Drive PDF ID
                        </div>
                      </label>
                      <input 
                        type="text" 
                        value={pdfFileId}
                        onChange={(e) => setPdfFileId(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all dir-ltr text-left font-mono text-sm"
                        placeholder="File ID"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">رابط الصورة المصغرة (اختياري)</label>
                    <input 
                      type="url" 
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all dir-ltr text-left"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-brand-grey-light dark:border-gray-600 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-brand-blue hover:bg-brand-blue-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-brand-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          {editingLesson ? 'تحديث' : 'حفظ وإنشاء QR'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Lessons List */}
            <div className="bg-white dark:bg-bg-card-dark rounded-xl p-6 border border-brand-grey-light dark:border-gray-700 shadow-sm transition-colors">
              <h3 className="text-lg font-bold mb-4">قائمة الدروس ({lessons.length})</h3>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-8 text-brand-grey dark:text-gray-400">
                  لا توجد دروس. ابدأ بإنشاء درس جديد.
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-brand-grey-light dark:border-gray-700 hover:border-brand-blue dark:hover:border-sky-500 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded bg-brand-blue/10 dark:bg-sky-900/30 text-brand-blue dark:text-sky-400 flex items-center justify-center font-bold">
                          {lesson.number}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{lesson.title}</div>
                          <div className="text-xs text-brand-grey dark:text-gray-400">{lesson.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => loadLessonForEdit(lesson)}
                          className="text-brand-blue hover:text-brand-blue-hover dark:text-sky-400 dark:hover:text-sky-300 p-2"
                          title="تعديل"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="text-red-400 hover:text-red-500 p-2"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* QR & Preview Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-bg-card-dark rounded-xl p-6 border border-brand-grey-light dark:border-gray-700 h-full flex flex-col items-center text-center shadow-sm transition-colors">
              <h2 className="text-xl font-bold mb-2">رمز الاستجابة السريع</h2>
              <p className="text-brand-grey dark:text-gray-400 text-sm mb-6">يتم توليد هذا الرمز تلقائياً للطباعة في الكتاب</p>
              
              <div className="w-64 h-64 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-center mb-6 shadow-inner border border-brand-grey-light dark:border-gray-600">
                {generatedQR ? (
                  <img src={generatedQR} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                ) : (
                  <div className="text-gray-300 dark:text-gray-600 flex flex-col items-center">
                    <QrCode size={64} className="mb-2 opacity-50" />
                    <span className="text-sm">سيظهر الرمز هنا بعد الحفظ</span>
                  </div>
                )}
              </div>

              {generatedQR && (
                <a
                  href={generatedQR}
                  download={`lesson-${editingLesson?.id || 'new'}-qr.png`}
                  className="w-full bg-brand-grey hover:bg-brand-grey-dark dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 rounded-lg transition-colors text-sm font-bold border border-transparent"
                >
                  تحميل الصورة (PNG)
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;
