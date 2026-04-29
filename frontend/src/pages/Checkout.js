import React, { useState, useEffect } from 'react';
import { useNavigate, useSelector } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhone, FaCreditCard, FaMoneyBillWave, FaWallet, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { createOrder } from '../redux/orderSlice';
import { clearCartItems } from '../redux/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Delivery Info
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryInstructions: '',
    // Payment Info
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: '',
    upiId: ''
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  const tax = totalAmount * 0.08;
  const deliveryFee = totalAmount > 500 ? 0 : 50;
  const discount = appliedCoupon ? (totalAmount * appliedCoupon.discount / 100) : 0;
  const finalTotal = totalAmount + tax + deliveryFee - discount;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (items.length === 0) {
      navigate('/menu');
    }
  }, [isAuthenticated, items.length, navigate]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
  
  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      return formData.name && formData.email && formData.phone && 
             formData.address && formData.city && formData.state && formData.zipCode;
    }
    if (stepNum === 2) {
      if (formData.paymentMethod === 'card') {
        return formData.cardNumber && formData.cardExpiry && formData.cardCVV && formData.cardName;
      }
      if (formData.paymentMethod === 'upi') {
        return formData.upiId;
      }
      return true;
    }
    return true;
  };
  
  const handleNext = () => {
    if (!validateStep(step)) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    try {
      const orderData = {
        items: items.map(item => ({
          pizzaId: item.pizzaId,
          name: item.name,
          size: item.size,
          crust: item.crust,
          toppings: item.toppings,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          instructions: formData.deliveryInstructions
        },
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon?.code,
        subtotal: totalAmount,
        tax,
        deliveryFee,
        discount,
        total: finalTotal
      };
      
      const result = await dispatch(createOrder(orderData)).unwrap();
      
      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate(`/order-tracking/${result._id}`);
    } catch (error) {
      toast.error(error.message || 'Error placing order');
    }
  };
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Delivery', 'Payment', 'Confirm'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-primary' : 'bg-gray-700'
                } text-white`}>
                  {step > index + 1 ? <FaCheck /> : index + 1}
                </div>
                <span className={`ml-2 hidden sm:inline ${step >= index + 1 ? 'text-white' : 'text-gray-500'}`}>
                  {label}
                </span>
                {index < 2 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              {/* Step 1: Delivery Info */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Delivery Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="+1 234 567 8900"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="input"
                        placeholder="12345"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-2 block">Address *</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="123 Main Street, Apt 4"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="input"
                        placeholder="NY"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Delivery Instructions</label>
                    <textarea
                      name="deliveryInstructions"
                      value={formData.deliveryInstructions}
                      onChange={handleChange}
                      className="input"
                      rows={2}
                      placeholder="Ring doorbell, leave at door, etc."
                    />
                  </div>
                </div>
              )}
              
              {/* Step 2: Payment */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { id: 'card', label: 'Credit Card', icon: FaCreditCard },
                      { id: 'upi', label: 'UPI', icon: FaWallet },
                      { id: 'cod', label: 'Cash on Delivery', icon: FaMoneyBillWave }
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                          formData.paymentMethod === method.id
                            ? 'border-primary bg-primary/20'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <method.icon className={`text-2xl mb-2 ${formData.paymentMethod === method.id ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={formData.paymentMethod === method.id ? 'text-white' : 'text-gray-400'}>
                          {method.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="input"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-400 text-sm mb-2 block">Expiry Date</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            className="input"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm mb-2 block">CVV</label>
                          <input
                            type="text"
                            name="cardCVV"
                            value={formData.cardCVV}
                            onChange={handleChange}
                            className="input"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Name on Card</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className="input"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'upi' && (
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        className="input"
                        placeholder="yourname@upi"
                      />
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'cod' && (
                    <div className="text-center py-8">
                      <FaMoneyBillWave className="text-6xl text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Pay with cash when your order is delivered</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 3: Confirm */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Confirm Order</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Delivery Address</h3>
                      <div className="bg-gray-800 p-4 rounded-xl">
                        <p className="text-white">{formData.name}</p>
                        <p className="text-gray-400">{formData.address}</p>
                        <p className="text-gray-400">{formData.city}, {formData.state} {formData.zipCode}</p>
                        <p className="text-gray-400">{formData.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Payment Method</h3>
                      <div className="bg-gray-800 p-4 rounded-xl">
                        <p className="text-white capitalize">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.pizzaId} className="flex justify-between bg-gray-800 p-3 rounded-xl">
                            <div>
                              <p className="text-white">{item.name}</p>
                              <p className="text-gray-500 text-sm">
                                {item.size}, {item.crust} × {item.quantity}
                              </p>
                            </div>
                            <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button onClick={handleBack} className="btn-secondary flex items-center">
                    <FaArrowLeft className="mr-2" /> Back
                  </button>
                ) : (
                  <div />
                )}
                
                {step < 3 ? (
                  <button onClick={handleNext} className="btn-primary flex items-center">
                    Next <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="btn-primary flex items-center">
                    Place Order <FaCheck className="ml-2" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.pizzaId} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 border-t border-gray-700 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-green-400">FREE</span> : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-700">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold text-white">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;