import { UserModel } from "@/Models/User";
import { SignUpSchema } from "@/Schmea/SignUp";
import { NextRequest, NextResponse } from "next/server";
import  bcrypt  from  "bcryptjs";

import dbConnect from "@/lib/dbConnect";

export const POST = async (req:NextRequest) => 
{
    await dbConnect();
    const info = await req.json();
    const zodedInfo = SignUpSchema.safeParse(info);
    if(!zodedInfo.success) return NextResponse.json({success:false,message:"Invalid Data"},{status:400});
    const existingUser = await UserModel.findOne( {
        $or:[{email:zodedInfo.data.email},{username:zodedInfo.data.username}]
    })
    if(existingUser) return NextResponse.json({success:false,message:"User already exists",User:existingUser}, {status:400});
    const genSalt =bcrypt.genSaltSync(10);
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    let verifyExpire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    zodedInfo.data.password =  bcrypt.hashSync(zodedInfo.data.password, genSalt);
    const user = new UserModel({...zodedInfo.data, isSignedIn:true ,  verifyCode: verifyCode ,verifyExpire:verifyExpire});
    await user.save()
    return NextResponse.json({success:true,message:"User created successfully",User:user }, {status:200});
}