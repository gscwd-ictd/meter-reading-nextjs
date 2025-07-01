import { type PropsWithChildren } from "react";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Sonner";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meter Reading",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <QueryClientProvider>
          <Toaster richColors position="top-right" />
          <main className="h-screen overflow-x-hidden">{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
