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
            if(!user) return NextResponse.json({success:false,message:"User not found"},{status:404});
            const match = await bcrypt.compare(password, user.password);
            if(!match) return NextResponse.json({success:false,message:"Invalid password"}, {status:401});
            user.isSignedIn = true;
             user.save().then(()=>{
                return NextResponse.json({success:true,message:"Login successful"}, {status:200});
             })
             .catch((err:any) => console.log(err));
        }
    else 
        {
            const user  = await UserModel.findOne({username:username});
            if(!user) return NextResponse.json({success:false,message:"User not found"}, {status:404});
            const match = await bcrypt.compare(password, user.password);
            if(!match) return NextResponse.json({success:false,message:"Invalid password"}, {status:401});
            user.isSignedIn = true;
             user.save().then(()=>{
                return NextResponse.json({success:true,message:"Login successful"}, {status:200});
             })
             .catch((err:any) => console.log(err));

            
        }
    }
    catch(err)
    {

        return NextResponse.json({success:false,message:err}, {status:500});
    }

}