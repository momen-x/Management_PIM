import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/pages";

export function verifyToken(request: NextRequest): JwtPayload | null {
  try {
    const cookieName = "token";
    const jwtToken = request.cookies.get(cookieName);
    const token = jwtToken?.value;

    if (!token) {
      return null;
    }

    const privateKey = process.env.PRIVATE_KEY as string;
    const userPayload = jwt.verify(token, privateKey) as JwtPayload;

    return userPayload;
  } catch (error) {
    return null;
  }
}
