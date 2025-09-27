const express = require('express');
const path = require('path');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes with specific configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma']
}));

// Set cache control headers for all responses
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// Serve static files from the current directory
app.use(express.static('.', {
  setHeaders: (res, path) => {
    // Force no-cache for all static files
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }
}));

// Route for the main page (redirects to coming soon unless bypassed)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for coming soon page
app.get('/coming-soon', (req, res) => {
  res.sendFile(path.join(__dirname, 'coming-soon.html'));
});

// Route for request page
app.get('/request', (req, res) => {
  res.sendFile(path.join(__dirname, 'request.html'));
});

// Proxy route for Mixcloud API to avoid CORS issues
app.get('/api/mixcloud/*', (req, res) => {
  const mixcloudPath = req.path.replace('/api/mixcloud', '');
  const mixcloudUrl = `https://api.mixcloud.com${mixcloudPath}`;
  
  console.log(`Proxying Mixcloud API request: ${mixcloudUrl}`);
  
  https.get(mixcloudUrl, (mixcloudRes) => {
    let data = '';
    
    mixcloudRes.on('data', (chunk) => {
      data += chunk;
    });
    
    mixcloudRes.on('end', () => {
      res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.send(data);
    });
  }).on('error', (err) => {
    console.error('Mixcloud API Error:', err);
    res.status(500).json({ error: 'Failed to fetch from Mixcloud API' });
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 SamudraFM Server running at:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log(`\n📻 Website Features:`);
  console.log(`   • Home (redirects to coming soon): http://localhost:${PORT}`);
  console.log(`   • Coming soon: http://localhost:${PORT}/coming-soon`);
  console.log(`   • Main site (secret access): http://localhost:${PORT}?bypass=1`);
  console.log(`   • Request page: http://localhost:${PORT}/request`);
  console.log(`\n🔄 Cache clearing is enabled - fresh content on every visit!`);
  console.log(`\nPress Ctrl+C to stop the server`);
});
