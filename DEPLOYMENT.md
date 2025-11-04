# Deploy CampusShelf on Render

## Prerequisites
1. A Render account (sign up at https://render.com)
2. Your code pushed to GitHub, GitLab, or Bitbucket
3. MongoDB Atlas connection string ready

## Step 1: Push to Git Repository
Make sure your code is pushed to a Git repository:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Connect Repository on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub/GitLab/Bitbucket repository
4. Select your `Campus_Shelf` repository

## Step 3: Configure Environment Variables
In the Render dashboard, add these environment variables:

**Required:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
- `JWT_SECRET` - A long random string for JWT token signing
  - Generate one: `openssl rand -hex 32`
- `MONGODB_DB` - Database name (default: `campus_shelf`)
- `NODE_ENV` - Set to `production`

**Optional (for image uploads):**
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

## Step 4: Configure Build Settings
Render should auto-detect these from `render.yaml`, but verify:
- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `pnpm start`
- **Node Version:** 20 (or latest LTS)

## Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically:
   - Install dependencies with pnpm
   - Build your Next.js app
   - Start the server
3. Wait for deployment to complete (5-10 minutes)

## Step 6: Seed Database (After Deployment)
Once deployed, visit your app URL and call the seed endpoint:
```
https://your-app-name.onrender.com/api/seed
```
Or use curl:
```bash
curl -X POST https://your-app-name.onrender.com/api/seed
```

## Step 7: Test Your Deployment
- Visit your Render URL (e.g., `https://campus-shelf.onrender.com`)
- Test user signup/login
- Test creating listings
- Test viewing products

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version is compatible

### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or Render's IPs
- Ensure database name matches in connection string

### App Crashes on Start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure `JWT_SECRET` is set

### Images Not Loading
- If using Cloudinary, verify credentials are set
- Check image paths in your database
- Verify `public/` folder images are included in deployment

## Render Plan Recommendations
- **Free Tier:** Good for testing (spins down after inactivity)
- **Starter Plan ($7/month):** Better for production (always on)
- **Professional Plans:** For high traffic

## Custom Domain (Optional)
1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain and follow DNS setup instructions

## Auto-Deploy
Render automatically deploys when you push to your main branch. You can disable this in settings if needed.
