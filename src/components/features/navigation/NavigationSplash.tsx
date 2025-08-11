"use client";

import { LoadingSplash } from "@mr/components/ui/LoadingSplash";
import { useNavigationSplash } from "./NavigationSplashProvider";

export const NavigationSplash = () => {
  const { visible, text } = useNavigationSplash();
  return <LoadingSplash show={visible} text={text} />;
};
