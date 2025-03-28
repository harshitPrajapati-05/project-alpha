import { UserModel } from "@/Models/User";
import { auth, unstable_update } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export const POST = async (req:NextRequest) =>
    {
        await dbConnect();
        const session = await auth();
        const user:User = session?.user;

        if(!session || !session?.user) return NextResponse.json({message:"Not Authenticated"},{status:401});

        const  userId = user._id;
        const {acceptMessage} = await req.json();

        try {
            const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessages:acceptMessage},{new:true})
            if(!updatedUser) return NextResponse.json({message:"failed to accept message"},{status:404});
            await unstable_update({user:{ ...user,isAcceptingMessages: !session?.user?.isAcceptingMessages}})
            return NextResponse.json({success:true,message:"Message Acceptance Updated", },{status:200});
        } catch (error) {
            console.log(error);
            return NextResponse.json({success:false,message:"failed to accept message"},{status:500});
        }
    }

export const GET = async (req:NextRequest) =>
    {
        const { searchParams } = new URL(req.url);
        const queryParams = {username: searchParams.get('username')};
        try {
            const foundedUser = await UserModel.findOne(queryParams);
    
            if(!foundedUser) return NextResponse.json({success:false,message:"User not found"},{status:404});
            
            return NextResponse.json({ success:true ,isAccpetingMessages:foundedUser.isAcceptingMessages},{status:200});
            
        } catch (error) {
            
            return NextResponse.json({success:false,message:"failed to get User Acceptance"}, {status:500});
        }
    }

