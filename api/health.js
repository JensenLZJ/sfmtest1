// Health check API handler for Vercel
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'SamudraFM API is running',
    timestamp: new Date().toISOString(),
    environment: {
      instagram: 'hardcoded',
      calendar: 'hardcoded', 
      sheets: 'hardcoded'
    }
  });
}
