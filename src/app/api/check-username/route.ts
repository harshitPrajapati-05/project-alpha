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
    if(!zodedUsername.success) return NextResponse.json({message: zodedUsername.error.format()._errors},{status:400})
    await dbConnect();
    const user = await UserModel.findOne({username: zodedUsername.data});
    if(user)return NextResponse.json({message: " Username is Already taken"},{status:404})
    return NextResponse.json({message: "Username is Available"},{status:200})

}
