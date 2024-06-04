"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowPathIcon, Bars4Icon, CheckBadgeIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Session, User } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(false);
  const [user , setUser]= useState<User|null>()
    const { data: sessionData ,update} = useSession()
    useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);
  useEffect(() => {
    if (user) {
      if (user?.isVerified) {
         setTimeout(()=>setIsVerifying(true),200);
      } else {
        setTimeout(() => setIsVerifying(false), 6000);
      }
    }
  }, [user ,user?.isVerified]);

  const handler = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`/api/accept-message`, {
        acceptMessage: !user?.isAcceptingMessages,
      });
       update({ user: { isAcceptingMessage: !user?.isAcceptingMessages } }).then(()=>
        toast.success(res.data.message)
      )
    } catch (err:any) {
      toast.error(err.response.data.message);
    }
  };

  if (!sessionData || !user) return null;

  return (
    <nav>
      <div className="fixed top-0 right-2 w-fit h-min  bg-black/55 text-white/90">
        <ul className="flex justify-evenly items-center space-x-3">
          {user ? (
            <>
              <li>
                {user?.profile_picture?.secure_url && (
                  <CldImage
                    alt={user?.profile_picture.filename}
                    src={user?.profile_picture.secure_url}
                    height={50}
                    priority
                    className="border border-white/70 rounded-xl"
                    width={50}
                  />
                )}
              </li>
              <li className="text-center flex flex-col items-center">
                {user?.username && (
                  <>
                    {user?.username}
                    {isVerifying ? (
                      user?.isVerified ? (
                        <p className="text-[9px] font-bold flex text-green-500">
                          Verified
                          <CheckBadgeIcon className="w-4 h-4" />
                        </p>
                      ) : (
                        <p className="text-[9px] font-bold flex text-sky-500">
                          Verifying
                          <ArrowPathIcon className="animate-spin w-4 h-4" />
                        </p>
                      )
                    ) : (
                      <p className="text-[9px] font-bold flex text-red-500">
                        Not Verified
                        <ExclamationCircleIcon className="w-4 h-4" />
                      </p>
                    )}
                  </>
                )}
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Bars4Icon className="w-6 h-6" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-transparent/70 text-white/80 mt-8">
                    <DropdownMenuItem asChild >
                        <Link href={`/auth/Verify/${btoa(btoa(user?.username))}/${btoa(user?.verifyCode)}` || `/verify`}>
                      Verify Account
                    </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link  href={`/Messages`}> Messages</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handler}>
                      Accepting Messages {user?.isAcceptingMessages ? "✅" : "❌"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link  href={`/Send`}> Send Messages</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          ) : (
            <>
              <li>
                <h2>Error Guy</h2>
              </li>
              <li>
                <Button onClick={() => signIn()}>Sign In</Button>
              </li>
            </> 
          )}
        </ul>
      </div>
    </nav>
  );
};
