import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = "1d";

export async function POST(req) {
  try {
    const refreshToken = req.cookies.get("refresh-token")?.value;
    if (!refreshToken)
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });

    // Check token in DB
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date())
      return NextResponse.json({ message: "Refresh token expired" }, { status: 401 });

    const accessToken = jwt.sign(
      { userId: tokenRecord.user.id, email: tokenRecord.user.email },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const response = NextResponse.json({ message: "Token refreshed", accessToken });
    response.cookies.set("access-token", accessToken, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
