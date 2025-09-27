# SamudraFM Website - Development Setup

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Main website: http://localhost:3000
   - Coming soon page: http://localhost:3000/coming-soon
   - Request page: http://localhost:3000/request

## 🔧 Features

- **Cache Clearing**: All cache-busting measures are active
- **CORS Enabled**: Works with external APIs
- **Static File Serving**: Serves all your HTML, CSS, JS, and images
- **404 Handling**: Custom 404 page for missing routes
- **No-Cache Headers**: Forces fresh content on every visit

## 📁 Project Structure

```
sfmtest1/
├── index.html          # Main website
├── coming-soon.html    # Coming soon page
├── request.html        # Request page
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript
├── sw.js              # Service worker
├── asset-protection.js # Asset protection
├── images/            # Image assets
├── server.js          # Node.js server
├── package.json       # Dependencies
└── README-DEV.md      # This file
```

## 🌐 Accessing the Website

Once the server is running, you can access:

- **Main Site**: http://localhost:3000
- **Coming Soon**: http://localhost:3000/coming-soon  
- **Request Page**: http://localhost:3000/request
- **Any other file**: http://localhost:3000/filename

## 🔄 Cache Clearing

The server is configured to:
- Send no-cache headers for all responses
- Force fresh content on every visit
- Work with the cache-busting measures in your HTML/JS files

## 🛠️ Development Tips

- Use `npm run dev` for development (auto-restart on file changes)
- The server serves files from the current directory
- All static files are served with no-cache headers
- CORS is enabled for API calls

## 🚨 Troubleshooting

If you encounter issues:

1. **Port already in use**: Change the PORT in server.js or kill the process using port 3000
2. **Module not found**: Run `npm install` again
3. **Cache issues**: The server forces no-cache, but you can also hard refresh (Ctrl+F5)

## 📱 Mobile Testing

To test on mobile devices on the same network:
1. Find your computer's IP address
2. Access http://YOUR_IP:3000 from your mobile device
3. Make sure both devices are on the same WiFi network
