"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    const { data: sessionData } = useSession();
    const [expireText, setExpireText] = useState('');

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

    useEffect( () => {
        if(new Date(session?.user.isVerifyExpire) < new Date()){
            
        }
    }, [session, router]);

    useMemo(() => {
        const checkVerifyExpire = () => {
            if (expireText.length > 0 && session?.user) {
                axios.get(`/api/verify/${btoa(btoa(session.user.username))}/${btoa(session.user.verifyCode)}`)
                    .then((res) => {
                        setExpireText(res.data.message);
                        toast.success(res.data.message);
                    })
                    .catch((err) => {
                        setExpireText(err.response.data.age);
                        toast.error(err.response.data.age);
                    });
            }
        };
        checkVerifyExpire();
    }, [expireText, session]);
    
    return (session || pathname.startsWith("/auth")) && <>{children}</>
}

export default Template;
