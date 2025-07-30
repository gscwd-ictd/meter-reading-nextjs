"use client";

import { FunctionComponent } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";

type LoadingSplashProps = {
  text?: string;
  show: boolean;
};

export const LoadingSplash: FunctionComponent<LoadingSplashProps> = ({ text = "Loading...", show }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 dark:bg-black/95"
    >
      <div className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-6 shadow-lg dark:bg-black">
        <LoadingSpinner className="text-primary size-20" />
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
