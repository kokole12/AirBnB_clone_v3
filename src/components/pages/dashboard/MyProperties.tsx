'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { toast } from "sonner";
import { PropertyCard } from "../../PropertyCard";

interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  thumbnail?: string;
  images?: string[];
  status: string;
  description: string;
  amenities: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface MyPropertiesProps {
  onAddProperty?: () => void;
}

export function MyProperties({ onAddProperty }: MyPropertiesProps) {
  const router = useRouter();
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties/user");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      setProperties(properties.filter(p => p.id !== id));
      toast.success("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  const handleAddProperty = () => {
    if (onAddProperty) {
      onAddProperty();
    } else {
      router.push("/dashboard/add-property");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "secondary";
      case "RENTED":
        return "default";
      case "DRAFT":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Properties</h2>
          <p className="text-slate-500">Manage your property listings and status.</p>
        </div>
        <Button onClick={handleAddProperty} className="bg-blue-900 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No properties listed</h3>
          <p className="mb-4 text-sm text-slate-500 text-center max-w-sm">
            You haven't listed any properties yet. Add your first property to start reaching potential tenants.
          </p>
          <Button onClick={handleAddProperty} className="bg-blue-900 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" /> Add Your First Property
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property as any}
              showActions={true}
              onDelete={handleDeleteProperty}
              onMarkTaken={(id) => {
                console.log("Marking as taken/rented:", id);
                // Implement toggle status logic here
                const updatedProperties = properties.map(p =>
                  p.id === id ? { ...p, status: p.status === 'Active' ? 'Rented' : 'Active' } : p
                );
                setProperties(updatedProperties);
                toast.success(`Property marked as ${updatedProperties.find(p => p.id === id)?.status}`);
              }}
              onDiscount={(id, discount) => {
                console.log("Applying discount:", id, discount);
                // Implement discount logic
                toast.success(`Discount of ${discount} applied`);
              }}
            />
          ))}
        </div>
      )}    </div>
  );
}
