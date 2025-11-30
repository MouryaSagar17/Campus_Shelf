# CampusShelf - Student Marketplace

A full-stack marketplace platform for students to buy and sell study materials, books, electronics, and more.

## Overview

CampusShelf is a Next.js application that allows students to:
- Browse and search for study materials, books, electronics, and other items
- Post listings with images
- Manage favorites and shopping cart
- Chat with sellers
- Manage their own listings

## Deployment

This project is configured for deployment on **Render.com**.

See `render.yaml` for deployment configuration.

To deploy on Render:
1. Connect your GitHub repository to Render
2. Render will automatically detect the `render.yaml` file
3. Set up environment variables in Render dashboard
4. Deploy!

## Local Setup

1. Create a `.env.local` file with:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>/<db-name>?retryWrites=true&w=majority
MONGODB_DB=campus_shelf
```

2. Install deps and run dev:

```bash
pnpm install
pnpm dev
```

- Listings API:
  - GET `/api/listings` → list
  - POST `/api/listings` → create (expects JSON body)
  - GET `/api/listings/[id]` → detail

The products pages will prefer server data and fall back to `lib/dummy-data.js` if the API or DB is unavailable.

## Backend Endpoints

- Listings
  - GET `/api/listings` — query params: `q`, `category`, `college`, `sort` (price,-price,rating,-rating,-createdAt), `page`, `limit`
  - POST `/api/listings` — JSON body or multipart form-data (`title, description, category, price, college, image`)
  - GET `/api/listings/[id]`
  - PUT `/api/listings/[id]`
  - DELETE `/api/listings/[id]`

## Environment Variables

Create `.env.local`:

```
MONGODB_URI=your-mongodb-uri
MONGODB_DB=campus_shelf

# Optional (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

If Cloudinary variables are omitted, the API will still accept JSON posts but won't upload images.