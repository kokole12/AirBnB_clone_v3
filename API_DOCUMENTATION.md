# API Documentation

This document describes the available API endpoints for the Property Management Marketplace.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### Properties

#### GET /properties
Fetch all properties with optional filters

**Query Parameters:**
- `city` (string): Filter by city
- `type` (string): Filter by property type (APARTMENT, HOUSE, etc.)
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter

**Response:**
```json
[
  {
    "id": "prop_001",
    "title": "Luxury Downtown Apartment",
    "price": 2500,
    "city": "San Francisco",
    "type": "APARTMENT",
    "bedrooms": 2,
    "bathrooms": 2,
    "owner": {
      "id": "user_001",
      "firstName": "John",
      "lastName": "Landlord",
      "avatar": "https://..."
    }
  }
]
```

#### GET /properties/:id
Get a specific property with reviews and owner details

**Response:**
```json
{
  "id": "prop_001",
  "title": "Luxury Downtown Apartment",
  "description": "...",
  "price": 2500,
  "address": "123 Main Street",
  "bedrooms": 2,
  "bathrooms": 2,
  "amenities": ["WiFi", "Gym", "Parking"],
  "reviews": [
    {
      "id": "review_001",
      "rating": 5,
      "comment": "Great place!",
      "author": { "firstName": "Jane", "lastName": "Tenant" }
    }
  ],
  "owner": {
    "id": "user_001",
    "firstName": "John",
    "lastName": "Landlord",
    "phone": "+1 (555) 123-4567",
    "email": "landlord@example.com"
  }
}
```

#### POST /properties (Requires Authentication - Landlord)
Create a new property

**Request Body:**
```json
{
  "title": "New Property",
  "description": "A beautiful new place",
  "price": 2000,
  "address": "456 Oak Ave",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "USA",
  "type": "APARTMENT",
  "bedrooms": 2,
  "bathrooms": 1,
  "sqft": 1000,
  "amenities": ["WiFi", "Parking"],
  "images": ["https://..."],
  "available": true
}
```

#### PATCH /properties/:id (Requires Authentication - Owner)
Update a property

**Request Body:**
Same as POST (only include fields to update)

#### DELETE /properties/:id (Requires Authentication - Owner)
Delete a property

### Users

#### GET /users/me (Requires Authentication)
Get current user profile

**Response:**
```json
{
  "id": "user_001",
  "clerkId": "clerk_123",
  "email": "landlord@example.com",
  "firstName": "John",
  "lastName": "Landlord",
  "role": "LANDLORD",
  "phone": "+1 (555) 123-4567",
  "avatar": "https://...",
  "properties": [
    { "id": "prop_001", "title": "..." }
  ]
}
```

#### POST /users (Requires Authentication)
Create or sync user with Clerk

**Request Body:**
```json
{
  "role": "LANDLORD",
  "phone": "+1 (555) 123-4567",
  "bio": "Professional landlord"
}
```

### Messages

#### GET /messages (Requires Authentication)
Get all messages for the current user

**Response:**
```json
[
  {
    "id": "msg_001",
    "content": "Hi! I'm interested in your property",
    "isRead": false,
    "createdAt": "2026-02-13T10:00:00Z",
    "sender": {
      "id": "user_001",
      "firstName": "Jane",
      "lastName": "Tenant",
      "avatar": "https://..."
    },
    "receiver": {
      "id": "user_002",
      "firstName": "John",
      "lastName": "Landlord"
    }
  }
]
```

#### POST /messages (Requires Authentication)
Send a message

**Request Body:**
```json
{
  "receiverId": "user_002",
  "content": "Hi! I'm interested in your property"
}
```

**Response:**
Same as GET /messages response item

## Authentication

Most endpoints require Clerk authentication. Include the auth token in your request headers:

```
Authorization: Bearer <token>
```

This is handled automatically by the Clerk middleware on the frontend and Clerk's Next.js SDK on the backend.

## Error Responses

All errors follow this format:

```json
{
  "error": "Error description"
}
```

### Common Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `500`: Server error

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production.

## Examples

### Fetch properties in San Francisco under $3000

```bash
curl "http://localhost:3000/api/properties?city=San%20Francisco&maxPrice=3000"
```

### Create a new property

```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "New Apartment",
    "price": 2500,
    "address": "123 Main St",
    "city": "San Francisco",
    ...
  }'
```

### Send a message

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "receiverId": "user_002",
    "content": "Hello! I am interested in your property."
  }'
```
