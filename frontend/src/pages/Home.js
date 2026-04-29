import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar, FaClock, FaFire, FaPizzaSlice, FaLeaf, FaCheese, FaMotorcycle } from 'react-icons/fa';
import { getPizzas } from '../redux/pizzaSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pizzas, isLoading } = useSelector(state => state.pizzas);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    dispatch(getPizzas({}));
  }, [dispatch]);
  
  // Countdown timer for special offer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setCountdown({ hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const popularPizzas = pizzas.filter(p => p.isPopular).slice(0, 6);
  const featuredPizzas = pizzas.filter(p => p.isFeatured).slice(0, 4);
  
  const categories = [
    { name: 'Veg Pizza', icon: <FaLeaf />, color: 'text-green-400' },
    { name: 'Chicken Pizza', icon: <FaFire />, color: 'text-orange-400' },
    { name: 'Cheese Burst', icon: <FaCheese />, color: 'text-yellow-400' },
    { name: 'Seafood Pizza', icon: <FaPizzaSlice />, color: 'text-blue-400' },
    { name: 'BBQ Pizza', icon: <FaFire />, color: 'text-red-400' },
    { name: 'Supreme Pizza', icon: <FaStar />, color: 'text-purple-400' }
  ];
  
  const reviews = [
    { name: 'John D.', rating: 5, comment: 'Best pizza ever! The delivery was super fast.', avatar: 'JD' },
    { name: 'Sarah M.', rating: 5, comment: 'Amazing taste, fresh ingredients. Highly recommend!', avatar: 'SM' },
    { name: 'Mike R.', rating: 4, comment: 'Great pizza and excellent service. Will order again!', avatar: 'MR' }
  ];
  
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-darker to-dark">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                Free Delivery on Orders Above $20
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Delicious
                <span className="block gradient-text">Pizza Delivered</span>
                Fresh & Hot
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                Experience the authentic taste of Italy with our handcrafted pizzas, made with the finest ingredients and delivered to your doorstep.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/menu" className="btn-primary flex items-center">
                  Order Now <FaArrowRight className="ml-2" />
                </Link>
                <Link to="/menu" className="btn-outline">
                  View Menu
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">500+</h3>
                  <p className="text-gray-400">Happy Customers</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">50+</h3>
                  <p className="text-gray-400">Pizza Varieties</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">15min</h3>
                  <p className="text-gray-400">Avg. Delivery Time</p>
                </div>
              </div>
            </motion.div>
            
            {/* Right Content - Pizza Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600"
                  alt="Delicious Pizza"
                  className="relative z-10 w-full h-full object-cover rounded-full border-4 border-gray-800"
                />
                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-10 -left-4 glass rounded-xl p-3 z-20"
                >
                  <div className="flex items-center space-x-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-white font-semibold">4.9 Rating</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute bottom-20 -right-4 glass rounded-xl p-3 z-20"
                >
                  <div className="flex items-center space-x-2">
                    <FaMotorcycle className="text-green-400" />
                    <span className="text-white font-semibold">Fast Delivery</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Special Offer Banner */}
      <section className="py-8 bg-gradient-to-r from-primary/20 via-red-900/20 to-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-4xl">🎉</span>
              <div>
                <h3 className="text-2xl font-bold text-white">Special Offer!</h3>
                <p className="text-gray-400">Get 50% OFF on your first order</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Ends in:</span>
              <div className="flex space-x-2">
                <div className="bg-gray-800 rounded-lg p-3 text-center min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{String(countdown.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">Hours</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{String(countdown.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">Min</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{String(countdown.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">Sec</div>
                </div>
              </div>
              <Link to="/menu" className="btn-primary ml-4">
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Explore Our <span className="gradient-text">Categories</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From classic Margherita to spicy Chicken Tikka, we have something for everyone
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/menu?category=${category.name}`}
                  className="block card text-center p-6 group cursor-pointer"
                >
                  <div className={`text-4xl mb-3 ${category.color} group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="text-white font-semibold">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Pizzas Section */}
      <section className="py-20 bg-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Popular <span className="gradient-text">Pizzas</span></h2>
              <p className="text-gray-400">Our most loved pizzas by customers</p>
            </div>
            <Link to="/menu" className="btn-outline mt-4 md:mt-0">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPizzas.map((pizza, index) => (
              <motion.div
                key={pizza._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/pizza/${pizza._id}`} className="block card pizza-card group">
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={pizza.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'}
                      alt={pizza.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {pizza.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-primary px-3 py-1 rounded-full text-white text-sm font-semibold">
                        {pizza.discount}% OFF
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center bg-black/50 px-2 py-1 rounded-full">
                      <FaStar className="text-yellow-400 text-xs mr-1" />
                      <span className="text-white text-sm">{pizza.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {pizza.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{pizza.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">${pizza.price}</span>
                      {pizza.discount > 0 && (
                        <span className="text-gray-500 line-through ml-2">${Math.round(pizza.price / (1 - pizza.discount / 100))}</span>
                      )}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaClock className="mr-1" />
                      {pizza.preparationTime} min
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Deals Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Featured <span className="gradient-text">Deals</span></h2>
            <p className="text-gray-400">Check out our special deals and combos</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPizzas.map((pizza, index) => (
              <motion.div
                key={pizza._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/pizza/${pizza._id}`} className="block card text-center group">
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={pizza.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'}
                      alt={pizza.name}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-2">
                      <span className="badge badge-primary">{pizza.category}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{pizza.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <FaStar className="text-yellow-400" />
                    <span className="text-white">{pizza.rating}</span>
                    <span className="text-gray-500">({pizza.reviewCount} reviews)</span>
                  </div>
                  <div className="text-2xl font-bold text-white">${pizza.price}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Customer Reviews Section */}
      <section className="py-20 bg-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">What Our <span className="gradient-text">Customers Say</span></h2>
            <p className="text-gray-400">Don't just take our word for it</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{review.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 italic">"{review.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>
            <div className="relative p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Order?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Browse our delicious menu and place your order now. Fast delivery guaranteed!
              </p>
              <Link to="/menu" className="inline-flex items-center bg-white text-primary font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors">
                Browse Menu <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;