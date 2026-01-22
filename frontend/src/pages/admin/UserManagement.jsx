import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Don't send password if editing and it's empty
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await adminService.updateUser(editingUser._id, updateData);
        alert('User updated successfully!');
      } else {
        await adminService.createUser(formData);
        alert('User created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't populate password
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminService.deleteUser(id);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer',
    });
    setEditingUser(null);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">User Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="font-medium text-neutral-900 dark:text-white">{user.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-primary hover:text-orange-700">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  minLength={6}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg font-semibold"
                >
                  {editingUser ? 'Update' : 'Create'} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
