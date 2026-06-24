import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Saudi Manpower Platform",
    template: "%s | Saudi Manpower Platform",
  },
  description: "Connect with verified manual workers and licensed contractors across Saudi Arabia. Fast, secure, and fully automated onboarding.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased flex flex-col`}>
        <AuthProvider>
          <div className="flex-1 flex flex-col relative w-full">
            {/* Global background decoration */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" aria-hidden="true" />
            
            {children}
          </div>
        </AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
