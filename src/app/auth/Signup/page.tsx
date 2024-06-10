'use client'
import { SignUpSchema } from '@/Schmea/SignUp'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import axios from 'axios'
import { useDebounceCallback } from 'usehooks-ts'
import {Card,CardContent,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {toast} from "sonner"
import { CrossCircledIcon, EyeClosedIcon, EyeOpenIcon, PlusCircledIcon} from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'


const AuthPage = () =>
  {
    type  User = z.infer<typeof SignUpSchema>
    const [username, setUsername] = React.useState("")
    const router = useRouter();
    const [user , setUser]= useState<User|null>()
    const { data: sessionData } = useSession()
    useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);

    const delayedUsernaming = useDebounceCallback(setUsername, 1500)
    const form = useForm<z.infer<typeof SignUpSchema>>(
      {
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
          username: "",
          password: "",
          email: "",
          profile_picture: {
            secure_url: "",
            public_id: "",
          },
        },
      }
    )
    const [image , setImage] = React.useState({
      secure_url: "",
      public_id: "",
      file_name: "",
    })
    const delayingImage = useDebounceCallback(setImage, 600)
    useEffect(() => {
      if(username)
        {
          const promise = new Promise((resolve, reject) => {
             axios.get(`/api/check-username?username=${username}`)
             .then(res =>  res.data.success && resolve(res.data.message))
             .catch((err) => reject(err.response?.data.message))
          })
          toast.promise(promise, {
            loading:"Checking...", 
            success: (data) => ` ${data}`,
            error: (err) => ` ${err}`,
          })
        }
    }, [username])
    const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
       axios.post(`/api/signup`, values).then(res => {
         if(res.data.success)
          {
            signIn("credentials", {
              identifier: `${values?.username || values?.email}`,
              password: values?.password,
              redirect: false,
            }).then(() =>{
             toast.success(res.data.message)
             setTimeout(() => router.replace("/"), 200)}
           ).catch((err) => console.log(err))
          }
      })
       .catch(err =>toast.error(err.response?.data.message))
    }

    if(user) router.push(`/`);
    const[show , setShow] = useState(false)

    return (
      <Card  className="w-1/2   mx-auto  shadow-[0px_0px_100px_rgba(255,255,255,1)]   hover:shadow-[0px_0px_100px_rgba(56,189,248,1)]   mt-4 px-10   ">
        <CardHeader>
          <CardTitle className='text-center text-xl'>Sign Up </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-2">
              <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field}  onChange={(e) => {
                  delayedUsernaming(e.target.value) 
                  field.onChange(e)}}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
               <FormLabel className='flex items-center justify-between'> 
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
               <FormLabel className='flex items-center justify-between'> 
               Password
               {
                 show ? <EyeOpenIcon  className='cursor-pointer w-2 h-2' onClick={() => setShow(false)} /> : <EyeClosedIcon className='cursor-pointer w-2 h-2' onClick={() => setShow(true)} />
               }
              </FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type={`${ show? "text" : "password" }`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile_picture"
          render={({ field }) => (
            <FormItem className='flex justify-center  items-center flex-col'>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
              { image.secure_url === "" ? <CldUploadWidget  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}  options={{maxFiles: 1 , resourceType: "auto" , folder:"profilePictures" , cropping: true }} 
              onSuccess={
                (res:any)=> 
                  { if(res?.info)
                    {
                      field.onChange({
                        secure_url: res?.info?.secure_url,
                        public_id: res?.info?.public_id,
                        filename:`${res?.info?.original_filename}.${res?.info?.format}`
                      })
                      delayingImage({
                        secure_url: res.info?.secure_url,
                        public_id: res.info?.public_id,
                        file_name: res.info.original_filename
                      })
                    }
                  }
              }
                >
                {({ open }) => (
                <Button  className='w-20 h-20  rounded-full'  onClick={() => open()} asChild={true}>
                  <PlusCircledIcon className="w-20 h-20 rounded-full"  />
                  </Button>
                )}
                </CldUploadWidget>
                :
                <>
                <CldImage  alt="Profile Picture" src={image.secure_url} width={80} height={80} crop={`fill`} preserveTransformations priority={true} className=" rounded-full"/>
                  <CrossCircledIcon className="w-8 h-8 rounded-full" onClick={() => setImage({secure_url: "", public_id: "", file_name: ""})} />
                  </>
                }
              </FormControl>
            </FormItem>
          )}
        />
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex justify-end  items-end'>
          <Button type="button" onClick={ form.handleSubmit(onSubmit)}>Sign Up</Button>
        </CardFooter>
        </Card>
    )
  }

export default AuthPage