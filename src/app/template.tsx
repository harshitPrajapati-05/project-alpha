"use client"
import { UserModel } from "@/Models/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";
import { Session } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const Template = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const lowerPathName = pathname.toLowerCase();
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const { data: sessionData ,update} = useSession();

    useMemo(() => {
        if (sessionData === null || sessionData === undefined) return;
        setSession(sessionData as Session);
    }, [sessionData]);

    useEffect(() => {
        if (lowerPathName.includes('verify') || lowerPathName.startsWith('verify')) {
            setTimeout(() => {
                if (session?.user) {
                    router.replace(`/auth/Verify/${btoa(btoa(session.user.username))}/${btoa(session.user.verifyCode)}`);
                }
            }, 500);
        }
    }, [session, lowerPathName, router]);


   if(new Date(session?.user?.verifyExpire)< new Date()){
     (async()=>
        {
            await dbConnect();
            let verifyExpire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            let verifyCode= Math.floor(100000 + Math.random() * 900000).toString();
            const user = await UserModel.findOne({username:session?.user?.username,isVerified:true})
            user.verified = false ;
            user.verifyCode= verifyCode;
            user.verifyExpire = verifyExpire;
            user.save()
            .then(async()=>{
                await update({user:{isVerified:false,verifyExpire:verifyExpire,verifyCode:verifyCode}});
                toast.warning("Your Verification is Expired ");
            }).catch((err:any)=> toast.error("Internal Server Error"))
        }
        )()
   }
    
    return (session || pathname.startsWith("/auth")|| pathname.startsWith(`/`)) && <>{children}</>
}

export default Template;
