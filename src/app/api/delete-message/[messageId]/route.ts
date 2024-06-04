import { UserModel } from "@/Models/User";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const DELETE = async(req:NextRequest,{params}:{params:{messageId:string}})=>
    {
        const {messageId} = params;
        await dbConnect();
        const session = await auth();
        const user:User = session?.user 

        if(!session || !user) return NextResponse.json({success:false ,message:"Not Authenticated"});
        try 
        {
             const updation = await UserModel.updateOne(
                {_id:user._id},
                {$pull:{messages:{ _id:messageId}}}
            )
            if(updation.modifiedCount===0) return NextResponse.json({success:false, message:"Message not Found or Already Delete"}, {status:404})
                else return NextResponse.json({success:true, message:"Message Deleted "}, {status:200});
        } 
        catch (error) 
        {
            console.log(error);
            return NextResponse.json({success:false, message:"Internal Server Error"}, { status:500})
        }
}