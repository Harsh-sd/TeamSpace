import { NextResponse } from "next/server";
import prisma from "@/lib/db"

import jwt from "jsonwebtoken";
import {createTeamSchema} from "@/lib/validators/auth"


export async function POST(req){
    try{
        const token=req.cookies.get("access-token")?.value;
        if(!token){
          return NextResponse.json(
              {message:"Token not found"},
              {status:401}
          )
        };
        //fetching the userId to pass in db
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const body= await req.json();
        //validating the fields 
        const parsed = createTeamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    };
    const { name } = parsed.data;
            //create a team
       const team = await prisma.team.create({
      data: {
        name,
        createdById: userId,
      },
    });
        // Add  to TeamMember
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId,
        role: "OWNER",
      },
    });
        return NextResponse.json({ team }, { status: 201 });

    }
    catch(error){
           console.error(error);
           return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}