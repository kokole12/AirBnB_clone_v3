
export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  type: "Apartment" | "House" | "Studio" | "Commercial";
  listingType: "RENT" | "SALE";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  images?: string[];
  status: "Active" | "Draft" | "Rented";
  description: string;
  amenities: string[];
  ownerId: string;
  views: number;
  inquiries: number;
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    price: 2500,
    currency: "$",
    location: "Downtown, Seattle, WA",
    type: "Apartment",
    listingType: "RENT",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop",
    status: "Active",
    description: "Experience luxury living in the heart of the city. This modern apartment features floor-to-ceiling windows, a chef's kitchen, and amenities galore.",
    amenities: ["Gym", "Pool", "Concierge", "Parking"],
    ownerId: "u1",
    views: 1240,
    inquiries: 12,
  },
  {
    id: "2",
    title: "Cozy Suburban House",
    price: 3200,
    currency: "$",
    location: "Bellevue, WA",
    type: "House",
    listingType: "RENT",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2400,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
    status: "Active",
    description: "Perfect for families, this spacious house offers a large backyard, modern appliances, and is located in a top-rated school district.",
    amenities: ["Backyard", "Garage", "Fireplace", "Pet Friendly"],
    ownerId: "u1",
    views: 890,
    inquiries: 8,
  },
  {
    id: "3",
    title: "Industrial Loft Studio",
    price: 1800,
    currency: "$",
    location: "Capitol Hill, Seattle, WA",
    type: "Studio",
    listingType: "RENT",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop",
    status: "Rented",
    description: "Trendy loft with exposed brick walls and high ceilings. Steps away from the best nightlife and restaurants.",
    amenities: ["Roof Deck", "Laundry in Unit", "Elevator"],
    ownerId: "u1",
    views: 2100,
    inquiries: 25,
  },
  {
    id: "4",
    title: "Seaside Villa",
    price: 5500000,
    currency: "$",
    location: "Malibu, CA",
    type: "House",
    listingType: "SALE",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3500,
    image: "https://images.unsplash.com/photo-1600596542815-60c375043303?q=80&w=1000&auto=format&fit=crop",
    status: "Active",
    description: "Breathtaking ocean views from every room. This villa is the epitome of luxury coastal living.",
    amenities: ["Private Beach Access", "Infinity Pool", "Smart Home", "Wine Cellar"],
    ownerId: "u2",
    views: 540,
    inquiries: 3,
  },
  {
    id: "5",
    title: "Minimalist City Condo",
    price: 2100,
    currency: "$",
    location: "Austin, TX",
    type: "Apartment",
    listingType: "RENT",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 800,
    image: "https://images.unsplash.com/photo-1556912172-4545a9315284?q=80&w=1000&auto=format&fit=crop",
    status: "Active",
    description: "Sleek and modern condo in the vibrant downtown area. Close to music venues and parks.",
    amenities: ["Gym", "Coworking Space", "Pool"],
    ownerId: "u2",
    views: 1100,
    inquiries: 15,
  }
];

export const MOCK_MESSAGES = [
  {
    id: "1",
    sender: "John Doe",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    lastMessage: "Is the apartment still available for viewing this weekend?",
    time: "10:30 AM",
    unread: 2,
    propertyId: "1",
    propertyTitle: "Modern Downtown Apartment",
  },
  {
    id: "2",
    sender: "Sarah Smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    lastMessage: "Thanks for the information. I will get back to you.",
    time: "Yesterday",
    unread: 0,
    propertyId: "2",
    propertyTitle: "Cozy Suburban House",
  },
  {
    id: "3",
    sender: "Michael Brown",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
    lastMessage: "I submitted the application.",
    time: "2 days ago",
    unread: 0,
    propertyId: "1",
    propertyTitle: "Modern Downtown Apartment",
  },
];
