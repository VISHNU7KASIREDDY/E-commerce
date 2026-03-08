import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Read error from URL param (set by backend on OAuth failure)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'oauth_failed') {
      setError('Google sign-in failed. Please try again.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setDemoLoading(role);
    const creds = role === 'admin'
      ? { email: 'demo_admin@example.com', password: 'demo1234' }
      : { email: 'demo_user@example.com', password: 'demo1234' };

    try {
      await login(creds.email, creds.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed. Please try again.');
    } finally {
      setDemoLoading('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-700">
        <div className="text-center mb-8">
          <div className="size-12 text-primary mx-auto mb-4">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
        </div>

        {/* Google Sign-In — server-side Passport.js redirect flow */}
        <a
          href={`${BACKEND_URL}/api/auth/google`}
          className="flex items-center justify-center gap-3 w-full border border-neutral-300 dark:border-neutral-600 rounded-lg py-2.5 px-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sign in with Google</span>
        </a>

        {/* Demo Login Section */}
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">demo logins</span>
            <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              disabled={!!demoLoading}
              className="flex items-center justify-center gap-2 border-2 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300 rounded-lg py-2.5 px-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              👤 {demoLoading === 'user' ? 'Logging in...' : 'Demo User'}
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={!!demoLoading}
              className="flex items-center justify-center gap-2 border-2 border-violet-400 dark:border-violet-500 text-violet-700 dark:text-violet-300 rounded-lg py-2.5 px-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔧 {demoLoading === 'admin' ? 'Logging in...' : 'Demo Admin'}
            </button>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2">
            Demo accounts cannot delete data
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
