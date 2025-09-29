// Main API handler
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req;
  
  // Route to different handlers based on URL
  if (url === '/api/instagram') {
    return handleInstagram(req, res);
  } else if (url === '/api/calendar') {
    return handleCalendar(req, res);
  } else if (url === '/api/health') {
    return handleHealth(req, res);
  } else {
    res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
};

async function handleInstagram(req, res) {
  try {
    const accessToken = process.env.MY_INSTAGRAM_API || 'IGAAKR1FYftV5BZAFJhalA4ZAk9nUEtXbWUtdnVsd092aEZAjMXJ3b2JNZAFZAMd1V5VFRoZAmpPOV9QM3hCQ2Fua1pRVFBJMGw3S1VrZAkU4Wkk0eURZAalQwNjJvQTEtR2ViZAWxyam43TU0tVGx6RDV4ZADFmSjctN0FobWw5LU9hRnRYOAZDZD';
    
    if (!accessToken) {
      res.status(500).json({ 
        success: false, 
        error: 'Instagram API key not configured' 
      });
      return;
    }

    const instagramUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}&limit=12`;
    
    const response = await fetch(instagramUrl);
    const data = await response.json();

    if (data.error) {
      res.status(500).json({ 
        success: false, 
        error: 'Instagram API error: ' + data.error.message 
      });
      return;
    }

    const posts = data.data.map(post => ({
      id: post.id,
      caption: post.caption || 'View on Instagram',
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url || post.media_url,
      permalink: post.permalink,
      timestamp: new Date(post.timestamp).toLocaleDateString('en-GB')
    }));

    res.status(200).json({
      success: true,
      posts: posts
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch Instagram posts' 
    });
  }
}

async function handleCalendar(req, res) {
  try {
    const apiKey = process.env.MY_CALENDAR_API || 'AIzaSyAwJIWjqSccC0lITDPo-qu4Xas3MHkBXX4';
    const calendarId = 'samudrafm.com@gmail.com';
    
    if (!apiKey) {
      res.status(500).json({ 
        success: false, 
        error: 'Calendar API key not configured' 
      });
      return;
    }

    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString();
    
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&maxResults=10&singleEvents=true&orderBy=startTime`;
    
    const response = await fetch(calendarUrl);
    const data = await response.json();

    if (data.error) {
      res.status(500).json({ 
        success: false, 
        error: 'Google Calendar API error: ' + data.error.message 
      });
      return;
    }

    const events = data.items.map(event => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      location: event.location || '',
      url: event.htmlLink || ''
    }));

    res.status(200).json({
      success: true,
      events: events
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch calendar events' 
    });
  }
}

async function handleHealth(req, res) {
  res.status(200).json({
    success: true,
    message: 'SamudraFM API is running',
    timestamp: new Date().toISOString(),
    environment: {
      instagram: process.env.MY_INSTAGRAM_API ? 'configured' : 'missing',
      calendar: process.env.MY_CALENDAR_API ? 'configured' : 'missing',
      sheets: process.env.MY_SHEET_API ? 'configured' : 'missing'
    }
  });
}
