const fetch = require('node-fetch');

// Google Calendar API handler for Vercel
export default async function handler(req, res) {
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
    const apiKey = process.env.MY_CALENDAR_API;
    const calendarId = 'samudrafm.com@gmail.com';
    
    console.log('Calendar API called, API key:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      res.status(500).json({ 
        success: false, 
        error: 'Calendar API key not configured. Please set MY_CALENDAR_API environment variable.' 
      });
      return;
    }

    // Fetch calendar events
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(); // 30 days from now
    
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&maxResults=10&singleEvents=true&orderBy=startTime`;
    
    const response = await fetch(calendarUrl);
    const data = await response.json();

    if (data.error) {
      console.error('Google Calendar API Error:', data.error);
      res.status(500).json({ 
        success: false, 
        error: 'Google Calendar API error: ' + data.error.message 
      });
      return;
    }

    // Transform the data to match your frontend expectations
    const events = data.items.map(event => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      location: event.location || '',
      url: event.htmlLink || ''
    }));

    console.log(`Fetched ${events.length} calendar events total`);

    res.status(200).json({
      success: true,
      events: events
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch calendar events' 
    });
  }
}
