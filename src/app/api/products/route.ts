import { prisma } from "@/app/lib/prisma";
import { IAddNewProducts } from "@/app/utils/requestBodies";
import { tokenName } from "@/app/utils/tokenName";
import { addNewProduct } from "@/app/utils/validationByZod";
import { verifyToken, verifyTokenForPage } from "@/app/utils/verifyToken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/products
 * @description Add new  products for user by user himself
 * @access private (just by user himself)
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IAddNewProducts;
    const validation = addNewProduct.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    const isUser = verifyToken(request);
    if (isUser === null) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    if (isUser.id !== body.userId) {
      return NextResponse.json(
        { message: "Forbidden: You can only add products to your own account" },
        { status: 403 }
      );
    }
    const total =
      body.price + (body.ads ?? 0) + (body.tax ?? 0) - (body.discount ?? 0);
    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        price: body.price,
        ads: body.ads ?? 0,
        tax: body.tax ?? 0,
        discount: body.discount ?? 0,
        total: total,
        categorie: body.categorie ?? "",
        userId: body.userId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        ads: true,
        tax: true,
        discount: true,
        total: true,
        categorie: true,
        createdAt: true,
      },
    });
    return NextResponse.json(
      { message: "Product added successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route ~/api/products
 * @description Get all products for the authenticated user
 * @access private (user gets their own products, admin gets all products)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = verifyToken(request);
    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    // Build the where clause based on user role
    const whereClause = authUser.isAdmin ? {} : { userId: authUser.id };

    // Fetch products with related user data
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest first
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: products,
        meta: {
          count: products.length,
          isAdmin: authUser.isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * @method DELETE
 * @route ~/api/products
 * @description delete all products for the authenticated user
 * @access private (user delete their own products, admin delete all products)
 */
export async function DELETE(request: NextRequest) {
  try {
    const authUser = verifyToken(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    console.log("from api id is", authUser.id);

    await prisma.product.deleteMany({ where: { userId: authUser.id } });
    return NextResponse.json(
      { message: "deleted succesfully , all product is deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
