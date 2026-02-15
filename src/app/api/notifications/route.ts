import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/notifications - Get user's notifications
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

        const notifications = await prisma.notification.findMany({
            where: {
                userId: user.id,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
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

        const body = await request.json();
        const { notificationId, markAllRead } = body;

        if (markAllRead) {
            await prisma.notification.updateMany({
                where: {
                    userId: user.id,
                    isRead: false,
                },
                data: {
                    isRead: true,
                },
            });
            return NextResponse.json({ success: true, message: "All notifications marked as read" });
        }

        if (!notificationId) {
            return NextResponse.json(
                { error: "Notification ID is required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            return NextResponse.json(
                { error: "Notification not found" },
                { status: 404 }
            );
        }

        if (notification.userId !== user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const updated = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating notification:", error);
        return NextResponse.json(
            { error: "Failed to update notification" },
            { status: 500 }
        );
    }
}
