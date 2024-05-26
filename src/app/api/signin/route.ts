import { UserModel } from "@/Models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export const POST = async (req:NextRequest) => 
{
    await dbConnect();
    const {email ,username , password} = await req.json();
    try{
    if(email) 
        {
            const user  = await UserModel.findOne({email:email});
            if(!user) return NextResponse.json({message:"User not found"},{status:404});
            const match = await bcrypt.compare(password, user.password);
            if(!match) return NextResponse.json({message:"Invalid password"}, {status:401});
            return NextResponse.json({message:"Login successful"}, {status:200});
        }
    else 
        {
            const user  = await UserModel.findOne({username:username});
            if(!user) return NextResponse.json({message:"User not found"}, {status:404});
            const match = await bcrypt.compare(password, user.password);
            if(!match) return NextResponse.json({message:"Invalid password"}, {status:401});
            return NextResponse.json({message:"Login successful"}, {status:200});
        }
    }
    catch(err)
    {

        return NextResponse.json({message:err}, {status:500});
    }

}