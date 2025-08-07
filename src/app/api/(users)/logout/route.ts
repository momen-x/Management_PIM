import { tokenName } from "@/app/utils/tokenName";
import { verifyToken } from "@/app/utils/verifyToken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/logout
 * @description log out
 * @access private (just the log in user)
 */
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);

    if (user === null) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    (await cookies()).delete(tokenName);
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
