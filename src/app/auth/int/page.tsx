"use client"
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
const page = () => {
  return (
    <Card className="w-full max-w-md mx-auto dark bg-transparent/80 my-14">
            <CardHeader className="text-center m-2 text-xl">
                <CardTitle>You are Unauthenticated...😥</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
                <p>Please login to continue</p>
            </CardContent>
            <CardFooter>
            <Button onClick={() => signIn()}>Sign In</Button>
            </CardFooter>
        </Card>
  )
}

export default page