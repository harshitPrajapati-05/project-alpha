"use client"
import React ,{useEffect, useState}from 'react'
import {Card,CardContent,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SignInSchema } from '@/Schmea/SignIn'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { signIn, useSession} from "next-auth/react";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from 'next-auth'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
const SignIn = () =>
{
  const [user , setUser]= useState<User|null>()
    const { data: sessionData ,update} = useSession()
    useEffect(()=> { sessionData  && setUser(sessionData.user as User) },[sessionData, user]);
        const [switcher , setSwitcher] = useState(false);
        const form = useForm<z.infer<typeof SignInSchema>>({
            resolver: zodResolver(SignInSchema),
            defaultValues: {
                password: '',
                username: undefined,
                email: undefined,
            }
        });
        const router = useRouter();
        const onSwitch = () => setSwitcher(!switcher);
        const signinIndicator =({data}:{data:z.infer<typeof SignInSchema>})=>
          {
            const promise = new Promise((resolve, reject) => {
              axios.post(`/api/signin`,data)
              .then(res => {
                if(res.data.success)
                  {
                  resolve(res.data.message);
                  signIn('credentials', {
                    identifier: `${data.username || data.email}`,
                    password: data.password,
                    redirect: false,
                  }).then(() => setTimeout(() => router.push("/"), 400))
                  .catch((err) => console.log(err))
                }
              })
              .catch(err=> {
                reject(err.response?.data.message);
                
              })
           })
           toast.promise(promise, {
             loading:"Checking...", 
             success: (data:any) => ` ${data}`,
             error: (err:any) => (`${err}`),
           })
          }
        const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
          signinIndicator({data})
        };

        if(user) router.push(`/`)
       
          const [show, setShow] = useState(false);
  return (
    
    <Card className=" w-1/2  mx-auto py-20   shadow-[0px_0px_100px_rgba(255,255,255,1)]   hover:shadow-[0px_0px_100px_rgba(56,189,248,1)]   mt-16 px-20  ">
        <CardHeader>
        <CardTitle onDoubleClick={onSwitch} className='select-none text-center -mt-8 text-2xl'>Sign In </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-2">
            <FormField
          control={form.control}
          name={switcher ? 'username' : 'email'}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center justify-between'>{switcher ? 'Username' : 'Email'}
              <Link href="/auth/Signup" className="text-sm font-bold   text-sky-500">Sign Up</Link>
              </FormLabel>
              <FormControl>
                <Input placeholder='double click the "Sign in " to switch email or username' {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>)} />
            <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
               <FormLabel className='flex items-center justify-between'> 
               Password
               {
                 show ? <EyeOpenIcon className='cursor-pointer w-2 h-2 text-sky-600' onClick={() => setShow(false)} /> : <EyeClosedIcon className='cursor-pointer w-2 h-2 text-sky-600' onClick={() => setShow(true)} />
               }
              </FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type={`${ show? "text" : "password" }`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>)} />
            </form>
            </Form>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={ form.handleSubmit(onSubmit)}>Sign In</Button>
        </CardFooter>
    </Card>
  )
}

export default SignIn
