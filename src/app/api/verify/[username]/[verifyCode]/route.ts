import { UserModel } from "@/Models/User";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "string-encode-decode";
import  dbConnect  from "@/lib/dbConnect";
import { auth, unstable_update } from "@/auth";
import { Session, User } from "next-auth";
import { Error } from "mongoose";

export const POST = async (req:NextRequest,{params}:{params:{username:string , verifyCode:string}}) =>{
        await dbConnect();
        const session = await auth();
        const User = session?.user as User;
        const {username,verifyCode} = params;
        let deUserName = atob(atob(username));
        let deVerifyCode = atob(atob(verifyCode));
        
        if(session && User)
            {
                const verifiedUser = await UserModel.findOne({username:deUserName, isVerified:true});
                if(!verifiedUser && User.isVerified === false)
                    {
                        const UnverifiedUser = await UserModel.findOne({username:deUserName,isVerified:false});
                        if(UnverifiedUser)
                            {
                                const isMatch = UnverifiedUser.verifyCode = deVerifyCode;
                                const isNotExpire = UnverifiedUser.verifyExpire > Date.now();
                                if(isMatch && isNotExpire )
                                    {
                                        UnverifiedUser.isVerified = true ;
                                        UnverifiedUser.verifyExpire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                                        let verifyExpire = UnverifiedUser.verifyExpire
                                         UnverifiedUser.save()
                                         .then(async()=>{
                                            await unstable_update({user:{...User, isVerified:true, verifyExpire: verifyExpire}});
                                            return NextResponse.json({message:"User is verified"}, {status:200});
                                        })
                                        .catch((err:Error)=> {return NextResponse.json({message:err.message},{status:500})})
        
                                    }
                                    return NextResponse.json({message:"User is not verified"}, {status:401})
                            }
                    }
                return NextResponse.json({message:"User is  verified"}, {status:201});
            }
        
            return NextResponse.json({message:"User isn't  Sign In"}, {status:401});
    }
    
 
    