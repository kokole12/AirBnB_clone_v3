import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/properties - Get all properties or search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const type = searchParams.get("type");

    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const listingType = searchParams.get("listingType"); // "RENT" or "SALE"
    const amenities = searchParams.getAll("amenities"); // Expecting multiple "amenities" params

    const where: any = {
      status: "ACTIVE",
    };

    if (city) {
      where.OR = [
        { city: { contains: city, mode: "insensitive" } },
        { title: { contains: city, mode: "insensitive" } },
        { location: { contains: city, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (type) {
      where.type = type;
    }

    if (listingType) {
      where.listingType = listingType;
    }

    if (bedrooms) {
      // If "4+", we might want gte: 4, else equals
      if (bedrooms === "4+") {
        where.bedrooms = { gte: 4 };
      } else {
        where.bedrooms = parseInt(bedrooms);
      }
    }

    if (bathrooms) {
      if (bathrooms === "4+") {
        where.bathrooms = { gte: 4 };
      } else {
        where.bathrooms = parseInt(bathrooms);
      }
    }

    if (amenities && amenities.length > 0) {
      where.amenities = {
        hasEvery: amenities,
      };
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      take: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeProperties = properties.map((p) => ({
      ...p,
      price: p.price.toNumber(),
    }));

    return NextResponse.json(safeProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property (landlords only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify user is a landlord
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== "LANDLORD") {
      return NextResponse.json(
        { error: "Only landlords can create properties" },
        { status: 403 }
      );
    }

    const data = await request.json();

    const property = await prisma.property.create({
      data: {
        ...data,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...property,
      price: property.price.toNumber(),
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
