import { prisma } from "@/app/lib/prisma";
import { generateToken, setCookie } from "@/app/utils/createToken";
import { IEditAcountInfo } from "@/app/utils/requestBodies";
import jwt from "jsonwebtoken";

import {
  deleteAcount,
  editUserInfo,
  editUserPassword,
} from "@/app/utils/validationByZod";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "@/app/types/pages";
import { verifyToken } from "@/app/utils/verifyToken";
import { cookies } from "next/headers";
import { tokenName } from "@/app/utils/tokenName";
interface Iprops {
  params: Promise<{ id: string }>;
}
interface IPasswordDeleteAcount {
  password: string;
}

/**
 * @method GET
 * @route ~/api/profile/:id
 * @description display informatin single uuser
 * @access private (just by user themself or by admin)
 */
export async function GET(request: NextRequest, { params }: Iprops) {
  try {
    const id = +(await params).id;
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "the user not found" },
        { status: 404 }
      );
    }
    const isUser = verifyToken(request);
    if (isUser === null) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    if (isUser.id !== id && isUser.isAdmin === false) {
      return NextResponse.json(
        { message: "Unauthorized: You can only display your own account" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "the user not found check from id" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/profile/:id
 * @description edit user account
 * @access private (just by user themself)
 */
export async function PUT(request: NextRequest, { params }: Iprops) {
  try {
    const id = +(await params).id;
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "the user not found check from id" },
        { status: 404 }
      );
    }
    const isUser = verifyToken(request);
    if (isUser === null) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    if (isUser.id !== id) {
      return NextResponse.json(
        { message: "Unauthorized: You can only edit your own account" },
        { status: 403 }
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isAdmin: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const body = (await request.json()) as IEditAcountInfo;

    // Determine if this is a password change or info update
    const isPasswordChange =
      body.oldPassword || body.newPassword || body.confirmNewPassword;

    if (isPasswordChange) {
      const passwordValidation = editUserPassword.safeParse({
        oldPassword: body.oldPassword,
        newPassword: body.newPassword,
        confirmPassword: body.confirmNewPassword,
      });

      if (!passwordValidation.success) {
        return NextResponse.json(
          {
            message: "Invalid password data",
            errors: passwordValidation.error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 400 }
        );
      }

      const isOldPasswordValid = await bcrypt.compare(
        body.oldPassword!,
        existingUser.password
      );
      if (!isOldPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(body.newPassword!, salt);

      // Update password
      await prisma.user.update({
        where: { id },
        data: {
          password: hashedNewPassword,
          ubdatedAt: new Date(),
        },
      });

      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      );
    } else {
      // Validate user info update
      const infoValidation = editUserInfo.safeParse({
        name: body.name,
        email: body.email,
      });

      if (!infoValidation.success) {
        return NextResponse.json(
          {
            message: "Invalid user information",
            errors: infoValidation.error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      if (body.email && body.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: body.email },
          select: { id: true },
        });

        if (emailExists && emailExists.id !== id) {
          return NextResponse.json(
            { message: "Email is already in use" },
            { status: 409 }
          );
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...(body.name && { name: body.name }),
          ...(body.email && { email: body.email }),
          ubdatedAt: new Date(), // Note: Fix this typo in your schema to 'updatedAt'
        },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
          ubdatedAt: true, // Note: Fix this typo in your schema to 'updatedAt'
        },
      });

      const response = NextResponse.json(
        {
          message: "Profile updated successfully",
          user: updatedUser,
        },
        { status: 200 }
      );
      const newToken = jwt.sign(
        {
          id: existingUser.id,
          name: body.name,
          email: body.email,
          isAdmin: existingUser.isAdmin,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "30d" }
      );
      response.cookies.set({
        name: tokenName,
        value: newToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      return response;
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @route ~/api/profile/:id
 * @description delete user account
 * @access private (just by user themself or by admin)
 */
export async function DELETE(request: NextRequest, { params }: Iprops) {
  try {
    const id = +(await params).id;
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "the user not found check from id" },
        { status: 404 }
      );
    }
    const isUser = verifyToken(request);
    if (isUser === null) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    if (isUser.id !== id && isUser.isAdmin === false) {
      return NextResponse.json(
        { message: "Unauthorized: You can only delete your own account" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as IPasswordDeleteAcount;
    const validation = deleteAcount.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "enter a correct password" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "the user not found" },
        { status: 404 }
      );
    }
    const JWT_Token = request.cookies.get(tokenName);
    const token = JWT_Token?.value as string;
    const userFormToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (userFormToken === null) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    if (userFormToken.id !== user.id) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    await prisma.user.delete({ where: { id } });
    (await cookies()).delete(tokenName);
    return NextResponse.json(
      { message: "deleted", user: user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
