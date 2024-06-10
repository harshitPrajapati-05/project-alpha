"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowPathIcon, CheckBadgeIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import {  User } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { GearIcon, HomeIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
export const NavBar = () => {
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
    if(!user?.isVerified) toast.error("you have to Verify your Account first")
      else {
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
    }
    
  };

  const signOutHandler = async () => {
      axios.post(`/api/signout`)
      .then(res =>  setTimeout(() =>signOut({callbackUrl:"/"}), 200))
      .catch((err:any) => toast.error(err.response.data.message) )
  }
 


  return (
    <nav className="  w-full    md:w-full ">
        <ul className="flex  justify-between font-bold  items-center  px-3">
          <li className="">
           {user?  
           <HoverCard openDelay={10}  closeDelay={10}>
           <HoverCardTrigger asChild>
           <CldImage
            src={`${user?.profile_picture?.secure_url!}`}
            alt={user?.profile_picture?.filename!}
            width={60}
            height={60}
            crop={"fill"}
            priority={true}
            quality={100}
            radius={100}
            preserveTransformations
            border={{
              color: "white",
              width: 10,
              radius: 50,

            }} 
            className=" flex  mt-2  border-2 rounded-2xl"
            />
           </HoverCardTrigger>
           <HoverCardContent className="rounded-2xl text-[10px] dark p-4 text-wrap  h-fit w-fit text-white">
           <p className="flex ">Username::{user?.username}</p>
           <p> Email::{user?.email}</p>
           <p className={`${user?.isAcceptingMessages ? "text-green-500" : "text-red-500"}`}> { user?.isAcceptingMessages? "online" : "offline"}</p>
           </HoverCardContent>
           </HoverCard>
            :
            <Image
            src="/images.jpeg"
            alt="profile"
            width={60}
            height={60}
            priority={true}
            quality={100}
            className="rounded-2xl flex  items-center justify-center align-middle text-center   border-2"
            />
          }
            {user && <span className="fixed -mt-4 ml-11">
            {isVerifying ? (
                      user?.isVerified ? 
                      <CheckBadgeIcon className="w-5 h-5  stroke-white   font-semibold  flex text-green-500" />
                      : 
                      <ArrowPathIcon className="animate-spin w-5 h-5 stroke-white font-semibold flex text-sky-500" />

                    ) :<ExclamationCircleIcon className="w-5 h-5  stroke-white  font-semibold flex text-red-500" />
                    }
           </span>}
              
              

          </li>
          <li>
          <DropdownMenu   >
                  <DropdownMenuTrigger  asChild>
                    <GearIcon    className={`w-7 h-7  text-white  animate-spin flex  mb-4`} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="dark mt-auto  "  >
                     {user && <DropdownMenuItem asChild >
                        <Link href={`/auth/Verify/${btoa(btoa(user?.username))}/${btoa(user?.verifyCode)}` || `/verify`}>
                      Verify Account
                    </Link>
                    </DropdownMenuItem>}
                    {pathname==='/Send' &&  <DropdownMenuItem  asChild> 
                    <Link  href={`/`} className="flex justify-center"  > <HomeIcon className="font-bold"/></Link>
                    </DropdownMenuItem>}
                    {user && <DropdownMenuItem asChild>
                      <Link  href={`/Messages`}> Messages</Link>
                    </DropdownMenuItem>}
                    {user && <DropdownMenuItem onClick={handler}>
                      Accepting Messages {user?.isAcceptingMessages ? "✅" : "❌"}
                    </DropdownMenuItem>}
                    {!(pathname==='/Send') && <DropdownMenuItem asChild>
                      <Link  href={`/Send`}> Send Messages</Link>
                    </DropdownMenuItem>}
                    {!user && <DropdownMenuItem  className="flex justify-center" onClick={() => signIn()}>Sign In</DropdownMenuItem>}
                   {user && <DropdownMenuItem onClick={signOutHandler}>Sign Out</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
          </li>
        </ul>
    </nav>
  );
};
