import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/inquiries - Get inquiries for property owner
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get all inquiries for properties owned by this user
    const inquiries = await prisma.inquiry.findMany({
      where: {
        property: {
          ownerId: user.id,
        },
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            images: true,
            price: true,
            currency: true,
            address: true,
            city: true,
            type: true,
            listingType: true,
            bedrooms: true,
            bathrooms: true,
            sqft: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

// POST /api/inquiries - Create a new inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      propertyId,
      tenantName,
      tenantEmail,
      tenantPhone,
      message,
    } = body;

    if (!propertyId || !tenantName || !tenantEmail) {
      return NextResponse.json(
        { error: "propertyId, tenantName, and tenantEmail are required" },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        tenantName,
        tenantEmail,
        tenantPhone: tenantPhone || null,
        message: message || null,
        status: "PENDING",
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            images: true,
            price: true,
            currency: true,
            address: true,
            city: true,
            type: true,
            listingType: true,
            bedrooms: true,
            bathrooms: true,
            sqft: true,
          },
        },
      },
    });

    // Create notification for property owner
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        title: "New Inquiry Received",
        message: `You have a new inquiry for "${property.title}" from ${tenantName}.`,
        type: "INQUIRY",
        link: "/dashboard/inquiries",
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}
