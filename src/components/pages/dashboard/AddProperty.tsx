'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface AddPropertyProps {
  onCancel?: () => void;
  onSave?: () => void;
}

interface PropertyForm {
  title: string;
  description: string;
  price: string;
  currency: string;
  listingType: "RENT" | "SALE";
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  amenities: string[];
  availableFrom: string;
  images: File[];
  imagePreviews: string[];
}

const AMENITIES = ["WiFi", "Parking", "Pool", "Gym", "Air Conditioning", "Heating", "Washer/Dryer", "Pet Friendly", "Balcony", "Garden"];

export function AddProperty({ onCancel, onSave }: AddPropertyProps) {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [form, setForm] = React.useState<PropertyForm>({
    title: "",
    description: "",
    price: "",
    currency: "USD",
    listingType: "RENT",
    type: "APARTMENT",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    amenities: [],
    availableFrom: "",
    images: [],
    imagePreviews: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...form.images, ...files];
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setForm(prev => ({
      ...prev,
      images: newFiles,
      imagePreviews: newPreviews
    }));
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of form.images) {
      try {
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("property-images")
          .upload(`properties/${filename}`, file);

        if (error) {
          console.error("Upload error:", error);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: publicData } = supabase.storage
          .from("property-images")
          .getPublicUrl(`properties/${filename}`);

        uploadedUrls.push(publicData.publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      }
    }

    return uploadedUrls;
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Upload images
      const imageUrls = await uploadImages();

      if (form.images.length > 0 && imageUrls.length === 0) {
        toast.error("Failed to upload images");
        setIsLoading(false);
        return;
      }

      // Create property
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          currency: form.currency,
          listingType: form.listingType,
          type: form.type,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
          bedrooms: parseInt(form.bedrooms) || 0,
          bathrooms: parseInt(form.bathrooms) || 0,
          sqft: parseInt(form.sqft) || 0,
          amenities: form.amenities,
          images: imageUrls,
          thumbnail: imageUrls[0] || "",
          availableFrom: form.availableFrom ? new Date(form.availableFrom).toISOString() : null,
          status: "ACTIVE",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to create property");
        setIsLoading(false);
        return;
      }

      toast.success("Property created successfully!");

      if (onSave) {
        onSave();
      } else {
        router.push("/dashboard/properties");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create property");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/dashboard/properties");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Add New Property</h2>
            <p className="text-slate-500">Step {step} of 3</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={`h-2 rounded-full ${step >= 1 ? "bg-blue-900" : "bg-slate-200"}`} />
        <div className={`h-2 rounded-full ${step >= 2 ? "bg-blue-900" : "bg-slate-200"}`} />
        <div className={`h-2 rounded-full ${step >= 3 ? "bg-blue-900" : "bg-slate-200"}`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Basic Information"}
            {step === 2 && "Property Details"}
            {step === 3 && "Images & Publishing"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Modern Downtown Apartment"
                  value={form.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your property..."
                  className="min-h-[120px]"
                  value={form.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Listing Type */}
              <div className="space-y-2">
                <Label>Listing Type *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, listingType: "RENT" }))}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${form.listingType === "RENT"
                        ? "border-blue-900 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                  >
                    For Rent
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, listingType: "SALE" }))}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${form.listingType === "SALE"
                        ? "border-blue-900 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                  >
                    For Sale
                  </button>
                </div>
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder={form.listingType === "RENT" ? "2500" : "250000"}
                    value={form.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="KES">KES (Ksh)</option>
                    <option value="UGX">UGX (USh)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Property Type *</Label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="STUDIO">Studio</option>
                  <option value="CONDO">Condo</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="VILLA">Villa</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St"
                    value={form.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Seattle"
                    value={form.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="WA"
                    value={form.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="98101"
                    value={form.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="USA"
                    value={form.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    placeholder="2"
                    value={form.bedrooms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    placeholder="2"
                    value={form.bathrooms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Size (sqft)</Label>
                  <Input
                    id="sqft"
                    name="sqft"
                    type="number"
                    placeholder="1100"
                    value={form.sqft}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {AMENITIES.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`amenity-${item}`}
                        checked={form.amenities.includes(item)}
                        onChange={() => handleAmenityChange(item)}
                        className="rounded border-slate-300 text-blue-900"
                      />
                      <label htmlFor={`amenity-${item}`} className="text-sm text-slate-600">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Label className="mb-4 block">Property Photos</Label>
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center transition-colors hover:bg-slate-100 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                    <UploadCloud className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-slate-900">Upload Photos</h3>
                  <p className="mb-4 text-sm text-slate-500">Drag and drop your images here, or click to browse</p>
                  <Button variant="outline" type="button">Select Files</Button>
                </div>

                {form.imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {form.imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden bg-slate-200 aspect-square">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  name="availableFrom"
                  type="date"
                  value={form.availableFrom}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Next Step</Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading}
              >
                {isLoading ? "Publishing..." : "Publish Property"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
