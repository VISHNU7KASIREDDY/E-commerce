import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* User Info Card */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-700 mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Name
            </label>
            <p className="text-lg text-neutral-900 dark:text-white">{user?.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Email
            </label>
            <p className="text-lg text-neutral-900 dark:text-white">{user?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Role
            </label>
            <p className="text-lg text-neutral-900 dark:text-white capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* My Orders Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">My Orders</h2>
        
        {loadingOrders ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-neutral-300 dark:text-neutral-600 mb-4">shopping_bag</span>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">No orders yet</p>
            <a href="/shop" className="inline-block mt-4 text-primary hover:underline">Start Shopping</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      Order #{order.orderNumber || order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-neutral-900 dark:text-white font-medium">{item.name}</p>
                        <p className="text-neutral-500 dark:text-neutral-400">Qty: {item.qty}</p>
                      </div>
                      <p className="text-neutral-900 dark:text-white font-semibold">₹{item.price}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Amount</span>
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">₹{order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
