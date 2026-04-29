import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaPizzaSlice } from 'react-icons/fa';
import { login } from '../redux/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Login failed');
    }
  };
  
  const handleDemoLogin = async (role) => {
    const credentials = role === 'admin' 
      ? { email: 'admin@pizzaexpress.com', password: 'admin123' }
      : { email: 'user@example.com', password: 'user123' };
    
    try {
      await dispatch(login(credentials)).unwrap();
      toast.success(`Logged in as ${role}!`);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error('Demo login failed');
    }
  };
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center">
              <FaPizzaSlice className="text-4xl text-primary mr-2" />
              <span className="text-3xl font-bold gradient-text">PizzaExpress</span>
            </Link>
            <h2 className="text-2xl font-bold text-white mt-6">Welcome Back!</h2>
            <p className="text-gray-400">Sign in to continue to your account</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-gray-400 text-sm">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="btn-secondary flex items-center justify-center">
              <FaGoogle className="mr-2" /> Google
            </button>
            <button className="btn-secondary flex items-center justify-center">
              <FaFacebook className="mr-2" /> Facebook
            </button>
          </div>
          
          {/* Demo Login */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('user')}
                className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Demo User
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Demo Admin
              </button>
            </div>
          </div>
          
          {/* Sign Up Link */}
          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;