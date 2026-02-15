"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Maximize, Heart, Edit, Trash2, Tag, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Property } from "../lib/data";
import { formatPrice } from "../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PropertyCardProps {
  property: Property;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onMarkTaken?: (id: string) => void;
  onDiscount?: (id: string, discount: number) => void;
}

export function PropertyCard({ property, showActions, onDelete, onMarkTaken, onDiscount }: PropertyCardProps) {
  const [discountPrice, setDiscountPrice] = React.useState<string>("");
  const isForSale = property.listingType === "SALE";

  const handleDiscountSubmit = () => {
    if (onDiscount && discountPrice) {
      onDiscount(property.id, parseFloat(discountPrice));
      setDiscountPrice("");
    }
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md border-slate-200 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-400">No image</div>
        )}

        {/* Listing Type Badge */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          <Badge variant={isForSale ? "default" : "secondary"} className={isForSale ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"}>
            {isForSale ? "For Sale" : "For Rent"}
          </Badge>
          {property.status !== "Active" && (
            <Badge variant="outline" className="bg-slate-900 text-white border-none">
              {property.status}
            </Badge>
          )}
        </div>

        {!showActions && (
          <div className="absolute right-3 top-3">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 text-slate-500 hover:text-red-500 hover:bg-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            {formatPrice(property.price, property.currency)}
            {!isForSale && <span className="text-sm font-normal text-slate-500">/mo</span>}
          </h3>
        </div>

        <h4 className="mb-1 truncate text-lg font-semibold text-slate-800" title={property.title}>
          {property.title}
        </h4>

        <div className="mb-4 flex items-center text-sm text-slate-500">
          <MapPin className="mr-1 h-3.5 w-3.5" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4 text-blue-900" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-blue-900" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4 text-blue-900" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      {showActions ? (
        <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-4 gap-2">

          {/* Edit */}
          <Link href={`/dashboard/properties/${property.id}/edit`} className="w-full">
            <Button variant="outline" size="sm" className="w-full px-0" title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>

          {/* Discount */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full px-0" title="Apply Discount">
                <Tag className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply Discount</DialogTitle>
                <DialogDescription>
                  Enter the new discounted price for this property.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount-price" className="text-right">
                    New Price
                  </Label>
                  <Input
                    id="discount-price"
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="col-span-3"
                    placeholder="Amount"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleDiscountSubmit}>Save Discount</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Mark as Taken */}
          <Button
            variant="outline"
            size="sm"
            className="w-full px-0"
            title="Mark as Taken/Active"
            onClick={() => onMarkTaken?.(property.id)}
          >
            <CheckCircle className={`h-4 w-4 ${property.status === 'Rented' ? 'text-green-600' : ''}`} />
          </Button>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full px-0 hover:bg-red-50 hover:text-red-600" title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  property listing and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete?.(property.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="p-5 pt-0">
          <Link href={`/property?id=${property.id}`}>
            <Button className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
