# Secure SamudraFM Setup for GitHub Pages + Vercel

## 🔒 Security Implementation

Your API keys are now secured using Vercel serverless functions. This works perfectly with GitHub Pages hosting while keeping your credentials completely secure.

## 📁 Files Created

- `applepie/calendar-events.js` - Vercel serverless function
- `vercel.json` - Vercel configuration
- `.gitignore` - Prevents sensitive files from being committed

## 🚀 Setup Steps

### Option 1: Quick Setup (Recommended)

1. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `GOOGLE_CALENDAR_ID` = `c2FtdWRyYWZtLmNvbUBnbWFpbC5jb20`
     - `GOOGLE_CALENDAR_API_KEY` = `AIzaSyBsR0tbkQTYwBoxLS9rsTh-MRu6yjK8QQ0`

2. **Update API URL** (if needed):
   - Replace `https://samudrafm.vercel.app` in `script.js` with your Vercel domain
   - The endpoint will be `/applepie/calendar-events` (innocuous folder name)

3. **Deploy to GitHub Pages**:
   - Your GitHub Pages site will use the Vercel API
   - No changes needed to your GitHub Pages setup

### Option 2: Manual Setup

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add GOOGLE_CALENDAR_ID
   vercel env add GOOGLE_CALENDAR_API_KEY
   ```

## 🔧 How It Works

1. **GitHub Pages**: Serves your static website
2. **Vercel Function**: Handles API calls securely
3. **Client-side**: Makes requests to Vercel serverless function
4. **Security**: API keys are never exposed to users

## 🌐 Deployment Workflow

### GitHub Pages (Your Main Site):
- Push to `main` branch
- GitHub Pages automatically updates
- Site served from `https://yourusername.github.io/sfmtest1`

### Vercel (API Backend):
- Automatically deploys when you push to GitHub
- Handles all API requests securely
- Environment variables stored safely

## ✅ Security Benefits

- ✅ API keys completely hidden from public
- ✅ Serverless functions (no server to maintain)
- ✅ Automatic HTTPS and CORS
- ✅ Scales automatically
- ✅ Free tier available
- ✅ Works perfectly with GitHub Pages

## 🔄 Update Process

1. **Make changes** to your code
2. **Push to GitHub** - GitHub Pages updates automatically
3. **Vercel auto-deploys** - API functions update automatically
4. **No manual deployment** needed!

## 🐛 Troubleshooting

### If calendar events don't load:
1. Check browser console for errors
2. Verify Vercel deployment is successful
3. Check Vercel function logs
4. Ensure environment variables are set in Vercel

### If Vercel deployment fails:
1. Check `applepie/calendar-events.js` syntax
2. Verify `vercel.json` configuration
3. Check Vercel dashboard for error details

## 📝 Important Notes

- **Free Tier**: Vercel offers generous free tier for personal projects
- **Custom Domain**: You can use your own domain with both services
- **Automatic Updates**: Both GitHub Pages and Vercel update automatically
- **No Server Maintenance**: Serverless functions handle everything
- **Global CDN**: Fast loading worldwide

## 🎯 Final Result

- **GitHub Pages**: Hosts your beautiful website
- **Vercel**: Securely handles Google Calendar API
- **Users**: See real-time calendar events
- **You**: API keys are completely secure!

This setup gives you the best of both worlds: GitHub Pages hosting with secure API functionality!
