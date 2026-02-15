"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Heart, Share2, Star, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Property, MOCK_PROPERTIES } from "../../lib/data";
import { toast } from "sonner";
import { formatPrice } from "../../lib/utils";

interface PropertyDetailsPageProps {
  propertyId: string;
}

export function PropertyDetailsPage({ propertyId }: PropertyDetailsPageProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // In a real app, this would fetch from API
  const property = MOCK_PROPERTIES.find((p) => p.id === propertyId) || MOCK_PROPERTIES[0];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          tenantName: formData.name,
          tenantEmail: formData.email,
          tenantPhone: formData.phone || null,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to send inquiry");
        return;
      }

      toast.success("Inquiry sent successfully! The property owner will contact you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast.error("Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8 overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
            {property.image ? (
              <img
                src={property.image}
                alt={property.title}
                className="h-[400px] w-full object-cover md:h-[500px]"
              />
            ) : (
              <div className="h-[400px] md:h-[500px] w-full flex items-center justify-center bg-slate-200 text-slate-400">No image available</div>
            )}
            {/* Thumbnails would go here */}
          </div>

          {/* Header Info */}
          <div className="mb-8">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-slate-900">{property.title}</h1>
                <div className="flex items-center text-slate-500">
                  <MapPin className="mr-1 h-4 w-4" />
                  {property.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-900">
                  {formatPrice(property.price, property.currency)}
                </div>
                {property.listingType === "RENT" && (
                  <div className="text-slate-500">/month</div>
                )}
              </div>
            </div>

            <div className="flex gap-4 border-y border-slate-100 py-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                  <BedDouble className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{property.bedrooms}</div>
                  <div className="text-xs text-slate-500">Bedrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                  <Bath className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{property.bathrooms}</div>
                  <div className="text-xs text-slate-500">Bathrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                  <Maximize className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{property.sqft}</div>
                  <div className="text-xs text-slate-500">Square Feet</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Description</h2>
            <p className="leading-relaxed text-slate-600">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Amenities</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Location</h2>
            <div className="h-64 w-full rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
              Map View Integration
            </div>
          </div>
        </div>

        {/* Sidebar Contact */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" alt="Agent" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">James Wilson</div>
                <div className="text-sm text-slate-500">Property Manager</div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSendMessage}>
              <Input
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                placeholder="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                placeholder="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <Textarea
                placeholder="I'm interested in this property..."
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="min-h-[120px]"
                required
              />
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>

            <div className="mt-6 flex justify-between text-sm text-slate-500">
              <button className="flex items-center gap-1 hover:text-blue-900">
                <Heart className="h-4 w-4" /> Save
              </button>
              <button className="flex items-center gap-1 hover:text-blue-900">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
