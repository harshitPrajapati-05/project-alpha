"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { LinkPreview } from '@/components/ui/link-preview';
import { motion } from 'framer-motion';
const Page = () => {
  const [user , setUser]= useState<User|null>()
  const { data: sessionData } = useSession()
  useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);
  
  if(!user) return (
    < motion.div 
    initial={{ y:-500 }}
    animate={{ y: 0  , }}
    className="sm:my-28  h-[20rem]    text-center    ">
    <p className=" text-5xl py-8  text-sky-700/70    ">
       You Might Need to 
        <LinkPreview url="https://project-alpha-vert.vercel.app/auth/Signin?callbackUrl=https%3A%2F%2Fproject-alpha-vert.vercel.app%2F" quality={100} width={225}  height={150} className="font-bold px-2   text-white/80 ">
           SignIn
        </LinkPreview>{" "}
    </p>
    <p className='  -mt-4 text-xl text-sky-600 font-medium '>
       U can only 
        <LinkPreview url="https://project-alpha-vert.vercel.app/Send" quality={100} width={225}  height={150} className="font-bold px-2 text-white/80 ">
        SendMessages
        </LinkPreview>{""}
      Without being Signed In
    </p>
    <p className=' mt-20 text-sky-700 font-semibold'>
      Made By Using 
        <LinkPreview url="https://authjs.dev/" quality={100} width={225}  height={150} className="font-bold px-2 text-white/80 ">
        AuthJs
        </LinkPreview>
        🔹
        <LinkPreview url="https://ui.aceternity.com/" quality={100} width={225}  height={150} className="font-bold px-2 text-white/80 ">
        Aceternity
        </LinkPreview>
        🔹
        <LinkPreview url="https://ui.shadcn.com/" quality={100} width={225}  height={150} className="font-bold px-2 text-white/80 ">
        ShadCn   
        </LinkPreview>
    </p>
    <p className='text-sky-700 font-semibold'>
          Guided By 
          <LinkPreview url="https://www.youtube.com/@chaiaurcode" quality={100} width={225}  height={150} className="font-bold px-2  text-white/80 ">
          Chai Aur Code 
          </LinkPreview>
        </p>
    </motion.div>
  )
  
  return (
    < motion.div 
    initial={{ y:-500 }}
    animate={{ y: 0  , }}
    className="sm:my-28  h-[20rem]    text-center    ">
      <p className=" text-5xl py-8  text-sky-600   ">
        HELLO to PROJECT ALPHA
      </p>
      <p className=' mt-20 text-sky-700 font-semibold'>
      Made By Using 
        <LinkPreview url="https://authjs.dev/" quality={100} width={225}  height={150} className="font-bold px-2 text-white/80 ">
        AuthJs
        </LinkPreview>
        🔹
        <LinkPreview url="https://ui.aceternity.com/" quality={100} width={225}  height={150} className="font-bold px-2 text-white/80 ">
        Aceternity
        </LinkPreview>
        🔹
        <LinkPreview url="https://ui.shadcn.com/" quality={100} width={225}  height={150} className="font-bold px-2 text-white/80 ">
        ShadCn   
        </LinkPreview>
    </p>
    <p className='text-sky-700 font-semibold'>
          Guided By 
          <LinkPreview url="https://www.youtube.com/@chaiaurcode" quality={100} width={225}  height={150} className="font-bold px-2  text-white/80 ">
          Chai Aur Code 
          </LinkPreview>
        </p>

    </motion.div>
  ) ;
}


export default Page;
