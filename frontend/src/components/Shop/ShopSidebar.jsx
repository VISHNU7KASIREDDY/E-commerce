import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ShopSidebar = ({ onCategoryChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  
  // Local filter state (not applied until button click)
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isVeg, setIsVeg] = useState(false);
  const [isNonVeg, setIsNonVeg] = useState(false);

  const categories = [
    { id: 'pickles', name: 'Pickles', count: 24 },
    { id: 'spices', name: 'Spices & Masalas', count: 18 },
    { id: 'podis', name: 'Podis (Powders)', count: 12 },
    { id: 'snacks', name: 'Indian Snacks', count: 9 },
  ];

  const handleCategoryClick = (categoryId) => {
    // Determine active category for toggling
    const newCategory = activeCategory === categoryId ? null : categoryId;
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    
    // Notify parent if needed (URL change triggers fetch usually)
    if (onCategoryChange) onCategoryChange(newCategory);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Add price filters
    if (priceRange[0] > 0) {
      params.set('minPrice', priceRange[0]);
    } else {
      params.delete('minPrice');
    }
    
    if (priceRange[1] < 1000) {
      params.set('maxPrice', priceRange[1]);
    } else {
      params.delete('maxPrice');
    }
    
    // Add dietary filters
    const dietary = [];
    if (isVeg) dietary.push('veg');
    if (isNonVeg) dietary.push('nonveg');
    
    if (dietary.length > 0) {
      params.set('dietary', dietary.join(','));
    } else {
      params.delete('dietary');
    }
    
    setSearchParams(params);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#181311] dark:text-white">
          <span className="material-symbols-outlined text-primary">category</span> Categories
        </h3>
        <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex items-center justify-between group transition-colors hover:text-primary ${
                  activeCategory === cat.id ? 'text-primary font-bold' : ''
                }`}
              >
                <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                <span>({cat.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-[#f5f1f0] dark:border-gray-800" />

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-[#181311] dark:text-white">Price Range</h3>
        <div className="px-1">
          {/* Price Display */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              ₹{priceRange[0]}
            </span>
            <span className="text-gray-400">-</span>
            <span className="text-gray-600 dark:text-gray-400">
              ₹{priceRange[1]}
            </span>
          </div>
          
          {/* Custom Range Slider */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
            {/* Active Range Track */}
            <div 
              className="absolute h-full bg-primary rounded-full"
              style={{
                left: `${(priceRange[0] / 1000) * 100}%`,
                right: `${100 - (priceRange[1] / 1000) * 100}%`
              }}
            />
            
            {/* Min Range Input */}
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[0]}
              onChange={(e) => {
                const value = Math.min(Number(e.target.value), priceRange[1] - 10);
                setPriceRange([value, priceRange[1]]);
              }}
              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
            />
            
            {/* Max Range Input */}
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => {
                const value = Math.max(Number(e.target.value), priceRange[0] + 10);
                setPriceRange([priceRange[0], value]);
              }}
              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
            />
          </div>
        </div>
      </div>

      <hr className="border-[#f5f1f0] dark:border-gray-800" />

      {/* Dietary */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-[#181311] dark:text-white">Dietary</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary bg-white dark:bg-surface-dark" 
              checked={isVeg}
              onChange={(e) => setIsVeg(e.target.checked)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary">Vegetarian</span>
            <span className="ml-auto size-3 border border-green-600 p-[1px] flex items-center justify-center rounded-[2px]">
              <span className="size-1.5 bg-green-600 rounded-full"></span>
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary bg-white dark:bg-surface-dark" 
              checked={isNonVeg}
              onChange={(e) => setIsNonVeg(e.target.checked)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary">Non-Vegetarian</span>
            <span className="ml-auto size-3 border border-red-600 p-[1px] flex items-center justify-center rounded-[2px]">
              <span className="size-1.5 bg-red-600 rounded-full"></span>
            </span>
          </label>
        </div>
      </div>

      <hr className="border-[#f5f1f0] dark:border-gray-800" />

      {/* Apply Filters Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">filter_alt</span>
        Apply Filters
      </button>
    </aside>
  );
};

export default ShopSidebar;
