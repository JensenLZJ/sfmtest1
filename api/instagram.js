const fetch = require('node-fetch');

// Instagram API handler for Vercel
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

  try {
    const accessToken = process.env.MY_INSTAGRAM_API || 'IGAAKR1FYftV5BZAFJhalA4ZAk9nUEtXbWUtdnVsd092aEZAjMXJ3b2JNZAFZAMd1V5VFRoZAmpPOV9QM3hCQ2Fua1pRVFBJMGw3S1VrZAkU4Wkk0eURZAalQwNjJvQTEtR2ViZAWxyam43TU0tVGx6RDV4ZADFmSjctN0FobWw5LU9hRnRYOAZDZD';
    
    console.log('Instagram API called, access token:', accessToken ? 'Present' : 'Missing');
    
    if (!accessToken) {
      res.status(500).json({ 
        success: false, 
        error: 'Instagram API key not configured. Please set MY_INSTAGRAM_API environment variable.' 
      });
      return;
    }

    // Fetch Instagram posts
    const instagramUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}&limit=12`;
    
    const response = await fetch(instagramUrl);
    const data = await response.json();

    if (data.error) {
      console.error('Instagram API Error:', data.error);
      res.status(500).json({ 
        success: false, 
        error: 'Instagram API error: ' + data.error.message 
      });
      return;
    }

    // Transform the data to match your frontend expectations
    const posts = data.data.map(post => ({
      id: post.id,
      caption: post.caption || 'View on Instagram',
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url || post.media_url,
      permalink: post.permalink,
      timestamp: new Date(post.timestamp).toLocaleDateString('en-GB')
    }));

    console.log(`Fetched ${posts.length} Instagram posts total`);

    res.status(200).json({
      success: true,
      posts: posts
    });

  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch Instagram posts' 
    });
  }
}
