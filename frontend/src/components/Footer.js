import React from 'react';
import { Link } from 'react-router-dom';
import { FaPizzaSlice, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-darker border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <FaPizzaSlice className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold gradient-text">PizzaExpress</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              The best pizza delivery service in town. Fresh ingredients, authentic recipes, and lightning-fast delivery to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/menu" className="text-gray-400 hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-primary transition-colors">Cart</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-primary transition-colors">My Account</Link></li>
              <li><Link to="/admin" className="text-gray-400 hover:text-primary transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <FaPhone className="mr-3 text-primary" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaEnvelope className="mr-3 text-primary" />
                <span>info@pizzaexpress.com</span>
              </li>
              <li className="flex items-start text-gray-400">
                <FaMapMarkerAlt className="mr-3 text-primary mt-1" />
                <span>123 Pizza Street, Food City, FC 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 PizzaExpress. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;