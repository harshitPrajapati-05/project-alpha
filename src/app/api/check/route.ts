import { UserModel } from "@/Models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req:NextRequest) =>
    {
            await dbConnect();
            try {
                const users = await UserModel.find({isSignedIn:true});
                const usernames = users.map(user => ({
                    username: user.username,
                    email: user.email,
                    profile_picture_url: user.profile_picture.secure_url
                  }));
                  
                return NextResponse.json({success:true, numberOfUsers: users?.length , usernames 
                },{status:201})
            } catch (error) {
                return NextResponse.json({success:false, message:"Internal Server Error"}, {status:500})
            }
    }