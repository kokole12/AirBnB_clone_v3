# Property Image Upload Setup Guide

## Overview
Properties are uploaded to Supabase Storage, which provides secure file storage with public URL access.

## Setup Steps

### 1. Create Supabase Storage Bucket

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **Create a new bucket**
5. Create a bucket named: `property-images`
6. Set it to **Public** (allow public read access)
7. Click **Create bucket**

### 2. Set Bucket Policies

After creating the bucket, set these RLS (Row Level Security) policies:

**For uploading (authenticated users only):**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  bucket_id = 'property-images'
);
```

**For public read access:**
```sql
CREATE POLICY "Allow public read"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');
```

### 3. Verify Your Credentials

Check your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## How It Works

### Image Upload Flow

1. **User selects images** in the "Add Property" form
2. **Preview generated** - Images shown before publishing
3. **Upload on publish** - When "Publish Property" is clicked:
   - Images uploaded to Supabase Storage
   - Public URLs generated
   - URLs saved to database with property
   - Property created with thumbnail and images array

### Image Storage Structure

```
property-images/
└── properties/
    ├── [timestamp]-[random]-image1.jpg
    ├── [timestamp]-[random]-image2.jpg
    └── [timestamp]-[random]-image3.jpg
```

### Image Display

- **Thumbnail** - First image in array, displayed in property list
- **Other images** - Can display in property detail page
- **URLs** - Stored in database for easy retrieval

## API Endpoints

### Create Property with Images
```
POST /api/properties
Body: {
  title: string
  description: string
  price: number
  currency: string
  type: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  bedrooms: number
  bathrooms: number
  sqft: number
  amenities: string[]
  images: string[] (URLs from Supabase)
  thumbnail: string (first image URL)
  availableFrom: ISO date string
  status: "ACTIVE"
}
```

### Get User's Properties
```
GET /api/properties/user
Returns: Property[] (with thumbnail and images)
```

### Get Single Property
```
GET /api/properties/[id]
Returns: Property object with all images
```

### Delete Property
```
DELETE /api/properties/[id]
Removes property from database (images remain in storage)
```

## Troubleshooting

### Images not uploading
- Check Supabase credentials in `.env.local`
- Verify bucket exists and is public
- Check browser console for error messages

### Public URLs not working
- Ensure bucket is set to **Public**
- Check RLS policies allow public read access
- Verify image filename was successfully created

### CORS Issues
- Supabase should handle CORS automatically
- If issues persist, contact Supabase support

## Image Size Recommendations

- **Maximum file size**: 5MB per image (configurable)
- **Recommended format**: JPG, PNG, WebP
- **Optimal dimensions**: 1200x800px for thumbnails
- **For quality**: Use 2-3x dimensions and let CSS scale down

## Cleanup

Images are stored in Supabase until manually deleted. Old images are not automatically removed when properties are deleted. To clean up:

1. Go to Supabase Dashboard → Storage
2. Navigate to `property-images/properties/`
3. Manually delete old image files

Or create a cleanup script to remove unused images.

## Example - Adding a Property with Images

```typescript
// 1. Select images and get file objects
const files = event.target.files;

// 2. Upload each image to Supabase
const uploadedUrls = [];
for (const file of files) {
  const { data, error } = await supabase.storage
    .from("property-images")
    .upload(`properties/${filename}`, file);
  
  const { data: publicData } = supabase.storage
    .from("property-images")
    .getPublicUrl(`properties/${filename}`);
  
  uploadedUrls.push(publicData.publicUrl);
}

// 3. Create property with image URLs
const response = await fetch("/api/properties", {
  method: "POST",
  body: JSON.stringify({
    ...propertyData,
    images: uploadedUrls,
    thumbnail: uploadedUrls[0]
  })
});
```
