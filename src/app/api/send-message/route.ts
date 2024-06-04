import { Message, UserModel } from "@/Models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";




export const POST = async(req:NextRequest)=>
{
    await dbConnect();
    const {username,content,sender }= await req.json();

    try 
    {
        const user = await UserModel.findOne({username:username});  
        if(!user) return NextResponse.json({success:false,message:"User not found"}, {status:404});
        if(!user.isAcceptingMessages) return NextResponse.json({success:false,message:"User not accepting messages"}, {status:403})
        const newMessage = {content , username , sender, createdAt:new Date()}
        user.messages.push(newMessage as Message);
        const MessagedSent = await user.save();
        if(!MessagedSent) return NextResponse.json({success:false, message:"Error sending message"}, {status:400})
            else{
        const {username,sender} = MessagedSent.messages[MessagedSent.messages.length -1];
        return NextResponse.json({ success:true,message:`Message Sent to ${username} by ${sender}`}, {status:201});
    }
    } 
    catch (error) 
    {
        return NextResponse.json({success:false,message:"Internal Server Error"}, {status:500});
    }
}

