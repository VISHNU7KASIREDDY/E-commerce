import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">SpiceRoute Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {}
        <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="font-medium">Products</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span className="font-medium">Users</span>
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              <span className="font-medium">Orders</span>
            </NavLink>

            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              <span className="font-medium">View Store</span>
            </NavLink>
          </nav>
        </aside>

        {}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
