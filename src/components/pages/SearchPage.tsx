"use client";

import * as React from "react";
import { Filter, Search as SearchIcon, MapPin, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Badge } from "../ui/badge";
import { PropertyCard } from "../PropertyCard";
import { MOCK_PROPERTIES, Property } from "../../lib/data";
import { Slider } from "../ui/slider";
import { formatPrice } from "../../lib/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter States
  const [searchTerm, setSearchTerm] = React.useState(searchParams.get("city") || "");
  const [priceRange, setPriceRange] = React.useState([0, 500000]); // Ksh range
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [bedrooms, setBedrooms] = React.useState<string | null>(null);
  const [bathrooms, setBathrooms] = React.useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);

  // Data State
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalItems, setTotalItems] = React.useState(0);

  // Debounce helper
  const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedPrice = useDebounce(priceRange, 500);

  // Fetch properties
  React.useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("city", debouncedSearch);
        params.append("minPrice", debouncedPrice[0].toString());
        params.append("maxPrice", debouncedPrice[1].toString());
        if (selectedType) params.append("type", selectedType.toUpperCase());
        if (bedrooms) params.append("bedrooms", bedrooms);
        if (bathrooms) params.append("bathrooms", bathrooms);
        selectedAmenities.forEach(a => params.append("amenities", a));

        const res = await fetch(`/api/properties?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          // Transform if needed (reusing logic from LandingPage, ideally this should be a shared utility)
          const transformedData = data.map((p: any) => ({
            ...p,
            image: p.thumbnail || (p.images && p.images.length > 0 ? p.images[0] : "") || "",
            status: p.status === "ACTIVE" ? "Active" :
              p.status === "RENTED" ? "Rented" :
                p.status === "INACTIVE" ? "Draft" : p.status,
            // Ensure other enums match if needed
            listingType: p.listingType === "RENT" ? "RENT" : "SALE",
            type: p.type === "APARTMENT" ? "Apartment" :
              p.type === "HOUSE" ? "House" :
                p.type === "STUDIO" ? "Studio" :
                  p.type.charAt(0) + p.type.slice(1).toLowerCase()
          }));
          setProperties(transformedData);
          setTotalItems(transformedData.length);
        } else {
          // Fallback to mock if API fails (e.g. DB connection issue)
          console.warn("API failed, using mock data fallback");
          const lower = debouncedSearch.toLowerCase();
          const filtered = MOCK_PROPERTIES.filter(p => {
            const matchesSearch = !lower || p.location.toLowerCase().includes(lower) || p.title.toLowerCase().includes(lower);
            const matchesPrice = p.price >= debouncedPrice[0] && p.price <= debouncedPrice[1];
            const matchesType = !selectedType || p.type.toUpperCase() === selectedType.toUpperCase();

            const matchesBedrooms = !bedrooms || (bedrooms === "4+" ? p.bedrooms >= 4 : p.bedrooms === parseInt(bedrooms));
            const matchesBathrooms = !bathrooms || (bathrooms === "4+" ? p.bathrooms >= 4 : p.bathrooms === parseInt(bathrooms));

            // Amenities (AND logic - must have all selected)
            const matchesAmenities = selectedAmenities.length === 0 ||
              selectedAmenities.every(a => p.amenities.some(item => item.toLowerCase() === a.toLowerCase()));

            return matchesSearch && matchesPrice && matchesType && matchesBedrooms && matchesBathrooms && matchesAmenities;
          });
          setProperties(filtered);
          setTotalItems(filtered.length);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        // Fallback code
        setProperties(MOCK_PROPERTIES); // Reset or use filtered mock logic
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [debouncedSearch, debouncedPrice, selectedType, bedrooms, bathrooms, selectedAmenities]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-72 space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <Filter className="h-4 w-4 text-slate-500" />
            </div>

            <div className="space-y-6">
              {/* Location */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-900">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="City, Neighborhood, Zip"
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-900">Price (Ksh)</label>
                  <span className="text-xs text-slate-500">
                    Ksh {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                  </span>
                </div>
                <div className="pt-2">
                  <Slider
                    defaultValue={[0, 500000]}
                    max={1000000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-900">Property Type</label>
                <div className="space-y-2">
                  {["Apartment", "House", "Studio", "Commercial", "Villa"].map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={type}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                        checked={selectedType === type.toUpperCase()}
                        onChange={() => setSelectedType(selectedType === type.toUpperCase() ? null : type.toUpperCase())}
                      />
                      <label htmlFor={type} className="text-sm text-slate-600">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-900">Bedrooms</label>
                <div className="flex gap-2">
                  {[1, 2, 3, "4+"].map((num) => (
                    <button
                      key={num}
                      onClick={() => setBedrooms(bedrooms === num.toString() ? null : num.toString())}
                      className={`h-9 w-9 rounded border text-sm font-medium transition-colors ${bedrooms === num.toString()
                        ? "border-blue-900 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-900 hover:text-blue-900"
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-900">Bathrooms</label>
                <div className="flex gap-2">
                  {[1, 2, 3, "4+"].map((num) => (
                    <button
                      key={num}
                      onClick={() => setBathrooms(bathrooms === num.toString() ? null : num.toString())}
                      className={`h-9 w-9 rounded border text-sm font-medium transition-colors ${bathrooms === num.toString()
                        ? "border-blue-900 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-900 hover:text-blue-900"
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-900">Amenities</label>
                <div className="space-y-2">
                  {["WiFi", "Parking", "Gym", "Pool", "Air Conditioning", "Balcony"].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={amenity}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      <label htmlFor={amenity} className="text-sm text-slate-600">{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setPriceRange([0, 500000]);
                  setSelectedType(null);
                  setBedrooms(null);
                  setBathrooms(null);
                  setSelectedAmenities([]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">
              {isLoading ? "Searching..." : `${totalItems} Properties Found`}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Sort by:</span>
              <Select className="w-[180px]">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {properties.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                  <SearchIcon className="mb-2 h-10 w-10 text-slate-400" />
                  <h3 className="text-lg font-medium text-slate-900">No properties found</h3>
                  <p className="text-slate-500">Try adjusting your search filters.</p>
                </div>
              )}
            </>
          )}

          {!isLoading && properties.length > 0 && (
            <div className="mt-10 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
