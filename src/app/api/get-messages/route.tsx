import { UserModel } from "@/Models/User";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";




export const GET = async(req:NextRequest)=>
    {
        await dbConnect();
        const session = await auth();
        const User:User = session?.user;
    
        if(!session || session?.user || !User) return NextResponse.json({message:"UnAuthenicated",},{status:401});

        const userId =  new mongoose.Types.ObjectId(User._id);
        
        try {
            const user = await UserModel.aggregate([
                {$match:{_id:userId}},
                {$unwind:'$messages'},
                {$sort:{'message.createdAt':-1}},
                {$group:{_id:'$_id', messages:{$push:'$messages'}}}
            ])
            if(!user || user.length === 0) return NextResponse.json({message:"No User found"}, {status:404});
            return NextResponse.json({messages:user[0].messages});
        } catch (error) {
            return NextResponse.json({message:"Internal Server Error"}, {status:500});
        }
    }