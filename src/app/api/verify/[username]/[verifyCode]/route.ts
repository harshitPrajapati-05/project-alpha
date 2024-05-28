import { UserModel } from "@/Models/User";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth, unstable_update } from "@/auth";
import { Session, User } from "next-auth";
import { Error } from "mongoose";

export const POST = async (req: NextRequest, { params }: { params: { username: string, verifyCode: string } }) => {
    await dbConnect();
    const session = await auth();
    const User = session?.user as User;
    const { username, verifyCode } = params;

    let deUserName = atob(atob(username));

    let deVerifyCode = atob(atob(verifyCode));

    if (session && User) {
        const verifiedUser = await UserModel.findOne({ username: deUserName, isVerified: true });
        if (!verifiedUser) {
            try {
                const UnverifiedUser = await UserModel.findOne({ username: deUserName , isVerified:false});
                const isMatch = UnverifiedUser.verifyCode === deVerifyCode;
                const isNotExpire = (new Date(UnverifiedUser.verifyExpire) > new Date());
                if (isMatch || isNotExpire) {
                    UnverifiedUser.isVerified = true;
                    UnverifiedUser.verifyExpire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    let verifyExpire = UnverifiedUser.verifyExpire;
                    await UnverifiedUser.save();
                    await unstable_update({ user: { ...User, isVerified: true, verifyExpire: verifyExpire } });
                    return NextResponse.json({ success: true, message: "User is verified" }, { status: 200 });
                }
                else return NextResponse.json({ success: false, message: "User is not verified" }, { status: 401 });
            } 
            catch (err: any) {
                return NextResponse.json({ success: false, message: err.message }, { status: 500 });
            }
        } else return NextResponse.json({ success: false, message: " User is Already Verified" }, { status: 401 });
    } else  return NextResponse.json({ success: false, message: "User isn't signed in" }, { status: 401 });
    
}
export const GET = async (req: NextRequest, { params }: { params: { username: string, verifyCode: string } }) => {
    try {
        await dbConnect();
        const { username } = params;
        const session = await auth();
        const User = session?.user as User;

        if (!session && !User) {
            return NextResponse.json({ message: "User isn't signed in" }, { status: 401 });
        }

        let deUserName = atob(atob(username));
        const verifiedUser = await UserModel.findOne({ username: deUserName, isVerified: true });

        if (!verifiedUser) {
            return NextResponse.json({ success: false, message: "User is not verified" }, { status: 401 });
        }

        const isExpired = new Date(User.verifyExpire) < new Date() && new Date(verifiedUser.verifyExpire) < new Date();

        if (isExpired) {
            verifiedUser.isVerified = false;
            verifiedUser.verifyExpire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            verifiedUser.verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            try {
                await verifiedUser.save();
                await unstable_update({ user: { ...User, isVerified: false, verifyCode: btoa(verifiedUser.verifyCode), verifyExpire: verifiedUser.verifyExpire } });
                return NextResponse.json({ success: "warn", message: "User's verification has expired" }, { status: 210 });
            } catch (err: any) {
                return NextResponse.json({ success: false, message: err.message }, { status: 500 });
            }
        } else {
            return NextResponse.json({ success: true, message: "User is verified" }, { status: 200 });
        }
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
};
