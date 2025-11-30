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
JWT_SECRET=your-jwt-secret-key

# Optional (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional (for email sending - password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@campusshelf.com

# Optional (for production)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Notes:**
- If Cloudinary variables are omitted, images will be stored as base64 in the database
- If SMTP variables are omitted, password reset emails won't be sent (check console in development)
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- In development, reset links will be logged to console if email is not configured