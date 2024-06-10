
import type { Metadata } from "next";
import {  Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider  from "@/context/AuthProvider";
import { NavBar } from "@/components/NavBar";
import { WavyBackground } from "@/components/ui/wavy-background";
import React from "react";


const inter = Roboto_Mono({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Project Alpha",
  description: "Messengers by Errors",
};



export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;


}>) {

 


  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <AuthProvider> 
        <WavyBackground colors={['#dc5f5', '#f7aef8', '#b388eb', '#8093f1', '#72ddf7']}>
        <NavBar/>
        {children}
        </WavyBackground>
        <Toaster richColors={true}
         />
        </AuthProvider>
      </body>
    </html>
  );
}
