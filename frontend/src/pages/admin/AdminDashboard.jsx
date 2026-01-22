import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [products, users] = await Promise.all([
        adminService.getAllProducts(),
        adminService.getAllUsers(),
      ]);
      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Products Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.totalProducts}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[28px]">inventory_2</span>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.totalUsers}</p>
            </div>
            <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-[28px]">group</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a
              href="/admin/products"
              className="block px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              Manage Products
            </a>
            <a
              href="/admin/users"
              className="block px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
            >
              Manage Users
            </a>
            <a
              href="/admin/orders"
              className="block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
            >
              Manage Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
