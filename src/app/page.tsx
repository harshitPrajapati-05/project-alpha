"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useSession, signIn } from 'next-auth/react';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { User } from 'next-auth';
import { MessageCard } from '@/components/MessageCard';
import { LinkPreview } from '@/components/ui/link-preview';

const Page = () => {
  const [user , setUser]= useState<User|null>()
  const { data: sessionData ,update} = useSession()
  useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);
  
  if(!user) return (
    <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-28  mt-28">
       You Might Need to  
        <LinkPreview url="https://project-alpha-vert.vercel.app/auth/Signin?callbackUrl=https%3A%2F%2Fproject-alpha-vert.vercel.app%2F" quality={100} width={225}  height={150} className="font-bold border-transparent">
          Tailwind CSS
        </LinkPreview>{" "}
    </p>
    
  )
  return null ;
}


export default Page;
