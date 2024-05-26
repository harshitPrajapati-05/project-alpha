import type { Metadata } from "next";
import {  Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider  from "@/context/AuthProvider";
import { NavBar } from "@/components/NavBar";
const inter = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        <AuthProvider>
        <NavBar/>
        {children}
        <Toaster richColors={true} />
        </AuthProvider>
      </body>
    </html>
  );
}
