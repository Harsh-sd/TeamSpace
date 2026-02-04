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
    //fetch the team from team member
    const team = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: decoded.userId,
      },
      include: {
        team: true,
      },
    });
     if (!team) {
      return NextResponse.json(
        { message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        team: {
          id: team.team.id,
          name: team.team.name,
          role: team.role,
        },
      },
      { status: 200 }
    );
  }catch(error){
    return  NextResponse.json(
        {message:"Internal server error"},
        {status:500}
    )
  }
}