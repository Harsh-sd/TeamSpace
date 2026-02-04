import { NextResponse } from "next/server";
import prisma from "@/lib/db"
import jwt from "jsonwebtoken"

export async function GET(req , {params}){
  try {
    const { teamId } = await params;
      if (!teamId) {
      return NextResponse.json(
        { message: "Team ID missing" },
        { status: 400 }
      );
    }
     //get the userId from the token
    const token=req.cookies.get("access-token")?.value;
    if(!token){
        return  NextResponse.json(
        {message:"Token not found"},
        {status:401}
    )
    };
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
     //  Check if user belongs to this team
    const isMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId:decoded.userId,
      },
    });

    if (!isMember) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }
     //  Fetch all team members
    const members = await prisma.teamMember.findMany({
      where: {
        teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const formatMembers = members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
    }));

    return NextResponse.json(
      { members: formatMembers },
      { status: 200 }
    );

   
  }catch(error){
    return  NextResponse.json(
        {message:"Internal server error"},
        {status:500}
    )
  }
}