import React from 'react';
import { motion } from 'framer-motion';
import { FaPizzaSlice, FaFire, FaBox, FaMotorcycle } from 'react-icons/fa';
import { GiRollingDough, GiManualMeatGrinder } from 'react-icons/gi';

const PizzaPrepAnimation = ({ status }) => {
  const steps = [
    { id: 'received', icon: GiRollingDough, label: 'Kneading Dough', color: 'text-yellow-600' },
    { id: 'preparing', icon: GiManualMeatGrinder, label: 'Adding Toppings', color: 'text-red-500' },
    { id: 'baking', icon: FaFire, label: 'In the Oven', color: 'text-orange-500' },
    { id: 'qualityCheck', icon: FaBox, label: 'Packaging', color: 'text-blue-500' },
    { id: 'outForDelivery', icon: FaMotorcycle, label: 'On its Way', color: 'text-green-500' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-800/50 rounded-3xl mb-8 overflow-hidden">
      <div className="relative flex items-center justify-between w-full max-w-2xl px-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="relative flex flex-col items-center z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isActive ? '#e11d28' : '#374151',
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 shadow-lg ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}
              >
                <Icon className={`text-xl ${isCurrent ? 'animate-bounce' : ''}`} />
              </motion.div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {step.label}
              </span>

              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-12 w-full h-[2px] bg-gray-700 -z-10">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: isActive && index < currentStepIndex ? '100%' : '0%' }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {status === 'preparing' && (
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-6 text-primary text-sm font-medium"
        >
          Our chefs are hand-crafting your masterpiece...
        </motion.p>
      )}
    </div>
  );
};

export default PizzaPrepAnimation;