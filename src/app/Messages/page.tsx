"use client"

import { Message } from "@/Models/User";
import { MessageCard } from "@/components/MessageCard";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
        if(messages.length > 0) return
        
           else messages && setTimeout(()=> fetchMessages(), 100);
    }, [fetchMessages ,  messages]);
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
     <Card className="   mt-6  mx-28   justify-between  shadow-[0px_0px_80px_rgba(255,255,255,1)]  hover:shadow-[0px_0px_60px_rgba(56,189,248,1)]   ">
      <ul className=" flex flex-wrap justify-evenly dark ">
      {
      
      messages.map((message , index)=>
        (index < 10)?
      <>
       <li className="  w-fit rounded-lg items-center ">
         <MessageCard 
        key={message._id}
        message={message}
        onMessageDelete={handleDeleteMessage}
        /> 
       </li> 
       </>
       :<></>
    )
    }
     </ul>
   </Card>:
   <Card className=" p-4 gap-4 mx-auto w-fit mt-auto  shadow-[0px_0px_100px_rgba(255,255,255,1)]   hover:shadow-[0px_0px_100px_rgba(56,189,248,1)]  my-28 dark  ">
    <h1 className="text-center text-2xl hover:text-sky-600 hover:animate-bounce p-10">No Messages</h1>
   </Card>
}

   </>

  )
}

export default MessagesPage