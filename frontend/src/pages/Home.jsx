import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import WishlistButton from '../components/Wishlist/WishlistButton';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();

      const bestsellers = data.filter(product => product.isBestseller);
      setProducts(bestsellers.slice(0, 8)); 
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); 
    addToCart(product._id, 1, product.sizes?.[0] || '250g');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="layout-container flex h-full grow flex-col items-center">
        {}
        <div className="w-full max-w-[1280px] p-4 lg:p-8">
          <div
            className="flex min-h-[500px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end px-6 pb-12 md:px-12 md:pb-16 relative overflow-hidden shadow-lg"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoSrAq9MXugja7fqhLig0Ku8TDqNMAUSkA1ugRqVJm_I41nGeH5VOCfSwNrqpr3TZjhMCscJOIgncggmE4UaZ_MtyNgDBcPl4xoUk43tcyMats43tTAmGBLDYu2dyQyVywGkJZEOuC6iG7oO8uhohcGELn5dazvxUeInvipfMJ6AoL6A3FFGvVHGDfHFhLDrxQCW6r7Qh_DkdlWHhZ2EQjYY-Pq0ZPioZGSg16TNgnrAZmVqHs6Ek9yAirddeTwQcQY6TslwR-_4A")`,
            }}
          >
            <div className="flex flex-col gap-4 text-left max-w-2xl z-10">
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
                Authentic Flavors, <br /> Delivered to Your Doorstep
              </h1>
              <h2 className="text-white/90 text-base md:text-lg font-medium leading-normal max-w-xl">
                Explore our handcrafted range of spicy pickles, aromatic curries, and traditional snacks made from
                generations-old recipes.
              </h2>
            </div>
            <Link to="/shop" className="z-10 flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-orange-600 transition-colors text-white text-base font-bold tracking-[0.015em] shadow-lg shadow-orange-900/20">
              <span className="truncate">Shop Now</span>
            </Link>
          </div>
        </div>

        {}
        <div className="flex flex-col max-w-[1280px] w-full px-4 lg:px-8 py-8">
          <h2 className="text-neutral-900 dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight text-left pb-6">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {}
            <Link to="/shop?category=pickles" className="group flex flex-col items-center gap-4 text-center cursor-pointer">
              <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary/20 transition-all duration-300">
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url("/images/pickle-category.jpg")`,
                  }}
                ></div>
              </div>
              <p className="text-neutral-900 dark:text-white text-lg font-semibold group-hover:text-primary transition-colors">
                Pickles
              </p>
            </Link>

            {}
            <Link to="/shop?category=podis" className="group flex flex-col items-center gap-4 text-center cursor-pointer">
              <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary/20 transition-all duration-300">
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url("/images/podis-category.jpg")`,
                  }}
                ></div>
              </div>
              <p className="text-neutral-900 dark:text-white text-lg font-semibold group-hover:text-primary transition-colors">
                Podis
              </p>
            </Link>

            {}
            <Link to="/shop?category=spices" className="group flex flex-col items-center gap-4 text-center cursor-pointer">
              <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary/20 transition-all duration-300">
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url("/images/spices-category.jpg")`,
                  }}
                ></div>
              </div>
              <p className="text-neutral-900 dark:text-white text-lg font-semibold group-hover:text-primary transition-colors">
                Spices
              </p>
            </Link>

            {}
            <Link to="/shop?category=snacks" className="group flex flex-col items-center gap-4 text-center cursor-pointer">
              <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary/20 transition-all duration-300">
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url("/images/snacks-category.jpg")`,
                  }}
                ></div>
              </div>
              <p className="text-neutral-900 dark:text-white text-lg font-semibold group-hover:text-primary transition-colors">
                Snacks
              </p>
            </Link>
          </div>
        </div>

        {}
        <div className="flex flex-col max-w-[1280px] w-full px-4 lg:px-8 py-8">
          <h2 className="text-neutral-900 dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight text-left pb-6">
            Bestsellers
          </h2>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                No products available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 lg:px-8 snap-x snap-mandatory scrollbar-hide">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="min-w-[280px] w-[280px] sm:w-[300px] snap-center shrink-0 group flex flex-col gap-4 bg-white dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <WishlistButton 
                        productId={product._id} 
                        className={`!size-10 !rounded-full bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-lg transition-opacity ${
                          isInWishlist(product._id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        title="Add to Cart"
                      >
                        <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-neutral-900 dark:text-white font-bold text-lg leading-tight truncate">
                      {product.name}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                      {product.sizes?.[0] || '250g'} • {product.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        {product.discountPrice && (
                          <span className="text-neutral-500 dark:text-neutral-400 text-sm line-through">
                            ₹{product.price}
                          </span>
                        )}
                        <span className="text-neutral-900 dark:text-white font-bold text-xl">
                          ₹{product.discountPrice || product.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                        <span className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                          {product.rating ? product.rating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
