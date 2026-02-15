"use client";

import * as React from "react";
import { ArrowUpRight, Home, MessageSquare, DollarSign, Heart, Clock, Tag, TrendingUp, Building2, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { formatPrice } from "../../../lib/utils";
import { toast } from "sonner";

interface DashboardData {
  totalProperties: number;
  activeProperties: number;
  rentedProperties: number;
  vacantProperties: number;
  totalMonthlyRevenue: number;
  occupancyRate: number;
  totalInquiries: number;
  pendingInquiries: number;
  recentInquiries: number;
  totalFavorites: number;
  forRentCount: number;
  forSaleCount: number;
  latestInquiries: {
    id: string;
    tenantName: string;
    tenantEmail: string;
    tenantPhone?: string;
    message?: string;
    status: string;
    createdAt: string;
    property: {
      id: string;
      title: string;
      thumbnail?: string;
      images?: string[];
    };
  }[];
  properties: {
    id: string;
    title: string;
    price: number;
    currency: string;
    status: string;
    listingType: string;
    thumbnail?: string;
    address: string;
    city: string;
    inquiryCount: number;
    favoriteCount: number;
  }[];
}

export function DashboardOverview() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/overview");
      if (response.ok) {
        const json = await response.json();
        setData(json);
      } else {
        // Use fallback data if API fails
        setData(getFallbackData());
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Loading your portfolio data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 animate-pulse rounded bg-slate-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of your property portfolio performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(data.totalMonthlyRevenue, "USD")}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Across {data.totalProperties} {data.totalProperties === 1 ? "property" : "properties"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeProperties}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                {data.forRentCount} For Rent
              </Badge>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {data.forSaleCount} For Sale
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalInquiries}</div>
            <div className="flex items-center gap-2 mt-1">
              {data.pendingInquiries > 0 && (
                <p className="text-xs text-amber-600 flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {data.pendingInquiries} pending
                </p>
              )}
              {data.recentInquiries > 0 && (
                <p className="text-xs text-emerald-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {data.recentInquiries} this week
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalFavorites}</div>
            <p className="text-xs text-slate-500 mt-1">
              People saved your listings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Property Performance */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Inquiries and favorites per listing</CardDescription>
          </CardHeader>
          <CardContent>
            {data.properties.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200">
                <div className="text-center text-slate-400">
                  <Building2 className="mx-auto mb-2 h-8 w-8" />
                  <p className="text-sm">No properties yet</p>
                  <p className="text-xs mt-1">Add your first listing to see performance</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                {data.properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-slate-200">
                      {property.thumbnail ? (
                        <img
                          src={property.thumbnail}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          <Home className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {property.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">
                          {property.city}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${property.listingType === "SALE"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                        >
                          {property.listingType === "SALE" ? "Sale" : "Rent"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-xs">
                      <div className="text-center">
                        <p className="font-semibold text-slate-900">{property.inquiryCount}</p>
                        <p className="text-slate-400">Inquiries</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-900">{property.favoriteCount}</p>
                        <p className="text-slate-400">Saves</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-900">
                          {formatPrice(property.price, property.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Inquiries */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Latest Inquiries</CardTitle>
            <CardDescription>
              {data.pendingInquiries > 0
                ? `${data.pendingInquiries} need your attention`
                : "All caught up!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.latestInquiries.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200">
                <div className="text-center text-slate-400">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8" />
                  <p className="text-sm">No inquiries yet</p>
                  <p className="text-xs mt-1">You'll see new inquiries here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                {data.latestInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
                      {inquiry.tenantName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900">
                          {inquiry.tenantName}
                        </p>
                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                          {formatTimeAgo(inquiry.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 truncate">
                        {inquiry.property.title}
                      </p>
                      {inquiry.message && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {inquiry.message}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <a href={`mailto:${inquiry.tenantEmail}`} className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                          <Mail className="h-2.5 w-2.5" />
                          {inquiry.tenantEmail}
                        </a>
                        {inquiry.tenantPhone && (
                          <a href={`tel:${inquiry.tenantPhone}`} className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                            <Phone className="h-2.5 w-2.5" />
                            {inquiry.tenantPhone}
                          </a>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${inquiry.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : inquiry.status === "CONTACTED"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                    >
                      {inquiry.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Fallback data when API is unavailable
function getFallbackData(): DashboardData {
  return {
    totalProperties: 0,
    activeProperties: 0,
    rentedProperties: 0,
    vacantProperties: 0,
    totalMonthlyRevenue: 0,
    occupancyRate: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    recentInquiries: 0,
    totalFavorites: 0,
    forRentCount: 0,
    forSaleCount: 0,
    latestInquiries: [],
    properties: [],
  };
}
