"use client";
import React from "react";
import animationData from "../public/animationData.json";
import Lottie, { useLottie } from "lottie-react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
export default function LoadingTable({ isLoading, children }) {
  // State to control animation completion
  const [isAnimationComplete, setIsAnimationComplete] = React.useState(false);

  // Reset animation state when loading state changes
  React.useEffect(() => {
    if (isLoading) {
      setIsAnimationComplete(false);
    }
  }, [isLoading]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <div className="flex justify-center items-center">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className=""
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
              className="w-20 h-20"
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
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main content */}
      <div className={isLoading ? "hidden" : "block"}>{children}</div>
    </div>
  );
}
