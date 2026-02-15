import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const landlord = await prisma.user.upsert({
    where: { clerkId: "landlord_demo_001" },
    update: {},
    create: {
      clerkId: "landlord_demo_001",
      email: "landlord@demo.com",
      firstName: "John",
      lastName: "Landlord",
      role: "LANDLORD",
      phone: "+1 (555) 123-4567",
      bio: "Professional property manager with 10+ years of experience",
    },
  });

  const tenant = await prisma.user.upsert({
    where: { clerkId: "tenant_demo_001" },
    update: {},
    create: {
      clerkId: "tenant_demo_001",
      email: "tenant@demo.com",
      firstName: "Jane",
      lastName: "Tenant",
      role: "TENANT",
      phone: "+1 (555) 987-6543",
    },
  });

  console.log("✅ Users created:", { landlord: landlord.id, tenant: tenant.id });

  // Create demo properties
  const property1 = await prisma.property.upsert({
    where: { id: "prop_001" },
    update: {},
    create: {
      ownerId: landlord.id,
      title: "Luxury Downtown Apartment",
      description: "Beautiful 2-bedroom apartment in the heart of downtown with city views",
      price: "2500.00",
      currency: "$",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
      latitude: 37.7749,
      longitude: -122.4194,
      type: "APARTMENT",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      amenities: ["WiFi", "Air Conditioning", "Gym", "Parking", "Dishwasher"],
      available: true,
      status: "ACTIVE",
    },
  });

  const property2 = await prisma.property.upsert({
    where: { id: "prop_002" },
    update: {},
    create: {
      ownerId: landlord.id,
      title: "Modern House with Garden",
      description: "Spacious 3-bedroom house with backyard and garage",
      price: "3500.00",
      currency: "$",
      address: "456 Oak Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "USA",
      latitude: 37.7751,
      longitude: -122.4195,
      type: "HOUSE",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2000,
      amenities: ["Garden", "Garage", "Washer/Dryer", "Fireplace"],
      available: true,
      status: "ACTIVE",
    },
  });

  console.log("✅ Properties created:", { prop1: property1.id, prop2: property2.id });

  // Create a favorite (if the model exists)
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: tenant.id,
        propertyId: property1.id,
      },
    });
    console.log("✅ Favorite created:", favorite.id);
  } catch (e) {
    console.log("⚠️  Skipped favorite creation");
  }

  // Create a message (if the model exists)
  try {
    const message = await prisma.message.create({
      data: {
        senderId: tenant.id,
        receiverId: landlord.id,
        content: "Hi! I'm interested in your downtown apartment. Can we schedule a viewing?",
      },
    });
    console.log("✅ Message created:", message.id);
  } catch (e) {
    console.log("⚠️  Skipped message creation");
  }

  // Create an inquiry (if the model exists)
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId: property1.id,
        tenantName: "Jane Tenant",
        tenantEmail: "jane@example.com",
        tenantPhone: "+1 (555) 987-6543",
        message: "I would like to inquire about this property",
      },
    });
    console.log("✅ Inquiry created:", inquiry.id);
  } catch (e) {
    console.log("⚠️  Skipped inquiry creation");
  }

  console.log("🌱 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
