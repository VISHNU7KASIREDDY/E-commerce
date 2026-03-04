import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        navigate('/');
      } catch (e) {
        console.error('OAuth callback parse error:', e);
        navigate('/login?error=oauth_failed');
      }
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">Completing sign-in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
