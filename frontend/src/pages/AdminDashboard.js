import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaUser, FaPizzaSlice, FaShoppingCart, FaDollarSign, FaChartLine, FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaCog, FaSignOutAlt, FaBars, FaTimes as FaClose, FaUsers, FaTag } from 'react-icons/fa';
import { getPizzas, addPizza, updatePizza, deletePizza } from '../redux/pizzaSlice';
import { getOrders, updateOrderStatus } from '../redux/orderSlice';
import { logout } from '../redux/authSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { pizzas } = useSelector(state => state.pizzas);
  const { orders } = useSelector(state => state.orders);
  const [usersList, setUsersList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPizzaModal, setShowPizzaModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null);
  const [pizzaForm, setPizzaForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Veg Pizza',
    image: '',
    sizes: { small: 0, medium: 50, large: 100 },
    crusts: { thin: 0, cheeseBurst: 50, stuffed: 30, pan: 20 },
    extraToppings: { extraCheese: 30, mushrooms: 25, chicken: 40, sausage: 35, pepperoni: 35, olives: 20, onions: 15 },
    ingredients: [],
    spiceLevel: 1,
    preparationTime: 20,
    availability: true,
    isPopular: false,
    discount: 0
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: 0,
    minOrderAmount: 0,
    validUntil: '',
    isActive: true
  });
  
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/login');
    } else if (user?.isAdmin) { // Only fetch admin data if user is admin
      dispatch(getPizzas());
      dispatch(getOrders());
      fetchUsers();
      fetchCoupons();
      fetchAnalytics();
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalytics(data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsersList(data);
    } catch (err) { console.error(err); }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/coupons');
      const data = await res.json();
      setCouponsList(data);
    } catch (err) { console.error(err); }
  };
  
  const handleLogout = () => {
    dispatch(logout()); // Use Redux logout action
    navigate('/login'); // Redirect to login after logout

    toast.success('Logged out successfully');
  };
  
  const handlePizzaSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...pizzaForm, images: [pizzaForm.image] };
    try {
      if (editingPizza) {
        await dispatch(updatePizza({ id: editingPizza._id, pizzaData: dataToSubmit })).unwrap();
        toast.success('Pizza updated successfully');
      } else {
        await dispatch(addPizza(dataToSubmit)).unwrap();
        toast.success('Pizza added successfully');
      }
      setShowPizzaModal(false);
      setEditingPizza(null);
      setPizzaForm({
        name: '', description: '', price: 0, category: 'Veg Pizza', image: '',
        sizes: { small: 0, medium: 50, large: 100 },
        crusts: { thin: 0, cheeseBurst: 50, stuffed: 30, pan: 20 },
        extraToppings: { extraCheese: 30, mushrooms: 25, chicken: 40, sausage: 35, pepperoni: 35, olives: 20, onions: 15 },
        ingredients: [], spiceLevel: 1, preparationTime: 20, availability: true, isPopular: false, discount: 0
      });
    } catch (error) {
      toast.error('Error saving pizza');
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/coupons', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(couponForm)
      });
      if (res.ok) {
        toast.success('Coupon created');
        fetchCoupons();
        setShowCouponModal(false);
      }
    } catch (err) { toast.error('Error creating coupon'); }
  };
  
  const handleDeletePizza = async (id) => {
    if (window.confirm('Are you sure you want to delete this pizza?')) {
      try {
        await dispatch(deletePizza(id)).unwrap();
        toast.success('Pizza deleted successfully');
      } catch (error) {
        toast.error('Error deleting pizza');
      }
    }
  };
  
  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Error updating order');
    }
  };
  
  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.status === 'delivered' ? order.total : 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const totalPizzas = pizzas.length;
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'orders', label: 'Orders', icon: FaShoppingCart }, // Changed icon to FaShoppingCart for consistency
    { id: 'pizzas', label: 'Pizzas', icon: FaPizzaSlice },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'coupons', label: 'Coupons', icon: FaTag }
  ];
  
  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }
  
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2">
          {sidebarOpen ? <FaClose /> : <FaBars />}
        </button>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
          <div className="p-6 border-b border-gray-700">
            <Link to="/admin/dashboard" className="flex items-center">
              <FaPizzaSlice className="text-3xl text-primary mr-2" />
              <span className="text-2xl font-bold text-white">PizzaExpress</span>
            </Link>
            <p className="text-gray-400 text-sm mt-2">Admin Dashboard</p>
          </div>
          
          <nav className="p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <tab.icon className="mr-3" />
                {tab.label}
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-8"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8 pt-24 lg:pt-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-primary to-purple-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Total Revenue</p>
                      <p className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <FaDollarSign className="text-4xl text-white/30" />
                  </div>
                </div>
                
                <div className="card bg-gradient-to-br from-blue-500 to-cyan-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Total Orders</p>
                      <p className="text-3xl font-bold text-white">{totalOrders}</p>
                    </div>
                    <FaShoppingCart className="text-4xl text-white/30" />
                  </div>
                </div>
                
                <div className="card bg-gradient-to-br from-yellow-500 to-orange-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Pending Orders</p>
                      <p className="text-3xl font-bold text-white">{pendingOrders}</p>
                    </div>
                    <FaChartLine className="text-4xl text-white/30" />
                  </div>
                </div>
                
                <div className="card bg-gradient-to-br from-green-500 to-emerald-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Total Pizzas</p>
                      <p className="text-3xl font-bold text-white">{totalPizzas}</p>
                    </div>
                    <FaPizzaSlice className="text-4xl text-white/30" />
                  </div>
                </div>
              </div>
              
              {/* Analytics Chart */}
              {analytics && (
                <div className="card mb-8">
                  <h3 className="text-xl font-bold text-white mb-6">Revenue Trend (Last 7 Days)</h3>
                  <div className="h-[300px]">
                    <Line 
                      data={{
                        labels: analytics.dailyRevenue.map(d => d.date),
                        datasets: [{
                          label: 'Revenue ($)',
                          data: analytics.dailyRevenue.map(d => d.revenue),
                          borderColor: '#e11d28',
                          backgroundColor: 'rgba(225, 29, 40, 0.1)',
                          fill: true,
                          tension: 0.4
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' } },
                          x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                        },
                        plugins: { legend: { display: false } }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Recent Orders */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id} className="border-b border-gray-800">
                          <td className="py-3 text-white">{order.orderNumber}</td>
                          <td className="py-3 text-gray-400">{order.deliveryInfo?.name}</td>
                          <td className="py-3 text-white">${order.total.toFixed(2)}</td>
                          <td className="py-3">
                            <span className={`badge ${
                              order.status === 'delivered' ? 'badge-success' :
                              order.status === 'cancelled' ? 'badge-error' :
                              'badge-warning'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Orders Management</h2>
                <span className="badge badge-primary">{pendingOrders} pending</span>
              </div>
              
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="card">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Order #{order.orderNumber}</h3>
                        <p className="text-gray-400 text-sm">
                          {order.deliveryInfo?.name} • {order.deliveryInfo?.phone}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {order.deliveryInfo?.address}, {order.deliveryInfo?.city}
                        </p>
                      </div>
                      <div className="text-right mt-4 lg:mt-0">
                        <p className="text-2xl font-bold text-white">${order.total.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, i) => (
                          <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                          className="input py-2"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="outForDelivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Pizzas Tab */}
          {activeTab === 'pizzas' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Pizza Management</h2>
                <button
                  onClick={() => { setEditingPizza(null); setShowPizzaModal(true); }}
                  className="btn-primary"
                >
                  <FaPlus className="mr-2" /> Add Pizza
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pizzas.map(pizza => (
                  <div key={pizza._id} className="card">
                    <img
                      src={pizza.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300'}
                      alt={pizza.name}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{pizza.name}</h3>
                        <span className="badge badge-primary text-xs">{pizza.category}</span>
                      </div>
                      <p className="text-xl font-bold text-primary">${pizza.price}</p>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{pizza.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`badge ${pizza.availability ? 'badge-success' : 'badge-error'}`}>
                        {pizza.availability ? 'Available' : 'Unavailable'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingPizza(pizza); setPizzaForm(pizza); setShowPizzaModal(true); }}
                          className="p-2 text-primary hover:bg-primary/20 rounded-lg"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePizza(pizza._id)}
                          className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold text-white mb-8">User Management</h2>
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Joined</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map(u => (
                        <tr key={u._id} className="border-b border-gray-800">
                          <td className="py-3 text-white">{u.name}</td>
                          <td className="py-3 text-gray-400">{u.email}</td>
                          <td className="py-3 text-gray-400">{u.phone}</td>
                          <td className="py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-3">
                            <button 
                              onClick={async () => { // This should ideally be a Redux thunk for consistency
                                if(window.confirm('Delete user?')) {
                                  await fetch(`http://localhost:5000/api/users/${u._id}`, { 
                                    method: 'DELETE',
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                  });
                                  fetchUsers();
                                }
                              }}
                              className="text-red-500 hover:text-red-400"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Coupon Management</h2>
                <button onClick={() => setShowCouponModal(true)} className="btn-primary">
                  <FaPlus className="mr-2" /> Create Coupon
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {couponsList.map(coupon => (
                  <div key={coupon._id} className="card border-l-4 border-primary">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-white">{coupon.code}</h3>
                        <p className="text-primary font-bold">{coupon.discount}% OFF</p>
                      </div>
                      <span className={`badge ${coupon.isActive ? 'badge-success' : 'badge-error'}`}>
                        {coupon.isActive ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>Min Order: ${coupon.minOrderAmount}</p>
                      <p>Expires: {new Date(coupon.validUntil).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Pizza Modal */}
      {showPizzaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingPizza ? 'Edit Pizza' : 'Add New Pizza'}
              </h2>
              <button onClick={() => setShowPizzaModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handlePizzaSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Name *</label>
                  <input
                    type="text"
                    value={pizzaForm.name}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Category</label>
                  <select
                    value={pizzaForm.category}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, category: e.target.value })}
                    className="input"
                  >
                    <option value="Veg Pizza">Veg Pizza</option>
                    <option value="Chicken Pizza">Chicken Pizza</option>
                    <option value="Cheese Burst">Cheese Burst</option>
                    <option value="Seafood Pizza">Seafood Pizza</option>
                    <option value="BBQ Pizza">BBQ Pizza</option>
                    <option value="Supreme Pizza">Supreme Pizza</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Description</label>
                <textarea
                  value={pizzaForm.description}
                  onChange={(e) => setPizzaForm({ ...pizzaForm, description: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Base Price *</label>
                  <input
                    type="number"
                    value={pizzaForm.price}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, price: parseFloat(e.target.value) })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Prep Time (min)</label>
                  <input
                    type="number"
                    value={pizzaForm.preparationTime}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, preparationTime: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Discount %</label>
                  <input
                    type="number"
                    value={pizzaForm.discount}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, discount: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Image URL</label>
                <input
                  type="url"
                  value={pizzaForm.image}
                  onChange={(e) => setPizzaForm({ ...pizzaForm, image: e.target.value })}
                  className="input"
                  placeholder="https://..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pizzaForm.availability}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, availability: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary"
                  />
                  <span className="ml-2 text-white">Available</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pizzaForm.isPopular}
                    onChange={(e) => setPizzaForm({ ...pizzaForm, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary"
                  />
                  <span className="ml-2 text-white">Popular</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowPizzaModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingPizza ? 'Update Pizza' : 'Add Pizza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Coupon</h2>
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Promo Code</label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="input uppercase"
                  placeholder="E.G. SUMMER50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Discount %</label>
                  <input
                    type="number"
                    value={couponForm.discount}
                    onChange={(e) => setCouponForm({ ...couponForm, discount: parseInt(e.target.value) })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Expiry Date</label>
                  <input
                    type="date"
                    value={couponForm.validUntil}
                    onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowCouponModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;