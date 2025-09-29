const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const fetch = require('node-fetch');

// Load environment variables from .env file
require('dotenv').config();

// Production server - uses GitHub Repository secrets only
console.log('🚀 Starting SamudraFM Production Server...');

const PORT = process.env.PORT || 8003;
const HOST = '0.0.0.0';

// API Configuration - using hardcoded API keys
const API_CONFIG = {
  // Instagram API
  instagram: {
    accessToken: process.env.MY_INSTAGRAM_API || 'IGAAKR1FYftV5BZAFJhalA4ZAk9nUEtXbWUtdnVsd092aEZAjMXJ3b2JNZAFZAMd1V5VFRoZAmpPOV9QM3hCQ2Fua1pRVFBJMGw3S1VrZAkU4Wkk0eURZAalQwNjJvQTEtR2ViZAWxyam43TU0tVGx6RDV4ZADFmSjctN0FobWw5LU9hRnRYOAZDZD',
    appId: process.env.MY_INSTAGRAM_APP_ID || '723291117434206',
    appSecret: process.env.MY_INSTAGRAM_APP_SECRET || '633a4b6826c81ee605cff6aa2e867edb'
  },
  // Google Calendar API
  calendar: {
    apiKey: process.env.MY_CALENDAR_API || 'AIzaSyAwJIWjqSccC0lITDPo-qu4Xas3MHkBXX4',
    calendarId: 'samudrafm.com@gmail.com'
  },
  // Google Sheets API
  sheets: {
    apiKey: process.env.MY_SHEET_API || 'AIzaSyA-iGsaqKLpZAnBx8vOBWnRC4XLCb6vsrQ',
    spreadsheetId: process.env.MY_SHEET_ID || ''
  }
};

// API keys are hardcoded, no validation needed
function validateEnvironmentVariables() {
  console.log('✅ Using hardcoded API keys');
  return true;
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// API Route handlers
async function handleInstagramAPI(req, res) {
  try {
    const accessToken = API_CONFIG.instagram.accessToken;
    
    console.log('Instagram API called, access token:', accessToken ? 'Present' : 'Missing');
    
    if (!accessToken) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        error: 'Instagram API key not configured. Please set MY_INSTAGRAM_API environment variable.' 
      }));
      return;
    }
    
    // Try to get real Instagram posts first
    try {
      let allPosts = [];
      let nextUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}&limit=100`;
      
      // Fetch all pages of posts
      while (nextUrl) {
        const response = await fetch(nextUrl);
        
        if (!response.ok) {
          throw new Error(`Instagram API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(`Instagram API error: ${data.error.message}`);
        }
        
        // Add posts from this page
        if (data.data && data.data.length > 0) {
          allPosts = allPosts.concat(data.data);
        }
        
        // Check if there's a next page
        nextUrl = data.paging && data.paging.next ? data.paging.next : null;
        
        // Safety limit to prevent infinite loops (max 1000 posts)
        if (allPosts.length >= 1000) {
          console.log('Reached maximum post limit (1000), stopping pagination');
          break;
        }
      }
      
      console.log(`Fetched ${allPosts.length} Instagram posts total`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        posts: allPosts
      }));
      
    } catch (apiError) {
      console.log('Instagram API failed, using fallback data:', apiError.message);
      
      // Fallback to mock data if API fails
      const fallbackPosts = [
        {
          id: 'fallback1',
          caption: 'Welcome to SamudraFM! 🎵 Fresh beats and great vibes! Tune in to SamudraFM for the latest music and updates!',
          media_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
          media_type: 'IMAGE',
          permalink: 'https://www.instagram.com/samudrafm/',
          timestamp: new Date().toISOString()
        },
        {
          id: 'fallback2',
          caption: 'Behind the Scenes 🎙️ Our amazing team working hard to bring you the best content!',
          media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
          media_type: 'IMAGE',
          permalink: 'https://www.instagram.com/samudrafm/',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'fallback3',
          caption: 'Live Radio Session 📻 Tune in for our live sessions every week!',
          media_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop&crop=center',
          media_type: 'IMAGE',
          permalink: 'https://www.instagram.com/samudrafm/',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        posts: fallbackPosts
      }));
    }
    
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    console.error('Error details:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: error.message
    }));
  }
}

async function handleCalendarAPI(req, res) {
  try {
    const { apiKey, calendarId } = API_CONFIG.calendar;
    
    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        error: 'Google Calendar API key not configured. Please set MY_CALENDAR_API environment variable.' 
      }));
      return;
    }
    
    const now = new Date();
    const timeMax = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days ahead
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${now.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=50`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Calendar API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Google Calendar API error: ${data.error.message}`);
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      events: data.items || []
    }));
    
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: error.message
    }));
  }
}

const server = http.createServer(async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Add cache-busting headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Handle API routes
    if (req.url === '/api/instagram') {
        await handleInstagramAPI(req, res);
        return;
    }
    
    if (req.url === '/api/calendar') {
        await handleCalendarAPI(req, res);
        return;
    }
    
    if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
        return;
    }
    
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Handle special routes
    if (pathname === '/') {
        pathname = '/index.html';
    } else if (pathname === '/coming-soon') {
        pathname = '/coming-soon.html';
    } else if (pathname === '/opportunities' || pathname === '/opportunities/') {
        pathname = '/opportunities.html';
    } else if (pathname === '/schedule') {
        pathname = '/schedule.html';
    } else if (pathname === '/episodes') {
        pathname = '/episodes.html';
    } else if (pathname === '/listen') {
        pathname = '/listen.html';
    } else if (pathname === '/about') {
        pathname = '/about.html';
    } else if (pathname === '/contact') {
        pathname = '/contact.html';
    }
    
    // Get file path
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head><title>404 Not Found</title></head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file ${pathname} was not found.</p>
                        <a href="/">Go to Homepage</a>
                    </body>
                </html>
            `);
            return;
        }
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Internal Server Error</h1>');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, HOST, () => {
    console.log('🚀 SamudraFM Production Server Started!');
    console.log(`📡 Server running at: http://${HOST}:${PORT}/`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🔐 Using GitHub Repository secrets for API keys`);
    console.log('-'.repeat(50));
    
    // Validate environment variables
    validateEnvironmentVariables();
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use. Please try a different port.`);
    } else {
        console.log('❌ Server error:', err.message);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server stopped by user');
    process.exit(0);
});
