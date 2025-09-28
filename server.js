const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const fetch = require('node-fetch');

const PORT = 8000;
const HOST = '0.0.0.0';

// API Configuration - using environment variables with fallbacks for local development
const API_CONFIG = {
  // Instagram API
  instagram: {
    accessToken: process.env.MY_INSTAGRAM_API || 'IGAAKR1FYftV5BZAFMwRUVrM1Nwak44cUlGaUhqWWhXdlZAyTFZAjZAVBFYzRoZAFViVklmVmNYeEJoS3RvNklOaHlEQjd1UVFfV0pUdmQwN2pZAVlpNbkE5LTFXSXg5UUl2TmpiQXc1bXoxZAHhQYWF3Mzl6blk4T1M4bG1nMmMtX0JuawZDZD',
    appId: process.env.MY_INSTAGRAM_APP_ID || '723291117434206',
    appSecret: process.env.MY_INSTAGRAM_APP_SECRET || '11f5a58610ee6c7e708fcc7cec378e41'
  },
  // Google Calendar API
  calendar: {
    apiKey: process.env.MY_CALENDAR_API || 'AIzaSyBsR0tbkQTYwBoxLS9rsTh-MRu6yjK8QQ0',
    calendarId: 'samudrafm.com@gmail.com'
  },
  // Google Sheets API
  sheets: {
    apiKey: process.env.MY_SHEET_API || '',
    spreadsheetId: '' // You'll need to provide this
  }
};

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
    
    if (!accessToken) {
      throw new Error('Instagram API key not configured');
    }
    
    // Get the user's media
    const mediaUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}&limit=12`;
    
    const response = await fetch(mediaUrl);
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Instagram API error: ${data.error.message}`);
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      posts: data.data || []
    }));
    
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
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
      throw new Error('Google Calendar API key not configured');
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
    console.log('🚀 SamudraFM Server Starting...');
    console.log(`📡 Server running at: http://${HOST}:${PORT}/`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌐 Open your browser to: http://${HOST}:${PORT}/`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
    console.log('-'.repeat(50));
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
