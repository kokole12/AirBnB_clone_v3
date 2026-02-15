import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// PATCH /api/inquiries/[id] - Update inquiry status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

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

    // Check if user owns the property for this inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          include: { owner: true },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    if (inquiry.property.owner.id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this inquiry" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

// DELETE /api/inquiries/[id] - Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

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

    // Check if user owns the property for this inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          include: { owner: true },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    if (inquiry.property.owner.id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this inquiry" },
        { status: 403 }
      );
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
