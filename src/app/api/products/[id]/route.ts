import { prisma } from "@/app/lib/prisma";
import { IEditProductInfo } from "@/app/utils/requestBodies";
import { editProduct } from "@/app/utils/validationByZod";
import { verifyToken } from "@/app/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Iprops {
  params: Promise<{ id: string }>;
}

/**
 * @method PUT
 * @route ~/api/products/:id
 * @description Edit products by the owner
 * @access private
 */
export async function PUT(request: NextRequest, { params }: Iprops) {
  try {
    const id = +(await params).id;
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as IEditProductInfo;
    const validation = editProduct.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: validation.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const authUser = verifyToken(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        userId: true,
        price: true,
        ads: true,
        tax: true,
        discount: true,
        categorie: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.userId !== authUser.id) {
      return NextResponse.json(
        { success: false, message: "You can only edit your own products" },
        { status: 403 }
      );
    }

    const newPrice = body.price ?? product.price;
    const newAds = body.ads ?? product.ads ?? 0;
    const newTax = body.tax ?? product.tax ?? 0;
    const newDiscount = body.discount ?? product.discount ?? 0;
    const total = newPrice + newAds + newTax - newDiscount;

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        price: newPrice,
        ads: newAds,
        tax: newTax,
        discount: newDiscount,
        total: total,
        categorie: body.categorie ?? product.categorie ?? "",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * @method Delete
 * @route ~/api/products/:id
 * @description Delete products by the owner
 * @access private
 */
export async function DELETE(request: NextRequest, { params }: Iprops) {
  try {
    const id = +(await params).id;
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "the product not found" },
        { status: 404 }
      );
    }
    const authUser = verifyToken(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { message: "the product not found" },
        { status: 404 }
      );
    }
    if (authUser.id !== product.userId) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own products" },
        { status: 403 }
      );
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "deleted" }, { status: 200 });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
