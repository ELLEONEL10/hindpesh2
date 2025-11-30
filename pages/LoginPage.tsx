import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { APP_NAME_AR } from '../constants';
import { authAPI } from '../services/api';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call Django backend API for authentication
      // Django automatically handles password hashing and verification
      const response = await authAPI.login(username, password);
      onLogin(response.token);
      navigate('/hind-admin-portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-card-dark rounded-2xl shadow-xl border border-brand-grey-light dark:border-gray-700 w-full max-w-md p-8 transition-colors duration-300">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-blue-light dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue dark:text-sky-400">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تسجيل دخول المشرف</h1>
          <p className="text-brand-grey dark:text-gray-400 text-sm mt-2">
            لوحة تحكم {APP_NAME_AR}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-brand-grey-dark dark:text-gray-300 mb-2">
              اسم المستخدم
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-brand-grey">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-10 pl-3 py-3 bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-grey-dark dark:text-gray-300 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-brand-grey">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-3 py-3 bg-gray-50 dark:bg-gray-900 border border-brand-grey-light dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-brand-blue hover:bg-brand-blue-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-blue/20 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                جاري التحقق...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-xs text-brand-grey dark:text-gray-500">
                هذه المنطقة محمية. يتم تسجيل جميع محاولات الدخول.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;