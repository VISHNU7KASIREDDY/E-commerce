import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/Product/ProductCard';
import ShopSidebar from '../components/Shop/ShopSidebar';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const dietary = searchParams.get('dietary');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('best-selling');

  useEffect(() => {
    fetchProducts();
  }, [category, search, type, minPrice, maxPrice, dietary]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let data = await productService.getProducts(category);
      
      if (search) {
         const lowerSearch = search.toLowerCase().trim();
         if (lowerSearch) {
             data = data.filter(product => {
                const productName = product.name?.toLowerCase() || '';
                return productName.includes(lowerSearch);
             });
         }
      }

      if (type === 'bestsellers') {
         data = data.filter(product => product.isBestseller === true);
      }

      if (minPrice || maxPrice) {
         data = data.filter(product => {
            const effectivePrice = product.discountPrice || product.price || 0;
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Infinity;
            return effectivePrice >= min && effectivePrice <= max;
         });
      }

      if (dietary) {
         const dietaryPrefs = dietary.split(',');
         data = data.filter(product => {
            if (dietaryPrefs.includes('veg') && dietaryPrefs.includes('nonveg')) {
               return true;
            }
            if (dietaryPrefs.includes('veg') && product.isVegetarian === true) {
               return true;
            }
            if (dietaryPrefs.includes('nonveg') && product.isVegetarian === false) {
               return true;
            }
            return false;
         });
      }

      data = applySorting(data, sortBy);

      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySorting = (data, sort) => {
    const sorted = [...data];
    switch(sort) {
      case 'price-low-high':
        return sorted.sort((a, b) => {
          const priceA = a.discountPrice || a.price || 0;
          const priceB = b.discountPrice || b.price || 0;
          return priceA - priceB;
        });
      case 'price-high-low':
        return sorted.sort((a, b) => {
          const priceA = a.discountPrice || a.price || 0;
          const priceB = b.discountPrice || b.price || 0;
          return priceB - priceA;
        });
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'best-selling':
      default:
        return sorted;
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setProducts(applySorting(products, e.target.value));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 min-h-screen flex flex-col">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm font-medium text-[#8a6e60] dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="material-symbols-outlined text-sm pt-1">chevron_right</span></li>
          <li><Link to="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
          {category && (
            <>
              <li><span className="material-symbols-outlined text-sm pt-1">chevron_right</span></li>
              <li aria-current="page" className="text-[#181311] dark:text-primary font-bold capitalize">{category}</li>
            </>
          )}
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 relative">
        {/* Sidebar - Hidden on mobile, shown on lg */}
        <div className="hidden lg:block">
            <ShopSidebar />
        </div>

        {/* Mobile Filter Drawer Overlay - Optional implementation for better UX */}
        {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsMobileFilterOpen(false)}>
                <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-background-dark p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button onClick={() => setIsMobileFilterOpen(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <ShopSidebar />
                </div>
            </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full">
          {/* Header & Toolbar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[#181311] dark:text-white text-3xl lg:text-4xl font-bold tracking-tight mb-2 capitalize">
                   {search ? `Search Results for "${search}"` : type === 'bestsellers' ? 'Best Sellers' : category ? `${category}` : 'Authentic Pickles & Spices'}
                </h1>
                <p className="text-[#8a6e60] dark:text-gray-400 text-base max-w-2xl">
                    Handcrafted traditional recipes made with authentic spices, cold-pressed oils, and love from our grandmother's kitchen.
                </p>
              </div>
              <div className="text-sm font-medium text-gray-500 whitespace-nowrap">
                Showing {products.length} results
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-light dark:bg-surface-dark p-3 rounded-lg shadow-sm border border-[#f5f1f0] dark:border-gray-800">
               {/* Mobile Filter Trigger */}
               <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-background-light dark:bg-[#3a2c26] rounded-md text-sm font-semibold hover:bg-gray-200 transition"
               >
                 <span className="material-symbols-outlined text-lg">filter_list</span> Filters
               </button>

               <div className="flex items-center gap-4 ml-auto lg:ml-0">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium hidden sm:block">Sort by:</label>
                    <div className="relative">
                       <select 
                         value={sortBy}
                         onChange={handleSortChange}
                         className="appearance-none bg-background-light dark:bg-[#3a2c26] border-none text-sm font-semibold pl-4 pr-10 py-2 rounded-md focus:ring-1 focus:ring-primary cursor-pointer min-w-[160px] text-[#181311] dark:text-white"
                       >
                         <option value="best-selling">Best Selling</option>
                         <option value="price-low-high">Price: Low to High</option>
                         <option value="price-high-low">Price: High to Low</option>
                         <option value="newest">Newest First</option>
                       </select>
                       <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-lg">expand_more</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
             <div className="flex justify-center items-center min-h-[300px]">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
             </div>
          ) : products.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                 No products found.
               </p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
