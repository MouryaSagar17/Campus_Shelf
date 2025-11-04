# CampusShelf React App

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mouryamourya289-6687s-projects/v0-campus-shelf-react-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/RqAVvUXwvLr)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/mouryamourya289-6687s-projects/v0-campus-shelf-react-app](https://vercel.com/mouryamourya289-6687s-projects/v0-campus-shelf-react-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/RqAVvUXwvLr](https://v0.app/chat/projects/RqAVvUXwvLr)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

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