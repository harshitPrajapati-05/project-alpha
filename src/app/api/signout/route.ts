import { UserModel } from "@/Models/User";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextResponse } from "next/server";




export const POST = async () => 
    {
        await    dbConnect();
        const session = await auth();
        const user:User = session?.user;
        const signOuttedUser = await UserModel.findOne({username: user.username});
        signOuttedUser.isSignedIn = false;
        signOuttedUser.save()
        .then(() => {return NextResponse.json({ success: true, message: "Signout Successful" }, { status: 200 })} )
        .catch(() => {return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })});
    }
