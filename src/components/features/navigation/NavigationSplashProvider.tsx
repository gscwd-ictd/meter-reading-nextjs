"use client";

import { LoadingSplash } from "@mr/components/ui/LoadingSplash";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";

type NavigationSplashContextType = {
  showSplash: (text?: string) => void;
  hideSplash: () => void;
};

const NavigationSplashContext = createContext<NavigationSplashContextType | undefined>(undefined);

export const useNavigationSplash = () => {
  const context = useContext(NavigationSplashContext);
  if (!context) throw new Error("useNavigationSplash must be used within NavigationSplashProvider");
  return context;
};

export const NavigationSplashProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("Loading...");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPathRef = useRef<string | null>(null);

  const manualTriggerRef = useRef(false);

  const showSplash = useCallback(
    (msg?: string) => {
      const currentPath = pathname;
      const previousPath = lastPathRef.current;
      const isSamePath = currentPath === previousPath;

      const duration = isSamePath ? 300 : 1200;

      setText(msg ?? "Loading...");
      setVisible(true);
      manualTriggerRef.current = true;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        manualTriggerRef.current = false;
      }, duration);

      // IMPORTANT: update the last path *now*
      lastPathRef.current = currentPath;
    },
    [pathname],
  );

  const hideSplash = useCallback(() => {
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    manualTriggerRef.current = false;
  }, []);

  useEffect(() => {
    if (!manualTriggerRef.current) return;

    // only hide splash if route actually changed or fallback triggered
    if (lastPathRef.current !== pathname) {
      hideSplash();
    }

    lastPathRef.current = pathname;
  }, [pathname, hideSplash]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <NavigationSplashContext.Provider value={{ showSplash, hideSplash }}>
      {children}
      <LoadingSplash show={visible} text={text} />
    </NavigationSplashContext.Provider>
  );
};
