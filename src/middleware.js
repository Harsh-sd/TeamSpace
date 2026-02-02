import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export  async function middleware(req){
    const token = req.cookies.get("access-token")?.value;
    if(!token){
        return NextResponse.redirect(new URL("/login", req.url));
    }
    try{
        const verifytoken=jwt.verify(token , process.env.SECRET_KEY);
        if(!verifytoken){
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
       }
    
    catch(error){
        return NextResponse.redirect(new URL("/login", req.url));

    }
}
export const config = {
  matcher: ["/dashboard/:path*"]
};