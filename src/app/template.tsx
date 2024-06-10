"use client"

import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {motion} from "framer-motion"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



const Template = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const lowerPathName = pathname.toLowerCase();
    const router = useRouter();
    const [user , setUser]= useState<User|null>()
    const { data: sessionData } = useSession()
    useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);
   

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
    interface UsersProps {
        numberOfUsers: number;
        success: boolean;
        users: [];
    }
    const [users, setUsers] = useState<UsersProps|null>(null);

    useEffect(() => {
      axios
        .get("/api/check")
        .then((res) => {
            res.data.success && setUsers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },[]);

    if(users?.numberOfUsers! > 10 )
        return (
           <Card className=" max-w-lg  mx-auto w-fit   border-red-500  mt-32 s text-red-500  shadow-[0px_0px_200px_rgba(239, 68, 68, 1)]">
            <CardHeader>
                <CardTitle><h1 className="text-center font-bold">
                <ExclamationTriangleIcon className="h-6 w-6" />
                    Too Many Users</h1></CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center font-semibold text-red-600">Please Currently Active Users Limit Exceeded </p>
            </CardContent>
           </Card>
    )
   

    
    
    

    return (user || pathname.startsWith("/auth") || pathname === "/" || pathname.startsWith(`/Send`)) ? <motion.div
    initial={{ y:-700 }}
    animate={{ y:0 , transition: { duration: 2 , ease:"easeInOut"} }}
    >{children}</motion.div> : 
     null ;
}

export default Template;
