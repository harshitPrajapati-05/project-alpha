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
    const { data: sessionData, update } = useSession();
    const [expireText, setExpireText] = useState('');

    useEffect(() => {
        if (sessionData) {
            setSession(sessionData as Session);
        }
    }, [sessionData]);


    useEffect(() => {
        if (lowerPathName.includes('verify')) {
            const timeoutId = setTimeout(() => {
                if (session?.user) {
                    router.replace(`/auth/Verify/${btoa(btoa(session.user.username))}/${btoa(session.user.verifyCode)}`);
                }
            }, 500);
            return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
        }
    }, [session, lowerPathName, router]);

    useEffect(() => {
        const checkVerifyExpire = async () => {
            if ((new Date(session?.user?.verifyExpire) < new Date()) && expireText === '') {
                try {
                    const res = await axios.get(`/api/verify/${btoa(btoa(session?.user.username))}/${btoa(session?.user.verifyCode)}`);
                    setExpireText(res.data.message);
                    await update({ user: { isVerified: false } });
                    toast.success(res.data.message);
                } catch (err:any) {
                    setExpireText(err.response?.data?.message || "Error occurred");
                    if( err.response?.data?.message ==="User isn't signed in" || 
                        err.response?.data?.message === "User is Verification Expired" ||
                        err.response?.data?.message === "User is not verified" ||
                        err.response?.data?.message === "User is verified"
                    )
                    toast.error(err.response?.data?.message || "Error occurred");
                }
            }
        };
        checkVerifyExpire();
    }, [expireText,session]);

    return (session || pathname.startsWith("/auth") || pathname === "/") ? <>{children}</> : null;
}

export default Template;
