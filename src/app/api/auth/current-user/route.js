import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

export async function GET(req){
    try{
        //get the token 
    const token=await req.cookies.get("access-token")?.value;
    if(!token){
        return NextResponse.json(
            {message:"Token not found"},
            {status:401}
        );
    }
    //verify token using secret key
    const decode=jwt.verify(token , process.env.JWT_SECRET) ;

    const user=await prisma.user.findUnique({
           where:{id:decode.userId},
           select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    };
     return NextResponse.json({ user }, { status: 200 });
    }
    catch(error){
      return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
    }

}