import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedOut,
  SignedIn,
  UserButton,
  SignIn,
} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tripper",
  description: "Making a trip little easier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Navbar */}
          <header className="sticky top-0 z-50 w-ful px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex">
                <a className="mr-6 flex items-center space-x-2" href="/">
                  <span className="font-bold">Tripper</span>
                </a>
              </div>
              <div className="flex flex-1 items-center justify-end space-x-2">
                <UserButton showName />
              </div>
            </div>
          </header>
          <SignedOut>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <SignIn routing="hash" />
            </div>
          </SignedOut>
          <SignedIn>
            {
              <div className="px-4">
                {children}
                <Toaster />
              </div>
            }
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
