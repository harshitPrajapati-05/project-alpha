"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import{ useDebounceCallback} from "usehooks-ts"

const Template = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const lowerPathName = pathname.toLowerCase();
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const delay = useDebounceCallback(setSession, 2000)
    const { data: sessionData, update } = useSession();

    useEffect(() => {
        if (sessionData) {
            delay(sessionData as Session);
        }
    }, [sessionData]);


    useEffect(() => {
        if (lowerPathName.includes('verify')) {
            const timeoutId = setTimeout(() => {
                if (session?.user) {
                    router.replace(`/auth/Verify/${btoa(btoa(session.user.username))}/${btoa(session.user.verifyCode)}`);
                }
            }, 250);
            return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
        }
    }, [session, lowerPathName, router]);
    console.log(session?.user?.verifyCode , btoa(session?.user?.verifyCode), )
    useEffect(() => {
            if ((new Date(session?.user?.verifyExpire) < new Date())&& session?.user.isVerified ) 
                {

                        axios.get(`/api/verify/${btoa(btoa(session?.user.username))}/${btoa(session?.user.verifyCode)}`)
                        .then((res)=>{
                            if( res.data.success ==="warn" || res.data.success===true)
                                {
                                    toast.warning("Your account has been expired");
                                    setTimeout(()=> router.refresh(),250)
                                }
                        })
                        
                }
    },[ session , session?.user.isVerified]);

    return (session || pathname.startsWith("/auth") || pathname === "/") ? <>{children}</> : null;
}

export default Template;
