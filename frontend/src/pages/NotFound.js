import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaPizzaSlice, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Large 404 Text */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FaPizzaSlice className="text-6xl md:text-8xl text-primary animate-spin-slow" />
            </div>
          </div>
          
          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Looks like this pizza got lost in the oven. The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/" className="btn-primary flex items-center">
              <FaHome className="mr-2" />
              Go Home
            </Link>
            <Link to="/menu" className="btn-secondary flex items-center">
              <FaPizzaSlice className="mr-2" />
              Browse Menu
            </Link>
          </motion.div>
          
          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <p className="text-gray-500 mb-4">Or go back to</p>
            <Link to="/menu" className="text-primary hover:underline inline-flex items-center">
              <FaArrowLeft className="mr-2" />
              Previous Page
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;