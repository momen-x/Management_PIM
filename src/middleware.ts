import { NextResponse, NextRequest } from "next/server";
import { tokenName } from "./app/utils/tokenName";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get(tokenName);
  const token = jwtToken?.value as string;
  if (!token) {
    if (request.nextUrl.pathname.startsWith("/api/profile")) {
      return NextResponse.json(
        { message: "No token provided, access denied" },
        { status: 401 }
      );
    } else if (request.nextUrl.pathname === "/profile") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: ["/api/profile/:path*", "/login", "/register", "/profile"],
};
