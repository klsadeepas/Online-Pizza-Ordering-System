import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaTrash, FaMinus, FaPlus, FaTag, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { removeFromCart, updateQuantity, clearCartItems } from '../redux/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  
  const tax = totalAmount * 0.08;
  const deliveryFee = totalAmount > 500 ? 0 : 50;
  const discount = appliedCoupon ? (totalAmount * appliedCoupon.discount / 100) : 0;
  const finalTotal = totalAmount + tax + deliveryFee - discount;
  
  useEffect(() => {
    fetchCoupons();
  }, []);
  
  const fetchCoupons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };
  
  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      dispatch(updateQuantity({
        pizzaId: item.pizzaId,
        size: item.size,
        crust: item.crust,
        toppings: item.toppings,
        quantity: newQuantity
      }));
    }
  };
  
  const handleRemove = (item) => {
    dispatch(removeFromCart({
      pizzaId: item.pizzaId,
      size: item.size,
      crust: item.crust,
      toppings: item.toppings
    }));
    toast.success(`${item.name} removed from cart`);
  };
  
  const handleApplyCoupon = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderAmount: totalAmount })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAppliedCoupon(data);
        toast.success(`Coupon applied! ${data.discount}% off`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error applying coupon');
    }
  };
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-gray-400 mb-8">Looks like you haven't added any pizzas yet</p>
            <Link to="/menu" className="btn-primary">
              Browse Menu <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Your <span className="gradient-text">Cart</span>
          </h1>
          <p className="text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={`${item.pizzaId}-${item.size}-${item.crust}-${JSON.stringify(item.toppings)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="card mb-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                          <p className="text-gray-400 text-sm">
                            Size: {item.size} | Crust: {item.crust}
                          </p>
                          {item.toppings && item.toppings.length > 0 && (
                            <p className="text-gray-500 text-xs">
                              Toppings: {item.toppings.join(', ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-800 rounded-full">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            className="p-2 text-white hover:text-primary transition-colors"
                          >
                            <FaMinus />
                          </button>
                          <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="p-2 text-white hover:text-primary transition-colors"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-gray-500 text-sm">
                              ${item.price.toFixed(2)} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              {/* Coupon */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Apply Coupon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="input flex-1"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="btn-primary px-4"
                  >
                    <FaTag />
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 p-2 bg-green-500/20 rounded-lg flex items-center justify-between">
                    <span className="text-green-400 text-sm">
                      {appliedCoupon.code} applied ({appliedCoupon.discount}% off)
                    </span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-green-400 hover:text-white"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
                {/* Available Coupons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {coupons.map(coupon => (
                    <button
                      key={coupon._id}
                      onClick={() => setCouponCode(coupon.code)}
                      className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                    >
                      {coupon.code}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-green-400">FREE</span> : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold text-white">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="btn-primary w-full flex items-center justify-center"
              >
                <FaShoppingBag className="mr-2" />
                Proceed to Checkout
              </button>
              
              {/* Free Delivery Notice */}
              {totalAmount < 500 && (
                <p className="text-center text-gray-500 text-sm mt-4">
                  Add ${(500 - totalAmount).toFixed(2)} more for free delivery!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;