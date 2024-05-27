"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useSession, signIn } from 'next-auth/react';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';

const Page = () => {
  const { data: sessionData } = useSession();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (sessionData) {
      setSession(sessionData as Session);
    }
  }, [sessionData]);

  return (
    <Card className="w-full max-w-md mx-auto space-y-2  text-white/80 font-semibold text-center bg-transparent/80 my-14">
        <h1> Welcome To Project Alpha </h1>
        <p> this projects is from Error Guy</p>
      {session ?
      <>
      <h2>you Started the Journey With Alpha</h2>
      </>
      :
      <>
      <h2> YOU ARE ISN&apos;T SIGNIN</h2>
      <Button onClick={()=>signIn()}>sign in</Button>
      </>
      }
    </Card>
  );
}

export default Page;
