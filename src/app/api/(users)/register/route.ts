import { prisma } from "@/app/lib/prisma";
import { generateToken, setCookie } from "@/app/utils/createToken";
import { ICreateNewAcount } from "@/app/utils/requestBodies";
import { registerUser } from "@/app/utils/validationByZod";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { NextResponse, NextRequest } from "next/server";

/**
 * @method PPST
 * @route ~/api/register
 * @description add new user (register , sin up)
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ICreateNewAcount;
    const validation = registerUser.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (user) {
      return NextResponse.json(
        { message: "This user already exists" },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });
    const cookie = setCookie({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });


    return NextResponse.json(
      {
        message: "Authenticated",
        user: { id: newUser.id, name: newUser.name },
      },
      { status: 201, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
