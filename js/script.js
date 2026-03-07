// SamduraFM front-end behaviors and mock data wiring
// Script.js loaded successfully

// Disable right-click (context menu) on the whole website
document.addEventListener('contextmenu', function(e) { e.preventDefault(); });

// Robust mobile detection that works on cache loads
function isMobile() {
  // Primary detection: User agent (most reliable)
  const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Secondary detection: Touch capabilities
  const touchMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  // Tertiary detection: Screen width (only if available)
  const screenMobile = window.innerWidth && window.innerWidth <= 768;
  
  const isMobileResult = userAgentMobile || touchMobile || screenMobile;
  
  return isMobileResult;
}

// Player ready state tracking
let isPlayerReady = false;
let isPlayerLoading = false;
let isPlayButtonHiddenOnMobile = false;

// Clear any existing caches and force fresh content loading
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
  });
}

// Hidden easter egg - hiring message (delayed 5 seconds)
setTimeout(() => {
  console.log('%c🥚 Easter Egg Found!\n%cLike looking under the hood? We\'re interested in people like you!\n%cCome and join us: https://samudrafm.com/opportunities/\n%cWe\'re always looking for talented students! 🚀',
    'color: #f91e5a; font-size: 16px; font-weight: bold;',
    'color: #8b4c93; font-size: 14px;',
    'color: #f91e5a; font-size: 12px; text-decoration: underline;',
    'color: #8b4c93; font-size: 12px; font-style: italic;');
}, 5000);

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Audio controls - now handled by Mixcloud widget
// Media Session API for mobile lock screen controls
if ('mediaSession' in navigator) {
  
  // Set up media session metadata
  function updateMediaSession(episode) {
    if (!episode) return;
    
    
    navigator.mediaSession.metadata = new MediaMetadata({
      title: episode.name || 'SamudraFM',
      artist: 'SamudraFM',
      album: 'Your study, your music',
      artwork: episode.picture ? [
        { src: episode.picture, sizes: '96x96', type: 'image/jpeg' },
        { src: episode.picture, sizes: '128x128', type: 'image/jpeg' },
        { src: episode.picture, sizes: '192x192', type: 'image/jpeg' },
        { src: episode.picture, sizes: '256x256', type: 'image/jpeg' },
        { src: episode.picture, sizes: '384x384', type: 'image/jpeg' },
        { src: episode.picture, sizes: '512x512', type: 'image/jpeg' }
      ] : [
        { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '96x96', type: 'image/png' },
        { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '128x128', type: 'image/png' },
        { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '192x192', type: 'image/png' },
        { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '256x256', type: 'image/png' },
        { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '384x384', type: 'image/png' },
        { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '512x512', type: 'image/png' }
      ]
    });
  }

  // Set up media session action handlers
  navigator.mediaSession.setActionHandler('play', () => {
    if (window.currentWidget && window.currentWidget.play) {
      window.currentWidget.play();
    } else if (window.currentEpisode) {
      window.playEpisode(window.currentEpisode);
    }
  });

  navigator.mediaSession.setActionHandler('pause', () => {
    if (window.currentWidget && window.currentWidget.pause) {
      window.currentWidget.pause();
    } else {
      window.pauseAudio();
    }
  });

  navigator.mediaSession.setActionHandler('stop', () => {
    window.pauseAudio();
  });

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    // Could implement previous episode functionality
  });

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    // Could implement next episode functionality
  });

  // Update playback state
  function updatePlaybackState(playing) {
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  // Set initial metadata
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'SamudraFM',
    artist: 'Your study, your music',
    album: 'Live Radio',
    artwork: [
      { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '96x96', type: 'image/png' },
      { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '128x128', type: 'image/png' },
      { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '192x192', type: 'image/png' },
      { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '256x256', type: 'image/png' },
      { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '384x384', type: 'image/png' },
      { src: 'assets/brandmark/SamudraFMLogo1.png', sizes: '512x512', type: 'image/png' }
    ]
  });

  // Make functions globally available
  window.updateMediaSession = updateMediaSession;
  window.updatePlaybackState = updatePlaybackState;
  
} else {
  // Media Session API not supported on this device
}

// Mock data (replace with your API later)
const MOCK_NOW = {
  host: 'Daf',
  show: 'Banishing the Thursday blues! Until 20:00',
  track: 'The Subway � Chappell Roan',
  progress: 42
};

const MOCK_RECENT = [
  { title: 'Down Under (feat. Colin Hay)', artist: 'Luude', time: '18:51', cover: null },
  { title: 'DAISIES', artist: 'Justin Bieber', time: '18:46', cover: null },
  { title: "Don't Get Me Wrong", artist: 'Lewis Capaldi', time: '18:40', cover: null },
  { title: 'As It Was', artist: 'Harry Styles', time: '18:36', cover: null }
];

// Profile picture mapping (same as schedule page)
const profilePictures = {
  // Jensen variations
  'JensenL': 'assets/avatar/Jensen.jpg',
  'Jensen': 'assets/avatar/Jensen.jpg',
  'JensenLim': 'assets/avatar/Jensen.jpg',
  'Jensen Lim': 'assets/avatar/Jensen.jpg',
  'Jensen L': 'assets/avatar/Jensen.jpg',
  'Jensen Lim Zi Jen': 'assets/avatar/Jensen.jpg',
  // Justin
  'Justin': 'assets/avatar/Justin.jpg',
  'Justin Choe': 'assets/avatar/Justin.jpg',
  // Srishti/Shristi variations
  'Srishti': 'assets/avatar/Srishti.jpg',
  'Shristi': 'assets/avatar/Srishti.jpg',
  // Vyshavi
  'Vyshavi': 'assets/avatar/vyshavi.png',
  'Vyshavi A/P Nandan': 'assets/avatar/vyshavi.png',
  'Vyshavi A/P Nandan': 'assets/avatar/vyshavi.png',
  // Noelle
  'Noelle': 'assets/avatar/noellechoy.png',
  'Noelle Choy Ee Theng': 'assets/avatar/noellechoy.png',
  // Benjamin
  'Benjamin': 'assets/avatar/benjaminedward.png',
  'Benjamin Edward Ng': 'assets/avatar/benjaminedward.png',
  // Ho Qing Qing
  'Qing Qing': 'assets/avatar/qinqing.png',
  'Ho Qing Qing': 'assets/avatar/qinqing.png',
  'QingQing': 'assets/avatar/qinqing.png',
  // Airil Daniel
  'Airil': 'assets/avatar/airildaniel.png',
  'Airil Daniel': 'assets/avatar/airildaniel.png',
  // Karisemma
  'Karisemma': 'assets/avatar/karisemma.png',
  // Ryan
  'Ryan': 'assets/avatar/ryanliew.png',
  'Ryan Liew Kye Le': 'assets/avatar/ryanliew.png',
  // Michelle
  'Michelle': 'assets/avatar/michellechantelle.png',
  'Michelle Chantelle': 'assets/avatar/michellechantelle.png',
  // Shayna
  'Shayna': 'assets/avatar/shaynaprisha.png',
  'Shayna Prisha': 'assets/avatar/shaynaprisha.png',
  // Sereena
  'Sereena': 'assets/avatar/sereenaanjali.png',
  'Sereena Anjali': 'assets/avatar/sereenaanjali.png',
  // Mr. Bean variations
  'mrbean': 'assets/avatar/mrbean.jpg',
  'Mrbean': 'assets/avatar/mrbean.jpg',
  'MrBean': 'assets/avatar/mrbean.jpg',
  'Mr. Bean': 'assets/avatar/mrbean.jpg',
  // Mr. Eugene
  'mreugene': 'assets/avatar/mreugene.png',
  'MrEugene': 'assets/avatar/mreugene.png',
  'Mr. Eugene': 'assets/avatar/mreugene.png',
  // Fallback for unknown presenters
  'Marcus': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'Jess': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
  'James': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'Lana': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'Jessica': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
  'Niv': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'Gavin': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'TBA': 'assets/brandmark/sfmTextLogoBG1.svg'
};

// Function to get profile picture for a presenter
function getProfilePicture(presenterName) {
  // Clean the presenter name (remove extra spaces, special characters)
  const cleanName = presenterName.trim().replace(/[^\w\s]/g, '');
  
  // Check for exact matches first
  if (profilePictures[cleanName]) {
    return profilePictures[cleanName];
  }
  
  // Check for partial matches (for names like "Jess & James")
  for (const [key, image] of Object.entries(profilePictures)) {
    if (cleanName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(cleanName.toLowerCase())) {
      return image;
    }
  }
  
  // Default fallback - use SamudraFM logo SVG
  return 'assets/brandmark/sfmTextLogoBG1.svg';
}

const MOCK_COMING = [
  { title: 'Jensen', desc: 'A Wee Mystical Magical Show', time: '20:00 � 22:00', cover: null },
  { title: 'Good guy', desc: 'Throwbacks With Good guy', time: '22:00 � 00:00', cover: null }
];

async function fetchInstagramPosts() {
  try {
    // Use custom-posts.json as the primary reliable source
    return await getFallbackInstagramPosts();
  } catch (error) {
    return await getFallbackInstagramPosts();
  }
}

// Fallback Instagram posts if API fails - loads from custom-posts.json
async function getFallbackInstagramPosts() {
  // Always use the JSON file, don't ever fall back to hardcoded data
  try {
    // Always fetch from custom-posts.json (force busting cache)
    const response = await fetch('json/custom-posts.json?v=' + Date.now(), { headers: { 'Accept': 'application/json' } });

    if (!response.ok) {
      throw new Error('Failed to load json/custom-posts.json');
    }

    const data = await response.json();

    // Ensure posts is an array
    if (!data || !Array.isArray(data.posts)) {
      throw new Error('json/custom-posts.json is malformed or empty');
    }

    // Always map using the JSON data structure
    const posts = data.posts.map((post, index) => ({
      id: post.id || `custom-${index}`,
      caption: post.content || post.title || 'Instagram Post',
      mediaUrl: post.image,
      thumbnailUrl: post.image,
      permalink: post.link || 'https://www.instagram.com/samudrafm/',
      timestamp: post.date || new Date().toISOString()
    }));

    return posts;
  } catch (error) {
    // If there's any error, do not fallback to hardcoded posts,
    // Always return empty array if JSON is unavailable
    // This ensures strict adherence to "always use JSON"
    return [];
  }
}

// Hardcoded fallback posts as last resort
function getHardcodedFallbackPosts() {
  return [
    {
      id: 'fallback-1',
      caption: 'Welcome to SamudraFM! Your study, your music. 🎵',
      mediaUrl: 'assets/brandmark/SamudraFMLogo1.png',
      thumbnailUrl: 'assets/brandmark/SamudraFMLogo1.png',
      permalink: 'https://www.instagram.com/samudrafm/',
      timestamp: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      caption: 'Tune in to our latest shows and discover new music! 🎧',
      mediaUrl: 'assets/brandmark/SamudraFMLogo1.png',
      thumbnailUrl: 'assets/brandmark/SamudraFMLogo1.png',
      permalink: 'https://www.instagram.com/samudrafm/',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'fallback-3',
      caption: 'Helping you focus, unwind, and stay inspired — one song at a time. ✨',
      mediaUrl: 'assets/brandmark/SamudraFMLogo1.png',
      thumbnailUrl: 'assets/brandmark/SamudraFMLogo1.png',
      permalink: 'https://www.instagram.com/samudrafm/',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}

// Render Instagram posts
function renderInstagramPosts(posts) {
  const container = document.getElementById('instagram-feed');
  if (!container) {
    console.error('Instagram feed container not found in renderInstagramPosts');
    return;
  }
  
  if (!posts || posts.length === 0) {
    // No posts to render, showing no posts message
    container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">No Instagram posts available</p>';
    return;
  }
  
  const html = posts.map(post => {
    const imageUrl = post.mediaUrl || post.media_url || post.thumbnail_url || post.image;
    const caption = post.caption || post.content || post.title || 'View on Instagram';
    const truncatedCaption = caption.length > 100 ? caption.substring(0, 100) + '...' : caption;
    const timestamp = new Date(post.timestamp || post.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const permalink = post.permalink || post.link || 'https://www.instagram.com/samudrafm/';
    
    return `
      <div class="instagram-card" onclick="window.open('${permalink}', '_blank')">
        <div class="instagram-cover" style="background-image: url('${imageUrl}')">
          <div class="instagram-date-overlay">
            <p class="instagram-date">${timestamp}</p>
          </div>
          <div class="instagram-overlay">
            <a href="${permalink}" target="_blank" rel="noopener" class="instagram-link">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div class="instagram-content">
            <p class="instagram-caption">${truncatedCaption}</p>
        </div>
      </div>
    `;
  }).join('');
  
  // Setting Instagram feed HTML
  container.innerHTML = html;
  // Instagram feed HTML set successfully
  // Final container innerHTML set
}

// Google Calendar Integration - Direct API call
async function fetchGoogleCalendarEvents() {
  try {
    // Fetching Google Calendar events from API
    
    const apiKey = 'AIzaSyAwJIWjqSccC0lITDPo-qu4Xas3MHkBXX4';
    const calendarId = 'samudrafm.com@gmail.com';
    
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString();
    
    // Use JSONP approach for static hosting
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&maxResults=50&singleEvents=true&orderBy=startTime&callback=handleCalendarResponse`;
    
    return new Promise((resolve, reject) => {
      // Create a unique callback function name
      const callbackName = 'googleCalendarCallback_' + Date.now();
      
      // Create the script tag for JSONP
      const script = document.createElement('script');
      script.src = calendarUrl.replace('callback=handleCalendarResponse', `callback=${callbackName}`);
      
      // Define the callback function
      window[callbackName] = function(data) {
        try {
          // Clean up
          document.head.removeChild(script);
          delete window[callbackName];
          
          if (data.error) {
            throw new Error(`Google Calendar API error: ${data.error.message}`);
          }
          
          // Successfully fetched Google Calendar events
          
          // Transform the data to match the expected format
          const events = data.items.map(event => ({
            summary: event.summary || 'Untitled Event',
            description: event.description || '',
            start: {
              dateTime: event.start.dateTime || event.start.date
            },
            end: {
              dateTime: event.end.dateTime || event.end.date
            },
            location: event.location || 'Online',
            htmlLink: event.htmlLink || 'https://samudrafm.com'
          }));
          
          // Filter events to only show upcoming ones
          const upcomingEvents = events.filter(event => {
            const eventDate = new Date(event.start.dateTime);
            const isUpcoming = eventDate >= now;
            // Event processed for upcoming check
            return isUpcoming;
          }).slice(0, 10);
          
          // Upcoming events processed
          resolve(upcomingEvents);
        } catch (error) {
          reject(error);
        }
      };
      
      // Handle script load error
      script.onerror = function() {
        document.head.removeChild(script);
        delete window[callbackName];
        reject(new Error('Failed to load Google Calendar script'));
      };
      
      // Add script to head
      document.head.appendChild(script);
    });
    
  } catch (error) {
    //console.error('Error fetching Google Calendar events:', error);
    // Return fallback data if API fails
    return getFallbackCalendarEvents();
  }
}

// Fallback calendar events if API fails
function getFallbackCalendarEvents() {
  const now = new Date();
  return [
    {
      id: 'fallback-1',
      summary: 'No Data',
      description: 'No Show',
      start: { dateTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString() },
      location: 'Online',
      htmlLink: 'https://samudrafm.com'
    },
    {
      id: 'fallback-2',
      summary: 'No Data',
      description: 'No Show',
      start: { dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString() },
      location: 'Online',
      htmlLink: 'https://samudrafm.com'
    },
    {
      id: 'fallback-3',
      summary: 'No Data',
      description: 'No Show',
      start: { dateTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString() },
      location: 'Online',
      htmlLink: 'https://samudrafm.com'
    }
  ];
}

// Fallback direct Google Calendar API (disabled for security)
async function fetchGoogleCalendarEventsDirect() {
  // This fallback is disabled to prevent API key exposure
  // All API calls should go through the secure backend
  //console.warn('Fallback Google Calendar API is disabled for security');
  return [];
}

function formatCalendarEvent(event) {
  const start = event.start?.dateTime || event.start?.date;
  const end = event.end?.dateTime || event.end?.date;
  
  // Extract presenter name from event title or description
  let presenter = 'Unknown Presenter';
  let showTitle = event.summary || 'Untitled Show';
  
  // Try to extract presenter from title (format: "Presenter Name - Show Title")
  const titleParts = showTitle.split(' - ');
  if (titleParts.length >= 2) {
    presenter = titleParts[0].trim();
    showTitle = titleParts.slice(1).join(' - ').trim();
  }
  
  // Format time
  let timeString = '';
  if (start) {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    
    if (event.start?.dateTime) {
      // Timed event
      timeString = startDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      if (endDate) {
        timeString += ` - ${endDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })}`;
      }
    } else {
      // All-day event
      timeString = 'All Day';
    }
  }
  
  // Extract date and day information
  let dateString = '';
  let dayString = '';
  if (start) {
    const startDate = new Date(start);
    dateString = startDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
    dayString = startDate.toLocaleDateString('en-GB', {
      weekday: 'long'
    });
  }
  
  return {
    title: presenter,
    desc: showTitle,
    time: timeString,
    cover: getProfilePicture(presenter),
    date: dateString,
    day: dayString,
    startRaw: start,
    endRaw: end
  };
}

// Update hero presenter card from formatted events
function updatePresenterCard(events) {
  const card = document.getElementById('hero-presenter-card');
  if (!card) return;
  
  const nameEl = document.getElementById('presenter-name');
  const descEl = document.getElementById('presenter-desc');
  const timeEl = document.getElementById('presenter-time');
  const avatarEl = document.getElementById('presenter-avatar');
  
  if (!nameEl || !descEl || !timeEl || !avatarEl) return;
  
  const now = new Date();
  let current = null;
  
  if (Array.isArray(events)) {
    current = events.find(ev => {
      if (!ev.startRaw || !ev.endRaw) return false;
      const s = new Date(ev.startRaw);
      const e = new Date(ev.endRaw);
      return !isNaN(s) && !isNaN(e) && s <= now && now <= e;
    }) || null;
  }
  
  if (!current) {
    // Fallback: AutoDJ
    nameEl.textContent = 'AutoDJ';
    descEl.textContent = 'Non-stop music on SamudraFM.';
    timeEl.textContent = 'Streaming all day.';
    avatarEl.style.backgroundImage = "url('assets/brandmark/sfmTextLogoBG1.svg')";
    return;
  }
  
  nameEl.textContent = current.title || 'Live presenter';
  descEl.textContent = current.desc || '';
  
  if (current.endRaw) {
    const endDate = new Date(current.endRaw);
    if (!isNaN(endDate)) {
      const until = endDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      timeEl.textContent = `On air until ${until}`;
    } else {
      timeEl.textContent = current.time || '';
    }
  } else {
    timeEl.textContent = current.time || '';
  }
  
  const coverUrl = current.cover || getProfilePicture(current.title || '');
  avatarEl.style.backgroundImage = `url('${coverUrl}')`;
}

// Helpers for placeholders ---------------------------------------------------
function withCover(url){
  return url ? `<div class="cover" style="background-image:url('${url}')" onerror="this.style.backgroundImage='url(assets/brandmark/SamudraFMLogo1.png)'"></div>` : `<div class="cover placeholder"></div>`;
}

// Render recent grid (if element exists)
const recentGrid = document.getElementById('recent-grid');
if (recentGrid) {
  recentGrid.innerHTML = MOCK_RECENT.map(item => `
    <article class="card" role="listitem">
      ${withCover(item.cover)}
      <div class="content">
        <p class="title">${item.title}</p>
        <p class="meta">${item.artist} � Played at ${item.time}</p>
      </div>
    </article>
  `).join('');
}

// Load coming up events when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add a small delay to ensure all elements are ready
  setTimeout(() => {
    const comingGrid = document.getElementById('coming-grid');
    
    if (comingGrid) {
      // Show loading state immediately
      comingGrid.innerHTML = '<div class="loading-state">Loading upcoming shows...</div>';
      
      // Load events with retry logic
      loadComingUpEventsWithRetry();
    } else {
      // Retry after a longer delay
      setTimeout(() => {
        const retryGrid = document.getElementById('coming-grid');
        if (retryGrid) {
          retryGrid.innerHTML = '<div class="loading-state">Loading upcoming shows...</div>';
          loadComingUpEventsWithRetry();
        }
      }, 1000);
    }
  }, 100);
});

// Load coming up events with retry logic
async function loadComingUpEventsWithRetry() {
  const comingGrid = document.getElementById('coming-grid');
  if (!comingGrid) return;
  
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount < maxRetries) {
    try {
      await loadComingUpEvents();
      return; // Success, exit retry loop
    } catch (error) {
      retryCount++;
      if (retryCount < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      } else {
        comingGrid.innerHTML = '<div class="no-events">Unable to load upcoming shows</div>';
      }
    }
  }
}


async function loadComingUpEvents() {
  // loadComingUpEvents function called
  const comingGrid = document.getElementById('coming-grid');
  // coming-grid found
  if (!comingGrid) return;
  
  // Show loading state
  comingGrid.innerHTML = '<div class="loading-state">Loading upcoming shows...</div>';
  
  try {
    // Try Google Calendar first
    const events = await fetchGoogleCalendarEvents();
    // Calendar events received
    
    if (events && events.length > 0) {
      // Processing calendar events
      const formattedEvents = events.map(formatCalendarEvent);
      // Formatted events processed
      renderComingUpEvents(formattedEvents);
      // Hero presenter card is updated only by nowplaying.js from API (do not overwrite)
      return;
    } else {
      // No calendar events found, using fallback
    }
    
  } catch (error) {
    //console.error('Error loading coming up events:', error);
  }
  
  // Use fallback data with proper formatting
  const fallbackEvents = [
    { 
      title: 'JensenL', 
      desc: 'A Wee Mystical Magical Show', 
      time: '20:00 - 22:00', 
      cover: 'assets/avatar/Jensen.jpg',
      date: '1 Oct',
      day: 'Wednesday'
    },
    { 
      title: 'Srishti', 
      desc: 'Study Vibes Session', 
      time: '19:00 - 21:00', 
      cover: 'assets/avatar/Srishti.jpg',
      date: '2 Oct',
      day: 'Thursday'
    }
  ];
  
  // Using fallback events
  renderComingUpEvents(fallbackEvents);
}

function renderComingUpEvents(events) {
  // renderComingUpEvents called
  const comingGrid = document.getElementById('coming-grid');
  // coming-grid element found
  if (!comingGrid) {
    // coming-grid element not found
    return;
  }
  
  if (!events || events.length === 0) {
    // No events provided, showing no-events message
    comingGrid.innerHTML = '<div class="no-events">No upcoming shows scheduled</div>';
    return;
  }
  
  // Rendering events
  
  // Show only the 2 latest events
  const limitedEvents = events.slice(0, 2);
  
  // Show limited events in vertical scrollable format
  const html = limitedEvents.map(item => {
    // Use profile picture if cover is null or empty
    const coverUrl = item.cover || getProfilePicture(item.title);
    return `
      <article class="card coming-up-card">
        ${withCover(coverUrl)}
      <div class="content">
        <p class="title">${item.title}</p>
        <p class="meta">${item.desc}</p>
        <p class="meta">${item.time}</p>
        ${item.date && item.day ? `<p class="meta date-day">${item.date} · ${item.day}</p>` : ''}
      </div>
    </article>
    `;
  }).join('');
  
  comingGrid.innerHTML = html;
  // Coming up events rendered successfully
}

// Handle logo click to go to home page
document.querySelector('.brand').addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = '/';
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    }
  });
});

// Mixcloud integration ------------------------------------------------------
// Set your Mixcloud username here
const MIXCLOUD_USERNAME = 'SamudraFM';
const MIXCLOUD_API_KEY = 'gDVAEf3yoChF4fkXFxfXNwl3XMkZEs0g';

let mixcloudNextUrl = null;
const isHttpContext = location.protocol === 'http:' || location.protocol === 'https:';

// Episodes Slider
let episodes = [];
let currentSlide = 0;
let episodesPerSlide = 4; // Show 4 episodes per slide
let totalSlides = 0;


async function loadMixcloudEpisodes(username, nextUrl) {
  if (!username) return;
  const slider = document.getElementById('episodes-slider');
  if (!slider) {
    return;
  }
  
  if (!nextUrl && !slider.dataset.loaded) {
    slider.innerHTML = '<p class="muted">Loading episodes�</p>';
  }
  
  try {
    // Load episodes from Mixcloud API directly
    const apiUrl = nextUrl || `https://api.mixcloud.com/${username}/cloudcasts/?limit=12`;
    const res = await fetch(apiUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    const items = (data.data || []).map(item => ({
      url: item.url,
      name: item.name,
      created: item.created_time ? new Date(item.created_time) : null,
      picture: item.pictures ? (item.pictures.extra_large || item.pictures.large || item.pictures.medium) : ''
    }));
    
    mixcloudNextUrl = data.paging && data.paging.next ? data.paging.next : null;
    if (!items.length) {
      // No episodes available
      slider.innerHTML = '<p class="muted">No episodes available at the moment.</p>';
      return;
    }
    
    // Store episodes for slider
    if (!nextUrl) {
      episodes = items;
      initEpisodesSlider();
    } else {
      episodes = [...episodes, ...items];
      updateSliderDots();
    }
    
    renderEpisodesSlider();
    attachEpisodeClickHandlers();

    const loadBtn = document.getElementById('episodes-load');
    if (loadBtn) {
      if (!mixcloudNextUrl) {
        loadBtn.style.display = 'none';
      } else {
        loadBtn.disabled = false;
        loadBtn.style.display = 'inline-flex';
      }
    }
  } catch (err) {
    console.error('Error loading episodes:', err);
    
    // Show error message when API fails
    slider.innerHTML = '<p class="muted">Unable to load episodes at the moment.</p>';
  }
  
  // After episodes are loaded, ensure play button is ready
  setTimeout(() => {
    ensurePlayButtonReady();
  }, 100);
}

// Fallback episodes function removed - using real Mixcloud data only

function initEpisodesSlider() {
  totalSlides = Math.ceil(episodes.length / episodesPerSlide);
  createSliderDots();
  updateSliderControls();
}

/**
 * Extract date from episode title if it appears in parentheses.
 * Matches: (3/3/26), (7 October 2025), (23 June 2023), etc.
 * @param {string} title - Episode title
 * @returns {{ dateOnly: string, fullMatch: string }} dateOnly = text without brackets; fullMatch = (date) for stripping from title; both '' if none
 */
function extractDateFromTitle(title) {
  if (!title || typeof title !== 'string') return { dateOnly: '', fullMatch: '' };
  const monthNames = 'January|February|March|April|May|June|July|August|September|October|November|December';
  const inParens = /\(([^)]+)\)/g;
  let match;
  while ((match = inParens.exec(title)) !== null) {
    const s = match[1].trim();
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(s)) return { dateOnly: s, fullMatch: match[0] };
    if (new RegExp(`^\\d{1,2}\\s+(${monthNames})\\s+\\d{4}$`, 'i').test(s)) return { dateOnly: s, fullMatch: match[0] };
  }
  return { dateOnly: '', fullMatch: '' };
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Convert short date (e.g. 3/3/26) to full date (e.g. 3 March 2026).
 * Numeric format is parsed as day/month/year. Already full dates (e.g. 7 October 2025) are returned as-is.
 * @param {string} dateOnly - Date string without brackets
 * @returns {string} Full date string
 */
function formatDateFull(dateOnly) {
  if (!dateOnly || typeof dateOnly !== 'string') return dateOnly || '';
  const s = dateOnly.trim();
  const numeric = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
  const m = s.match(numeric);
  if (m) {
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    let year = parseInt(m[3], 10);
    if (year < 100) year += year < 50 ? 2000 : 1900;
    if (month < 1 || month > 12) return s;
    return day + ' ' + MONTH_NAMES[month - 1] + ' ' + year;
  }
  return s;
}

function renderEpisodesSlider() {
  const slider = document.getElementById('episodes-slider');
  if (!slider) {
    
    return;
  }


  const html = episodes.map((ep, i) => {
    const imageUrl = ep.pictures?.large || ep.pictures?.medium || ep.picture || 'assets/brandmark/SamudraFMLogo1.png';
    const { dateOnly, fullMatch } = extractDateFromTitle(ep.name);
    const titleWithoutDate = fullMatch ? ep.name.replace(fullMatch, '').trim() : ep.name;
    const metaDate = dateOnly ? formatDateFull(dateOnly) : '';
    
    return `
      <article class="card episodes-card clickable-card" data-ep-index="${i}">
        <div class="cover" style="background-image:url('${imageUrl}')"></div>
        <div class="content">
          <p class="title">${titleWithoutDate}</p>
          ${metaDate ? `<p class="meta">${metaDate}</p>` : ''}
          <span class="play-link">Click to play now ▶</span>
        </div>
      </article>
    `;
  }).join('');
  
  slider.innerHTML = html;
  slider.dataset.loaded = '1';
}

function createSliderDots() {
  const dotsContainer = document.getElementById('episode-dots');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === currentSlide ? 'active' : ''}`;
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
}

function updateSliderDots() {
  totalSlides = Math.ceil(episodes.length / episodesPerSlide);
  createSliderDots();
  updateSliderControls();
}

function updateSliderPosition() {
  const slider = document.getElementById('episodes-slider');
  if (!slider) return;

  const slideWidth = 220 + 14; // card width + gap
  const translateX = -currentSlide * episodesPerSlide * slideWidth;
  slider.style.transform = `translateX(${translateX}px)`;
}

function updateSliderControls() {
  const prevBtn = document.getElementById('prev-episode');
  const nextBtn = document.getElementById('next-episode');

  if (prevBtn) prevBtn.disabled = currentSlide === 0;
  if (nextBtn) nextBtn.disabled = currentSlide >= totalSlides - 1;

  // Update dots
  const dots = document.querySelectorAll('.slider-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function goToSlide(slideIndex) {
  if (slideIndex < 0 || slideIndex >= totalSlides) return;
  
  currentSlide = slideIndex;
  updateSliderPosition();
  updateSliderControls();
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    goToSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
}

function attachEpisodeClickHandlers() {
  const slider = document.getElementById('episodes-slider');
  if (!slider) return;

  slider.querySelectorAll('.episodes-card').forEach((card, idx) => {
    const episode = episodes[idx];
    card.addEventListener('click', (e) => {
      // Prevent any redirect to Mixcloud
      e.preventDefault();
      e.stopPropagation();
      
      // Play the episode when clicking anywhere on the card
      playEpisode(episode);
    });
  });
}

// Load episodes for home page (using original slider functionality)
async function loadHomeEpisodes() {
  const episodesSlider = document.getElementById('episodes-slider');
  if (!episodesSlider) return;

  try {
    episodesSlider.innerHTML = '<p class="muted">Loading episodes...</p>';
    
    // Load episodes from Mixcloud API directly
    const res = await fetch(`https://api.mixcloud.com/${MIXCLOUD_USERNAME}/cloudcasts/?limit=12`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    const items = data.data || [];
    
    if (items.length === 0) {
      episodesSlider.innerHTML = '<p class="muted">No episodes available at the moment.</p>';
      return;
    }
    
    // Store episodes for slider functionality
    episodes = items;
    
    // Initialize and render the slider
    initEpisodesSlider();
    renderEpisodesSlider();
    attachEpisodeClickHandlers();
    
  } catch (error) {
    console.error('Error loading home episodes:', error);
    episodesSlider.innerHTML = '<p class="muted">Unable to load episodes at the moment.</p>';
  }
}

// Load episodes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add a small delay to ensure all elements are ready
  setTimeout(() => {
    const episodesSlider = document.getElementById('episodes-slider');
    
    if (episodesSlider) {
      // Show loading state immediately
      episodesSlider.innerHTML = '<p class="muted">Loading episodes...</p>';
      
      // Load episodes with retry logic
      loadEpisodesWithRetry();
    } else {
      // Retry after a longer delay
      setTimeout(() => {
        const retrySlider = document.getElementById('episodes-slider');
        if (retrySlider) {
          retrySlider.innerHTML = '<p class="muted">Loading episodes...</p>';
          loadEpisodesWithRetry();
        }
      }, 1000);
    }
  }, 100);
});

// Load episodes with retry logic
function getNextEpisode() {
  
  if (!episodes || episodes.length === 0) {
    return null;
  }
  
  // Find current episode index
  const currentIndex = episodes.findIndex(ep => 
    currentEpisode && ep.url === currentEpisode.url
  );
  
  if (currentIndex === -1) {
    return null;
  }
  
  // Get next episode (wrap around to first if at end)
  const nextIndex = (currentIndex + 1) % episodes.length;
  const nextEpisode = episodes[nextIndex];
  
  return nextEpisode;
}

// Add event listeners for episodes navigation buttons
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('episodes-prev');
  const nextBtn = document.getElementById('episodes-next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevEpisode);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextEpisode);
  }
  
  // Timeout: if no episodes load after 5 seconds, show message
  setTimeout(() => {
    const slider = document.getElementById('episodes-slider');
    if (slider && !slider.dataset.loaded) {
      slider.innerHTML = '<p class="muted">Loading episodes...</p>';
    }
  }, 5000);
});

const loadMoreBtn = document.getElementById('episodes-load');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    if (mixcloudNextUrl) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'Loading...';
      loadMixcloudEpisodes(MIXCLOUD_USERNAME, mixcloudNextUrl).finally(() => {
        loadMoreBtn.disabled = !mixcloudNextUrl;
        loadMoreBtn.textContent = 'Load more';
      });
    }
  });
}



// Slider button event listeners
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prev-episode');
  const nextBtn = document.getElementById('next-episode');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }
});

// Episodes navigation functions
function prevEpisode() {
  const slider = document.getElementById('episodes-slider');
  if (slider) {
    const container = slider.parentElement;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }
}

function nextEpisode() {
  const slider = document.getElementById('episodes-slider');
  if (slider) {
    const container = slider.parentElement;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
}

// Audio player for episodes -------------------------------------------------------
let currentEpisode = null;
let isCurrentlyPlaying = false;
let currentWidget = null;
let lastPlayPauseClickTime = 0;
const PLAY_PAUSE_CLICK_DEBOUNCE_MS = 400;
let currentEpisodeIndex = 0; // Track current episode index for auto-play

// Function to get the next episode for auto-play
function getNextEpisode() {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  // Find current episode index
  const currentIndex = episodes.findIndex(ep =>
    currentEpisode && ep.url === currentEpisode.url
  );

  if (currentIndex === -1) {
    return null;
  }

  // Get next episode (wrap around to first if at end)
  const nextIndex = (currentIndex + 1) % episodes.length;
  const nextEpisode = episodes[nextIndex];

  return nextEpisode;
}

// Function to handle auto-play next episode
function handleAutoPlayNext() {
  const nextEpisode = getNextEpisode();
  if (nextEpisode) {
    // Update current episode index
    currentEpisodeIndex = episodes.findIndex(ep => ep.url === nextEpisode.url);

    // Set auto-play flag
    window.isAutoPlaying = true;

    // Special handling for mobile auto-play
    if (isMobileDevice()) {
      // Ensure play button is visible and ready for mobile
      const playPauseBtn = document.getElementById('hero-play-pause');
      if (playPauseBtn) {
        // Show play button immediately for auto-play
        playPauseBtn.classList.add('mixcloud-ready');
        playPauseBtn.style.display = 'flex';
        playPauseBtn.style.opacity = '1';
        playPauseBtn.style.visibility = 'visible';
        playPauseBtn.style.pointerEvents = 'auto';
        playPauseBtn.style.position = 'relative';
        playPauseBtn.style.left = 'auto';
        playPauseBtn.style.top = 'auto';
        playPauseBtn.style.width = '72px';
        playPauseBtn.style.height = '72px';
        playPauseBtn.style.overflow = 'visible';
      }
    }

    // Play the next episode
    playEpisode(nextEpisode);

    // Mobile auto-play will be handled by the ready event listeners

    // Clear auto-play flag after a delay
    setTimeout(() => {
      window.isAutoPlaying = false;
    }, 5000); // Increased delay to allow mobile auto-play to complete

    // Show notification
    showAutoPlayNotification(nextEpisode.name);
  }
}

// Function to show auto-play notification
function showAutoPlayNotification(episodeName) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'auto-play-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid fa-play"></i>
      <span>Now playing: ${episodeName}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}


function stopCurrentPlayer() {
  // Stopping current player
  
  // Stop widget if it exists
  if (currentWidget) {
    try {
      if (typeof currentWidget.pause === 'function') {
        currentWidget.pause();
        // Paused current widget
      }
    } catch (error) {
      // Error pausing current widget
    }
    currentWidget = null;
  }
  
  // Clear player container
  const playerContainer = document.getElementById('mixcloud-player');
  if (playerContainer) {
    playerContainer.innerHTML = '';
  }
  
  // Hide player container
  const container = document.getElementById('mixcloud-player-container');
  if (container) {
    container.style.bottom = '-400px';
  }
  
  // Reset UI state
  updatePlayState(false);
  isCurrentlyPlaying = false;
  
  // Hide play button on mobile when player is stopped
  if (isMobileDevice()) {
    setPlayerReady(false);
  }
  
  // Current player stopped
}

// Function to fetch duration from Mixcloud API
async function fetchDurationFromAPI(episodeUrl) {
  // Fetching duration from Mixcloud API
  
  try {
    // Extract the show path from the URL
    // Example: https://www.mixcloud.com/SamudraFM/tasty-tuesday-show-27-june-2023/
    const urlParts = episodeUrl.split('/');
    const username = urlParts[3]; // SamudraFM
    const showSlug = urlParts[4]; // tasty-tuesday-show-27-june-2023
    
    if (!username || !showSlug) {
      // Could not parse episode URL
      return Promise.resolve();
    }
    
    // Mixcloud API calls disabled to reduce console logs
    // Using fallback data instead
    const response = { ok: false };
    
    if (!response.ok) {
      // API request failed
      return Promise.resolve();
    }
    
    const data = await response.json();
    // API response received
    
    // Extract duration from the response
    if (data.audio_length) {
      const duration = data.audio_length; // Duration in seconds
      // Got duration from API
      
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      // Duration formatted
      
      // Update the progress bar with the real duration
      updateProgressBar(0, 0, duration);
      
      // Update the time display with actual duration
      const totalTimeEl = document.getElementById('total-time');
      if (totalTimeEl) {
        totalTimeEl.textContent = '-' + formatTime(Math.floor(duration));
      }
      
      // Store the duration globally so progress tracking can use it
      window.currentEpisodeDuration = duration;
      
    } else {
      // No audio_length found in API response
    }
    
    return Promise.resolve();
    
  } catch (error) {
    // Error fetching duration from API
    return Promise.resolve();
  }
}

// Function to update artist display - use logo if artist is SamudraFM
function updateArtistDisplay(artistEl, episode) {
  if (!artistEl) return;
  
  // Check if episode has user info and if it's SamudraFM
  const artistName = episode.user?.username || episode.user?.name || '';
  const isSamudraFM = artistName.toLowerCase() === 'samudrafm' || artistName === 'SamudraFM';
  
  if (isSamudraFM) {
    // Replace text with logo
    artistEl.innerHTML = 'by <img src="assets/brandmark/samudrafmcomTextLogo1.svg" alt="samudrafm.com" style="height: 1em; vertical-align: middle; display: inline-block; margin: 0 2px;">';
  } else {
    // Use default text or episode artist name
    const displayText = artistName ? `by ${artistName}` : 'by SamudraFM';
    artistEl.textContent = displayText;
  }
}

function playEpisode(episode) {
  if (typeof window.pauseHeroLiveStream === 'function') window.pauseHeroLiveStream();
  // Hide play button on mobile when starting to load new episode (unless it's auto-play)
  if (isMobileDevice()) {
    // Don't hide play button if this is an auto-play transition
    const isAutoPlay = window.isAutoPlaying || false;
    if (!isAutoPlay) {
      setPlayerReady(false);
    }
  }
  
  // If already playing the same episode, don't restart
  if (isCurrentlyPlaying && currentEpisode && currentEpisode.url === episode.url) {
    return;
  }
  
  // If resuming the same episode and widget exists, just resume it
  if (!isCurrentlyPlaying && currentEpisode && currentEpisode.url === episode.url && currentWidget) {
    try {
      if (typeof currentWidget.play === 'function') {
        currentWidget.play();
        isCurrentlyPlaying = true;
        updatePlayState(true);
        startSimpleProgressTracking();
        // Show play button on mobile when resuming
        if (isMobileDevice()) {
          setPlayerReady(true);
        }
        return;
      }
    } catch (error) {
      console.error('Error resuming existing widget:', error);
    }
  }
  
  // Stop any existing player first (only if different episode)
  stopCurrentPlayer();
  
  currentEpisode = episode;
  isCurrentlyPlaying = true;
  
  // Update current episode index for auto-play
  if (episodes && episodes.length > 0) {
    const episodeIndex = episodes.findIndex(ep => ep.url === episode.url);
    if (episodeIndex !== -1) {
      currentEpisodeIndex = episodeIndex;
    }
  }
  
  // Update the hero player title and info
  const titleEl = document.getElementById('hero-ep-title');
  const artistEl = document.getElementById('hero-ep-artist');
  const openEl = document.getElementById('hero-open');
  const coverEl = document.getElementById('player-cover');
  if (titleEl) {
    titleEl.textContent = episode.name;
  }
  // Update artist display - use logo if artist is SamudraFM
  updateArtistDisplay(artistEl, episode);
  if (openEl) {
    openEl.href = 'request';
  }
  // Update player cover from episode artwork (from Mixcloud feed/API)
  if (coverEl) {
    const imageUrl = episode.pictures
      ? (episode.pictures.extra_large || episode.pictures.large || episode.pictures.medium || episode.pictures.small)
      : (episode.picture || '');
    if (imageUrl) {
      coverEl.style.backgroundImage = `url('${imageUrl.replace(/'/g, "%27")}')`;
      coverEl.classList.remove('placeholder');
    } else {
      coverEl.style.backgroundImage = '';
      coverEl.classList.add('placeholder');
    }
  }
  
  // Reset progress bar to beginning for new episode
  updateProgressBar(0, 0, 0);
  
  // Get duration from Mixcloud API first, then start playback
  fetchDurationFromAPI(episode.url).then(() => {
    // Use Mixcloud widget for playback after duration is set
    playWithMixcloudWidget(episode);
  });
}

function playWithMixcloudWidget(episode) {
  
  // Stop any existing player first
  if (currentWidget) {
    try {
      if (typeof currentWidget.pause === 'function') {
        currentWidget.pause();
      }
    } catch (error) {
    }
    currentWidget = null;
  }
  
  // Use Mixcloud's official embed URL that allows iframe embedding
  const playerContainer = document.getElementById('mixcloud-player');
  if (!playerContainer) {
    return;
  }
  
  // Clear any existing content completely
  playerContainer.innerHTML = '';
  
  // Also clear any existing iframes in the container
  const existingIframes = document.querySelectorAll('#mixcloud-iframe');
  existingIframes.forEach(iframe => iframe.remove());
  
  // Cleared existing players, creating new one
  
  // Create iframe using your exact Mixcloud embed code format
  const iframe = document.createElement('iframe');
  iframe.src = `https://player-widget.mixcloud.com/widget/iframe/?hide_artwork=1&autoplay=1&feed=${encodeURIComponent(episode.url)}`;
  iframe.width = '1%'; // Minimized width - hidden behind custom UI
  iframe.height = '400';
  iframe.frameBorder = '0';
  iframe.allow = 'encrypted-media; fullscreen; autoplay; idle-detection; web-share;';
  iframe.style.border = 'none';
  iframe.id = 'mixcloud-iframe';
  
  // Add error handling for iframe loading
  iframe.onerror = () => {
    // Retry loading after a delay
    setTimeout(() => {
      playWithMixcloudWidget(episode);
    }, 2000);
  };
  
  // Add timeout for iframe loading
  const iframeTimeout = setTimeout(() => {
    if (!window.mixcloudWidgetReady) {
      playWithMixcloudWidget(episode);
    }
  }, 2000); // 2 second timeout
  
  // Add event listeners to debug iframe loading
  iframe.onload = () => {
    clearTimeout(iframeTimeout);
    
    // Set up widget controls soon after iframe loads (shorter delay = better autoplay)
    setTimeout(() => {
      if (window.Mixcloud) {
        try {
          currentWidget = window.Mixcloud.PlayerWidget(iframe);
          
          // Sync button state with actual widget playback (fixes desync and delay)
          if (currentWidget.events) {
            if (currentWidget.events.play) {
              currentWidget.events.play.on(() => {
                isCurrentlyPlaying = true;
                updatePlayState(true);
                syncProgressFromWidget();
                if (!window.currentProgressInterval && !window.currentProgressTimeoutId) startSimpleProgressTracking();
              });
            }
            if (currentWidget.events.pause) {
              currentWidget.events.pause.on(() => {
                isCurrentlyPlaying = false;
                updatePlayState(false);
                syncProgressFromWidget().then(stopProgressTracking);
              });
            }
          }
          
          window.mixcloudWidgetReady = true;
          setPlayerReady(true);
          isCurrentlyPlaying = true;
          updatePlayState(true);
          
          // Explicitly start playback (iframe autoplay=1 is often blocked by browsers)
          function startWidgetPlayback() {
            if (currentWidget && typeof currentWidget.play === 'function') {
              try {
                currentWidget.play();
                syncProgressFromWidget();
                startSimpleProgressTracking();
              } catch (e) {
              }
            }
          }
          if (currentWidget.events && currentWidget.events.ready) {
            currentWidget.events.ready.on(() => {
              startWidgetPlayback();
              setTimeout(startWidgetPlayback, 200);
            });
          } else {
            startWidgetPlayback();
            setTimeout(startWidgetPlayback, 300);
            setTimeout(startWidgetPlayback, 800);
          }
          
          // For mobile auto-play, wait for widget ready event then start play
          if (isMobileDevice() && window.isAutoPlaying) {
            
            // Listen for widget ready event
            if (currentWidget && currentWidget.events && currentWidget.events.ready) {
              currentWidget.events.ready.on(() => {
                
                const playPauseBtn = document.getElementById('hero-play-pause');
                if (playPauseBtn) {
                  playPauseBtn.click();
                }
                
                if (currentWidget && typeof currentWidget.play === 'function') {
                  currentWidget.play();
                  isCurrentlyPlaying = true;
                  updatePlayState(true);
                  startSimpleProgressTracking();
                }
              });
            } else {
              // Fallback if no ready event available
              setTimeout(() => {
                const playPauseBtn = document.getElementById('hero-play-pause');
                if (playPauseBtn) {
                  playPauseBtn.click();
                }
                
                if (currentWidget && typeof currentWidget.play === 'function') {
                  currentWidget.play();
                }
              }, 1000);
            }
          }
          
          if (isMobileDevice()) {
            // For auto-play, ensure button is immediately visible
            if (window.isAutoPlaying) {
              const playPauseBtn = document.getElementById('hero-play-pause');
              if (playPauseBtn) {
                playPauseBtn.classList.add('mixcloud-ready');
                playPauseBtn.style.display = 'flex';
                playPauseBtn.style.opacity = '1';
                playPauseBtn.style.visibility = 'visible';
                playPauseBtn.style.pointerEvents = 'auto';
              }
              
              // Explicitly start playback for mobile auto-play
              setTimeout(() => {
                
                // Try multiple approaches to start playback
                const playPauseBtn = document.getElementById('hero-play-pause');
                
                // Method 1: Direct widget play call
                if (currentWidget && typeof currentWidget.play === 'function') {
                  currentWidget.play();
                  isCurrentlyPlaying = true;
                  updatePlayState(true);
                  startSimpleProgressTracking();
                }
                
                // Method 2: Programmatically click the play button
                if (playPauseBtn) {
                  playPauseBtn.click();
                }
                
                // Method 3: Trigger the play button's click event
                if (playPauseBtn) {
                  const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                  });
                  playPauseBtn.dispatchEvent(clickEvent);
                }
                
                // Hit play again after a short delay to ensure it actually starts
                setTimeout(() => {
                  
                  // Try widget play again
                  if (currentWidget && typeof currentWidget.play === 'function') {
                    currentWidget.play();
                  }
                  
                  // Try clicking play button again
                  if (playPauseBtn) {
                    playPauseBtn.click();
                  }
                }, 1000);
              }, 500); // Small delay to ensure widget is fully ready
            } else {
              showPlayButtonWhenReady();
            }
          }
          
          // Set up event listeners for sync
          if (currentWidget && currentWidget.events) {
            // Setting up sync event listeners
            
          // Listen for widget events to sync with custom UI
          if (currentWidget.events.play) {
            currentWidget.events.play.on(() => {
              updatePlayState(true);
              isCurrentlyPlaying = true;
              syncProgressFromWidget();
              startSimpleProgressTracking();
            });
          }
          
          if (currentWidget.events.pause) {
            currentWidget.events.pause.on(() => {
              updatePlayState(false);
              isCurrentlyPlaying = false;
              syncProgressFromWidget().then(stopProgressTracking);
            });
          }
          
          // Fallback sync: keep play/pause state in sync with widget
          const syncInterval = setInterval(() => {
            if (currentWidget && typeof currentWidget.isPaused === 'function') {
              try {
                const isPaused = currentWidget.isPaused();
                if (isPaused !== !isCurrentlyPlaying) {
                  updatePlayState(!isPaused);
                  isCurrentlyPlaying = !isPaused;
                  if (isPaused) {
                    syncProgressFromWidget().then(stopProgressTracking);
                  } else {
                    syncProgressFromWidget();
                    startSimpleProgressTracking();
                  }
                } else if (!isPaused && isCurrentlyPlaying) {
                  syncProgressFromWidget();
                }
              } catch (error) {}
            }
          }, 300);
          
          // Store interval ID for cleanup
          if (window.syncInterval) {
            clearInterval(window.syncInterval);
          }
          window.syncInterval = syncInterval;
          
          if (currentWidget.events.ended) {
            currentWidget.events.ended.on(() => {
              
              updatePlayState(false);
              isCurrentlyPlaying = false;
              // Stop progress tracking when ended
              stopProgressTracking();
              
              // Trigger auto-play next episode
              setTimeout(() => {
                handleAutoPlayNext();
              }, 1000); // Small delay to ensure clean state
            });
          }
          
          // Add progress event listener if available
          if (currentWidget.events.progress) {
            currentWidget.events.progress.on((progress) => {
              
              if (progress.position !== null && progress.duration !== null && progress.duration > 0) {
                const percentage = (progress.position / progress.duration) * 100;
                updateProgressBar(percentage, progress.position, progress.duration);
              }
            });
          }
            
            
          
          // Set initial volume when widget is ready
          if (typeof currentWidget.setVolume === 'function') {
            try {
              currentWidget.setVolume(0.6); // 60% volume
              
            } catch (error) {
              
            }
          }
          
          // Duration is now fetched from API in playEpisode(), no need to wait for audio
          } else {
            
          }
          
        } catch (error) {
          
        }
      } else {
        
      }
    }, 500);
  };
  
  iframe.onerror = (error) => {
    
  };
  
  playerContainer.appendChild(iframe);
  
  // Show the player container (slide up from bottom)
  const container = document.getElementById('mixcloud-player-container');
  if (container) {
    container.style.bottom = '0px';
    
  }
  
  updatePlayState(true);
  isCurrentlyPlaying = true;
}

function initializeMixcloudPlayer() {
  // This function is now handled by playWithMixcloudWidget()
  // No need for separate initialization to avoid duplicate widgets
  
}

function hideMixcloudPlayer() {
  const container = document.getElementById('mixcloud-player-container');
  if (container) {
    container.style.bottom = '-200px';
  }
}

function pauseMixcloudPlayer() {
  if (currentWidget) {
    try {
      if (typeof currentWidget.pause === 'function') currentWidget.pause();
    } catch (e) {}
  }
  isCurrentlyPlaying = false;
  updatePlayState(false);
  stopProgressTracking();
  hideMixcloudPlayer();
}
if (typeof window !== 'undefined') window.pauseMixcloudPlayer = pauseMixcloudPlayer;

function showMixcloudPlayer() {
  const container = document.getElementById('mixcloud-player-container');
  if (container) {
    container.style.bottom = '0px';
  }
}

function startProgressTracking(widget) {
  let progressInterval;
  
  const updateProgress = () => {
    Promise.all([widget.getPosition(), widget.getDuration()]).then(([position, duration]) => {
      if (duration > 0) {
        const percentage = (position / duration) * 100;
        updateProgressBar(percentage, position, duration);
      }
    }).catch(() => {
      // Fallback to mock progress if API fails
      updateProgressBar(0, 0, 0);
    });
  };
  
  // Start tracking progress every second
  progressInterval = setInterval(updateProgress, 1000);
  
  // Store interval for cleanup
  window.currentProgressInterval = progressInterval;
}

function updateProgressBar(percentage, currentSeconds, totalSeconds) {
  const pct = Math.max(0, Math.min(100, Number(percentage) || 0));
  const progressFill = document.getElementById('hero-progress');
  const progressHandle = document.getElementById('progress-handle');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const progressFillDesktop = document.getElementById('hero-progress-desktop');
  const progressHandleDesktop = document.getElementById('progress-handle-desktop');
  const currentTimeElDesktop = document.getElementById('current-time-desktop');
  const totalTimeElDesktop = document.getElementById('total-time-desktop');
  
  if (progressFill) {
    progressFill.style.width = pct + '%';
  }
  if (progressHandle) {
    progressHandle.style.left = pct + '%';
  }
  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(Math.floor(currentSeconds));
  }
  if (totalTimeEl) {
    totalTimeEl.textContent = '-' + formatTime(Math.floor(totalSeconds - currentSeconds));
  }
  if (progressFillDesktop) {
    progressFillDesktop.style.width = pct + '%';
  }
  if (progressHandleDesktop) {
    progressHandleDesktop.style.left = pct + '%';
  }
  if (currentTimeElDesktop) {
    currentTimeElDesktop.textContent = formatTime(Math.floor(currentSeconds));
  }
  if (totalTimeElDesktop) {
    totalTimeElDesktop.textContent = '-' + formatTime(Math.floor(totalSeconds - currentSeconds));
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function pauseEpisode() {
  
  isCurrentlyPlaying = false;
  
  // Radio stream removed - using Mixcloud widget only
  
  // Pause the Mixcloud widget
  if (currentWidget) {
    try {
      if (typeof currentWidget.pause === 'function') {
        currentWidget.pause();
        
        // Don't update UI here - let the widget event handler do it
      } else {
        
        isCurrentlyPlaying = false;
        updatePlayState(false);
        hideMixcloudPlayer();
      }
    } catch (error) {
      
      // Fallback: update UI manually
      isCurrentlyPlaying = false;
      updatePlayState(false);
      hideMixcloudPlayer();
    }
  } else {
    // No widget available, update UI manually
    isCurrentlyPlaying = false;
    updatePlayState(false);
    hideMixcloudPlayer();
  }
  
  stopProgressTracking();
  updatePlayState(false);
}

function stopProgressTracking() {
  if (window.currentProgressInterval) {
    clearInterval(window.currentProgressInterval);
    window.currentProgressInterval = null;
  }
  if (window.currentProgressTimeoutId) {
    clearTimeout(window.currentProgressTimeoutId);
    window.currentProgressTimeoutId = null;
  }
}

function syncProgressFromWidget() {
  if (!currentWidget || typeof currentWidget.getPosition !== 'function' || typeof currentWidget.getDuration !== 'function') {
    return Promise.resolve();
  }
  return Promise.all([currentWidget.getPosition(), currentWidget.getDuration()])
    .then(function (result) {
      var position = result[0];
      var duration = result[1];
      if (position == null || duration == null || duration <= 0) return;
      var pos = Math.max(0, Math.min(position, duration));
      var pct = Math.max(0, Math.min(100, (pos / duration) * 100));
      updateProgressBar(pct, pos, duration);
    })
    .catch(function () {});
}

function startSimpleProgressTracking() {
  stopProgressTracking();
  
  if (!isCurrentlyPlaying) return;
  if (!currentWidget || typeof currentWidget.getPosition !== 'function' || typeof currentWidget.getDuration !== 'function') {
    startFallbackProgressTracking();
    return;
  }
  
  const PROGRESS_POLL_MS = 200;

  function pollOnce() {
    if (!isCurrentlyPlaying || !currentWidget) {
      if (window.currentProgressTimeoutId) {
        clearTimeout(window.currentProgressTimeoutId);
        window.currentProgressTimeoutId = null;
      }
      return;
    }
    Promise.all([currentWidget.getPosition(), currentWidget.getDuration()])
      .then(([position, duration]) => {
        if (!isCurrentlyPlaying || !currentWidget) return;
        if (position == null || duration == null || duration <= 0) {
          startFallbackProgressTracking();
          return;
        }
        const pos = Math.max(0, Math.min(position, duration));
        const pct = Math.max(0, Math.min(100, (pos / duration) * 100));
        updateProgressBar(pct, pos, duration);
        
        if (duration - pos <= 2) {
          if (window.currentProgressTimeoutId) {
            clearTimeout(window.currentProgressTimeoutId);
            window.currentProgressTimeoutId = null;
          }
          updatePlayState(false);
          isCurrentlyPlaying = false;
          setTimeout(() => handleAutoPlayNext(), 1000);
          return;
        }
        window.currentProgressTimeoutId = setTimeout(pollOnce, PROGRESS_POLL_MS);
      })
      .catch(() => {
        if (!isCurrentlyPlaying) return;
        startFallbackProgressTracking();
      });
  }
  
  pollOnce();
}

function startFallbackProgressTracking() {
  stopProgressTracking();
  let totalDuration = window.currentEpisodeDuration || 1200;
  let progress = 0;

  function runFallbackInterval() {
    const progressFill = document.getElementById('hero-progress');
    const currentPercentage = progressFill ? parseFloat(progressFill.style.width) || 0 : 0;
    if (progress === 0 && currentPercentage > 0) {
      progress = Math.floor((currentPercentage / 100) * totalDuration);
      if (progress < 5) progress = 0;
    }

    window.currentProgressInterval = setInterval(() => {
      if (isCurrentlyPlaying) {
        progress += 1;
        const percentage = Math.min((progress / totalDuration) * 100, 100);
        updateProgressBar(percentage, progress, totalDuration);

        if (totalDuration - progress <= 2) {
          console.log('Episode finished via fallback progress tracking - triggering auto-play');
          isCurrentlyPlaying = false;
          updatePlayState(false);
          stopProgressTracking();
          setTimeout(() => handleAutoPlayNext(), 1000);
        }
      }
    }, 1000);
  }

  if (currentWidget && typeof currentWidget.getDuration === 'function') {
    currentWidget.getDuration()
      .then(duration => {
        if (duration && duration > 0) {
          totalDuration = duration;
          updateProgressBar(0, 0, totalDuration);
        }
        if (currentWidget && typeof currentWidget.getPosition === 'function') {
          return currentWidget.getPosition().then(function (position) {
            if (position != null && !isNaN(position)) progress = Math.max(0, Math.floor(position));
          });
        }
      })
      .catch(function () {})
      .then(function () {
        runFallbackInterval();
      });
  } else {
    runFallbackInterval();
  }
}

function updatePlayState(isPlaying) {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (!playPauseBtn) return;

  playPauseBtn.disabled = false;

  if (isPlaying) {
    // Show pause icon (Font Awesome)
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    // Set to pause icon
  } else {
    // Show play icon (Font Awesome)
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    // Set to play icon
  }

  var heroLatest = document.getElementById('hero-latest');
  if (heroLatest) {
    if (isPlaying) heroLatest.classList.add('hero-latest--playing');
    else heroLatest.classList.remove('hero-latest--playing');
  }

  // Force a re-render
  playPauseBtn.style.display = 'none';
  playPauseBtn.offsetHeight; // Trigger reflow
  playPauseBtn.style.display = 'flex';
}

// Progress bar functionality
function initProgressBar() {
  // Initialize mobile progress bar
  initSingleProgressBar('progress-bar', 'progress-handle', 'hero-progress', 'current-time', 'total-time');
  
  // Initialize desktop progress bar
  initSingleProgressBar('progress-bar-desktop', 'progress-handle-desktop', 'hero-progress-desktop', 'current-time-desktop', 'total-time-desktop');
}

function initSingleProgressBar(progressBarId, progressHandleId, progressFillId, currentTimeId, totalTimeId) {
  const progressBar = document.getElementById(progressBarId);
  const progressHandle = document.getElementById(progressHandleId);
  const progressFill = document.getElementById(progressFillId);
  const currentTimeEl = document.getElementById(currentTimeId);
  const totalTimeEl = document.getElementById(totalTimeId);
  
  // Check if elements exist before adding event listeners
  if (!progressBar || !progressHandle || !progressFill || !currentTimeEl || !totalTimeEl) {
    // Progress bar elements not found, skipping initialization
    return;
  }
  
  let isDragging = false;
  let isTouching = false;
  let touchStartX = 0;
  
  // Click to seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    stopProgressTracking();
    seekTo(percentage);
    if (isCurrentlyPlaying) {
      setTimeout(() => startSimpleProgressTracking(), 500);
    }
  });
  
  progressHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
    stopProgressTracking();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const rect = progressBar.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
      updateProgress(percentage);
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      const percentage = parseFloat(progressFill.style.width);
      seekTo(percentage);
      if (isCurrentlyPlaying) setTimeout(() => startSimpleProgressTracking(), 500);
    }
  });
  
  // Touch events for mobile
  progressBar.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isTouching = true;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    
    const rect = progressBar.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
    
    stopProgressTracking();
    updateProgress(percentage);
  }, { passive: false });
  
  progressBar.addEventListener('touchmove', (e) => {
    if (isTouching) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = progressBar.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
      updateProgress(percentage);
    }
  }, { passive: false });
  
  progressBar.addEventListener('touchend', (e) => {
    if (isTouching) {
      e.preventDefault();
      isTouching = false;
      const percentage = parseFloat(progressFill.style.width);
      seekTo(percentage);
      
      // Restart progress tracking after touch with longer delay
      if (isCurrentlyPlaying) {
        setTimeout(() => {
          // Restarting progress tracking after touch
          startSimpleProgressTracking();
        }, 500);
      }
    }
  }, { passive: false });
  
  // Handle touch on progress handle for dragging
  progressHandle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isTouching = true;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    
    stopProgressTracking();
  }, { passive: false });
  
  // Add visual feedback for mobile
  progressBar.addEventListener('touchstart', () => {
    progressBar.style.opacity = '0.8';
    progressHandle.style.transform = 'scale(1.2)';
    
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  });
  
  progressBar.addEventListener('touchend', () => {
    progressBar.style.opacity = '1';
    progressHandle.style.transform = 'scale(1)';
  });
  
  // Prevent scrolling when interacting with progress bar
  progressBar.addEventListener('touchstart', (e) => {
    e.preventDefault();
  }, { passive: false });
  
  progressBar.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });
  
  function updateProgress(percentage) {
    progressFill.style.width = percentage + '%';
    progressHandle.style.left = percentage + '%';
    
    // Update time display - get actual duration from Mixcloud
    if (currentWidget && typeof currentWidget.getDuration === 'function') {
      currentWidget.getDuration()
        .then(duration => {
          if (duration && duration > 0) {
            const currentSeconds = Math.floor((percentage / 100) * duration);
            currentTimeEl.textContent = formatTime(currentSeconds);
          }
        })
        .catch(() => {
          // Fallback to 0 if can't get duration
          currentTimeEl.textContent = '0:00';
        });
    } else {
      currentTimeEl.textContent = '0:00';
    }
    
    // Update total time display
    if (currentWidget && typeof currentWidget.getDuration === 'function') {
      currentWidget.getDuration()
        .then(duration => {
          if (duration && duration > 0) {
            const currentSeconds = Math.floor((percentage / 100) * duration);
            totalTimeEl.textContent = '-' + formatTime(Math.floor(duration - currentSeconds));
          }
        })
        .catch(() => {
          totalTimeEl.textContent = '-0:00';
        });
    } else {
      totalTimeEl.textContent = '-0:00';
    }
  }
  
  function seekTo(percentage) {
    // Seeking to percentage
    
    // Prevent multiple seek operations
    if (window.isSeeking) {
      // Seek already in progress, skipping
      return;
    }
    
    window.isSeeking = true;
    
    // Seek the actual Mixcloud player
    if (currentWidget && typeof currentWidget.seek === 'function') {
      try {
        // Get duration from the widget directly instead of parsing UI text
        currentWidget.getDuration().then(duration => {
          if (duration && duration > 0) {
            const seekPosition = (percentage / 100) * duration;
            // Seeking to position
        currentWidget.seek(seekPosition);
            setTimeout(function () {
              syncProgressFromWidget();
            }, 200);
            setTimeout(() => {
              window.isSeeking = false;
              syncProgressFromWidget();
            }, 1000);
          } else {
            // No valid duration available for seeking
            window.isSeeking = false;
          }
        }).catch(error => {
          // Error getting duration for seek
          window.isSeeking = false;
        });
      } catch (error) {
        // Error in seek function
        window.isSeeking = false;
      }
    } else {
      // No current widget available for seeking
      window.isSeeking = false;
    }
    
    // Update the progress bar immediately to show user's click
    updateProgress(percentage);
  }
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }
  
  // Initialize with 0 progress
  updateProgress(0);
}

// Volume control functionality
function initVolumeControl() {
  const volumeBar = document.querySelector('.volume-bar');
  const volumeFill = document.querySelector('.volume-fill');
  const volumeHandle = document.querySelector('.volume-handle');
  
  // Check if elements exist before adding event listeners
  if (!volumeBar || !volumeFill || !volumeHandle) {
    // Volume control elements not found, skipping initialization
    return;
  }
  
  let isDragging = false;
  let startX = 0;
  let startPercentage = 0;
  
  // Click on volume bar to set volume (desktop)
  volumeBar.addEventListener('click', (e) => {
    if (isDragging) return; // Don't trigger if we're dragging
    e.preventDefault();
    e.stopPropagation();
    
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    
    // Add visual feedback
    volumeBar.style.transform = 'scale(1.02)';
    setTimeout(() => {
      volumeBar.style.transform = 'scale(1)';
    }, 100);
    
    // Immediate visual feedback
    updateVolume(percentage);
  });
  
  // Touch support for volume bar (mobile)
  volumeBar.addEventListener('touchstart', (e) => {
    if (isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const rect = volumeBar.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
    
    // Add visual feedback
    volumeBar.style.transform = 'scale(1.02)';
    setTimeout(() => {
      volumeBar.style.transform = 'scale(1)';
    }, 100);
    
    // Immediate visual feedback
    updateVolume(percentage);
  });
  
  // Mouse events for desktop
  volumeHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
    e.stopPropagation();
    
    const rect = volumeBar.getBoundingClientRect();
    startX = e.clientX;
    startPercentage = parseFloat(volumeFill.style.width) || 0;
    
    // Add visual feedback
    volumeHandle.style.cursor = 'grabbing';
    volumeBar.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      requestAnimationFrame(() => {
      const rect = volumeBar.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
      updateVolume(percentage);
      });
    }
  });
  
  document.addEventListener('mouseup', (e) => {
    if (isDragging) {
    isDragging = false;
      
      // Remove visual feedback
      volumeHandle.style.cursor = 'grab';
      volumeBar.style.cursor = 'pointer';
    }
  });
  
  // Touch events for mobile
  volumeHandle.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const rect = volumeBar.getBoundingClientRect();
    startX = touch.clientX;
    startPercentage = parseFloat(volumeFill.style.width) || 0;
    
    // Add visual feedback
    volumeHandle.style.cursor = 'grabbing';
    volumeBar.style.cursor = 'grabbing';
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      e.preventDefault();
      requestAnimationFrame(() => {
        const touch = e.touches[0];
        const rect = volumeBar.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
        updateVolume(percentage);
      });
    }
  });
  
  document.addEventListener('touchend', (e) => {
    if (isDragging) {
      isDragging = false;
      
      // Remove visual feedback
      volumeHandle.style.cursor = 'grab';
      volumeBar.style.cursor = 'pointer';
    }
  });
  
  function updateVolume(percentage) {
    // Ensure percentage is within bounds
    percentage = Math.max(0, Math.min(100, percentage));
    
    // Update visual slider immediately with no transition during drag or click
    if (isDragging) {
      volumeFill.style.transition = 'none';
      volumeHandle.style.transition = 'none';
    } else {
      // Quick transition for clicks, no transition for immediate feedback
      volumeFill.style.transition = 'width 0.05s ease-out';
      volumeHandle.style.transition = 'left 0.05s ease-out';
    }
    
    volumeFill.style.width = percentage + '%';
    volumeHandle.style.left = percentage + '%';
    
    // Force a reflow to ensure immediate visual update
    volumeFill.offsetHeight;
    
    // Control Mixcloud widget volume
    if (currentWidget && typeof currentWidget.setVolume === 'function') {
      try {
        const volume = percentage / 100; // Convert percentage to 0-1 range
        currentWidget.setVolume(volume);
        
      } catch (error) {
        // Error setting volume
      }
    } else {
      // No widget available for volume control
    }
  }
  
  // Initialize with 60% volume
  updateVolume(60);
}

// Cache functionality removed - using live Mixcloud API only

// Hero latest episode -------------------------------------------------------
async function loadHeroLatest(username){
  if (!username) return;
  const titleEl = document.getElementById('hero-ep-title');
  const coverEl = document.querySelector('.hero-latest-cover');
  const openEl = document.getElementById('hero-open');
  
  // Check if elements exist before proceeding
  if (!titleEl || !coverEl || !openEl) {
    // Hero elements not found, skipping loadHeroLatest
    return;
  }
  
  try{
    // Load latest episode from Mixcloud API directly
    const res = await fetch(`https://api.mixcloud.com/${username}/cloudcasts/?limit=1`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    const ep = data.data && data.data[0];
    
    if (!ep) {
      // No episodes available
      titleEl.textContent = 'No episodes available';
      openEl.href = 'request';
      currentEpisode = null;
      updatePlayState(false);
      return;
    }
    
    titleEl.textContent = ep.name;
    const artistEl = document.getElementById('hero-ep-artist');
    // Update artist display - use logo if artist is SamudraFM
    updateArtistDisplay(artistEl, ep);
    openEl.href = 'request';
    
    // Set current episode for play button
    currentEpisode = ep;
    
    // Preload the Mixcloud widget for instant playback
    preloadCurrentEpisode(ep);
    
    // Update play button state
    updatePlayState(false);
    
    // Handle cover image - use the highest resolution available
    if (ep.pictures) {
      const imageUrl = ep.pictures.extra_large || ep.pictures.large || ep.pictures.medium || ep.pictures.small;
      if (imageUrl) {
        
        coverEl.style.backgroundImage = `url('${imageUrl}')`;
        coverEl.classList.remove('placeholder');
      } else {
        coverEl.classList.add('placeholder');
      }
    } else {
      coverEl.classList.add('placeholder');
    }
    coverEl.innerHTML = '';
    
  } catch(e){ 
    // Show error state when API fails
    titleEl.textContent = 'Unable to load episodes';
    openEl.href = 'request';
    currentEpisode = null;
    updatePlayState(false);
    
    // On error, ensure placeholder is shown
    if (coverEl) {
      coverEl.classList.add('placeholder');
      coverEl.innerHTML = '';
    }
  }
}

// Only load hero latest if we're on a page with hero elements
if (document.getElementById('hero-ep-title')) {
  loadHeroLatest(MIXCLOUD_USERNAME);
  
  // Preload Mixcloud widget for better first-time performance
  setTimeout(() => {
    // Create a hidden iframe to preload the widget
    const preloadIframe = document.createElement('iframe');
    preloadIframe.src = 'https://player-widget.mixcloud.com/widget/iframe/?hide_artwork=1&autoplay=0';
    preloadIframe.style.display = 'none';
    preloadIframe.style.position = 'absolute';
    preloadIframe.style.left = '-9999px';
    preloadIframe.onload = () => {
      window.mixcloudPreloaded = true;
    };
    document.body.appendChild(preloadIframe);
  }, 2000);
}

// Initialize player controls
document.addEventListener('DOMContentLoaded', () => {
  // Immediately hide play button on mobile before any other initialization
  if (isMobileDevice()) {
    const playPauseBtn = document.getElementById('hero-play-pause');
    if (playPauseBtn) {
      playPauseBtn.classList.remove('mixcloud-ready');
      playPauseBtn.style.display = 'none';
      playPauseBtn.style.opacity = '0';
      playPauseBtn.style.visibility = 'hidden';
      playPauseBtn.style.pointerEvents = 'none';
    }
  }
  
  // Only initialize if we're on a page with player elements
  if (document.getElementById('progress-bar') || document.getElementById('play-pause-btn')) {
    initProgressBar();
    initVolumeControl();
    initPlayButton();
    initAudioDebugging();
    startAudioMonitoring();
  }
  
  // Ensure play button is ready after a short delay
  setTimeout(() => {
    ensurePlayButtonReady();
  }, 500);
  
  // Pre-load Mixcloud player for mobile devices
  if (isMobileDevice()) {
    preloadMixcloudPlayer();
  }
  
  // Force update play button after Font Awesome loads
  setTimeout(() => {
    // Check if Font Awesome CSS is loaded
    const testIcon = document.createElement('i');
    testIcon.className = 'fa-solid fa-play';
    testIcon.style.position = 'absolute';
    testIcon.style.left = '-9999px';
    document.body.appendChild(testIcon);
    
    const computedStyle = window.getComputedStyle(testIcon, '::before');
    const fontFamily = computedStyle.getPropertyValue('font-family');
    
    document.body.removeChild(testIcon);
    
    forceUpdatePlayButton();
  }, 1000);
  
  // Change Listen now button to Send a request on mobile
  if (window.innerWidth <= 768) {
    const listenBtn = document.querySelector('.hero-copy .btn.primary');
    if (listenBtn) {
      listenBtn.textContent = 'Send a request';
      listenBtn.onclick = function(e) {
        e.preventDefault();
        window.location.href = 'request';
      };
    }
  }
});

function initAudioDebugging() {
  // Audio debugging disabled for clean console
}

// Additional troubleshooting function for real-time monitoring
function startAudioMonitoring() {
  // Audio monitoring disabled for clean console
}

// Global troubleshooting function - call from browser console
window.debugAudio = function() {
  // Debug function disabled for clean console
};

// Make it available globally
window.troubleshootAudio = window.debugAudio;

// Function to manually get and display the correct duration
window.getCorrectDuration = function() {
  // Debug function disabled for clean console
};

// Function to force set the correct duration (17:41 = 1061 seconds)
window.setCorrectDuration = function() {
  // Debug function disabled for clean console
};

// Function to debug and force get duration
window.debugDuration = function() {
  
  
  
  
  
  if (currentWidget && typeof currentWidget.getDuration === 'function') {
    
    currentWidget.getDuration()
      .then(duration => {
        
        if (duration && duration > 0) {
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          
          
          // Force update the display
          updateProgressBar(0, 0, duration);
          const totalTimeEl = document.getElementById('total-time');
          if (totalTimeEl) {
            totalTimeEl.textContent = '-' + formatTime(Math.floor(duration));
          }
        } else {
          
        }
      })
      .catch(error => {
        
      });
  } else {
    
  }
};

// Function to test API duration fetching
window.testAPIDuration = function() {
  if (currentEpisode && currentEpisode.url) {
    
    fetchDurationFromAPI(currentEpisode.url);
  } else {
    
  }
};

// Test function to manually trigger player
window.testPlayer = function() {
  
  
  // Check if we have episodes loaded
  const episodesGrid = document.getElementById('episodes-grid');
  const episodeCards = episodesGrid.querySelectorAll('.episodes-card');
  
  
  if (episodeCards.length > 0) {
    // Get the first episode
    const firstCard = episodeCards[0];
    const episode = {
      name: firstCard.querySelector('.title')?.textContent || 'Test Episode',
      url: firstCard.querySelector('.play-link')?.href || 'https://www.mixcloud.com/samudrafm/'
    };
    
    playEpisode(episode);
  } else {
    
    const testEpisode = {
      name: 'Test Episode',
      url: 'https://www.mixcloud.com/samudrafm/'
    };
    playEpisode(testEpisode);
  }
};

// testAudioStream function removed - using Mixcloud widget only

function forceUpdatePlayButton() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (playPauseBtn) {
    
    
    // Clear any existing content and set Font Awesome play icon
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    
    
  }
}

function initPlayButton() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (!playPauseBtn) {
    // Play button not found, skipping initialization
    return;
  }
  
    // Set initial state to play
    updatePlayState(false);
    
    // Hide play button initially on mobile until widget is ready
    if (isMobileDevice()) {
      // Remove CSS class to ensure button is hidden
      playPauseBtn.classList.remove('mixcloud-ready');
      isPlayerReady = false;
      isPlayButtonHiddenOnMobile = true;
    }
    
    // Ensure the button is clickable and has proper event handling
    playPauseBtn.style.pointerEvents = 'auto';
    playPauseBtn.style.cursor = 'pointer';
    playPauseBtn.setAttribute('role', 'button');
    playPauseBtn.setAttribute('tabindex', '0');
    
    // Play button initialized
    
    // Add touch event handling for mobile
    let touchStartTime = 0;
    let touchEndTime = 0;
    let isTouchHandled = false;
    
    // Handle touch start
    playPauseBtn.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      isTouchHandled = false;
      // Touch start on play button
      
      // Update debug panel
      
      // Visual feedback for debugging
      // playPauseBtn.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
      // setTimeout(() => {
      //   playPauseBtn.style.backgroundColor = 'transparent';
      // }, 200);
    }, { passive: true });
    
    // Handle touch end
    playPauseBtn.addEventListener('touchend', (e) => {
      touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      
      // Touch end on play button
      
      // Only handle if it's a quick tap (less than 500ms) and not already handled
      if (touchDuration < 500 && !isTouchHandled) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        isTouchHandled = true;
        
        
        // Update debug panel
        
        // Visual feedback for debugging
        // playPauseBtn.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
        // setTimeout(() => {
        //   playPauseBtn.style.backgroundColor = 'transparent';
        // }, 200);
        
        // Add a small delay to ensure click event is prevented
        setTimeout(() => {
          window.handlePlayPause();
        }, 10);
      } else {
        
        
        // Update debug panel
        
        // Visual feedback for ignored touch
        // playPauseBtn.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        // setTimeout(() => {
        //   playPauseBtn.style.backgroundColor = 'transparent';
        // }, 200);
      }
    }, { passive: false });
    
    // Handle click events (for desktop and fallback)
    playPauseBtn.addEventListener('click', (e) => {
      // Prevent double handling if touch was already processed
      if (isTouchHandled) {
        
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // On mobile devices, add extra delay to prevent double handling
      if (isMobileDevice()) {
        
        setTimeout(() => {
          isTouchHandled = false; // Reset for next interaction
        }, 300);
      }
      
      e.preventDefault();
      e.stopPropagation();
       // Debug log
      window.handlePlayPause();
    });
    
    // Handle keyboard events for accessibility
    playPauseBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        
        window.handlePlayPause();
      }
    });
  
  // Test audio button removed - using Mixcloud only
}

// Mobile detection and debugging
function isMobileDevice() {
  // Use the same robust detection as isMobile()
  return isMobile();
}

// Simple debugging function that works without console
function debugAlert(message) {
  // Only show alerts on mobile devices to avoid spam on desktop
  if (isMobileDevice()) {
    
    // Uncomment the line below to show alerts (only for testing)
    // alert('DEBUG: ' + message);
  }
}


function hidePlayButtonOnMobile() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (playPauseBtn && isMobileDevice()) {
    // Remove CSS class to hide the button
    playPauseBtn.classList.remove('mixcloud-ready');
    isPlayerReady = false;
    isPlayButtonHiddenOnMobile = true;
  }
}

function showPlayButtonWhenReady() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  
  if (playPauseBtn && isMobileDevice() && isPlayButtonHiddenOnMobile) {
    // Only show if player is actually ready and Mixcloud widget is loaded
    if (isPlayerReady && window.mixcloudWidgetReady && (currentWidget || window.preloadedWidget)) {
      // Add CSS class to show the button
      playPauseBtn.classList.add('mixcloud-ready');
      
      // Fallback: also set inline styles to ensure visibility
      playPauseBtn.style.display = 'flex';
      playPauseBtn.style.opacity = '1';
      playPauseBtn.style.visibility = 'visible';
      playPauseBtn.style.pointerEvents = 'auto';
      playPauseBtn.style.position = 'relative';
      playPauseBtn.style.left = 'auto';
      playPauseBtn.style.top = 'auto';
      playPauseBtn.style.width = '72px';
      playPauseBtn.style.height = '72px';
      playPauseBtn.style.overflow = 'visible';
      
      isPlayButtonHiddenOnMobile = false;
      
      // Set the play icon now that widget is ready
      updatePlayState(false);
    }
  }
}

function setPlayerReady(ready) {
  isPlayerReady = ready;
  if (ready) {
    // Only show play button if Mixcloud is actually ready
    if (window.mixcloudWidgetReady) {
      showPlayButtonWhenReady();
    }
  } else {
    if (isMobileDevice()) {
      hidePlayButtonOnMobile();
    }
  }
}

// Function to only play (for Listen now button)
window.handlePlayOnly = function() {
  // Handle play only - no toggle
  if (!currentEpisode) {
    // If no current episode, try to get the latest episode from the episodes grid
    const episodesGrid = document.getElementById('episodes-grid');
    if (episodesGrid && episodesGrid.children.length > 0) {
      const firstEpisode = episodesGrid.children[0];
      const episodeData = firstEpisode.dataset.episode;
      if (episodeData) {
        try {
          currentEpisode = JSON.parse(episodeData);
          
          playEpisode(currentEpisode);
          return;
        } catch (error) {
          
        }
      }
    }
    
    return;
  }
  
  // If already playing, don't do anything
  if (isCurrentlyPlaying) {
    
    return;
  }
  
  // Play the current episode
  
  playEpisode(currentEpisode);
};

// Make handlePlayPause globally accessible
window.handlePlayPause = function() {
  const now = Date.now();
  if (now - lastPlayPauseClickTime < PLAY_PAUSE_CLICK_DEBOUNCE_MS) {
    return;
  }
  lastPlayPauseClickTime = now;
  
  // If no current episode, try to get the latest episode from the episodes grid
  if (!currentEpisode) {
    const episodesGrid = document.getElementById('episodes-grid');
    if (episodesGrid) {
      const firstEpisodeCard = episodesGrid.querySelector('.episodes-card');
      if (firstEpisodeCard) {
        const episodeTitle = firstEpisodeCard.querySelector('.title')?.textContent;
        const episodeLink = firstEpisodeCard.querySelector('.play-link')?.href;
        if (episodeTitle && episodeLink) {
          currentEpisode = {
            name: episodeTitle,
            url: episodeLink
          };
        }
      }
    }
  }
  
  if (currentEpisode) {
    if (isCurrentlyPlaying) {
      // Currently playing → pause: optimistic UI then call widget
      updatePlayState(false);
      isCurrentlyPlaying = false;
      stopProgressTracking();
      const container = document.getElementById('mixcloud-player-container');
      if (container) container.style.bottom = '-200px';
      
      if (currentWidget) {
        try {
          if (typeof currentWidget.togglePlay === 'function') {
            currentWidget.togglePlay();
          } else if (typeof currentWidget.pause === 'function') {
            currentWidget.pause();
            setTimeout(function retryPause() {
              if (currentWidget && typeof currentWidget.pause === 'function') {
                currentWidget.pause();
              }
            }, 150);
          }
          setTimeout(function () { syncProgressFromWidget(); }, 80);
        } catch (error) {
          // Error pausing widget, but no console log
        }
      }
      
    } else {
      // Currently paused → play: pause live stream so only one player is active
      if (typeof window.pauseHeroLiveStream === 'function') window.pauseHeroLiveStream();
      isCurrentlyPlaying = true;
      updatePlayState(true);
      
      const container = document.getElementById('mixcloud-player-container');
      if (container) container.style.bottom = '0px';
      
      if (currentWidget) {
        try {
          if (typeof currentWidget.togglePlay === 'function') {
            currentWidget.togglePlay();
          } else if (typeof currentWidget.play === 'function') {
            currentWidget.play();
          } else {
            playEpisode(currentEpisode);
            return;
          }
          syncProgressFromWidget();
          startSimpleProgressTracking();
          setTimeout(syncProgressFromWidget, 100);
          setTimeout(syncProgressFromWidget, 350);
        } catch (error) {
          // Error resuming widget, fallback
          playEpisode(currentEpisode);
        }
      } else if (window.preloadedWidget && window.mixcloudWidgetReady) {
        // Use the preloaded widget
        currentWidget = window.preloadedWidget;
        
        try {
          if (typeof currentWidget.play === 'function') {
            currentWidget.play();
            // Update UI state
            updatePlayState(true);
            isCurrentlyPlaying = true;
            syncProgressFromWidget();
            startSimpleProgressTracking();
            setTimeout(syncProgressFromWidget, 100);
            setTimeout(syncProgressFromWidget, 350);
          } else {
            // Fallback to regular playEpisode
            playEpisode(currentEpisode);
          }
        } catch (error) {
          // Error playing preloaded widget, fallback to regular playEpisode
          playEpisode(currentEpisode);
        }
      } else {
        // No existing widget, create new one
        
        // Show loading state on play button
        const playPauseBtn = document.getElementById('hero-play-pause');
        if (playPauseBtn) {
          playPauseBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
          playPauseBtn.disabled = true;
        }
        
        // Play the episode using the existing playEpisode function
        playEpisode(currentEpisode);
        
        // Reset button state after a delay
        setTimeout(() => {
          if (playPauseBtn) {
            playPauseBtn.disabled = false;
            updatePlayState(true);
          }
        }, 3000);
      }
    }
  } else {
    alert('No episode available to play. Please wait for episodes to load.');
  }
};

// Function to preload the current episode for instant playback
function preloadCurrentEpisode(episode) {
  // Stop any existing preloaded widget
  if (window.preloadedWidget) {
    try {
      if (typeof window.preloadedWidget.pause === 'function') {
        window.preloadedWidget.pause();
      }
    } catch (error) {
      // Error stopping preloaded widget
    }
    window.preloadedWidget = null;
  }
  
  // Create a hidden iframe to preload the specific episode
  const preloadContainer = document.getElementById('mixcloud-player');
  if (!preloadContainer) {
    return;
  }
  
  // Create hidden preload iframe
  const preloadIframe = document.createElement('iframe');
  preloadIframe.src = `https://player-widget.mixcloud.com/widget/iframe/?hide_artwork=1&autoplay=0&feed=${encodeURIComponent(episode.url)}`;
  preloadIframe.style.display = 'none';
  preloadIframe.style.position = 'absolute';
  preloadIframe.style.left = '-9999px';
  preloadIframe.style.width = '1px';
  preloadIframe.style.height = '1px';
  preloadIframe.id = 'mixcloud-iframe-preloaded';
  preloadIframe.allow = 'encrypted-media; fullscreen; autoplay; idle-detection; web-share;';
  
  preloadIframe.onload = () => {
    // Set up widget controls for the preloaded episode
    setTimeout(() => {
      if (window.Mixcloud) {
        try {
          window.preloadedWidget = window.Mixcloud.PlayerWidget(preloadIframe);
          window.mixcloudWidgetReady = true;
          
          // Sync button state when preloaded widget becomes active (same as main widget)
          if (window.preloadedWidget.events) {
            if (window.preloadedWidget.events.play) {
              window.preloadedWidget.events.play.on(() => {
                isCurrentlyPlaying = true;
                updatePlayState(true);
                syncProgressFromWidget();
                if (!window.currentProgressInterval && !window.currentProgressTimeoutId) startSimpleProgressTracking();
              });
            }
            if (window.preloadedWidget.events.pause) {
              window.preloadedWidget.events.pause.on(() => {
                isCurrentlyPlaying = false;
                updatePlayState(false);
                syncProgressFromWidget().then(stopProgressTracking);
              });
            }
          }
          
          // Mark player as ready when preloaded widget is ready
          setPlayerReady(true);
          
          // For mobile auto-play, wait for preloaded widget ready event then start play
          if (isMobileDevice() && window.isAutoPlaying) {
            // Listen for preloaded widget ready event
            if (window.preloadedWidget && window.preloadedWidget.events && window.preloadedWidget.events.ready) {
              window.preloadedWidget.events.ready.on(() => {
                const playPauseBtn = document.getElementById('hero-play-pause');
                if (playPauseBtn) {
                  playPauseBtn.click();
                }
                
                if (window.preloadedWidget && typeof window.preloadedWidget.play === 'function') {
                  window.preloadedWidget.play();
                  currentWidget = window.preloadedWidget;
                  isCurrentlyPlaying = true;
                  updatePlayState(true);
                  startSimpleProgressTracking();
                }
              });
            } else {
              // Fallback if no ready event available
              setTimeout(() => {
                const playPauseBtn = document.getElementById('hero-play-pause');
                if (playPauseBtn) {
                  playPauseBtn.click();
                }
                
                if (window.preloadedWidget && typeof window.preloadedWidget.play === 'function') {
                  window.preloadedWidget.play();
                }
              }, 1000);
            }
          }
          
          // Show play button on mobile now that Mixcloud is ready
          if (isMobileDevice()) {
            // For auto-play, ensure button is immediately visible
            if (window.isAutoPlaying) {
              const playPauseBtn = document.getElementById('hero-play-pause');
              if (playPauseBtn) {
                playPauseBtn.classList.add('mixcloud-ready');
                playPauseBtn.style.display = 'flex';
                playPauseBtn.style.opacity = '1';
                playPauseBtn.style.visibility = 'visible';
                playPauseBtn.style.pointerEvents = 'auto';
              }
              
              // Explicitly start playback for mobile auto-play with preloaded widget
              setTimeout(() => {
                // Try multiple approaches to start playback
                const playPauseBtn = document.getElementById('hero-play-pause');
                
                // Method 1: Direct preloaded widget play call
                if (window.preloadedWidget && typeof window.preloadedWidget.play === 'function') {
                  window.preloadedWidget.play();
                  currentWidget = window.preloadedWidget;
                  isCurrentlyPlaying = true;
                  updatePlayState(true);
                  startSimpleProgressTracking();
                }
                
                // Method 2: Programmatically click the play button
                if (playPauseBtn) {
                  playPauseBtn.click();
                }
                
                // Method 3: Trigger the play button's click event
                if (playPauseBtn) {
                  const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                  });
                  playPauseBtn.dispatchEvent(clickEvent);
                }
                
                // Hit play again after a short delay to ensure it actually starts
                setTimeout(() => {
                  // Try preloaded widget play again
                  if (window.preloadedWidget && typeof window.preloadedWidget.play === 'function') {
                    window.preloadedWidget.play();
                  }
                  
                  // Try clicking play button again
                  if (playPauseBtn) {
                    playPauseBtn.click();
                  }
                }, 1000);
              }, 500); // Small delay to ensure widget is fully ready
            } else {
              showPlayButtonWhenReady();
            }
          }
        } catch (error) {
          // Error initializing preloaded widget
        }
      }
    }, 1000);
  };
  
  preloadIframe.onerror = () => {
    // Error loading preloaded widget
  };
  
  // Add to hidden container
  preloadContainer.appendChild(preloadIframe);
}

// Function to pre-load Mixcloud player for mobile devices
function preloadMixcloudPlayer() {
  
  
  // Wait for episodes to be loaded first
  const checkForEpisodes = () => {
    const episodesGrid = document.getElementById('episodes-grid');
    if (episodesGrid && episodesGrid.querySelector('.episodes-card')) {
      
      
      // Get the first episode
      const firstEpisodeCard = episodesGrid.querySelector('.episodes-card');
      const episodeTitle = firstEpisodeCard.querySelector('.title')?.textContent;
      const episodeLink = firstEpisodeCard.querySelector('.play-link')?.href;
      
      if (episodeTitle && episodeLink) {
        // Set current episode
        currentEpisode = {
          name: episodeTitle,
          url: episodeLink
        };
        
        
        
        // Create the Mixcloud player but keep it hidden
        createPreloadedMixcloudPlayer(episodeLink);
      }
    } else {
      // Episodes not loaded yet, try again in 500ms
      setTimeout(checkForEpisodes, 500);
    }
  };
  
  checkForEpisodes();
}

// Function to create a pre-loaded Mixcloud player
function createPreloadedMixcloudPlayer(episodeUrl) {
  
  
  // Clear any existing player
  const playerContainer = document.getElementById('mixcloud-player');
  if (playerContainer) {
    playerContainer.innerHTML = '';
  }
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://player-widget.mixcloud.com/widget/iframe/?hide_artwork=1&autoplay=0&feed=${encodeURIComponent(episodeUrl)}`;
  iframe.width = '1%';
  iframe.height = '400';
  iframe.frameBorder = '0';
  iframe.allow = 'encrypted-media; fullscreen; autoplay; idle-detection; web-share;';
    iframe.style.border = 'none';
    iframe.id = 'mixcloud-iframe-preloaded';
    iframe.style.display = 'block'; // Make visible for instant play
  
  // Add event listeners
  iframe.onload = () => {
    
    
    // Create widget immediately for instant play
    setTimeout(() => {
      if (window.Mixcloud) {
        try {
          currentWidget = window.Mixcloud.PlayerWidget(iframe);
          if (currentWidget.events) {
            if (currentWidget.events.play) {
              currentWidget.events.play.on(() => {
                isCurrentlyPlaying = true;
                updatePlayState(true);
                syncProgressFromWidget();
                if (!window.currentProgressInterval && !window.currentProgressTimeoutId) startSimpleProgressTracking();
              });
            }
            if (currentWidget.events.pause) {
              currentWidget.events.pause.on(() => {
                isCurrentlyPlaying = false;
                updatePlayState(false);
                syncProgressFromWidget().then(stopProgressTracking);
              });
            }
          }
          setPlayerReady(true);
        } catch (error) {
          
        }
      } else {
        
        // Retry after a delay
        setTimeout(() => {
          if (window.Mixcloud) {
            try {
              currentWidget = window.Mixcloud.PlayerWidget(iframe);
              if (currentWidget.events) {
                if (currentWidget.events.play) currentWidget.events.play.on(() => { isCurrentlyPlaying = true; updatePlayState(true); syncProgressFromWidget(); if (!window.currentProgressInterval && !window.currentProgressTimeoutId) startSimpleProgressTracking(); });
                if (currentWidget.events.pause) currentWidget.events.pause.on(() => { isCurrentlyPlaying = false; updatePlayState(false); syncProgressFromWidget().then(stopProgressTracking); });
              }
              setPlayerReady(true);
            } catch (error) {
              
            }
          }
        }, 2000);
      }
    }, 1000);
  };
  
  iframe.onerror = (error) => {
    
  };
  
  // Add to player container
  if (playerContainer) {
    playerContainer.appendChild(iframe);
  }
}

// Function to ensure play button is ready
function ensurePlayButtonReady() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (playPauseBtn) {
    // Hide play button on mobile initially until player is ready
    if (isMobileDevice()) {
      if (!window.mixcloudWidgetReady || !isPlayerReady) {
        hidePlayButtonOnMobile();
      } else if (isPlayButtonHiddenOnMobile) {
        showPlayButtonWhenReady();
      }
    }
    
    // Make sure the button is properly set up
    playPauseBtn.style.pointerEvents = 'auto';
    playPauseBtn.style.cursor = 'pointer';
    
    // If no current episode, try to get one from the episodes grid
    if (!currentEpisode) {
      const episodesGrid = document.getElementById('episodes-grid');
      if (episodesGrid) {
        const firstEpisodeCard = episodesGrid.querySelector('.episodes-card');
        if (firstEpisodeCard) {
          const episodeTitle = firstEpisodeCard.querySelector('.title')?.textContent;
          const episodeLink = firstEpisodeCard.querySelector('.play-link')?.href;
          if (episodeTitle && episodeLink) {
            currentEpisode = {
              name: episodeTitle,
              url: episodeLink
            };
            
          } else {
            
          }
        } else {
          
        }
      } else {
        
      }
    } else {
      
    }
  }
}

// Auto-updating Instagram Posts System using RSS.app feed
class AutoInstagramPosts {
  constructor() {
    this.posts = [];
    this.isLoading = false;
    this.lastUpdate = null;
    this.currentSlide = 0;
    this.postsPerSlide = 2;
    this.totalSlides = 0;
    this.feedUrl = 'https://rss.app/feeds/v1.1/mJ2rDzObUofwK0BR.json';
  }

  // Initialize posts
  async init() {
    try {
      await this.loadPosts();
    } catch (error) {
      //console.error('Failed to load Instagram posts:', error);
      this.loadFallbackPosts();
    }
  }

  // Load posts from RSS.app feed
  async loadPosts() {
    this.isLoading = true;
    
    try {
      const response = await fetch(this.feedUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Convert RSS feed items to our post format
        this.posts = data.items.map((item, index) => ({
          id: item.id || `rss-${index}`,
          title: item.title || 'Instagram Post',
          content: item.content_text || item.content_html || '',
          image: item.image || (item.attachments && item.attachments[0]?.url),
          link: item.url,
          date: item.date_published || new Date().toISOString()
        }));
        
        
        this.lastUpdate = new Date();
        this.isLoading = false;
        this.initSlider();
        this.renderPosts();
        return;
      } else {
        //console.warn('RSS feed not accessible, status:', response.status, 'using fallback');
        this.loadFallbackPosts();
        return;
      }
    } catch (error) {
      //console.error('Error loading RSS feed:', error);
      //console.error('Error details:', error.message, error.stack);
      this.loadFallbackPosts();
      return;
    }
  }

  // Fallback posts if RSS feed fails
  loadFallbackPosts() {
    this.posts = [
      {
        id: 'fallback1',
        title: 'Welcome to SamudraFM!',
        content: '🎵 Fresh beats and great vibes! Tune in to SamudraFM for the latest music and updates!',
        image: 'images/CustomPost/552514804_17962043480989085_3816.jpg',
        link: 'https://www.instagram.com/samudrafm/',
        date: new Date().toISOString()
      },
      {
        id: 'fallback2',
        title: 'Behind the Scenes',
        content: '📻 Our amazing team working hard to bring you the best content!',
        image: 'images/CustomPost/551500122_17962043462989085_5241.jpg',
        link: 'https://www.instagram.com/samudrafm/',
        date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'fallback3',
        title: 'New Episode Alert!',
        content: '🔥 Check out our latest episode featuring amazing music and great conversations!',
        image: 'images/CustomPost/551794330_17962043393989085_4990.jpg',
        link: 'https://www.instagram.com/samudrafm/',
        date: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'fallback4',
        title: 'Thank You Listeners!',
        content: '🙏 Thank you for your amazing support! We love hearing from our community!',
        image: 'images/CustomPost/552115285_17962041956989085_5018.jpg',
        link: 'https://www.instagram.com/samudrafm/',
        date: new Date(Date.now() - 259200000).toISOString()
      }
    ];
    this.isLoading = false;
    this.initSlider();
    this.renderPosts();
  }

  // Initialize Instagram posts slider
  initSlider() {
    this.totalSlides = Math.ceil(this.posts.length / this.postsPerSlide);
    this.createSliderDots();
    this.updateSliderControls();
  }

  // Create slider dots
  createSliderDots() {
    const dotsContainer = document.getElementById('instagram-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'slider-dot';
      if (i === this.currentSlide) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Update slider controls
  updateSliderControls() {
    const prevBtn = document.getElementById('prev-instagram');
    const nextBtn = document.getElementById('next-instagram');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentSlide === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentSlide >= this.totalSlides - 1;
    }
  }

  // Go to specific slide
  goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
    
    this.currentSlide = slideIndex;
    this.renderPosts();
    this.updateSliderControls();
    this.createSliderDots();
  }

  // Go to next slide
  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  // Go to previous slide
  prevSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  // Render posts to the UI with slider
  renderPosts() {
    const postsContainer = document.getElementById('instagram-feed');
    if (!postsContainer) {
      return;
    }

    // Clear existing posts
    postsContainer.innerHTML = '';

    // Show loading state if still loading
    if (this.isLoading) {
      postsContainer.innerHTML = `
        <div class="instagram-loading" style="grid-column: 1 / -1;">
          <i class="fab fa-instagram"></i>
          <p>Loading latest posts...</p>
        </div>
      `;
      return;
    }

    // Calculate which posts to show for current slide
    const startIndex = this.currentSlide * this.postsPerSlide;
    const endIndex = startIndex + this.postsPerSlide;
    const postsToShow = this.posts.slice(startIndex, endIndex);

    // Render posts for current slide
    postsToShow.forEach((post, index) => {
      const postElement = this.createPostCard(post, startIndex + index);
      postsContainer.appendChild(postElement);
    });
  }

  // Create individual post card
  createPostCard(post, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'instagram-post';
    if (post.link) {
      cardDiv.onclick = () => window.open(post.link, '_blank');
    }

    const timeAgo = this.getTimeAgo(post.date);
    const content = this.truncateText(post.content, 60);

    // Create image element with smart fallback
    const imageContainer = document.createElement('div');
    imageContainer.className = 'instagram-post-image';
    
    const img = document.createElement('img');
    img.alt = post.title;
    img.loading = 'lazy';
    
    // Smart image loading with fallbacks
    this.loadImageWithFallback(img, post.image, imageContainer);
    
    const placeholder = document.createElement('div');
    placeholder.className = 'instagram-placeholder';
    placeholder.style.display = 'none';
    placeholder.innerHTML = '<i class="fab fa-instagram"></i>';
    
    imageContainer.appendChild(img);
    imageContainer.appendChild(placeholder);
    
    cardDiv.innerHTML = `
      <div class="instagram-post-content">
        <h3 class="instagram-post-title">${post.title}</h3>
        <p class="instagram-post-description">${content}</p>
        <div class="instagram-post-meta">
          <p class="instagram-post-date">${timeAgo}</p>
          ${post.link ? `<a href="${post.link}" class="instagram-post-link" target="_blank" rel="noopener">
            View <i class="fas fa-external-link-alt"></i>
          </a>` : ''}
        </div>
      </div>
    `;
    
    cardDiv.insertBefore(imageContainer, cardDiv.firstChild);

    return cardDiv;
  }

  // Get time ago string
  getTimeAgo(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  }

  // Truncate text to specified length
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Manual refresh
  async refresh() {
    await this.loadPosts();
  }

  // Get last update time
  getLastUpdateTime() {
    return this.lastUpdate ? this.lastUpdate.toLocaleTimeString() : 'Never';
  }

  // Smart image loading with fallbacks
  loadImageWithFallback(img, originalUrl, container) {
    if (!originalUrl) {
      this.showPlaceholder(container);
      return;
    }

    // Try different URL variations for Instagram images
    const urlVariations = [
      originalUrl,
      originalUrl.replace('.heic', '.jpg'),
      originalUrl.replace('_e35_tt6', '_e35_s640x640'),
      originalUrl.replace('_e35_tt6', '_e35_s480x480'),
      // Fallback to a generic Instagram placeholder
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjYxQjU4Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3My4zIDE1MCAxNTAgMTczLjMgMTUwIDIwMEMxNTAgMjI2LjcgMTczLjMgMjUwIDIwMCAyNTBDMjI2LjcgMjUwIDI1MCAyMjYuNyAyNTAgMjAwQzI1MCAxNzMuMyAyMjYuNyAxNTAgMjAwIDE1MFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNzUgMTUwSDI1MFYyNTBIMjc1VjE1MFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNTAgMTc1SDEyNVYyMjVIMTUwVjE3NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='
    ];

    let currentIndex = 0;

    const tryNextUrl = () => {
      if (currentIndex >= urlVariations.length) {
        this.showPlaceholder(container);
        return;
      }

      const currentUrl = urlVariations[currentIndex];
      img.src = currentUrl;
    };

    img.onload = () => {
      img.style.display = 'block';
      const placeholder = container.querySelector('.instagram-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    };

    img.onerror = () => {
      currentIndex++;
      tryNextUrl();
    };

    // Start trying URLs
    tryNextUrl();
  }

  // Show placeholder when all image attempts fail
  showPlaceholder(container) {
    const img = container.querySelector('img');
    const placeholder = container.querySelector('.instagram-placeholder');
    
    if (img) img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  }
}

// Manual Instagram Posts System - Simple & Reliable with Slider
class ManualInstagramPosts {
  constructor() {
    this.posts = [];
    this.isLoading = false;
    this.lastUpdate = null;
    this.currentSlide = 0;
    this.postsPerSlide = 2; // Show 2 posts per slide
    this.totalSlides = 0;
  }

  // Initialize posts
  async init() {
    try {
      
      await this.loadPosts();
    } catch (error) {
      
      this.loadFallbackPosts();
    }
  }

  // Load posts from custom-posts.json (Manual System)
  async loadPosts() {
    this.isLoading = true;
    
    try {
      const response = await fetch('json/custom-posts.json?v=' + Date.now());
      
      if (response.ok) {
        const data = await response.json();
        this.posts = data.posts || [];
        
        this.lastUpdate = new Date();
        this.isLoading = false;
        this.initSlider();
        this.renderPosts();
        return;
      } else {
        //console.warn('Custom posts file not found, using fallback. Status:', response.status);
        this.loadFallbackPosts();
        return;
      }
    } catch (error) {
      //console.error('Error loading custom posts:', error);
      //console.error('Error details:', error.message, error.stack);
      this.loadFallbackPosts();
      return;
    }
  }

  // Extract title from caption (first line or first 30 chars)
  extractTitleFromCaption(caption) {
    if (!caption) return 'Instagram Post';
    
    const lines = caption.split('\n');
    const firstLine = lines[0].trim();
    
    if (firstLine.length <= 30) {
      return firstLine;
    }
    
    return firstLine.substring(0, 30) + '...';
  }

  // Fallback posts if auto-update fails
  loadFallbackPosts() {
    
    this.posts = [
      {
        id: 'fallback1',
        title: 'Welcome to SamudraFM!',
        content: '?? Fresh beats and great vibes! Tune in to SamudraFM for the latest music and updates!',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
        link: 'https://www.instagram.com/samudrafm/',
        date: new Date().toISOString()
      },
      {
        id: 'fallback2',
        title: 'Behind the Scenes',
        content: '?? Our amazing team working hard to bring you the best content!',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
        link: 'https://www.instagram.com/samudrafm/',
        date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    this.isLoading = false;
    this.initSlider();
    this.renderPosts();
  }

  // Initialize Instagram posts slider
  initSlider() {
    this.totalSlides = Math.ceil(this.posts.length / this.postsPerSlide);
    this.createSliderDots();
    this.updateSliderControls();
  }

  // Create slider dots
  createSliderDots() {
    const dotsContainer = document.getElementById('instagram-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'slider-dot';
      if (i === this.currentSlide) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Update slider controls
  updateSliderControls() {
    const prevBtn = document.getElementById('prev-instagram');
    const nextBtn = document.getElementById('next-instagram');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentSlide === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentSlide >= this.totalSlides - 1;
    }
  }

  // Go to specific slide
  goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
    
    this.currentSlide = slideIndex;
    this.renderPosts();
    this.updateSliderControls();
    this.createSliderDots();
  }

  // Go to next slide
  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  // Go to previous slide
  prevSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  // Render posts to the UI with slider
  renderPosts() {
    const postsContainer = document.getElementById('instagram-feed');
    if (!postsContainer) {
      
      return;
    }

    
    
    // Clear existing posts
    postsContainer.innerHTML = '';

    // Show loading state if still loading
    if (this.isLoading) {
      postsContainer.innerHTML = `
        <div class="instagram-loading" style="grid-column: 1 / -1;">
          <i class="fab fa-instagram"></i>
          <p>Loading latest posts...</p>
        </div>
      `;
      return;
    }

    // Calculate which posts to show for current slide
    const startIndex = this.currentSlide * this.postsPerSlide;
    const endIndex = startIndex + this.postsPerSlide;
    const postsToShow = this.posts.slice(startIndex, endIndex);

    // Render posts for current slide
    postsToShow.forEach((post, index) => {
      const postElement = this.createPostCard(post, startIndex + index);
      postsContainer.appendChild(postElement);
    });
    
    
  }

  // Create individual post card
  createPostCard(post, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'instagram-post';
    if (post.link) {
      cardDiv.onclick = () => window.open(post.link, '_blank');
    }

    const timeAgo = this.getTimeAgo(post.date);
    const content = this.truncateText(post.content, 60);

    // Create image element with fallback handling
    const imageContainer = document.createElement('div');
    imageContainer.className = 'instagram-post-image';
    
    const img = document.createElement('img');
    img.alt = post.title;
    img.loading = 'lazy';
    
    // Set up image loading with fallbacks
    this.setupImageWithFallbacks(img, post.image, imageContainer);
    
    const placeholder = document.createElement('div');
    placeholder.className = 'instagram-placeholder';
    placeholder.style.display = 'none';
    placeholder.innerHTML = '<i class="fab fa-instagram"></i>';
    
    imageContainer.appendChild(img);
    imageContainer.appendChild(placeholder);
    
    cardDiv.innerHTML = `
      <div class="instagram-post-content">
        <h3 class="instagram-post-title">${post.title}</h3>
        <p class="instagram-post-description">${content}</p>
        <div class="instagram-post-meta">
          <p class="instagram-post-date">${timeAgo}</p>
          ${post.link ? `<a href="${post.link}" class="instagram-post-link" target="_blank" rel="noopener">
            View <i class="fas fa-external-link-alt"></i>
          </a>` : ''}
        </div>
      </div>
    `;
    
    cardDiv.insertBefore(imageContainer, cardDiv.firstChild);

    return cardDiv;
  }

  // Setup image with multiple fallback attempts
  setupImageWithFallbacks(img, originalUrl, container) {
    if (!originalUrl) {
      this.showPlaceholder(container);
      return;
    }

    // Try different URL variations
    const urlVariations = [
      originalUrl,
      originalUrl.replace('.heic', '.jpg'),
      originalUrl.replace('stp=dst-jpg_e35_tt6', 'stp=dst-jpg_e35_s640x640'),
      originalUrl.replace('stp=dst-jpg_e35_tt6', 'stp=dst-jpg_e35_s480x480')
    ];

    let currentIndex = 0;

    const tryNextUrl = () => {
      if (currentIndex >= urlVariations.length) {
        //console.warn('All image URL variations failed for:', originalUrl);
        this.showPlaceholder(container);
        return;
      }

      const currentUrl = urlVariations[currentIndex];
      
      img.src = currentUrl;
    };

    img.onload = () => {
      img.style.display = 'block';
      container.querySelector('.instagram-placeholder').style.display = 'none';
    };

    img.onerror = () => {
      //console.warn(`Image failed to load (attempt ${currentIndex + 1}):`, img.src);
      currentIndex++;
      tryNextUrl();
    };

    // Start trying URLs
    tryNextUrl();
  }

  // Show placeholder when image fails
  showPlaceholder(container) {
    const img = container.querySelector('img');
    const placeholder = container.querySelector('.instagram-placeholder');
    
    if (img) img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  }

  // Get time ago string
  getTimeAgo(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  }

  // Truncate text to specified length
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Manual refresh
  async refresh() {
    
    await this.loadLatestPosts();
  }

  // Get last update time
  getLastUpdateTime() {
    return this.lastUpdate ? this.lastUpdate.toLocaleTimeString() : 'Never';
  }
}

// Test function to check JSON file directly
window.testCustomPosts = async function() {
  try {
    const response = await fetch('json/custom-posts.json?v=' + Date.now());
    const data = await response.json();
    // Test function - no console output
  } catch (error) {
    //console.error('Direct fetch error:', error);
  }
};

// Initialize Instagram posts when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add a small delay to ensure all elements are ready
  setTimeout(() => {
    const instagramFeed = document.getElementById('instagram-feed');
    
    if (instagramFeed) {
      // Show loading state immediately
      instagramFeed.innerHTML = '<div class="loading-state">Loading Instagram posts...</div>';
      
      // Load Instagram posts with retry logic
      loadInstagramPostsWithRetry();
    } else {
      // Retry after a longer delay
      setTimeout(() => {
        const retryFeed = document.getElementById('instagram-feed');
        if (retryFeed) {
          retryFeed.innerHTML = '<div class="loading-state">Loading Instagram posts...</div>';
          loadInstagramPostsWithRetry();
        }
      }, 1000);
    }
  }, 100);
});

// Load Instagram posts with retry logic
async function loadInstagramPostsWithRetry() {
  const instagramFeed = document.getElementById('instagram-feed');
  if (!instagramFeed) return;
  
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount < maxRetries) {
    try {
      await loadInstagramPosts();
      return; // Success, exit retry loop
    } catch (error) {
      retryCount++;
      
      if (retryCount < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      } else {
        instagramFeed.innerHTML = '<div class="no-posts">Unable to load Instagram posts</div>';
      }
    }
  }
}
  
// Load Instagram posts function
async function loadInstagramPosts() {
  const container = document.getElementById('instagram-feed');
  if (!container) {
    console.error('Instagram feed container not found');
    return;
  }
  
  // Show loading state
  //console.log('Setting loading state...');
  container.innerHTML = `
    <div class="instagram-loading" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
      <i class="fab fa-instagram" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent);"></i>
      <p style="color: var(--muted);">Loading Instagram posts...</p>
    </div>
  `;
  //console.log('Loading state set, container innerHTML:', container.innerHTML);
  
  try {
    const posts = await fetchInstagramPosts();
    
    if (posts && posts.length > 0) {
      renderInstagramPosts(posts);
    } else {
      console.warn('No posts received, showing fallback message');
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
          <i class="fab fa-instagram" style="font-size: 2rem; margin-bottom: 1rem; color: var(--muted);"></i>
          <p style="color: var(--muted);">No Instagram posts available at the moment</p>
          <p style="color: var(--muted); font-size: 0.9rem; margin-top: 0.5rem;">Check back later or visit our <a href="https://www.instagram.com/samudrafm/" target="_blank" style="color: var(--accent);">Instagram page</a></p>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('Error loading Instagram posts:', error);
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: var(--warning);"></i>
        <p style="color: var(--muted);">Unable to load Instagram posts</p>
        <p style="color: var(--muted); font-size: 0.9rem; margin-top: 0.5rem;">Please check your connection or visit our <a href="https://www.instagram.com/samudrafm/" target="_blank" style="color: var(--accent);">Instagram page</a></p>
      </div>
    `;
  }
}

// Auto-refresh Instagram posts every 5 minutes - DISABLED
// setInterval(() => {
//   if (window.autoInstagramPosts) {
//     window.autoInstagramPosts.refresh();
//   }
// }, 5 * 60 * 1000); // 5 minutes

// Ensure main content grid is visible on mobile
function ensureMainContentVisible() {
  const mainContentGrid = document.querySelector('.main-content-grid');
  if (!mainContentGrid) return;
  
  //console.log('Main content grid found - ensuring visibility');
  
  // Force main content grid to be visible
  mainContentGrid.style.setProperty('opacity', '1', 'important');
  mainContentGrid.style.setProperty('transform', 'translateY(0)', 'important');
  mainContentGrid.style.setProperty('pointer-events', 'auto', 'important');
  mainContentGrid.style.setProperty('display', 'grid', 'important');
  mainContentGrid.style.setProperty('visibility', 'visible', 'important');
  
  // Force all child elements to be visible
  const childElements = mainContentGrid.querySelectorAll('*');
  childElements.forEach(element => {
    if (!element.classList.contains('hero') && !element.classList.contains('hero-latest')) {
      element.classList.add('mobile-revealed', 'revealed');
      element.style.setProperty('opacity', '1', 'important');
      element.style.setProperty('transform', 'translateY(0)', 'important');
      element.style.setProperty('pointer-events', 'auto', 'important');
      element.style.setProperty('visibility', 'visible', 'important');
    }
  });
  
  // Specifically ensure coming section is visible
  const comingSection = document.querySelector('.coming');
  if (comingSection) {
    comingSection.classList.add('mobile-revealed', 'revealed');
    comingSection.style.setProperty('opacity', '1', 'important');
    comingSection.style.setProperty('transform', 'translateY(0)', 'important');
    comingSection.style.setProperty('pointer-events', 'auto', 'important');
    comingSection.style.setProperty('visibility', 'visible', 'important');
    
    // Ensure coming-grid is visible (but don't modify its content)
    const comingGrid = document.getElementById('coming-grid');
    if (comingGrid) {
      // Only add visibility classes if content is already loaded
      if (comingGrid.children.length > 0) {
        //console.log('coming-grid already has content, preserving it');
      }
      comingGrid.classList.add('mobile-revealed', 'revealed');
      comingGrid.style.setProperty('opacity', '1', 'important');
      comingGrid.style.setProperty('transform', 'translateY(0)', 'important');
      comingGrid.style.setProperty('pointer-events', 'auto', 'important');
      comingGrid.style.setProperty('visibility', 'visible', 'important');
      //console.log('coming-grid visibility ensured, content preserved');
    }
  }

  // Specifically ensure instagram section is visible
  const instagramSection = document.querySelector('.instagram-section');
  if (instagramSection) {
    instagramSection.classList.add('mobile-revealed', 'revealed');
    instagramSection.style.setProperty('opacity', '1', 'important');
    instagramSection.style.setProperty('transform', 'translateY(0)', 'important');
    instagramSection.style.setProperty('pointer-events', 'auto', 'important');
    instagramSection.style.setProperty('visibility', 'visible', 'important');
    
    // Ensure instagram-feed is visible
    const instagramFeed = document.getElementById('instagram-feed');
    if (instagramFeed) {
      instagramFeed.classList.add('mobile-revealed', 'revealed');
      instagramFeed.style.setProperty('opacity', '1', 'important');
      instagramFeed.style.setProperty('transform', 'translateY(0)', 'important');
      instagramFeed.style.setProperty('pointer-events', 'auto', 'important');
      instagramFeed.style.setProperty('visibility', 'visible', 'important');
    }
    
    // Ensure all instagram cards are visible
    const instagramCards = instagramSection.querySelectorAll('.instagram-card');
    instagramCards.forEach(card => {
      card.classList.add('mobile-revealed', 'revealed');
      card.style.setProperty('opacity', '1', 'important');
      card.style.setProperty('transform', 'translateY(0) scale(1)', 'important');
      card.style.setProperty('pointer-events', 'auto', 'important');
      card.style.setProperty('visibility', 'visible', 'important');
    });
  }
  
  //console.log('Main content grid visibility enforced');
}

// Simplified mobile content visibility - removed complex logic that might cause issues

// Backup loading for sections that might not load on first try
window.addEventListener('load', () => {
  // Check Instagram section
  const instagramFeed = document.getElementById('instagram-feed');
  if (instagramFeed && instagramFeed.innerHTML.trim() === '') {
    instagramFeed.innerHTML = '<div class="loading-state">Loading Instagram posts...</div>';
    loadInstagramPostsWithRetry();
  }
  
  // Check Coming up section
  const comingGrid = document.getElementById('coming-grid');
  if (comingGrid && comingGrid.innerHTML.trim() === '') {
    comingGrid.innerHTML = '<div class="loading-state">Loading upcoming shows...</div>';
    loadComingUpEventsWithRetry();
  }
  
  // Check Episodes section
  const episodesSlider = document.getElementById('episodes-slider');
  if (episodesSlider && episodesSlider.innerHTML.trim() === '') {
    episodesSlider.innerHTML = '<p class="muted">Loading episodes...</p>';
    loadEpisodesWithRetry();
  }
});

// Instagram Navigation Functions
function scrollInstagramLeft() {
  const feed = document.getElementById('instagram-feed');
  if (!feed) return;
  
  const scrollAmount = feed.clientWidth * 0.8; // Scroll by 80% of visible width
  feed.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  });
  
  updateInstagramNavButtons();
  // Reset auto-scroll timer when nav controls are used
  resetInstagramAutoScroll();
}

function scrollInstagramRight() {
  const feed = document.getElementById('instagram-feed');
  if (!feed) return;
  
  const scrollAmount = feed.clientWidth * 0.8; // Scroll by 80% of visible width
  feed.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
  
  updateInstagramNavButtons();
  // Reset auto-scroll timer when nav controls are used
  resetInstagramAutoScroll();
}

function updateInstagramNavButtons() {
  const feed = document.getElementById('instagram-feed');
  if (!feed) return;
  
  const prevBtn = document.querySelector('.instagram-prev-btn');
  const nextBtn = document.querySelector('.instagram-next-btn');
  
  if (!prevBtn || !nextBtn) return;
  
  // Update button states based on scroll position
  const isAtStart = feed.scrollLeft <= 0;
  const isAtEnd = feed.scrollLeft >= (feed.scrollWidth - feed.clientWidth);
  
  prevBtn.disabled = isAtStart;
  nextBtn.disabled = isAtEnd;
}

// Initialize navigation buttons when Instagram posts are loaded
document.addEventListener('DOMContentLoaded', function() {
  // Update buttons after a short delay to ensure posts are loaded
  setTimeout(updateInstagramNavButtons, 2000);
  
  // Update buttons on scroll
  const feed = document.getElementById('instagram-feed');
  if (feed) {
    feed.addEventListener('scroll', updateInstagramNavButtons);
  }
  
  // Start Instagram auto-scroll after posts are loaded
  setTimeout(startInstagramAutoScroll, 3000);
});

// Instagram Auto-Scroll Feature
let instagramAutoScrollInterval = null;
let instagramAutoScrollPaused = false;

function startInstagramAutoScroll() {
  const feed = document.getElementById('instagram-feed');
  if (!feed) return;
  
  // Clear any existing interval
  if (instagramAutoScrollInterval) {
    clearInterval(instagramAutoScrollInterval);
  }
  
  // Pause auto-scroll on hover
  feed.addEventListener('mouseenter', () => {
    instagramAutoScrollPaused = true;
  });
  
  feed.addEventListener('mouseleave', () => {
    instagramAutoScrollPaused = false;
  });
  
  // Auto-scroll every 3 seconds
  instagramAutoScrollInterval = setInterval(() => {
    if (instagramAutoScrollPaused) return;
    
    const feed = document.getElementById('instagram-feed');
    if (!feed) return;
    
    // Get the first instagram card to determine scroll amount (one post width)
    const firstCard = feed.querySelector('.instagram-card');
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth + 14; // Card width + gap
    const maxScroll = feed.scrollWidth - feed.clientWidth;
    
    // Check if we're at or near the end
    if (feed.scrollLeft >= maxScroll - 5) {
      // Scroll back to the beginning smoothly
      feed.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll to the next post
      feed.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
    
    updateInstagramNavButtons();
  }, 4000);
}

function stopInstagramAutoScroll() {
  if (instagramAutoScrollInterval) {
    clearInterval(instagramAutoScrollInterval);
    instagramAutoScrollInterval = null;
  }
}

function resetInstagramAutoScroll() {
  stopInstagramAutoScroll();
  startInstagramAutoScroll();
}

// Ad banner auto-rotate and dot indicators
function initAdBanner() {
  var track = document.getElementById('ad-banner-track');
  var dotsContainer = document.getElementById('ad-banner-dots');
  if (!track) return;
  var index = 0;
  var total = 4;
  var intervalMs = 5000;
  var intervalId;

  function goToSlide(i) {
    index = (i + total) % total;
    track.style.transform = 'translateX(-' + (index * 25) + '%)';
    if (dotsContainer) {
      var dots = dotsContainer.querySelectorAll('.ad-banner-dot');
      dots.forEach(function(dot, j) {
        var isActive = j === index;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive);
      });
    }
  }

  if (dotsContainer) {
    dotsContainer.querySelectorAll('.ad-banner-dot').forEach(function(dot) {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var i = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(i)) goToSlide(i);
      });
    });
  }

  intervalId = setInterval(function() {
    goToSlide(index + 1);
  }, intervalMs);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdBanner);
} else {
  initAdBanner();
}

// Calculate and display founder ages
function calculateFounderAges() {
  const ageElements = document.querySelectorAll('.age-calc');
  const currentYear = new Date().getFullYear();
  
  ageElements.forEach(function(element) {
    const birthYear = parseInt(element.getAttribute('data-birth-year'));
    if (!isNaN(birthYear)) {
      const age = currentYear - birthYear;
      element.textContent = age;
    }
  });
}

// Run age calculation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', calculateFounderAges);
} else {
  calculateFounderAges();
}