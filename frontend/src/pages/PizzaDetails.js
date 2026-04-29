import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaStar, FaClock, FaFire, FaShoppingCart, FaHeart, FaMinus, FaPlus, FaCheck } from 'react-icons/fa';
import { getPizzaById } from '../redux/pizzaSlice';
import { addToCart } from '../redux/cartSlice';

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pizza, isLoading } = useSelector(state => state.pizzas);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedCrust, setSelectedCrust] = useState('thin');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  useEffect(() => {
    dispatch(getPizzaById(id));
    fetchReviews();
  }, [dispatch, id]);
  
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  
  const sizes = [
    { id: 'small', label: 'Small', price: 0 },
    { id: 'medium', label: 'Medium', price: pizza?.sizes?.medium || 50 },
    { id: 'large', label: 'Large', price: pizza?.sizes?.large || 100 }
  ];
  
  const crusts = [
    { id: 'thin', label: 'Thin Crust', price: 0 },
    { id: 'cheeseBurst', label: 'Cheese Burst', price: pizza?.crusts?.cheeseBurst || 50 },
    { id: 'stuffed', label: 'Stuffed Crust', price: pizza?.crusts?.stuffed || 30 },
    { id: 'pan', label: 'Pan Crust', price: pizza?.crusts?.pan || 20 }
  ];
  
  const toppings = [
    { id: 'extraCheese', label: 'Extra Cheese', price: pizza?.extraToppings?.extraCheese || 30 },
    { id: 'mushrooms', label: 'Mushrooms', price: pizza?.extraToppings?.mushrooms || 25 },
    { id: 'chicken', label: 'Chicken', price: pizza?.extraToppings?.chicken || 40 },
    { id: 'sausage', label: 'Sausage', price: pizza?.extraToppings?.sausage || 35 },
    { id: 'pepperoni', label: 'Pepperoni', price: pizza?.extraToppings?.pepperoni || 35 },
    { id: 'olives', label: 'Olives', price: pizza?.extraToppings?.olives || 20 },
    { id: 'onions', label: 'Onions', price: pizza?.extraToppings?.onions || 15 }
  ];
  
  const calculatePrice = () => {
    if (!pizza) return 0;
    
    let price = pizza.price;
    
    // Add size price
    const size = sizes.find(s => s.id === selectedSize);
    if (size) price += size.price;
    
    // Add crust price
    const crust = crusts.find(c => c.id === selectedCrust);
    if (crust) price += crust.price;
    
    // Add toppings price
    selectedToppings.forEach(toppingId => {
      const topping = toppings.find(t => t.id === toppingId);
      if (topping) price += topping.price;
    });
    
    return price * quantity;
  };
  
  const handleToppingToggle = (toppingId) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId)
        ? prev.filter(t => t !== toppingId)
        : [...prev, toppingId]
    );
  };
  
  const handleAddToCart = () => {
    if (!pizza.availability) {
      toast.error('This pizza is currently unavailable');
      return;
    }
    
    const cartItem = {
      pizzaId: pizza._id,
      name: pizza.name,
      image: pizza.images[0],
      size: selectedSize,
      crust: selectedCrust,
      toppings: selectedToppings,
      quantity,
      price: calculatePrice() / quantity
    };
    
    dispatch(addToCart(cartItem));
    toast.success(`${pizza.name} added to cart!`);
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          pizzaId: id,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });
      
      if (response.ok) {
        toast.success('Review submitted successfully!');
        fetchReviews();
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (error) {
      toast.error('Error submitting review');
    }
  };
  
  if (isLoading || !pizza) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <img
                src={pizza.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'}
                alt={pizza.name}
                className="w-full aspect-square object-cover rounded-2xl"
              />
              {pizza.discount > 0 && (
                <div className="absolute top-4 left-4 bg-primary px-4 py-2 rounded-full text-white font-bold">
                  {pizza.discount}% OFF
                </div>
              )}
              {pizza.isPopular && (
                <div className="absolute top-4 right-4 bg-secondary px-4 py-2 rounded-full text-white font-bold">
                  Popular
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Right - Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Header */}
            <div className="mb-6">
              <span className="badge badge-primary mb-2">{pizza.category}</span>
              <h1 className="text-4xl font-bold text-white mb-2">{pizza.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-white font-semibold">{pizza.rating}</span>
                  <span className="text-gray-400 ml-1">({pizza.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <FaClock className="mr-1" />
                  {pizza.preparationTime} min
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">Spice:</span>
                  {[...Array(5)].map((_, i) => (
                    <FaFire key={i} className={i < pizza.spiceLevel ? 'text-red-500' : 'text-gray-700'} />
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6">{pizza.description}</p>
            
            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {pizza.ingredients.map((ing, i) => (
                  <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Select Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSize === size.id
                        ? 'border-primary bg-primary/20 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-semibold">{size.label}</div>
                    {size.price > 0 && <div className="text-sm text-primary">+${size.price}</div>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Crust Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Select Crust</h3>
              <div className="grid grid-cols-2 gap-3">
                {crusts.map(crust => (
                  <button
                    key={crust.id}
                    onClick={() => setSelectedCrust(crust.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedCrust === crust.id
                        ? 'border-primary bg-primary/20 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-semibold">{crust.label}</div>
                    {crust.price > 0 && <div className="text-sm text-primary">+${crust.price}</div>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Extra Toppings */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Extra Toppings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {toppings.map(topping => (
                  <button
                    key={topping.id}
                    onClick={() => handleToppingToggle(topping.id)}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                      selectedToppings.includes(topping.id)
                        ? 'border-primary bg-primary/20 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-sm">{topping.label}</span>
                    <span className="text-xs text-primary">+${topping.price}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="flex items-center bg-gray-800 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 text-white hover:text-primary transition-colors"
                >
                  <FaMinus />
                </button>
                <span className="text-white font-semibold text-xl w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 text-white hover:text-primary transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="text-3xl font-bold text-white mb-1">${calculatePrice().toFixed(2)}</div>
                {pizza.discount > 0 && (
                  <div className="text-gray-500 line-through">
                    ${(pizza.price * quantity * 1.5).toFixed(2)}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!pizza.availability}
                className={`btn-primary flex items-center ${!pizza.availability ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Customer Reviews</h2>
          
          {/* Add Review Form */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="card mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="text-gray-400 mb-2 block">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1"
                    >
                      <FaStar className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-600'} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience..."
                className="input mb-4"
                rows={3}
                required
              />
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          )}
          
          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {review.userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{review.userName}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400">{review.comment}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetails;