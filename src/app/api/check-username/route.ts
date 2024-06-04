import { UserModel } from "@/Models/User";
import { username } from "@/Schmea/SignUp";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => 
{
    const { searchParams } = new URL(req.url);
    const queryParams = {username: searchParams.get('username')};
    const zodedUsername = username.safeParse(queryParams.username);
    console.log(zodedUsername);
    if(!zodedUsername.success) return NextResponse.json({ success:false, message: zodedUsername.error.format()._errors},{status:400})
    await dbConnect();
    const user = await UserModel.findOne({username: zodedUsername.data});
    if(user)return NextResponse.json({success:false,message: " Username is Already taken"},{status:401})
    return NextResponse.json({success:true,message: "Username is Available"},{status:200})

}
