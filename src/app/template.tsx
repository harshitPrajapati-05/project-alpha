"use client"

import { AuroraBackground } from "@/components/ui/aurora-background";
import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const Template = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const lowerPathName = pathname.toLowerCase();
    const router = useRouter();
    const [user , setUser]= useState<User|null>()
    const { data: sessionData ,update} = useSession()
    useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);
    console.log(user?._id,user?.id)

    useEffect(() => {
        if (lowerPathName.includes('verify')) {
            const timeoutId = setTimeout(() => {
                if (user) {
                    router.replace(`/auth/Verify/${btoa(btoa(user?.username))}/${btoa(user?.verifyCode)}`);
                }
            }, 250);
            return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
        }
    }, [user, lowerPathName])
    useEffect(() => {
            if ((new Date(user?.verifyExpire!) < new Date())&& user?.isVerified ) 
                {

                        axios.get(`/api/verify/${btoa(btoa(user?.username))}/${btoa(user?.verifyCode)}`)
                        .then((res)=>{
                            if( res.data.success ==="warn" || res.data.success===true)
                                {
                                    toast.warning("Your account has been expired");
                                    setTimeout(()=> router.refresh(),250)
                                }
                        })
                        
                }
    },[ user , user?.isVerified]);

    return (user || pathname.startsWith("/auth") || pathname === "/" || pathname.startsWith(`/Send`)) ? <>{children}</> : null;
}

export default Template;
