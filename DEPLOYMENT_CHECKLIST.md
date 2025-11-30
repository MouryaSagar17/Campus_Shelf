# Render Deployment Checklist ✅

## Pre-Deployment Verification

### ✅ Code Status
- [x] All code committed and pushed to GitHub
- [x] Vercel dependencies removed
- [x] render.yaml configured correctly
- [x] ESLint configured
- [x] No build errors

### ✅ Configuration Files
- [x] `render.yaml` - Render deployment config
- [x] `package.json` - Dependencies defined
- [x] `next.config.mjs` - Next.js config
- [x] `.gitignore` - Sensitive files excluded

## Render Deployment Steps

### 1. Connect Repository
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub account
4. Select repository: `MouryaSagar17/Campus_Shelf`
5. Render will auto-detect `render.yaml`

### 2. Environment Variables (Set in Render Dashboard)
**Required:**
- `MONGODB_URI` = `mongodb+srv://campus:CTH7YetzSLdXxBDz@cluster0.5j7lwei.mongodb.net/campus_shelf?retryWrites=true&w=majority`
- `MONGODB_DB` = `campus_shelf`
- `JWT_SECRET` = (Generate with: `openssl rand -hex 32`)
- `NODE_ENV` = `production`

**Optional (for image uploads):**
- `CLOUDINARY_CLOUD_NAME` = (your cloud name)
- `CLOUDINARY_API_KEY` = (your API key)
- `CLOUDINARY_API_SECRET` = (your API secret)

### 3. Build Settings (Auto-detected from render.yaml)
- **Build Command:** `corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm run build`
- **Start Command:** `pnpm start`
- **Node Version:** 20

### 4. Deploy
- Click "Create Web Service"
- Wait for build to complete (5-10 minutes)
- Your app will be live at: `https://campus-shelf.onrender.com` (or your custom name)

### 5. Post-Deployment
- Test the deployment
- Seed database if needed: `POST https://your-app.onrender.com/api/seed`

## Important Notes

⚠️ **Vercel Status on GitHub:**
- The red X from Vercel is just a status indicator
- It does NOT prevent Render deployment
- You can safely ignore it or disconnect Vercel later
- Render deployment is completely independent

✅ **You can deploy to Render right now!**

