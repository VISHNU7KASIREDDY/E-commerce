import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Sync search input with URL query param
  React.useEffect(() => {
    const params = new URLSearchParams(search);
    const query = params.get('search');
    setSearchQuery(query || ''); // Set to empty string if no search param
  }, [search]);

  // Auto-clear search from URL when input is emptied
  React.useEffect(() => {
    const params = new URLSearchParams(search);
    const currentSearch = params.get('search');
    
    // If URL has search but input is empty, clear the URL
    if (currentSearch && searchQuery.trim() === '') {
      params.delete('search');
      const newSearch = params.toString();
      navigate(`/shop${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [searchQuery, search, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // If search is cleared, remove search param but keep current location
      const params = new URLSearchParams(search);
      params.delete('search');
      const newSearch = params.toString();
      navigate(`/shop${newSearch ? `?${newSearch}` : ''}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-200 dark:border-neutral-800 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 lg:px-10">
      <div className="flex items-center gap-4 lg:gap-8">
        <Link to="/" className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-neutral-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
            SpiceRoute
          </h2>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-col min-w-40 lg:w-[400px] !h-10">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full ring-1 ring-neutral-200 dark:ring-neutral-700 focus-within:ring-2 focus-within:ring-primary transition-all">
            <button type="submit" className="text-neutral-500 dark:text-neutral-400 flex border-none bg-neutral-100 dark:bg-neutral-800 items-center justify-center pl-4 rounded-l-lg border-r-0 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-neutral-900 dark:text-white focus:outline-0 border-none bg-neutral-100 dark:bg-neutral-800 h-full placeholder:text-neutral-500 px-4 pl-2 text-base font-normal leading-normal"
              placeholder="Search for mango pickle, garam masala..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex flex-1 justify-end gap-4 lg:gap-8 items-center">
        {/* Navigation Links */}
        <div className="hidden xl:flex items-center gap-6">
          <Link
            to="/shop"
            className="text-neutral-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-neutral-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-neutral-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Contact
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">{user?.name || 'Account'}</span>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-t-lg"
                >
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-orange-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Log In</span>
            </Link>
          )}

          <Link
            to="/wishlist"
            className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors"
          >
            <span className="material-symbols-outlined">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
