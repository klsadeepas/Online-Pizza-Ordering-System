import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaCheck, FaClock, FaMotorcycle, FaPizzaSlice, FaHome, FaPhone, FaArrowLeft, FaPrint, FaReceipt } from 'react-icons/fa';
import { getOrderById } from '../redux/orderSlice';
import PizzaPrepAnimation from '../components/PizzaPrepAnimation';

const OrderTracking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, isLoading: loading } = useSelector(state => state.orders);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const statusSteps = [
    { id: 'received', label: 'Order Received', icon: FaReceipt },
    { id: 'confirmed', label: 'Confirmed', icon: FaCheck },
    { id: 'preparing', label: 'Preparing', icon: FaClock },
    { id: 'outForDelivery', label: 'Out for Delivery', icon: FaMotorcycle },
    { id: 'delivered', label: 'Delivered', icon: FaHome }
  ];
  
  useEffect(() => {
    let interval;
    if (id) {
      dispatch(getOrderById(id));
      
      // Simulate real-time by polling every 10 seconds
      interval = setInterval(() => {
        if (order && order.status !== 'delivered' && order.status !== 'cancelled') {
          dispatch(getOrderById(id));
        }
      }, 10000);
    }
    
    return () => clearInterval(interval);
  }, [id, dispatch, order?.status]);
  
  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const statusMap = {
      'received': 0, // Changed 'placed' to 'received'
      'confirmed': 1,
      'preparing': 2,
      'baking': 2,
      'qualityCheck': 2,
      'outForDelivery': 3,
      'delivered': 4,
      'cancelled': -1
    };
    return statusMap[order.status] || 0;
  };
  
  const getEstimatedTime = () => {
    if (!order) return '';
    // The estimatedDelivery is already a Date object from the backend
    return new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Order Not Found</h2>
          <Link to="/menu" className="btn-primary">
            <FaArrowLeft className="mr-2" /> Back to Menu
          </Link>
        </div>
      </div>
    );
  }
  
  const currentStepIndex = getCurrentStepIndex();
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/dashboard" className="text-gray-400 hover:text-white mb-4 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Order <span className="gradient-text">#{order.orderNumber}</span>
              </h1>
              <p className="text-gray-400">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <button onClick={handlePrint} className="btn-secondary mt-4 md:mt-0">
              <FaPrint className="mr-2" /> Print Receipt
            </button>
          </div>
        </motion.div>
        
        {/* Status Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="text-center mb-8">
            {order.status === 'cancelled' ? (
              <div>
                <div className="text-red-500 text-6xl mb-4">✕</div>
                <h2 className="text-2xl font-bold text-red-500">Order Cancelled</h2>
              </div>
            ) : order.status === 'delivered' ? (
              <div>
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-green-500">Order Delivered!</h2>
                <p className="text-gray-400 mt-2">Thank you for your order</p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {order.status === 'outForDelivery' ? 'On the Way!' : 'Preparing Your Order'}
                </h2>
                <p className="text-gray-400">
                  Estimated delivery by <span className="text-primary font-semibold">{getEstimatedTime()}</span>
                </p>
              </div>
            )}
          </div>
          
          {/* Animated Preparation Visual */}
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <PizzaPrepAnimation status={order.status} />
          )}

          {/* Progress Steps */}
          {order.status !== 'cancelled' && (
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      index <= currentStepIndex ? 'bg-primary text-white' : 'bg-gray-700 text-gray-500'
                    }`}>
                      {index < currentStepIndex ? (
                        <FaCheck />
                      ) : (
                        <step.icon />
                      )}
                    </div>
                    <span className={`mt-2 text-xs ${index <= currentStepIndex ? 'text-white' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-white mb-4">Order Details</h3>
            
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">
                      {item.size}, {item.crust}
                      {item.toppings && item.toppings.length > 0 && ` • ${item.toppings.join(', ')}`}
                    </p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-700">
                <span className="text-white font-semibold">Total</span>
                <span className="text-xl font-bold text-white">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-white mb-4">Delivery Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">Delivery Address</p>
                <p className="text-white">{order.deliveryInfo?.name}</p>
                <p className="text-gray-400">{order.deliveryInfo?.address}</p>
                <p className="text-gray-400">{order.deliveryInfo?.city}, {order.deliveryInfo?.state} {order.deliveryInfo?.zipCode}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm mb-1">Contact</p>
                <p className="text-white flex items-center">
                  <FaPhone className="mr-2 text-primary" />
                  {order.deliveryInfo?.phone}
                </p>
                <p className="text-gray-400">{order.deliveryInfo?.email}</p>
              </div>
              
              {order.deliveryInfo?.instructions && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Delivery Instructions</p>
                  <p className="text-gray-400">{order.deliveryInfo.instructions}</p>
                </div>
              )}
              
              <div>
                <p className="text-gray-500 text-sm mb-1">Payment Method</p>
                <p className="text-white capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm mb-1">Payment Status</p>
                <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 card text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
          <p className="text-gray-400 mb-4">Our support team is here to assist you</p>
          <div className="flex justify-center gap-4">
            <a href="tel:+1234567890" className="btn-secondary">
              <FaPhone className="mr-2" /> Call Us
            </a>
            <Link to="/contact" className="btn-primary">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;