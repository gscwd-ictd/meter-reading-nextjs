"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type SplashContextType = {
  showSplash: (text?: string) => void;
  hideSplash: () => void;
  visible: boolean;
  text: string;
};

const NavigationSplashContext = createContext<SplashContextType>({
  showSplash: () => {},
  hideSplash: () => {},
  visible: false,
  text: "Loading...",
});

export const useNavigationSplash = () => {
  return useContext(NavigationSplashContext);
};

export const NavigationSplashProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("Loading...");
  const timeoutRef = useRef<number | undefined>(0);

  const showSplash = (msg?: string) => {
    // console.log("Showing splash:", msg);
    setText(msg || "Loading...");
    setVisible(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Safety timeout - always hide after 1.5 seconds
    timeoutRef.current = window.setTimeout(() => {
      // console.log("Safety timeout - hiding splash");
      setVisible(false);
    }, 1500);
  };

  const hideSplash = () => {
    // console.log("Hiding splash manually");
    setVisible(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  // Debug: log when pathname changes
  // useEffect(() => {
  //   console.log("Pathname changed to:", pathname);
  // }, [pathname]);

  // Hide splash automatically when route changes
  useEffect(() => {
    // console.log("Route change detected, hiding splash");
    hideSplash();
  }, [pathname]);

  // Show splash on initial load only
  useEffect(() => {
    // console.log("Initial load - showing splash");
    showSplash("Loading...");
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <NavigationSplashContext.Provider value={{ showSplash, hideSplash, visible, text }}>
      {children}
    </NavigationSplashContext.Provider>
  );
};
