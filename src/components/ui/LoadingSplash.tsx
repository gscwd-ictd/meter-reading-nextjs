"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CircleGauge } from "lucide-react";

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
      className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 dark:bg-black/95"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 dark:bg-black">
        <div className="relative inline-flex h-40 w-40 items-center justify-center">
          {/* Static dashed circle */}
          <div className="absolute size-40 rounded-full border-[6px] border-dashed border-gray-400" />

          {/* Lucide icon in the center */}
          <CircleGauge className="h-12 w-12 text-blue-600" />

          {/* Rotating needle */}
          <div className="absolute bottom-[50%] z-[1] h-16 w-1 origin-bottom animate-spin rounded-full bg-red-500" />

          {/* Counter rectangle under the needle */}
          <div className="absolute top-[65%] w-20 rounded bg-black p-0.5 text-center font-mono text-sm tracking-widest text-white shadow-md">
            {counter.toString().padStart(6, "0")}
          </div>
        </div>

        {/* Branding & optional text */}
        <div className="text-center">
          <div className="text-primary text-xl font-black">
            Metra<span className="text-slate-500">X</span>
          </div>
          <div className="text-xs font-bold text-gray-500">
            <i>Measure Transactions</i>
          </div>
          {text && <div className="mt-2 text-sm text-gray-600">{text}</div>}
        </div>
      </div>
    </motion.div>
  );
};
