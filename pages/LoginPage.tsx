import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME_AR } from '../constants';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      // Note: In production, use the environment variable for API URL
      const res = await fetch('http://localhost:8000/api/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      
      const data = await res.json();
      if (res.ok) {
        login(data.access, data.user);
        navigate('/');
      } else {
        console.error('Login failed:', data.error);
        alert('فشل تسجيل الدخول: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <img
            className="mx-auto h-24 w-auto object-contain"
            src="/logo.png"
            alt="Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            تسجيل الدخول إلى {APP_NAME_AR}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            سجل دخولك لمتابعة تقدمك في الدروس
          </p>
        </div>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.log('Login Failed');
              alert('فشل تسجيل الدخول باستخدام Google');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
