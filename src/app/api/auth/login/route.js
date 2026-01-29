import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validators/auth";
import jwt from "jsonwebtoken";
import crypto from "crypto"; 

const ACCESS_TOKEN_EXPIRES_IN = "1d"; // 1 day
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate input using Zod
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "User with the email not found" },
        { status: 401 }
      );
    }

    // Compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return NextResponse.json(
        { message: "User password does not match" },
        { status: 401 }
      );
    }

    // Create access token 
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    // Create refresh token (random string)
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN);

    // Delete old refresh tokens 
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    // Store refresh token in db
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    // Remove password from user 
    const { password: _, ...saveduser } = user;

 
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: saveduser,
      },
      { status: 200 }
    );

    // Set cookies
    response.cookies.set("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, 
    });

    response.cookies.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, 
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
