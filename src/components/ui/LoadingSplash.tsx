"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";

type LoadingSplashProps = {
  text?: string;
  show: boolean;
};

export const LoadingSplash: FunctionComponent<LoadingSplashProps> = ({ text = "Loading...", show }) => {
  const [counter, setCounter] = useState(0);

  // Reset counter every time 'show' becomes true
  useEffect(() => {
    if (show) {
      setCounter(0);
    }
  }, [show]);

  // Increment counter while loading
  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setCounter((prev) => (prev < 999999 ? prev + Math.floor(Math.random() * 40 + 5) : prev));
    }, 50);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-white/30 backdrop-blur-xs"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl p-8">
        <div className="relative inline-flex h-32 w-32 items-center justify-center">
          {/* Static dashed circle */}
          <div className="border-primary absolute size-32 rounded-full border-[6px]" />
          <div className="absolute size-28 rounded-full border-[4px] border-dashed border-gray-400" />

          <div className="absolute top-[30%] z-10 flex text-base font-black">
            <span className="text-primary">M</span>
            <span className="-ml-1 text-gray-500 italic dark:text-gray-300">X</span>
          </div>

          {/* Lucide icon in the center */}
          <Circle className="z-10 h-4 w-4 text-blue-600" />

          {/* Rotating needle */}
          <div className="absolute bottom-[50%] z-10 h-12 w-0.75 origin-bottom animate-spin rounded-full bg-red-500" />

          {/* Counter rectangle under the needle */}
          <div className="absolute top-[60%] w-14 rounded border border-gray-200 p-0 text-center font-mono text-[0.65rem] tracking-widest text-black shadow-md dark:border-black dark:bg-black dark:text-white">
            {counter.toString().padStart(6, "0")}
          </div>
        </div>

        {/* Branding & optional text */}
        <div className="text-center">
          <div className="text-primary text-xl font-black dark:text-blue-700">
            Metra<span className="text-slate-500 dark:text-slate-700">X</span>
          </div>
          <div className="text-xs font-bold text-gray-500 dark:text-gray-700">
            <i>Measure Transactions</i>
          </div>
          {text && <div className="mt-2 text-sm text-gray-600 dark:text-gray-800">{text}</div>}
        </div>
      </div>
    </motion.div>
  );
};
