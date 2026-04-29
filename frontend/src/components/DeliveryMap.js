import React from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaHome, FaMotorcycle } from 'react-icons/fa';

const DeliveryMap = ({ status }) => {
  // Map progress based on status
  const statusProgress = {
    'received': 0,
    'confirmed': 10,
    'preparing': 25,
    'baking': 40,
    'qualityCheck': 60,
    'outForDelivery': 85,
    'delivered': 100
  };

  const progress = statusProgress[status] || 0;

  return (
    <div className="card mb-8 overflow-hidden bg-slate-900 border-gray-700">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
        Live Delivery Map
      </h3>
      
      <div className="relative h-48 bg-[url('https://carto.com/help/images/getting-started/basemaps.png')] bg-cover bg-center rounded-xl border border-gray-800">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        
        {/* Path Line */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 50 150 Q 200 50 350 150 T 700 100"
            fill="transparent"
            stroke="#374151"
            strokeWidth="4"
            strokeDasharray="8 8"
            className="w-full h-full"
          />
          <motion.path
            d="M 50 150 Q 200 50 350 150 T 700 100"
            fill="transparent"
            stroke="#e11d28"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>

        {/* Icons */}
        <div className="absolute left-8 bottom-8 text-primary flex flex-col items-center">
          <FaStore className="text-3xl" />
          <span className="text-[10px] font-bold bg-black/80 px-1 rounded mt-1">KITCHEN</span>
        </div>

        <div className="absolute right-8 top-12 text-green-500 flex flex-col items-center">
          <FaHome className="text-3xl" />
          <span className="text-[10px] font-bold bg-black/80 px-1 rounded mt-1">YOU</span>
        </div>

        {/* Moving Delivery Bike */}
        {progress > 0 && progress < 100 && (
          <motion.div
            style={{ offsetPath: "path('M 50 150 Q 200 50 350 150 T 700 100')" }}
            animate={{ offsetDistance: `${progress}%` }}
            transition={{ duration: 2, ease: "linear" }}
            className="absolute text-white bg-primary p-2 rounded-full shadow-2xl shadow-primary/50"
          >
            <FaMotorcycle className="text-xl" />
          </motion.div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
        <span>0.0 KM</span>
        <span>{status === 'outForDelivery' ? 'Approx. 1.2 KM away' : 'Awaiting Dispatch'}</span>
        <span>2.4 KM</span>
      </div>
    </div>
  );
};

export default DeliveryMap;