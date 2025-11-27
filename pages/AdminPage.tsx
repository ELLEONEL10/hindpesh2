import React, { useState } from 'react';
import { Save, QrCode, Plus, Trash2, Link as LinkIcon, Youtube, Music, FileText } from 'lucide-react';

const AdminPage: React.FC = () => {
  // Mock State for the form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and QR generation
    setGeneratedQR(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hindpesh.com/lesson/new-id`);
  };

  return (
    <div className="min-h-screen bg-bg-main dark:bg-bg-dark text-gray-800 dark:text-white p-4 md:p-8 font-sans transition-colors duration-300" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            <p className="text-brand-grey dark:text-gray-400 text-sm mt-1">إدارة الدروس والمحتوى الرقمي</p>
          </div>
          <button className="bg-brand-blue hover:bg-brand-blue-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-md">
            <Plus size={18} />
            <span>درس جديد</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-bg-card-dark rounded-xl p-6 border border-brand-grey-light dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-brand-blue dark:text-sky-400" size={20} />
                بيانات الدرس الأساسية
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-grey-dark dark:text-gray-300 mb-1">عنوان الدرس</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                    placeholder="مثال: مقدمة في الحروف العربية"
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
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all dir-ltr text-left font-mono text-sm"
                            placeholder="File ID"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit"
                        className="bg-brand-blue hover:bg-brand-blue-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-brand-blue/20 transition-all"
                    >
                        <Save size={20} />
                        حفظ وإنشاء QR
                    </button>
                </div>
              </form>
            </div>
            
            {/* Mock List */}
            <div className="bg-white dark:bg-bg-card-dark rounded-xl p-6 border border-brand-grey-light dark:border-gray-700 shadow-sm transition-colors">
                <h3 className="text-lg font-bold mb-4">آخر الدروس المضافة</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-brand-grey-light dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                                    {i}
                                </div>
                                <span className="font-medium text-gray-800 dark:text-gray-200">عنوان درس تجريبي {i}</span>
                            </div>
                            <button className="text-red-400 hover:text-red-500 p-2">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
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
                     <button className="w-full bg-brand-grey hover:bg-brand-grey-dark dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 rounded-lg transition-colors text-sm font-bold border border-transparent">
                        تحميل الصورة (PNG)
                    </button>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;