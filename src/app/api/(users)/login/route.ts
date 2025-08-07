import { prisma } from "@/app/lib/prisma";
import { setCookie } from "@/app/utils/createToken";
import { ILogin } from "@/app/utils/requestBodies";
import { loginUser } from "@/app/utils/validationByZod";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/login
 * @description log in  user (log in , sin in)
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ILogin;
    const validation = loginUser.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json(
        { message: "this user is not found" },
        { status: 404 }
      );
    }
    const hashpassword = user.password;
    const isPasswordMatch = await bcrypt.compare(body.password, hashpassword);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "error in email or password" },
        { status: 400 }
      );
    }

    const cookie = setCookie({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return NextResponse.json(
      {
        message: "Authenticated",
        user: { id: user.id, name: user.name },
      },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
