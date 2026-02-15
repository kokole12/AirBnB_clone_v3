import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "USD") {
  const currencyMap: Record<string, string> = {
    "$": "USD",
    "USD": "USD",
    "€": "EUR",
    "£": "GBP",
    "KES": "KES",
    "UGX": "UGX"
  };

  const code = currencyMap[currency] || currency;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
