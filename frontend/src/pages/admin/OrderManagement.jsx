import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId, orderNumber) => {
    if (window.confirm(`Are you sure you want to delete order ${orderNumber || orderId}? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/orders/${orderId}`);
        alert('Order deleted successfully');
        fetchOrders(); // Refresh orders after deletion
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

  const getStatusColor = (status) => {
    const colors = {
      'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Order Management</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Manage and track all customer orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-700">
        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === status
                ? 'border-b-2 border-primary text-primary'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-primary'
            }`}
          >
            {status} {status === 'all' ? `(${orders.length})` : `(${orders.filter(o => o.status.toLowerCase() === status).length})`}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-neutral-500 dark:text-neutral-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                      {order.orderNumber || `#${order._id.slice(-8)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {order.user?.name || order.user?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {order.orderItems?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900 dark:text-white">
                      ₹{order.totalPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="rounded-md border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white text-sm focus:ring-primary focus:border-primary"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => deleteOrder(order._id, order.orderNumber)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete order"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
