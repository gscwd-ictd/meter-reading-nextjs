import { type Metadata } from "next";
import { type PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@mr/components/providers/ReactQueryProvider";
import { ThemeProvider } from "@mr/components/providers/ThemeProvider";
import { Toaster } from "@mr/components/ui/Sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetraX",
  description: "Meter Reading Application",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ReactQueryProvider>
          <Toaster richColors />
          {/* prettier-ignore */}
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
       
             {children}
        
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
