import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/dashboard/overview - Get dashboard metrics for the current user
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

        // Get all properties for this owner
        const properties = await prisma.property.findMany({
            where: { ownerId: user.id },
            select: {
                id: true,
                title: true,
                price: true,
                currency: true,
                status: true,
                listingType: true,
                thumbnail: true,
                images: true,
                address: true,
                city: true,
                createdAt: true,
                _count: {
                    select: {
                        inquiries: true,
                        favorites: true,
                    },
                },
            },
        });

        // Count inquiries
        const totalInquiries = await prisma.inquiry.count({
            where: {
                property: { ownerId: user.id },
            },
        });

        const pendingInquiries = await prisma.inquiry.count({
            where: {
                property: { ownerId: user.id },
                status: "PENDING",
            },
        });

        // Get recent inquiries (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentInquiries = await prisma.inquiry.count({
            where: {
                property: { ownerId: user.id },
                createdAt: { gte: sevenDaysAgo },
            },
        });

        // Get recent inquiries with details for the list
        const latestInquiries = await prisma.inquiry.findMany({
            where: {
                property: { ownerId: user.id },
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        images: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        // Calculate metrics
        const totalProperties = properties.length;
        const activeProperties = properties.filter(
            (p) => p.status === "ACTIVE"
        ).length;
        const rentedProperties = properties.filter(
            (p) => p.status === "RENTED"
        ).length;
        const vacantProperties = activeProperties;

        // Calculate total potential revenue (sum of all active rental property prices)
        const totalMonthlyRevenue = properties
            .filter((p) => p.status === "RENTED" || p.status === "ACTIVE")
            .reduce((sum, p) => sum + Number(p.price), 0);

        // Occupancy rate
        const occupancyRate =
            totalProperties > 0
                ? Math.round((rentedProperties / totalProperties) * 100)
                : 0;

        // Total favorites across all properties
        const totalFavorites = properties.reduce(
            (sum, p) => sum + p._count.favorites,
            0
        );

        // For sale vs for rent counts
        const forRentCount = properties.filter(
            (p) => p.listingType === "RENT"
        ).length;
        const forSaleCount = properties.filter(
            (p) => p.listingType === "SALE"
        ).length;

        return NextResponse.json({
            totalProperties,
            activeProperties,
            rentedProperties,
            vacantProperties,
            totalMonthlyRevenue,
            occupancyRate,
            totalInquiries,
            pendingInquiries,
            recentInquiries,
            totalFavorites,
            forRentCount,
            forSaleCount,
            latestInquiries,
            properties: properties.map((p) => ({
                id: p.id,
                title: p.title,
                price: Number(p.price),
                currency: p.currency,
                status: p.status,
                listingType: p.listingType,
                thumbnail: p.thumbnail || (p.images && p.images[0]) || null,
                address: p.address,
                city: p.city,
                inquiryCount: p._count.inquiries,
                favoriteCount: p._count.favorites,
            })),
        });
    } catch (error) {
        console.error("Error fetching dashboard overview:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
