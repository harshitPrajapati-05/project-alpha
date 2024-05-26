"use client";
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { signIn, useSession } from "next-auth/react";
import { decode } from "string-encode-decode";


export const  VerifyButton = () => 
    {   
        const router = useRouter();
        const { data: session} = useSession();
        let decodedCode = (session?.user?.verifyCode!);
        return session ? <Button variant={"secondary"} onClick={() => router.replace(`/Verify/${session?.user?.username}/${decodedCode}`)}>Verify Now</Button>: <Button variant={"secondary"} onClick={() => signIn()}>Signin Now</Button>;
    }

