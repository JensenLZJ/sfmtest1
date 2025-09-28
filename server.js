const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const HOST = '0.0.0.0';

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

const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Add cache-busting headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
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
    
    // Try to open browser
    const { exec } = require('child_process');
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${start} http://${HOST}:${PORT}/`);
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
