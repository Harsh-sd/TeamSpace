import { NextResponse } from "next/server";
import  prisma  from "@/lib/db"
import bcrypt from "bcryptjs"
import { signupSchema } from "@/lib/validators/auth"

export async function POST (req){
    try {
        const body=await req.json();

        // check out zod validation
    const parsed =signupSchema.safeParse(body);
    if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    )
  }
   const { name, email, password } = parsed.data
   //Check if the user alrady exists 
   const existingUser=await prisma.user.findUnique({ where: { email } })
   if(existingUser){
    return NextResponse.json(
        {message:"Email already exists"},
        {status:409}
    )
   }
         //Hash the password before storing in the db 
  const hashPassword=await bcrypt.hash(password , 10);
        //Save the user in the database
    const saveuser=await prisma.user.create({
       data:{name , email, password :hashPassword} })
    return NextResponse.json(
        {message:"User created successfully" , saveuser},
        {status :201},
       
    )
    }
    catch(error){
        return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    }
    
}