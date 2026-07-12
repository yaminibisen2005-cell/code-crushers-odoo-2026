import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Route, Package, Fuel, Shield, Navigation, BarChart3 } from 'lucide-react';

// Animation variants
const logoVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const glowVariants = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const loadingBarVariants = {
  initial: { width: "0%" },
  animate: { 
    width: "100%",
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

const textVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const floatingIconVariants = {
  animate: (delay) => ({
    y: [0, -20, 0],
    opacity: [0.05, 0.1, 0.05],
    transition: {
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }
  })
};

const loadingMessages = [
  "Initializing Fleet Platform...",
  "Connecting Transport Services...",
  "Loading Dashboard...",
  "Optimizing Fleet Data...",
  "Preparing Smart Operations..."
];

const backgroundIcons = [
  { icon: Truck, position: "top-[10%] left-[10%]" },
  { icon: MapPin, position: "top-[20%] right-[15%]" },
  { icon: Route, position: "bottom-[15%] left-[20%]" },
  { icon: Package, position: "bottom-[25%] right-[10%]" },
  { icon: Fuel, position: "top-[40%] left-[5%]" },
  { icon: Shield, position: "top-[60%] right-[8%]" },
  { icon: Navigation, position: "bottom-[40%] left-[12%]" },
  { icon: BarChart3, position: "top-[30%] right-[25%]" }
];

export const AppLoader = ({ onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    // Auto-complete after 5 seconds
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071A2D] to-[#0A1F3D]" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating Background Icons */}
      {backgroundIcons.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            className={`absolute ${item.position}`}
            variants={floatingIconVariants}
            animate="animate"
            custom={index * 0.2}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        );
      })}

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 p-12 md:p-16 rounded-[32px] bg-white/6 backdrop-blur-[20px] border border-white/10 shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Logo Container with Glow */}
        <div className="relative flex flex-col items-center gap-8">
          {/* Glow Effect */}
          <motion.div
            variants={glowVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-[#0F6FFF]/30 via-[#27D7FF]/30 to-[#A8F542]/30 blur-3xl rounded-full"
            style={{ width: '200px', height: '200px' }}
          />

          {/* Logo */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            className="relative z-10"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="flex flex-col items-center gap-4"
            >
              <img 
                src="/assets/logo/vtrackora-logo.png" 
                alt="VTrackora" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
              
              {/* Branding Text */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                  VTrackora
                </span>
                <span className="text-xs md:text-sm text-white/60 font-semibold uppercase tracking-widest">
                  Track • Monitor • Deliver
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Loading Bar */}
          <div className="w-full max-w-[280px] h-1 bg-white/10 rounded-[999px] overflow-hidden">
            <motion.div
              variants={loadingBarVariants}
              initial="initial"
              animate="animate"
              className="h-full rounded-[999px]"
              style={{
                background: 'linear-gradient(90deg, #0F6FFF, #27D7FF, #A8F542)'
              }}
            />
          </div>

          {/* Loading Text */}
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessageIndex}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-sm md:text-base text-white/70 font-medium"
              >
                {loadingMessages[currentMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AppLoader;
