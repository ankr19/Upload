"use client";

import animationData from "../public/animationData.json";
import React, { useState, useEffect } from "react";
import Lottie, { useLottie } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";

const Loading = ({ isLoading, children }) => {
  // State to control animation completion
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Reset animation state when loading state changes
  useEffect(() => {
    if (isLoading) {
      setIsAnimationComplete(false);
    }
  }, [isLoading]);

  // Default options for Lottie animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/25 dark:bg-gray-900 flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.5,
                delay: 0.2,
              },
            }}
          >
            <motion.div
              className="w-64 h-64"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.5 },
              }}
              exit={{
                scale: 1.2,
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              {View} 
            </motion.div>
            <motion.p
              className="absolute text-white font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.3, duration: 0.5 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              Loading your content...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={isLoading ? "hidden" : "block"}>{children}</div>
    </>
  );
};
export default Loading;
