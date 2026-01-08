import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, getTotalPrice, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(item.productId, newQuantity, item.size, item.category);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.productId, item.size, item.category);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setPlacing(true);
      // Create order from cart items
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.productId
        })),
        totalPrice: totalPrice
      };

      const order = await orderService.createOrder(orderData);
      
      // Clear cart by removing all items
      for (const item of cartItems) {
        await removeFromCart(item.productId, item.size, item.category);
      }

      alert(`Order placed successfully! Order Number: ${order.orderNumber}`);
      fetchCart(); // Refresh cart
      navigate('/'); // Navigate to home
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const cartItems = cart?.products || [];
  const totalPrice = getTotalPrice();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <nav className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          <a href="/" className="hover:text-primary">
            Home
          </a>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 dark:text-white">Cart</span>
        </nav>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Your Shopping Cart</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart.
        </p>
      </div>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '96px' }}>
              shopping_cart
            </span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Start adding some delicious products!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items Section */}
          <section className="lg:col-span-8">
            {/* Cart List */}
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-700 border-b border-neutral-200 dark:border-neutral-700 mb-8">
              {cartItems.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="flex py-6 flex-col sm:flex-row">
                  {/* Image */}
                  <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-32 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white">
                    <img
                      alt={item.name}
                      src={item.image || 'https://via.placeholder.com/150'}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Info & Controls */}
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
                    {/* Product Details */}
                    <div className="sm:col-span-3">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Size: {item.size}
                      </p>
                      <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
                        In stock
                      </p>
                    </div>

                    {/* Price */}
                    <div className="hidden sm:block sm:col-span-1 text-center">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="sm:col-span-1 flex items-center justify-between sm:justify-center border border-neutral-300 dark:border-neutral-600 rounded-lg px-2 py-1 w-full sm:w-auto max-w-[120px]">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="text-neutral-500 hover:text-primary p-1"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <input
                        className="w-8 text-center bg-transparent border-none text-neutral-900 dark:text-white font-medium p-0 focus:ring-0 text-sm"
                        type="text"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="text-neutral-500 hover:text-primary p-1"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>

                    {/* Total & Delete */}
                    <div className="sm:col-span-1 flex sm:block items-center justify-between sm:text-right mt-2 sm:mt-0">
                      <p className="text-lg font-bold text-neutral-900 dark:text-white sm:mb-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 sm:justify-end"
                      >
                        <span className="material-symbols-outlined text-base">delete_outline</span>
                        <span className="sm:hidden">Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 mt-16 lg:mt-0">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6 sm:p-8 sticky top-28">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
                Order Summary
              </h2>
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-neutral-200 dark:divide-neutral-700">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Subtotal</dt>
                    <dd className="font-medium text-neutral-900 dark:text-white">
                      ₹{totalPrice.toFixed(2)}
                    </dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Shipping</dt>
                    <dd className="font-medium text-neutral-900 dark:text-white">₹50.00</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Tax (5%)</dt>
                    <dd className="font-medium text-neutral-900 dark:text-white">
                      ₹{(totalPrice * 0.05).toFixed(2)}
                    </dd>
                  </div>
                  <div className="py-4 flex items-center justify-between border-t-2 border-dashed border-neutral-200 dark:border-neutral-700">
                    <dt className="text-base font-bold text-neutral-900 dark:text-white">Total</dt>
                    <dd className="text-xl font-bold text-primary">
                      ₹{(totalPrice + 50 + totalPrice * 0.05).toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Place Order Button */}
              <div className="mt-8">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || cartItems.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-white border border-transparent rounded-lg shadow-sm py-3 px-4 text-base font-bold text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-50 focus:ring-primary transition-all shadow-[0_4px_14px_0_rgba(242,89,13,0.39)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>

              {/* Trust Signals */}
              <div className="mt-6 flex justify-center gap-6 text-neutral-400 dark:text-neutral-500">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider">Fast</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-xl">eco</span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider">Fresh</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Cart;
