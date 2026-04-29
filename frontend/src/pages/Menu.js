import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaStar, FaClock, FaFire, FaThLarge, FaList } from 'react-icons/fa';
import { getPizzas, setFilters } from '../redux/pizzaSlice';

const Menu = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pizzas, isLoading, filters } = useSelector(state => state.pizzas);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = ['All', 'Veg Pizza', 'Chicken Pizza', 'Cheese Burst', 'Seafood Pizza', 'BBQ Pizza', 'Supreme Pizza'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];
  
  useEffect(() => {
    const category = searchParams.get('category') || 'All';
    const search = searchParams.get('search') || '';
    dispatch(setFilters({ category, search }));
    dispatch(getPizzas({ category: category === 'All' ? '' : category, search }));
  }, [dispatch, searchParams]);
  
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category !== 'All') params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    setSearchParams(params);
    
    // Fetch pizzas
    dispatch(getPizzas({
      category: newFilters.category === 'All' ? '' : newFilters.category,
      search: newFilters.search,
      sort: newFilters.sort,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      available: newFilters.available
    }));
  };
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our wide variety of delicious pizzas, made with fresh ingredients and authentic recipes
          </p>
        </motion.div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search pizzas..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-12"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn-outline flex items-center justify-center"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
          
          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input w-auto"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input w-auto"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            
            {/* View Mode */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400'}`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400'}`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-gray-800 rounded-xl p-4 mb-8"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="input"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{pizzas.length}</span> pizzas
          </p>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-48 rounded-xl mb-4"></div>
                <div className="skeleton h-6 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-1/2 mb-4"></div>
                <div className="skeleton h-8 w-1/3"></div>
              </div>
            ))}
          </div>
        ) : pizzas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No pizzas found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        ) : (
          /* Pizza Grid */
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {pizzas.map((pizza, index) => (
              <motion.div
                key={pizza._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/pizza/${pizza._id}`} className={`block card pizza-card group ${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={`relative overflow-hidden rounded-xl ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'mb-4'}`}>
                    <img
                      src={pizza.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'}
                      alt={pizza.name}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${viewMode === 'list' ? 'w-full h-full' : 'h-48'}`}
                    />
                    {pizza.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-primary px-3 py-1 rounded-full text-white text-sm font-semibold">
                        {pizza.discount}% OFF
                      </div>
                    )}
                    {!pizza.availability && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center bg-black/50 px-2 py-1 rounded-full">
                      <FaStar className="text-yellow-400 text-xs mr-1" />
                      <span className="text-white text-sm">{pizza.rating}</span>
                    </div>
                  </div>
                  
                  <div className={viewMode === 'list' ? 'flex-1 ml-4' : ''}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-primary">{pizza.category}</span>
                      <div className="flex items-center text-gray-400 text-sm">
                        <FaClock className="mr-1" />
                        {pizza.preparationTime} min
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                      {pizza.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{pizza.description}</p>
                    
                    {/* Ingredients */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {pizza.ingredients.slice(0, 4).map((ing, i) => (
                        <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                          {ing}
                        </span>
                      ))}
                      {pizza.ingredients.length > 4 && (
                        <span className="text-xs text-gray-500">+{pizza.ingredients.length - 4} more</span>
                      )}
                    </div>
                    
                    {/* Spice Level */}
                    <div className="flex items-center mb-4">
                      <span className="text-gray-400 text-sm mr-2">Spice:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaFire
                            key={i}
                            className={i < pizza.spiceLevel ? 'text-red-500' : 'text-gray-700'}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-white">${pizza.price}</span>
                        {pizza.discount > 0 && (
                          <span className="text-gray-500 line-through ml-2">
                            ${Math.round(pizza.price / (1 - pizza.discount / 100))}
                          </span>
                        )}
                      </div>
                      {pizza.isPopular && (
                        <span className="badge badge-warning">Popular</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;