import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaHistory, FaHeart, FaCog, FaSignOutAlt, FaPizzaSlice, FaClock, FaCheck, FaMotorcycle, FaStar, FaReceipt } from 'react-icons/fa';
import { logout, updateProfile } from '../redux/authSlice';
import { getOrders } from '../redux/orderSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { orders } = useSelector(state => state.orders);
  
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    id: user?.id, // Add user ID for updateProfile thunk
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    address: user?.address
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(getOrders());
    }
  }, [isAuthenticated, navigate, dispatch]);
  
  // Update profileData when user object changes (e.g., after login or profile update)
  useEffect(() => {
    setProfileData(prev => ({ ...prev, id: user?.id, name: user?.name, email: user?.email, phone: user?.phone, address: user?.address }));
  }, [user]);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Error updating profile');
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FaCheck className="text-green-500" />;
      case 'outForDelivery': return <FaMotorcycle className="text-blue-500" />;
      case 'received': return <FaReceipt className="text-gray-500" />; // Added for 'received' status
      case 'preparing': return <FaPizzaSlice className="text-yellow-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'badge-success';
      case 'outForDelivery': return 'badge-info';
      case 'preparing': return 'badge-warning';
      case 'received': return 'badge-secondary'; // Added for 'received' status
      case 'confirmed': return 'badge-primary';
      default: return 'badge-secondary';
    }
  };
  
  const tabs = [
    { id: 'orders', label: 'My Orders', icon: FaHistory },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'favorites', label: 'Favorites', icon: FaHeart },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];
  
  if (!isAuthenticated) {
    return null;
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
            Welcome back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          <p className="text-gray-400">Manage your orders and account</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              {/* User Info */}
              <div className="text-center pb-6 border-b border-gray-700 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <tab.icon className="mr-3" />
                    {tab.label}
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>
                
                {orders.length === 0 ? (
                  <div className="card text-center py-12">
                    <FaHistory className="text-6xl text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                    <p className="text-gray-400 mb-4">Start ordering delicious pizzas!</p>
                    <Link to="/menu" className="btn-primary">
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold text-white">
                                Order #{order.orderNumber}
                              </h3>
                              <span className={`badge ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="text-right mt-4 md:mt-0">
                            <p className="text-2xl font-bold text-white">${order.total.toFixed(2)}</p>
                            <p className="text-gray-400 text-sm">{order.items.length} items</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {order.items.slice(0, 3).map((item, i) => (
                            <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                              {item.name} × {item.quantity}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-400">
                            {getStatusIcon(order.status)}
                            <span className="ml-2 text-sm">
                              {order.status === 'delivered' 
                                ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                                : order.estimatedDelivery // This is a Date object, not minutes
                                  ? `Estimated: ${order.estimatedDelivery} min`
                                  : 'Processing'
                              }
                            </span>
                          </div>
                          <Link to={`/order-tracking/${order._id}`} className="text-primary hover:underline">
                            View Details →
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">My Profile</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-secondary"
                    >
                      <FaEdit className="mr-2" /> {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-3 text-gray-500" />
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="input pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Email</label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="input pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Phone</label>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-3 text-gray-500" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="input pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Address</label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
                          <input
                            type="text"
                            value={profileData.address}
                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                            className="input pl-10"
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-primary">
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-gray-800 rounded-xl">
                        <FaUser className="text-primary text-xl mr-4" />
                        <div>
                          <p className="text-gray-500 text-sm">Name</p>
                          <p className="text-white">{user?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-800 rounded-xl">
                        <FaEnvelope className="text-primary text-xl mr-4" />
                        <div>
                          <p className="text-gray-500 text-sm">Email</p>
                          <p className="text-white">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-800 rounded-xl">
                        <FaPhone className="text-primary text-xl mr-4" />
                        <div>
                          <p className="text-gray-500 text-sm">Phone</p>
                          <p className="text-white">{user?.phone || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-800 rounded-xl">
                        <FaMapMarkerAlt className="text-primary text-xl mr-4" />
                        <div>
                          <p className="text-gray-500 text-sm">Address</p>
                          <p className="text-white">{user?.address || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">My Favorites</h2>
                <div className="card text-center py-12">
                  <FaHeart className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
                  <p className="text-gray-400 mb-4">Save your favorite pizzas for quick ordering!</p>
                  <Link to="/menu" className="btn-primary">
                    Browse Menu
                  </Link>
                </div>
              </motion.div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
                <div className="card space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold">Email Notifications</h4>
                      <p className="text-gray-400 text-sm">Receive order updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold">SMS Notifications</h4>
                      <p className="text-gray-400 text-sm">Receive order updates via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold">Dark Mode</h4>
                      <p className="text-gray-400 text-sm">Toggle dark theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;