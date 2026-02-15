"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { PropertyCard } from "../PropertyCard";
import { MOCK_PROPERTIES } from "../../lib/data";

export function LandingPage() {
  const router = useRouter();
  const [featuredProperties, setFeaturedProperties] = React.useState(MOCK_PROPERTIES.slice(0, 3));

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/properties?limit=3");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Transform API data (Prisma model) to match PropertyCard interface
            const transformedData = data.map((p: any) => ({
              ...p,
              image: p.thumbnail || (p.images && p.images.length > 0 ? p.images[0] : "") || "",
              status: p.status === "ACTIVE" ? "Active" :
                p.status === "RENTED" ? "Rented" :
                  p.status === "INACTIVE" ? "Draft" : p.status,
              // Ensure other enums match if needed
              listingType: p.listingType === "RENT" ? "RENT" : "SALE", // Prisma is RENT/SALE, matches interface
              type: p.type === "APARTMENT" ? "Apartment" :
                p.type === "HOUSE" ? "House" :
                  p.type === "STUDIO" ? "Studio" :
                    p.type.charAt(0) + p.type.slice(1).toLowerCase() // Fallback capitalization
            }));
            setFeaturedProperties(transformedData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-blue-900 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            className="h-full w-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/50 to-transparent" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:leading-tight">
            Find Your Perfect Place <br className="hidden md:block" />
            To Call Home
          </h1>
          <p className="mb-10 text-lg text-blue-100 md:text-xl">
            Browse thousands of active listings, connect with owners directly, <br className="hidden md:block" />
            and manage your rental journey all in one place.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-xl">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative md:col-span-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input placeholder="Location" className="pl-10" />
              </div>
              <div className="md:col-span-1">
                <Select>
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                </Select>
              </div>
              <div className="md:col-span-1">
                <Select>
                  <option value="">Price Range</option>
                  <option value="0-1000">$0 - $1,000</option>
                  <option value="1000-2000">$1,000 - $2,000</option>
                  <option value="2000+">$2,000+</option>
                </Select>
              </div>
              <div className="md:col-span-1">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={() => router.push("/search")}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Properties</h2>
              <p className="mt-2 text-slate-600">Hand-picked properties just for you.</p>
            </div>
            <Link href="/search">
              <Button variant="outline">
                View All Properties <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop" className="rounded-2xl object-cover h-64 w-full" alt="House 1" />
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" className="rounded-2xl object-cover h-64 w-full mt-8" alt="House 2" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold text-slate-900">
                Everything you need to manage <br />
                your property journey
              </h2>
              <p className="mb-8 text-lg text-slate-600">
                Whether you're a first-time renter or an experienced landlord, our platform provides the tools you need to succeed.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-900">Smart Search</h3>
                    <p className="text-slate-600">Advanced filters to help you find exactly what you're looking for in seconds.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-900">Verified Listings</h3>
                    <p className="text-slate-600">All properties are verified to ensure safety and prevent fraud.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-900">Direct Communication</h3>
                    <p className="text-slate-600">Chat directly with landlords or tenants without intermediaries.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link href="/sign-up">
                  <Button size="lg">Start Your Journey</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mb-10 text-xl text-blue-100">
            Join thousands of happy tenants and landlords on PropEstate today.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" onClick={() => router.push("/search")}>Browse Properties</Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white hover:text-blue-900 border-white" onClick={() => router.push("/sign-up")}>List Your Property</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
