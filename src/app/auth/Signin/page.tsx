"use client"
import React ,{useState}from 'react'
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SignInSchema } from '@/Schmea/SignIn'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import axios, { AxiosError } from 'axios'
import { signIn} from "next-auth/react";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
const SignIn = () =>
{
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
                resolve(res.data.message);
                signIn('credentials', {
                  identifier: `${data.username || data.email}`,
                  password: data.password,
                  redirect: false,
                }).then(() => setTimeout(() => router.push("/"), 500))
                .catch((err) => console.log(err))
                return true
              })
              .catch(err=> {
                reject(err.response?.data.message);
                return false
              })
           })
           toast.promise(promise, {
             loading:"Checking...", 
             success: (data:any) => ` ${data}`,
             error: (err:any) => (`${err}`),
           })
          }
        const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
          axios.post(`/api/check`, data).then(res => signinIndicator({data})) 
        };
       
  return (
    <Card className="w-full max-w-md mx-auto my-5 dark bg-transparent/80">
        <CardHeader>
        <CardTitle onDoubleClick={onSwitch} className='select-none'>Sign In </CardTitle>
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
                <Input {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>)} />
            <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>)} />
            </form>
            </Form>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={ form.handleSubmit(onSubmit)}>Sign Up</Button>
        </CardFooter>
    </Card>
  )
}

export default SignIn
