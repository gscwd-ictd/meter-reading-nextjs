"use client";

import { LoadingSplash } from "@mr/components/ui/LoadingSplash";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";

type NavigationSplashContextType = {
  showSplash: (text?: string, newPath?: string) => void;
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
  const initialSplashShownRef = useRef(false); // 👈 added to track reload

  const showSplash = useCallback(
    (msg?: string, newPath?: string) => {
      const currentPath = newPath ?? pathname;
      const previousPath = lastPathRef.current;
      const isSamePath = currentPath === previousPath;

      const duration = isSamePath ? 600 : 1000;

      setText(msg ?? "Loading...");
      setVisible(true);
      manualTriggerRef.current = true;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        manualTriggerRef.current = false;
      }, duration);

      lastPathRef.current = currentPath;
    },
    [pathname],
  );

  const hideSplash = useCallback(() => {
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    manualTriggerRef.current = false;
  }, []);

  // 👇 Trigger splash once on initial page load
  useEffect(() => {
    if (!initialSplashShownRef.current) {
      showSplash("Loading...", window.location.pathname);
      initialSplashShownRef.current = true;
    }
  }, [showSplash]);

  useEffect(() => {
    if (!manualTriggerRef.current) return;

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
