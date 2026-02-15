import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// GET /api/users/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        properties: {
          take: 5,
        },
      },
    });

    // If user doesn't exist in DB, create them from Clerk data
    if (!user) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            firstName: clerkUser.firstName || "",
            lastName: clerkUser.lastName || "",
            role: (clerkUser.unsafeMetadata?.role as "TENANT" | "LANDLORD") || "TENANT",
          },
          include: {
            properties: {
              take: 5,
            },
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// POST /api/users/me - Update current user profile
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    const user = await prisma.user.update({
      where: { clerkId: userId },
      data,
      include: {
        properties: {
          take: 5,
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// PUT /api/users - Create or sync user with Clerk (fallback endpoint)
export async function PUT(request: NextRequest) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: data,
      create: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        role: data.role || (clerkUser.unsafeMetadata?.role as "TENANT" | "LANDLORD") || "TENANT",
      },
      include: {
        properties: {
          take: 5,
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json(
      { error: "Failed to create/update user" },
      { status: 500 }
    );
  }
}
