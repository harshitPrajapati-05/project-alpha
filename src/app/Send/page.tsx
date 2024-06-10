"use client"
import { sendMessage } from "@/Schmea/sendMessage";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from 'react';
import { useDebounceCallback } from "usehooks-ts";
import { useSession } from "next-auth/react";
import {  User } from "next-auth";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import uniqid from 'uniqid'
import axios from "axios";
import { toast } from "sonner";
import {username as Username} from "@/Schmea/SignUp"
import {  PaperPlaneIcon } from "@radix-ui/react-icons";


type MessageType = z.infer<typeof sendMessage>
const SendMessage = () => 
  {
  const [user , setUser]= useState<User|null>();
  const { data: sessionData ,update} = useSession();
  useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);
  const [username, setUsername] = useState("");
  const [messageState,setMessageState]=useState<MessageType>({
    content:"",
    createdAt:new Date(),
    username:'',
    sender:"",
  })
  const delayer = useDebounceCallback(setMessageState, 100);
  const delayerName = useDebounceCallback(setUsername, 1000);
  const handler =()=>
    {
      messageState.sender = user ? user?.username : uniqid('ErrorGuy-')
      messageState.createdAt= new Date();

     if( messageState && messageState.content && messageState.username )
      {
         axios.post(`/api/send-message`,messageState)
         .then((res)=>
          {
            toast.success(res.data.message)
            setMessageState(prev=>({...prev, content:""}))
          })
          .catch((err:any)=>
          {
            toast.error(err.response?.data.message)
          })
          .finally(()=> setMessageState(prev=>({...prev,content:""})))}

    }
      useEffect(()=>
        {
          if(username === user?.username) toast.warning("You can't send message to yourself")
            else{
            if(Username.safeParse(username).success){
              username && axios.get(`/api/check-username?username=${username}`)
              .then((res)=> toast.error(`User is'nt Exists`))
              .catch((err:any)=> {
                err.status===400 ? toast.error(`${err.response.data.message}`) : toast.success(`User is Found`);
              } ) 
            }  else toast.error(`${Username.safeParse(username).error?.format()._errors}`,)
          }
        }
      ,[username])
  
  return (
    <>
    
    <Card className={`  mt-5 py-1 gap-1 mx-10  shadow-[0px_0px_60px_rgba(255,255,255,1)]   hover:shadow-[0px_0px_60px_rgba(56,189,248,1)]  `} >
      <CardHeader className="flex items-center  py-2  justify-between px-5 flex-row">

      <h4  className=" font-bold flex gap-1 items-center">Send Message To
      <Input className="w-fit text-base "   onChange={(e)=>{ 
       ( e.target.value.trim().length > 0 )&& delayerName(e.target.value.trim());
        e.target.value.trim().length > 0 &&  delayer(prev=>({...prev,username:e.target.value.trim()})
      );
      }}/>
      </h4>
      </CardHeader>
      <CardContent className=" flex flex-col h-min py-1  ">

                <Editor
                  apiKey={`${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}`}
                  inline={false}
                  id="editor1"
                  
                  onEditorChange={(res) =>{

                    res && setMessageState(prev=>({...prev,content:res}))
                    
                  }}
                  init={{
                    height: 350, 
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                  }}
                  initialValue=" Welcome to Project Alpha"
                />
                
      </CardContent>
      <CardFooter className="flex items-center pb-2 pt-1  justify-end">
      <Button type="button" className="" name="Signup" onClick={handler}><PaperPlaneIcon  className="w-16"/></Button>
      </CardFooter>
    </Card> 
    </>         
  );
};

export default SendMessage;
