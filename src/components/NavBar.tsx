"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowPathIcon, Bars4Icon, CheckBadgeIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";

export const NavBar = () => 
{
    const router = useRouter()
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { data: sessionData, update } = useSession();

  useMemo(() => {
    if (sessionData === null || sessionData === undefined) return;
    setSession(sessionData as Session);
  }, [sessionData]);

  useEffect(() => {
    console.log(session);
  }, [session]);

  useMemo(() => {
    if (session?.user.isVerified === true) {
      setTimeout(() => setIsVerifying(true), 200);
    } else if (session?.user.isVerified === false) {
      setTimeout(() => setIsVerifying(false), 6000);
    } else {
      setIsVerifying(false);
    }
  }, [session]);

  const handler = async () => {
    axios
      .post(`/api/accept-message`, { acceptMessage: session?.user?.isAcceptingMessage })
      .then(async (res) => {
        await update({ user: { isAcceptingMessage: !session?.user?.isAcceptingMessage } });
        toast.success(res.data.message);
      })
      .catch((err) => toast.error(err.response.data.message));
  };
  if( sessionData === null || sessionData === undefined || session === null || session ===undefined) return null ;
  return (
    <nav>
      <div className="fixed top-0 right-2 w-fit h-fit bg-black/55 text-white/90">
        <ul className="flex justify-evenly items-center space-x-3 p-1">
          <li>
            {session?.user?.profile_picture?.secure_url && (
              <CldImage
                alt={session.user?.profile_picture?.filename}
                src={session?.user?.profile_picture?.secure_url}
                height={50}
                priority={true}
                className="border border-white/70 rounded-xl"
                width={50}
              />
            )}
          </li>
          <li className="text-center flex flex-col items-center">
            {session?.user?.username ? (
              <>
                {session?.user?.username}
                {isVerifying ? (
                  session?.user?.isVerified ? (
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
            ) : (
              <h2>ErrorGuy</h2>
            )}
          </li>
          <li>
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Bars4Icon className="w-6 h-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-transparent/70 text-white/80 mt-8">
                  <DropdownMenuItem onClick={() => router.push(`/auth/Verify/${btoa(btoa(session.user.username))}/${btoa(session.user.verifyCode)}`|| `/verify`)}>Verify Account</DropdownMenuItem>
                  <DropdownMenuItem onClick={handler}>
                    Accepting Messages {session?.user?.isAcceptingMessage ? "✅" : "❌"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="text-sm w-18" onClick={() => signIn()}>Sign IN</Button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
