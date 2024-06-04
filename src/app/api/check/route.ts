import { NextRequest, NextResponse } from "next/server";


export const POST = async (req:NextRequest) =>
    {
        const body = await req.json();
        return NextResponse.json({body})
    }