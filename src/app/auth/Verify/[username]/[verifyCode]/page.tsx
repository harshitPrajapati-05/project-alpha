"use client"   ;

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from '@/components/ui/text-reveal-card';
import { Session } from 'next-auth';


const Verify = () => {
    const {username, verifyCode} = useParams();
    const router = useRouter();
    const [session , setSession]= useState<Session|null>()
    const { data: sessionData ,update} = useSession()
    useMemo(()=> {if( sessionData === null || sessionData === undefined) return null;
      setSession(sessionData as Session) },[sessionData]);

     
    const verifyAccount = async () => { 
         axios.post(`/api/verify/${username}/${verifyCode}`)
         .then( async (res) => {
          if(res.data.success){
             update({user:{isVerified:true}}).then(()=>{toast.success("Account Verified")
            router.refresh();
             }
             )};
         })
         .catch((err) => {
            console.log(err)
            toast.error(err.response.data.message)
         })
           
    }
  
  return (
    <>
    <Card className='w-full max-w-md mx-auto my-5 dark bg-transparent/80 '>
        <CardHeader className='text-center font-bold'>
            <h1>Verify Your Account</h1>
        </CardHeader>
        <CardContent>
            {
              session?.user?.isVerified ? 
              <>
               <TextRevealCard className='w-full text-center  text-sm max-w-md mx-auto my-5 dark bg-transparent/80 '
        text="Verify Code"
        revealText={`${atob(session?.user?.verifyCode)}`}
      >
        <TextRevealCardTitle>
          Sometimes, you just need to see it.
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          it Might help to verify yourself on other platforms
        </TextRevealCardDescription>
      </TextRevealCard>
      <h3>You will unVerified on ::{ new Date(session.user.verifyExpire).toDateString()}</h3>
              </>:
              <Button onClick={verifyAccount} className='w-full'>Verify Account</Button>
            }
        </CardContent>
    </Card>
    </>
  )
}

export default Verify