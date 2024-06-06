"use client"

import { Message } from "@/Models/User";
import { MessageCard } from "@/components/MessageCard";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
const MessagesPage = () => {
    const [user , setUser]= useState<User|null>()
    const { data: sessionData ,update} = useSession()
    useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState("");
    const fetchMessages = useCallback(
      async() => {
        const response = await axios.get(`api/get-messages`);
          response.data.success && setMessages(response.data.messages);
          !response.data.success && setError(response.data.message);
      },
      [],
    )
    useEffect(() => {
        if(messages.length > 0) return;
        messages && setTimeout(()=> fetchMessages(), 100);
    }, [fetchMessages , user,  messages]);
     const handleDeleteMessage = (id:string) => {
        setMessages(messages.filter((message)=> message._id !== id));
    }
    
    if(!user) return (
        <div>loading...</div>
    )
  return (
   <>
   {
     messages.length > 0 ?
     <Card className=" grid grid-cols-3 mt-20 p-4 gap-4 mx-10  dark">
      {
      messages.map((message , index)=>
           <MessageCard
        key={message._id}
        message={message}
        onMessageDelete={handleDeleteMessage}
        /> 
    )
    }
   </Card>:
   <Card className=" mt-20 p-4 gap-4 mx-10 w-fit  dark">
    <h1 className="text-center text-2xl text-white">No Messages</h1>
   </Card>
}
   </>
  )
}

export default MessagesPage