import { Message, UserModel } from "@/Models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";




export const POST = async(req:NextRequest)=>
{
    await dbConnect();
    const {username,content}= await req.json();

    try {
        const user = await UserModel.findOne({username})
        if(!user) return NextResponse.json({success:false,message:"User not found"}, {status:404});
        
        if(!user.isAcceptingMessages) return NextResponse.json({success:false,message:"User not accepting messages"}, {status:403});

        const newMessage = {content ,createdAt:new Date()}
        user.messages.push(newMessage as Message);
        await user.save();
        return NextResponse.json({ success:true,message:"message sent "}, {status:201});
    } 
    catch (error) 
    {
        return NextResponse.json({success:false,message:"Internal Server Error"}, {status:500});
    }
}

