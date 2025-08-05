import Jwt from "jsonwebtoken";
import { JwtPayload } from "../types/pages";
import { serialize } from "cookie";

export function generateToken(payload: JwtPayload): string {
  try {
    const token = Jwt.sign(
      {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        isAdmin: payload.isAdmin,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30d",
      }
    );
    return token;
  } catch (error) {
    return "";
  }
}
// set cookie with jwt
export function setCookie(JwtPayload: JwtPayload): string {
  const token = generateToken(JwtPayload);
  const cookie = serialize("PIM_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, //30 days
  });
  return cookie;
}
