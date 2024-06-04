"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { AlertDialog,AlertDialogAction,AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,} from '@/components/ui/alert-dialog'
import { Button } from "./ui/button"
import { CrumpledPaperIcon } from "@radix-ui/react-icons"
import { User } from "next-auth"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Message } from "@/Models/User"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import parse from "html-react-parser"

type NewType = {
    message: Message
    onMessageDelete: (messageId: string) => void
}

type MessageCardProps =NewType
export const MessageCard =({message,onMessageDelete}:MessageCardProps)=>
    {
    const parser = new DOMParser();
    const [user , setUser]= useState<User|null>()
    const { data: sessionData ,update} = useSession()
    useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(
              `/api/delete-message/${message._id}`
            );
            toast.success(response.data.message)
            onMessageDelete(message._id);
          } catch (error:any) {
            toast.error(error.response?.data.message)
          } 
        };

        
        if(!user) return <></>
        return (
                <Card className="w-full max-w-md  flex flex-col  justify-between  dark bg-slate-800/60">
                <CardHeader className="flex-row py-2 px-1 justify-end">
                <AlertDialog  >
                    <AlertDialogTrigger asChild>
                        <Button className="" variant="destructive"><CrumpledPaperIcon/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this message for forever .
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </CardHeader>
                <CardContent>
                    <p className="">{parse(message.content)}</p>
                </CardContent>
                <CardFooter className="">
                    <p className="text-xs text-gray-700 dark:text-gray-100">{new Date(message.createdAt).toDateString()}</p>
                </CardFooter>
            </Card>
        )
    }