// Vercel Serverless Function for Google Calendar API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
    
    if (!calendarId || !apiKey) {
      console.error('Missing environment variables');
      return res.status(500).json({ 
        error: 'Calendar configuration missing',
        fallback: true 
      });
    }
    
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${now.toISOString()}&timeMax=${oneWeekFromNow.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=10`;
    
    console.log('Fetching calendar events from Google API...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Calendar API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to fetch calendar events',
        details: errorText,
        fallback: true 
      });
    }
    
    const data = await response.json();
    console.log('Calendar events received:', data.items?.length || 0, 'events');
    
    res.status(200).json({
      success: true,
      events: data.items || []
    });
    
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      fallback: true 
    });
  }
}
