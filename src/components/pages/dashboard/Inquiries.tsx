"use client";

import * as React from "react";
import { Search, Trash2, CheckCircle, Clock, MapPin, BedDouble, Bath, Mail, Phone, User, MessageSquare, Home } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { toast } from "sonner";
import { formatPrice } from "../../../lib/utils";

interface InquiryProperty {
  id: string;
  title: string;
  thumbnail?: string;
  images?: string[];
  image?: string;
  price?: number;
  currency?: string;
  location?: string;
  address?: string;
  city?: string;
  type?: string;
  listingType?: "RENT" | "SALE";
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
}

interface Inquiry {
  id: string;
  propertyId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone?: string;
  message?: string;
  status: "PENDING" | "CONTACTED" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  property: InquiryProperty;
}

export function Inquiries() {
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  React.useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      } else {
        toast.error("Failed to load inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsContacted = async (inquiryId: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONTACTED" }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === inquiryId ? { ...inq, status: "CONTACTED" } : inq
          )
        );
        toast.success("Marked as contacted");
      } else {
        toast.error("Failed to update inquiry");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast.error("Failed to update inquiry");
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    try {
      setDeletingId(inquiryId);
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
        toast.success("Inquiry deleted");
      } else {
        toast.error("Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.tenantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.property.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ACCEPTED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-3.5 w-3.5" />;
      case "CONTACTED":
      case "ACCEPTED":
        return <CheckCircle className="h-3.5 w-3.5" />;
      default:
        return null;
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

  const statusCounts = {
    ALL: inquiries.length,
    PENDING: inquiries.filter((i) => i.status === "PENDING").length,
    CONTACTED: inquiries.filter((i) => i.status === "CONTACTED").length,
    ACCEPTED: inquiries.filter((i) => i.status === "ACCEPTED").length,
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-900" />
          <p className="text-slate-500">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Property Inquiries
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          View and manage inquiries from potential tenants and buyers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["ALL", "PENDING", "CONTACTED", "ACCEPTED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-xl border p-4 text-left transition-all ${statusFilter === status
              ? "border-blue-900 bg-blue-50 ring-1 ring-blue-900"
              : "border-slate-200 bg-white hover:border-slate-300"
              }`}
          >
            <p className="text-2xl font-bold text-slate-900">
              {statusCounts[status]}
            </p>
            <p className="text-xs font-medium text-slate-500 capitalize">
              {status === "ALL" ? "All Inquiries" : status.toLowerCase()}
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name, email, or property..."
          className="pl-9 bg-white border-slate-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900">No inquiries found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "You'll see inquiries here when potential tenants or buyers reach out"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <Card
              key={inquiry.id}
              className="overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Property Info Panel */}
                <div className="lg:w-80 shrink-0 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200">
                  <div className="p-4">
                    {/* Property Thumbnail */}
                    <div className="relative mb-3 overflow-hidden rounded-lg aspect-[16/10] bg-slate-200">
                      {(() => {
                        const imgSrc = inquiry.property.image || inquiry.property.thumbnail || (inquiry.property.images && inquiry.property.images[0]);
                        return imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={inquiry.property.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <Home className="h-8 w-8" />
                          </div>
                        );
                      })()}
                      {/* Listing Type Badge */}
                      {inquiry.property.listingType && (
                        <div className="absolute top-2 left-2">
                          <Badge
                            className={`text-xs ${inquiry.property.listingType === "SALE"
                              ? "bg-blue-600 text-white"
                              : "bg-emerald-500 text-white"
                              }`}
                          >
                            {inquiry.property.listingType === "SALE" ? "For Sale" : "For Rent"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Property Details */}
                    <h4 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1">
                      {inquiry.property.title}
                    </h4>

                    {inquiry.property.price != null && (
                      <p className="text-lg font-bold text-blue-900 mb-1">
                        {formatPrice(inquiry.property.price, inquiry.property.currency || "USD")}
                        {inquiry.property.listingType === "RENT" && (
                          <span className="text-xs font-normal text-slate-500">/mo</span>
                        )}
                      </p>
                    )}

                    {(inquiry.property.location || inquiry.property.address || inquiry.property.city) && (
                      <div className="flex items-center text-xs text-slate-500 mb-2">
                        <MapPin className="mr-1 h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {inquiry.property.location || [inquiry.property.address, inquiry.property.city].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Property specs */}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {inquiry.property.bedrooms != null && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3" />
                          {inquiry.property.bedrooms} bed
                        </span>
                      )}
                      {inquiry.property.bathrooms != null && (
                        <span className="flex items-center gap-1">
                          <Bath className="h-3 w-3" />
                          {inquiry.property.bathrooms} bath
                        </span>
                      )}
                      {inquiry.property.sqft != null && (
                        <span>{inquiry.property.sqft} sqft</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inquiry Details Panel */}
                <div className="flex-1 p-4 lg:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* User Contact Info */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-900 font-semibold text-sm">
                          {inquiry.tenantName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900">
                            {inquiry.tenantName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                            <a
                              href={`mailto:${inquiry.tenantEmail}`}
                              className="flex items-center gap-1 text-sm text-blue-700 hover:underline"
                            >
                              <Mail className="h-3 w-3" />
                              {inquiry.tenantEmail}
                            </a>
                            {inquiry.tenantPhone && (
                              <a
                                href={`tel:${inquiry.tenantPhone}`}
                                className="flex items-center gap-1 text-sm text-blue-700 hover:underline"
                              >
                                <Phone className="h-3 w-3" />
                                {inquiry.tenantPhone}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      {inquiry.message && (
                        <div className="mb-3 rounded-lg bg-slate-50 border border-slate-100 p-3">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            "{inquiry.message}"
                          </p>
                        </div>
                      )}

                      {/* Status & Time */}
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`gap-1 text-xs ${getStatusColor(inquiry.status)}`}
                        >
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {formatTimeAgo(inquiry.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {inquiry.status === "PENDING" && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsContacted(inquiry.id)}
                          className="bg-blue-900 hover:bg-blue-800 text-xs"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Mark Contacted
                        </Button>
                      )}

                      <a href={`mailto:${inquiry.tenantEmail}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                        >
                          <Mail className="mr-1 h-3 w-3" />
                          Send Email
                        </Button>
                      </a>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-400 hover:text-red-600 text-xs"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this inquiry from{" "}
                            {inquiry.tenantName}? This action cannot be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-3 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteInquiry(inquiry.id)}
                              disabled={deletingId === inquiry.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deletingId === inquiry.id
                                ? "Deleting..."
                                : "Delete"}
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
