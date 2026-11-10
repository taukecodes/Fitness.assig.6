import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Component/Navbar";
import { FitProvider } from "@/context/FitContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description: "A dark, no-nonsense gym companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-white min-h-screen flex flex-col`}
      >
        <FitProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 2500,
              style: {
                background: "#181818",
                color: "#ffffff",
                border: "1px solid #a3e635",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: "bold",
              },
              success: {
                iconTheme: {
                  primary: "#a3e635",
                  secondary: "#121212",
                },
              },
            }}
          />

          <Navbar />
          <main className="flex-grow">{children}</main>
        </FitProvider>
      </body>
    </html>
  );
}
