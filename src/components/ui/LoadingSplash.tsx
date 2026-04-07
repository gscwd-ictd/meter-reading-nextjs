"use client";

import { FunctionComponent, useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { Gauge } from "lucide-react";

type LoadingSplashProps = {
  text?: string;
  show: boolean;
  dialHeight?: number;
  duration?: number;
  onLoadingComplete?: () => void;
  backgroundOpacity?: number; // New prop for background opacity (0-1)
};

export const LoadingSplash: FunctionComponent<LoadingSplashProps> = ({
  text = "Loading...",
  show,
  dialHeight = 12,
  duration,
  onLoadingComplete,
  backgroundOpacity = 0.8, // Default opacity
}) => {
  const [counter, setCounter] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressRef = useRef(0);

  // All hooks must be called unconditionally at the top
  const progressSpring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });

  const counterSpring = useSpring(0, {
    stiffness: 60,
    damping: 25,
    mass: 0.3,
  });

  const opacitySpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  // All useTransform hooks must also be at the top level
  const needleRotation = useTransform(progressSpring, [0, 100], [0, 360]);
  const scale = useTransform(opacitySpring, [0, 1], [0.9, 1]);
  const y = useTransform(opacitySpring, [0, 1], [20, 0]);
  const progressPercentage = useTransform(progressSpring, (latest) => `${Math.round(latest)}%`);
  const progressBarWidth = useTransform(progressSpring, [0, 100], ["0%", "100%"]);
  const strokeDashoffset = useTransform(progressSpring, [0, 100], [100, 0]);

  // Smooth counter display
  useEffect(() => {
    const unsubscribe = counterSpring.on("change", (latest) => {
      setCounter(Math.floor(latest));
    });

    return () => unsubscribe();
  }, [counterSpring]);

  // Reset states when show becomes true
  useEffect(() => {
    if (show) {
      setCounter(0);
      setIsComplete(false);
      progressRef.current = 0;

      // Animate entrance
      animate(opacitySpring, 1, {
        duration: 0.4,
        ease: "easeOut",
      });

      progressSpring.set(0);
      counterSpring.set(0);
    }
  }, [show, opacitySpring, progressSpring, counterSpring]);

  // Handle loading progress
  useEffect(() => {
    if (!show || isComplete) return;

    let animationFrame: number;
    let startTime: number | null = null;

    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Calculate smooth progress based on time or duration
      const targetProgress = duration
        ? Math.min((elapsed / duration) * 100, 100)
        : Math.min(progressRef.current + 0.3, 100);

      progressRef.current = targetProgress;

      // Update springs
      progressSpring.set(targetProgress);
      counterSpring.set(Math.min(targetProgress * 10000, 999999));

      if (targetProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setIsComplete(true);
        // Smooth exit animation
        setTimeout(() => {
          animate(opacitySpring, 0, {
            duration: 0.5,
            ease: "easeInOut",
          }).then(() => {
            if (onLoadingComplete) {
              onLoadingComplete();
            }
          });
        }, 600);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [show, duration, isComplete, onLoadingComplete, progressSpring, counterSpring, opacitySpring]);

  // Early return must be after all hooks
  if (!show) return null;

  return (
    <motion.div
      style={{ opacity: opacitySpring }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Background with customizable opacity - only this div's opacity changes */}
      <div
        className="absolute inset-0 backdrop-blur-lg"
        style={{
          opacity: backgroundOpacity,
          backgroundColor: `rgb(255 255 255 / ${backgroundOpacity * 100}%)`,
        }}
      />

      <motion.div
        style={{ scale, y }}
        className="flex flex-col items-center gap-6 rounded-3xl bg-white/95 p-8 shadow-2xl ring-1 ring-gray-200/30 dark:bg-gray-800/95 dark:ring-gray-700/30"
      >
        {/* Water Meter */}
        <div className="relative inline-flex h-36 w-36 items-center justify-center">
          {/* Subtle background pulse */}
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-blue-500/10"
          />

          {/* Main dial */}
          <div className="border-primary/60 absolute size-36 rounded-full border-8 bg-white/70 backdrop-blur-sm dark:bg-gray-800/70" />
          <motion.div
            className="absolute size-32 rounded-full border-4 border-dashed border-gray-300/60 dark:border-gray-600/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />

          {/* Brand logo */}
          <motion.div
            className="absolute top-[28%] z-10 flex text-lg font-black"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [1, 0.9, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-blue-600">M</span>
            <span className="-ml-1 text-gray-600 italic dark:text-gray-400">X</span>
          </motion.div>

          {/* Center icon */}
          <motion.div
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Gauge className="z-10 h-5 w-5 text-blue-600" />
          </motion.div>

          {/* Smooth rotating needle */}
          <motion.div
            className="absolute bottom-[50%] z-10 w-1 origin-bottom rounded-full bg-gradient-to-t from-red-500 to-red-600 shadow-lg"
            style={{
              height: `${dialHeight * 4}px`,
              rotate: needleRotation,
            }}
          />

          {/* Counter display */}
          <motion.div
            className="absolute top-[62%] w-16 rounded-lg border border-gray-300 bg-white/95 px-1 py-0.5 text-center font-mono text-xs font-bold tracking-widest text-gray-800 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-700/95 dark:text-white"
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {counter.toString().padStart(6, "0")}
          </motion.div>

          {/* Smooth progress ring */}
          <div className="absolute inset-0">
            <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200/30 dark:text-gray-700/30"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="48"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="text-blue-500"
                pathLength={100}
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Branding */}
          <div className="text-2xl font-black">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Metra
            </span>
            <span className="text-gray-600 dark:text-gray-400">X</span>
          </div>

          {/* Tagline */}
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            <i>Measure Transactions</i>
          </div>

          {/* Loading text with smooth progress */}
          {text && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{text}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {/* <motion.span>{progressPercentage}</motion.span> */}
                <div className="h-1 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{
                      width: progressBarWidth,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
