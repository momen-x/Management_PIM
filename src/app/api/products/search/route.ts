import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface SearchParams {
  searchByTitle?: string;
  searchByCategory?: string;
}

/**
 * @method GET
 * @route ~/api/products/search
 * @description Search products by title or category (user's products only)
 * @access private
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = verifyToken(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const searchParams: SearchParams = {
      searchByTitle:
        request.nextUrl.searchParams.get("searchByTitle") || undefined,
      searchByCategory:
        request.nextUrl.searchParams.get("searchByCategory") || undefined,
    };

    // Validate at least one search parameter exists
    if (!searchParams.searchByTitle && !searchParams.searchByCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide either searchByTitle or searchByCategory",
        },
        { status: 400 }
      );
    }

    const whereClause: any = { userId: authUser.id };

    if (searchParams.searchByTitle) {
      whereClause.title = {
        contains: searchParams.searchByTitle,
        mode: "insensitive",
      };
    }

    if (searchParams.searchByCategory) {
      whereClause.categorie = {
        contains: searchParams.searchByCategory,
        mode: "insensitive",
      };
    }

    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,

        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: products,
        meta: {
          total: totalCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product search error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
