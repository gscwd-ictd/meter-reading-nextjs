"use client";
import { Tabs, TabsList, TabsTrigger } from "@mr/components/ui/Tabs";
import { ComputerIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs value={theme} onValueChange={setTheme}>
      <TabsList className="flex gap-0 rounded-full border bg-inherit p-0.5">
        <TabsTrigger value="system" className="h-full rounded-full">
          <ComputerIcon className="size-3" />
        </TabsTrigger>
        <TabsTrigger value="light" className="h-full rounded-full">
          <SunIcon className="size-3" />
        </TabsTrigger>
        <TabsTrigger value="dark" className="h-full rounded-full">
          <MoonIcon className="size-3" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
