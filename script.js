// SamduraFM front-end behaviors and mock data wiring

// Force clear cache on every load
if ('caches' in window) {
    caches.keys().then(function(names) {
        for (let name of names) {
            caches.delete(name);
        }
    });
}

// Hidden easter egg - hiring message
console.log('%c🥚 Easter Egg Found!', 'color: #f61b58; font-size: 16px; font-weight: bold;');
console.log('%cLike looking under the hood? We\'re interested in people like you!', 'color: #8b4c93; font-size: 14px;');
console.log('%cCome and join us: https://samudrafm.com/opportunities/', 'color: #f61b58; font-size: 12px; text-decoration: underline;');
console.log('%cWe\'re always looking for talented developers! 🚀', 'color: #8b4c93; font-size: 12px; font-style: italic;');

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    
    // Add animate__fadeInRightBig class on mobile when menu opens
    if (window.innerWidth <= 768) {
      if (open) {
        console.log('Opening menu on mobile');
        // Remove any existing animation classes first
        navMenu.classList.remove('animate__fadeInRightBig', 'animate__animated');
        // Force a reflow to ensure the class removal takes effect
        navMenu.offsetHeight;
        // Add both animate__animated and animate__fadeInRightBig classes
        navMenu.classList.add('animate__animated', 'animate__fadeInRightBig');
        console.log('Added animation classes:', navMenu.classList.toString());
        // Remove animation class after animation completes
        setTimeout(() => {
          navMenu.classList.remove('animate__fadeInRightBig', 'animate__animated');
          console.log('Removed animation classes');
        }, 1000);
      } else {
        // Remove animation class when closing
        navMenu.classList.remove('animate__fadeInRightBig', 'animate__animated');
        console.log('Closing menu, removed animation classes');
      }
    }
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
        { src: 'images/SamudraFMLogo1transparent.png', sizes: '96x96', type: 'image/png' },
        { src: 'images/SamudraFMLogo1transparent.png', sizes: '128x128', type: 'image/png' },
        { src: 'images/SamudraFMLogo1transparent.png', sizes: '192x192', type: 'image/png' },
        { src: 'images/SamudraFMLogo1transparent.png', sizes: '256x256', type: 'image/png' },
        { src: 'images/SamudraFMLogo1transparent.png', sizes: '384x384', type: 'image/png' },
        { src: 'images/SamudraFMLogo1transparent.png', sizes: '512x512', type: 'image/png' }
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
      { src: 'images/SamudraFMLogo1transparent.png', sizes: '96x96', type: 'image/png' },
      { src: 'images/SamudraFMLogo1transparent.png', sizes: '128x128', type: 'image/png' },
      { src: 'images/SamudraFMLogo1transparent.png', sizes: '192x192', type: 'image/png' },
      { src: 'images/SamudraFMLogo1transparent.png', sizes: '256x256', type: 'image/png' },
      { src: 'images/SamudraFMLogo1transparent.png', sizes: '384x384', type: 'image/png' },
      { src: 'images/SamudraFMLogo1transparent.png', sizes: '512x512', type: 'image/png' }
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
  'JensenL': 'assets/avatar/Jensen.jpg',
  'Jensen': 'assets/avatar/Jensen.jpg',
  'JensenLim': 'assets/avatar/Jensen.jpg',
  'Jensen Lim': 'assets/avatar/Jensen.jpg',
  'Jensen L': 'assets/avatar/Jensen.jpg',
  'Srishti': 'assets/avatar/Srishti.jpg',
  'mrbean': 'assets/avatar/mrbean.jpg',
  'Mrbean': 'assets/avatar/mrbean.jpg',
  'MrBean': 'assets/avatar/mrbean.jpg',
  'Marcus': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'Jess': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
  'James': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'Lana': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'Jessica': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
  'Niv': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'Gavin': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'TBA': 'images/SamudraFMLogo1.png'
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
  
  // Default fallback - use SamudraFM logo
  return 'images/SamudraFMLogo1.png';
}

const MOCK_COMING = [
  { title: 'Jensen', desc: 'A Wee Mystical Magical Show', time: '20:00 � 22:00', cover: null },
  { title: 'Good guy', desc: 'Throwbacks With Good guy', time: '22:00 � 00:00', cover: null }
];

// Mock data for reference (Live section removed)
// MOCK_NOW, MOCK_RECENT, MOCK_COMING kept for potential future use

// Instagram API Configuration - Using secure backend API
// API keys are now stored securely in GitHub Repository secrets
// and accessed through the backend API server

// Instagram API Integration (Using JSONP approach for static hosting)
async function fetchInstagramPosts() {
  try {
    // Since we can't use CORS proxies, we'll use the fallback data
    // In a real production environment, you'd need a backend server
    console.log('Using fallback Instagram data for static hosting');
    return getFallbackInstagramPosts();
    
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    // Return fallback data if API fails
    return getFallbackInstagramPosts();
  }
}

// Fallback Instagram posts if API fails
function getFallbackInstagramPosts() {
  return [
    {
      id: 'fallback-1',
      caption: 'Welcome to SamudraFM! Your study, your music. 🎵',
      mediaUrl: 'images/SamudraFMLogo1.png',
      thumbnailUrl: 'images/SamudraFMLogo1.png',
      permalink: 'https://www.instagram.com/samudrafm/',
      timestamp: new Date().toLocaleDateString('en-GB')
    },
    {
      id: 'fallback-2',
      caption: 'Tune in to our latest shows and discover new music! 🎧',
      mediaUrl: 'images/SamudraFMLogo1.png',
      thumbnailUrl: 'images/SamudraFMLogo1.png',
      permalink: 'https://www.instagram.com/samudrafm/',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
    },
    {
      id: 'fallback-3',
      caption: 'Helping you focus, unwind, and stay inspired — one song at a time. ✨',
      mediaUrl: 'images/SamudraFMLogo1.png',
      thumbnailUrl: 'images/SamudraFMLogo1.png',
      permalink: 'https://www.instagram.com/samudrafm/',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
    }
  ];
}

// Fallback direct Instagram API (for development)
async function fetchInstagramPostsDirect() {
  try {
    // This fallback is disabled to prevent API key exposure
    // All API calls should go through the secure backend
    console.warn('Fallback Instagram API is disabled for security');
    return [];
    
  } catch (error) {
    console.error('Error fetching Instagram posts directly:', error);
    return [];
  }
}

// Render Instagram posts
function renderInstagramPosts(posts) {
  const container = document.getElementById('instagram-feed');
  if (!container) {
    console.error('Instagram feed container not found in renderInstagramPosts');
    return;
  }
  
  console.log('Rendering Instagram posts:', posts);
  
  if (!posts || posts.length === 0) {
    console.log('No posts to render, showing no posts message');
    container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">No Instagram posts available</p>';
    return;
  }
  
  const html = posts.map(post => {
    const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
    const caption = post.caption ? post.caption.substring(0, 100) + '...' : 'View on Instagram';
    const timestamp = new Date(post.timestamp).toLocaleDateString();
    
    return `
      <div class="instagram-card">
        <div class="instagram-cover" style="background-image: url('${imageUrl}')">
          <div class="instagram-date-overlay">
            <p class="instagram-date">${timestamp}</p>
          </div>
          <div class="instagram-overlay">
            <a href="${post.permalink}" target="_blank" rel="noopener" class="instagram-link">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div class="instagram-content">
            <p class="instagram-caption">${caption}</p>
        </div>
      </div>
    `;
  }).join('');
  
  console.log('Setting Instagram feed HTML:', html);
  container.innerHTML = html;
  console.log('Instagram feed HTML set successfully');
}

// Google Calendar Integration - Using static JSON file for reliable data
async function fetchGoogleCalendarEvents() {
  try {
    console.log('Fetching Google Calendar events from static file...');
    
    // Load events from static JSON file
    const response = await fetch('/calendar-events.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load calendar events: ${response.status}`);
    }
    
    const data = await response.json();
    const events = data.events || [];
    
    console.log('Successfully fetched Google Calendar events:', events.length);
    
    // Filter events to only show upcoming ones
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate >= now;
    }).slice(0, 10);
    
    console.log('Upcoming events:', upcomingEvents.length);
    
    return upcomingEvents;
    
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
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
      summary: 'JensenL - A Wee Mystical Magical Show',
      description: 'Join Jensen for an enchanting musical journey',
      start: { dateTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString() },
      location: 'Online',
      htmlLink: 'https://samudrafm.com'
    },
    {
      id: 'fallback-2',
      summary: 'Srishti - Study Vibes Session',
      description: 'Perfect music for your study sessions',
      start: { dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString() },
      location: 'Online',
      htmlLink: 'https://samudrafm.com'
    },
    {
      id: 'fallback-3',
      summary: 'Special Guest - Music Discovery',
      description: 'Discover new artists and hidden gems',
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
  console.warn('Fallback Google Calendar API is disabled for security');
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
    day: dayString
  };
}

// Helpers for placeholders ---------------------------------------------------
function withCover(url){
  return url ? `<div class="cover" style="background-image:url('${url}')" onerror="this.style.backgroundImage='url(images/SamudraFMLogo1.png)'"></div>` : `<div class="cover placeholder"></div>`;
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

// Render coming up (if element exists)
const comingGrid = document.getElementById('coming-grid');
if (comingGrid) {
  // Try to load from Google Calendar first, fallback to presenters.json, then mock data
  loadComingUpEvents();
}


async function loadComingUpEvents() {
  const comingGrid = document.getElementById('coming-grid');
  if (!comingGrid) return;
  
  // Show loading state
  comingGrid.innerHTML = '<div class="loading-state">Loading upcoming shows...</div>';
  
  try {
    // Try Google Calendar first
    const events = await fetchGoogleCalendarEvents();
    
    if (events && events.length > 0) {
      const formattedEvents = events.map(formatCalendarEvent);
      renderComingUpEvents(formattedEvents);
      return;
    }
    
    // Try to load from presenters.json
    try {
      const response = await fetch('/presenters.json');
      if (response.ok) {
        const data = await response.json();
        renderComingUpEvents(data.presenters);
        return;
      }
    } catch (jsonError) {
      // Silent fallback
    }
    
    // Fallback to mock data
    renderComingUpEvents(MOCK_COMING);
    
  } catch (error) {
    console.error('Error loading coming up events:', error);
    // Fallback to mock data on error
    renderComingUpEvents(MOCK_COMING);
  }
}

function renderComingUpEvents(events) {
  const comingGrid = document.getElementById('coming-grid');
  if (!comingGrid) return;
  
  if (!events || events.length === 0) {
    comingGrid.innerHTML = '<div class="no-events">No upcoming shows scheduled</div>';
    return;
  }
  
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
      </div>
        ${item.date && item.day ? `
          <div class="coming-up-time">
            <div class="coming-up-date">${item.date}</div>
            <div class="coming-up-day">${item.day}</div>
          </div>
        ` : ''}
    </article>
    `;
  }).join('');
  
  comingGrid.innerHTML = html;
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
    const url = nextUrl || `https://api.mixcloud.com/${encodeURIComponent(username)}/cloudcasts/?limit=12`;
    const res = await fetch(url, {
      cache: 'no-cache'
    });
    if (!res.ok) throw new Error(`Failed to fetch Mixcloud: ${res.status} ${res.statusText}`);
    const data = await res.json();
    
    const items = (data.data || []).map(item => ({
      url: item.url,
      name: item.name,
      created: item.created_time ? new Date(item.created_time) : null,
      picture: item.pictures ? (item.pictures.extra_large || item.pictures.large || item.pictures.medium) : ''
    }));
    
    mixcloudNextUrl = data.paging && data.paging.next ? data.paging.next : null;
    if (!items.length) {
      // Use fallback episodes
      episodes = getFallbackEpisodes();
      initEpisodesSlider();
      renderEpisodesSlider();
      attachEpisodeClickHandlers();
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
    
    
    // Use fallback episodes instead of showing error
    episodes = getFallbackEpisodes();
    initEpisodesSlider();
    renderEpisodesSlider();
    attachEpisodeClickHandlers();
  }
  
  // After episodes are loaded, ensure play button is ready
  setTimeout(() => {
    ensurePlayButtonReady();
  }, 100);
}

function getFallbackEpisodes() {
  return [
    {
      url: 'https://www.mixcloud.com/samudrafm/tasty-tuesday-show-27-june-2023/',
      name: 'Tasty Tuesday Show (27 June 2023)',
      created: new Date('2023-06-27T10:00:00Z'),
      picture: 'https://via.placeholder.com/400x300/f61b58/ffffff?text=Tasty+Tuesday'
    },
    {
      url: 'https://www.mixcloud.com/samudrafm/friday-frequency-frenzy-23-june-2023/',
      name: 'Friday Frequency Frenzy (23 June 2023)',
      created: new Date('2023-06-23T15:30:00Z'),
      picture: 'https://via.placeholder.com/400x300/8b4c93/ffffff?text=Friday+Frenzy'
    },
    {
      url: 'https://www.mixcloud.com/samudrafm/feel-good-friday-9-june-2023/',
      name: 'Feel Good Friday (9 June 2023)',
      created: new Date('2023-06-09T18:00:00Z'),
      picture: 'https://via.placeholder.com/400x300/4a2c8a/ffffff?text=Feel+Good'
    },
    {
      url: 'https://www.mixcloud.com/samudrafm/the-tasty-tuesday-show-6-june-2023/',
      name: 'The Tasty Tuesday Show (6 June 2023)',
      created: new Date('2023-06-06T14:15:00Z'),
      picture: 'https://via.placeholder.com/400x300/6b4c93/ffffff?text=Tasty+Tuesday+2'
    },
    {
      url: 'https://www.mixcloud.com/samudrafm/morning-coffee-with-us-20-june-2023/',
      name: 'Morning Coffee with Us! (20 June 2023)',
      created: new Date('2023-06-20T08:00:00Z'),
      picture: 'https://via.placeholder.com/400x300/2c5aa0/ffffff?text=Morning+Coffee'
    },
    {
      url: 'https://www.mixcloud.com/samudrafm/retro-moodboosters-16-june-2023/',
      name: 'Retro Moodboosters (16 June 2023)',
      created: new Date('2023-06-16T16:30:00Z'),
      picture: 'https://via.placeholder.com/400x300/8b4c93/ffffff?text=Retro+Mood'
    },
    {
      url: 'https://www.mixcloud.com/samudrafm/sahabat-kirib-15-jun-2023/',
      name: 'Sahabat Kirib (15 Jun 2023)',
      created: new Date('2023-06-15T12:00:00Z'),
      picture: 'https://via.placeholder.com/400x300/4a2c8a/ffffff?text=Sahabat+Kirib'
    },
    {
      url: 'https://www.mixcloud.com/samudrafm/weekend-vibes-10-june-2023/',
      name: 'Weekend Vibes (10 June 2023)',
      created: new Date('2023-06-10T20:00:00Z'),
      picture: 'https://via.placeholder.com/400x300/f61b58/ffffff?text=Weekend+Vibes'
    }
  ];
}

function initEpisodesSlider() {
  totalSlides = Math.ceil(episodes.length / episodesPerSlide);
  createSliderDots();
  updateSliderControls();
}

function renderEpisodesSlider() {
  const slider = document.getElementById('episodes-slider');
  if (!slider) {
    
    return;
  }


  const html = episodes.map((ep, i) => `
    <article class="card episodes-card clickable-card" data-ep-index="${i}">
      <div class="cover ${ep.picture ? '' : 'placeholder'}" ${ep.picture ? `style="background-image:url('${ep.picture}')"` : ''}></div>
      <div class="content">
        <p class="title">${ep.name}</p>
        <p class="meta">${ep.created ? ep.created.toLocaleDateString() : ''}</p>
        <span class="play-link">Click to play now ▶</span>
      </div>
    </article>
  `).join('');
  
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

// Load episodes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadMixcloudEpisodes(MIXCLOUD_USERNAME);
  
  // Fallback: if no episodes load after 3 seconds, use fallback
  setTimeout(() => {
    const slider = document.getElementById('episodes-slider');
    if (slider && !slider.dataset.loaded) {
      episodes = getFallbackEpisodes();
      initEpisodesSlider();
      renderEpisodesSlider();
      attachEpisodeClickHandlers();
    }
  }, 3000);
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
    
    // Construct the API URL
    const apiUrl = `https://api.mixcloud.com/${username}/${showSlug}/`;
    // API URL constructed
    
    // Fetch from Mixcloud API
    const response = await fetch(apiUrl, {
      cache: 'no-cache'
    });
    
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

function playEpisode(episode) {
  
  // If already playing the same episode, don't restart
  if (isCurrentlyPlaying && currentEpisode && currentEpisode.url === episode.url) {
    return;
  }
  
  // Stop any existing player first
  stopCurrentPlayer();
  
  currentEpisode = episode;
  isCurrentlyPlaying = true;
  
  // Update the hero player title and info
  const titleEl = document.getElementById('hero-ep-title');
  const openEl = document.getElementById('hero-open');
  if (titleEl) {
    titleEl.textContent = episode.name;
  }
  if (openEl) {
    openEl.href = 'request.html';
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
  // Loading Mixcloud player
  
  // Stop any existing player first
  if (currentWidget) {
    try {
      if (typeof currentWidget.pause === 'function') {
        currentWidget.pause();
      }
    } catch (error) {
      // Error stopping previous widget
    }
    currentWidget = null;
  }
  
  // Use Mixcloud's official embed URL that allows iframe embedding
  const playerContainer = document.getElementById('mixcloud-player');
  if (!playerContainer) {
    // Mixcloud player container not found
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
  
  // Add event listeners to debug iframe loading
  iframe.onload = () => {
    
    
    // Try to set up widget controls after iframe loads
    setTimeout(() => {
      // Setting up widget controls
      if (window.Mixcloud) {
        try {
          currentWidget = window.Mixcloud.PlayerWidget(iframe);
          // Mixcloud widget initialized for controls
          
          // Set up event listeners for sync
          if (currentWidget && currentWidget.events) {
            // Setting up sync event listeners
            
          // Listen for widget events to sync with custom UI
          if (currentWidget.events.play) {
            currentWidget.events.play.on(() => {
              
              updatePlayState(true);
              isCurrentlyPlaying = true;
              // Start progress tracking when playing
              
              startSimpleProgressTracking();
            });
          }
          
          if (currentWidget.events.pause) {
            currentWidget.events.pause.on(() => {
              
              updatePlayState(false);
              isCurrentlyPlaying = false;
              // Stop progress tracking when paused
              if (window.currentProgressInterval) {
                clearInterval(window.currentProgressInterval);
                window.currentProgressInterval = null;
              }
            });
          }
          
          // Add a fallback sync mechanism - check widget state periodically
          const syncInterval = setInterval(() => {
            if (currentWidget && typeof currentWidget.isPaused === 'function') {
              try {
                const isPaused = currentWidget.isPaused();
                if (isPaused !== !isCurrentlyPlaying) {
                  
                  updatePlayState(!isPaused);
                  isCurrentlyPlaying = !isPaused;
                  
                  if (isPaused) {
                    // Stop progress tracking when paused
                    if (window.currentProgressInterval) {
                      clearInterval(window.currentProgressInterval);
                      window.currentProgressInterval = null;
                    }
                  } else {
                    // Start progress tracking when playing
                    
                    startSimpleProgressTracking();
                  }
                }
              } catch (error) {
                
              }
            }
          }, 500); // Check every 500ms for faster sync
          
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
              if (window.currentProgressInterval) {
                clearInterval(window.currentProgressInterval);
                window.currentProgressInterval = null;
              }
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
    }, 2000);
  };
  
  iframe.onerror = (error) => {
    
  };
  
  playerContainer.appendChild(iframe);
  
  // Show the player container (slide up from bottom)
  const container = document.getElementById('mixcloud-player-container');
  if (container) {
    container.style.bottom = '0px';
    
  }
  
  // Update UI to show playing state
  updatePlayState(true);
  isCurrentlyPlaying = true;
  
  // Start progress tracking
  startSimpleProgressTracking();
  
  
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
  // Update mobile progress bar
  const progressFill = document.getElementById('hero-progress');
  const progressHandle = document.getElementById('progress-handle');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  
  // Update desktop progress bar
  const progressFillDesktop = document.getElementById('hero-progress-desktop');
  const progressHandleDesktop = document.getElementById('progress-handle-desktop');
  const currentTimeElDesktop = document.getElementById('current-time-desktop');
  const totalTimeElDesktop = document.getElementById('total-time-desktop');
  
  // Update mobile elements
  if (progressFill) {
    progressFill.style.width = percentage + '%';
  }
  if (progressHandle) {
    progressHandle.style.left = percentage + '%';
  }
  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(Math.floor(currentSeconds));
  }
  if (totalTimeEl) {
    totalTimeEl.textContent = '-' + formatTime(Math.floor(totalSeconds - currentSeconds));
  }
  
  // Update desktop elements
  if (progressFillDesktop) {
    progressFillDesktop.style.width = percentage + '%';
  }
  if (progressHandleDesktop) {
    progressHandleDesktop.style.left = percentage + '%';
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
  
  // Stop progress tracking
  if (window.currentProgressInterval) {
    clearInterval(window.currentProgressInterval);
    window.currentProgressInterval = null;
  }
  
  updatePlayState(false);
}

function startSimpleProgressTracking() {
  // Stop any existing progress tracking
  if (window.currentProgressInterval) {
    clearInterval(window.currentProgressInterval);
    window.currentProgressInterval = null;
  }
  
  // Only start tracking if we're actually playing
  if (!isCurrentlyPlaying) {
    
    return;
  }
  
  
  
  // Try to get progress from Mixcloud widget
  if (currentWidget && typeof currentWidget.getPosition === 'function' && typeof currentWidget.getDuration === 'function') {
    
    
    window.currentProgressInterval = setInterval(async () => {
      if (isCurrentlyPlaying && currentWidget) {
        try {
          // Handle async position and duration
          const position = await currentWidget.getPosition();
          const duration = await currentWidget.getDuration();
          
          if (position !== null && duration !== null && duration > 0) {
            const percentage = (position / duration) * 100;
            updateProgressBar(percentage, position, duration);
          } else {
            
            // Try fallback if we can't get valid data
            startFallbackProgressTracking();
          }
        } catch (error) {
          
          // Fallback to simple tracking
          startFallbackProgressTracking();
        }
      } else {
        
        if (window.currentProgressInterval) {
          clearInterval(window.currentProgressInterval);
          window.currentProgressInterval = null;
        }
      }
    }, 1000);
  } else {
    
    startFallbackProgressTracking();
  }
}

function startFallbackProgressTracking() {
  // Fallback progress tracking - simple timer
  let totalDuration = window.currentEpisodeDuration || 1200; // Use API duration if available, otherwise 20 minutes
  
  // Try to get the actual duration from Mixcloud widget first
  if (currentWidget && typeof currentWidget.getDuration === 'function') {
    currentWidget.getDuration()
      .then(duration => {
        if (duration && duration > 0) {
          totalDuration = duration;
          
          // Update the progress bar with correct duration
          updateProgressBar(0, 0, totalDuration);
        }
      })
      .catch(error => {
        
      });
  }
  
  // Get current progress from the progress bar
  const progressFill = document.getElementById('hero-progress');
  const currentPercentage = progressFill ? parseFloat(progressFill.style.width) || 0 : 0;
  let progress = Math.floor((currentPercentage / 100) * totalDuration);
  
  // If progress is very close to 0, start from 0 (new episode)
  if (progress < 5) {
    progress = 0;
  }
  
  window.currentProgressInterval = setInterval(() => {
    if (isCurrentlyPlaying) {
      progress += 1;
      const percentage = Math.min((progress / totalDuration) * 100, 100);
      updateProgressBar(percentage, progress, totalDuration);
      
      if (progress >= totalDuration) {
        // Episode finished
        isCurrentlyPlaying = false;
        updatePlayState(false);
        clearInterval(window.currentProgressInterval);
      }
    }
  }, 1000);
}

function updatePlayState(isPlaying) {
  // Update the single play/pause button
  const playPauseBtn = document.getElementById('hero-play-pause');
  
  if (!playPauseBtn) {
    console.log('Play button not found in updatePlayState');
    return;
  }
  
  // Updating play state
  
  if (isPlaying) {
    // Show pause icon (Font Awesome)
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    console.log('Set to pause icon');
  } else {
    // Show play icon (Font Awesome)
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log('Set to play icon');
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
    console.log(`Progress bar elements not found for ${progressBarId}, skipping initialization`);
    return;
  }
  
  let isDragging = false;
  
  // Click to seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    // Stop automatic progress tracking when user seeks
    if (window.currentProgressInterval) {
      clearInterval(window.currentProgressInterval);
      window.currentProgressInterval = null;
    }
    
    seekTo(percentage);
    
    // Restart progress tracking after seeking with longer delay
    if (isCurrentlyPlaying) {
      setTimeout(() => {
        console.log('Restarting progress tracking after seek');
        startSimpleProgressTracking();
      }, 500);
    }
  });
  
  // Drag handle
  progressHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
    
    // Stop automatic progress tracking when user starts dragging
    if (window.currentProgressInterval) {
      clearInterval(window.currentProgressInterval);
      window.currentProgressInterval = null;
    }
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
      
      // Restart progress tracking after dragging with longer delay
      if (isCurrentlyPlaying) {
        setTimeout(() => {
          console.log('Restarting progress tracking after drag');
          startSimpleProgressTracking();
        }, 500);
      }
    }
  });
  
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
    console.log('Seeking to percentage:', percentage);
    
    // Prevent multiple seek operations
    if (window.isSeeking) {
      console.log('Seek already in progress, skipping');
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
            console.log('Seeking to position:', seekPosition, 'of', duration);
        currentWidget.seek(seekPosition);
        
            // Reset seeking flag after a delay
            setTimeout(() => {
              window.isSeeking = false;
            }, 1000);
          } else {
            console.log('No valid duration available for seeking');
            window.isSeeking = false;
          }
        }).catch(error => {
          console.log('Error getting duration for seek:', error);
          window.isSeeking = false;
        });
      } catch (error) {
        console.log('Error in seek function:', error);
        window.isSeeking = false;
      }
    } else {
      console.log('No current widget available for seeking');
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
    console.log('Volume control elements not found, skipping initialization');
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
        console.log('Error setting volume:', error);
      }
    } else {
      console.log('No widget available for volume control');
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
    console.log('Hero elements not found, skipping loadHeroLatest');
    return;
  }
  
  try{
    const url = `https://api.mixcloud.com/${encodeURIComponent(username)}/cloudcasts/?limit=1`;
    
    const res = await fetch(url, {
      cache: 'no-cache'
    });
    
    const data = await res.json();
    
    const ep = data.data && data.data[0];
    
    if (!ep) {
      // Fallback to radio stream info
      titleEl.textContent = 'SamudraFM Live Stream';
      openEl.href = 'request.html';
      currentEpisode = { name: 'SamudraFM Live Stream', url: '#' };
      updatePlayState(false);
      return;
    }
    
    titleEl.textContent = ep.name;
    openEl.href = 'request.html';
    
    // Set current episode for play button
    currentEpisode = ep;
    
    
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
    
    // Show simple loading state when API fails
    titleEl.textContent = 'Loading...';
    openEl.href = 'request.html';
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
}

// Initialize player controls
document.addEventListener('DOMContentLoaded', () => {
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
        window.location.href = 'request.html';
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
    console.log('Play button not found, skipping initialization');
    return;
  }
  
    // Set initial state to play
    updatePlayState(false);
    
    // Hide play button initially on mobile until widget is ready
    if (isMobileDevice()) {
      playPauseBtn.style.display = 'none';
      
    }
    
    // Ensure the button is clickable and has proper event handling
    playPauseBtn.style.pointerEvents = 'auto';
    playPauseBtn.style.cursor = 'pointer';
    playPauseBtn.setAttribute('role', 'button');
    playPauseBtn.setAttribute('tabindex', '0');
    
    console.log('Play button initialized', { 
      element: playPauseBtn, 
      hasCurrentEpisode: !!currentEpisode,
      isCurrentlyPlaying 
    });
    
    // Add touch event handling for mobile
    let touchStartTime = 0;
    let touchEndTime = 0;
    let isTouchHandled = false;
    
    // Handle touch start
    playPauseBtn.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      isTouchHandled = false;
      console.log('Touch start on play button', { 
        touchStartTime, 
        isCurrentlyPlaying, 
        hasCurrentEpisode: !!currentEpisode,
        isMobile: isMobileDevice(),
        touchCount: e.touches.length
      });
      
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
      
      console.log('Touch end on play button', { 
        touchDuration, 
        isTouchHandled, 
        isCurrentlyPlaying, 
        hasCurrentEpisode: !!currentEpisode,
        hasWidget: !!currentWidget,
        isMobile: isMobileDevice()
      });
      
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
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0);
}

// Simple debugging function that works without console
function debugAlert(message) {
  // Only show alerts on mobile devices to avoid spam on desktop
  if (isMobileDevice()) {
    
    // Uncomment the line below to show alerts (only for testing)
    // alert('DEBUG: ' + message);
  }
}


function showPlayButtonWhenReady() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (playPauseBtn && isMobileDevice()) {
    playPauseBtn.style.display = 'flex';
    
    
    // Set the play icon now that widget is ready
    updatePlayState(false);
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
  // Handle play/pause button click
  
  // Update debug panel
  
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
      // Currently playing, pause the episode
      
      if (currentWidget) {
        try {
          if (typeof currentWidget.pause === 'function') {
            currentWidget.pause();
            
            // Immediately update UI as fallback
            setTimeout(() => {
              updatePlayState(false);
              isCurrentlyPlaying = false;
              // Stop progress tracking
              if (window.currentProgressInterval) {
                clearInterval(window.currentProgressInterval);
                window.currentProgressInterval = null;
              }
            }, 100);
          } else {
            
            updatePlayState(false);
            isCurrentlyPlaying = false;
            // Stop progress tracking
            if (window.currentProgressInterval) {
              clearInterval(window.currentProgressInterval);
              window.currentProgressInterval = null;
            }
          }
        } catch (error) {
          
          updatePlayState(false);
          isCurrentlyPlaying = false;
          // Stop progress tracking
          if (window.currentProgressInterval) {
            clearInterval(window.currentProgressInterval);
            window.currentProgressInterval = null;
          }
        }
      } else {
        
        updatePlayState(false);
        isCurrentlyPlaying = false;
        // Stop progress tracking
        if (window.currentProgressInterval) {
          clearInterval(window.currentProgressInterval);
          window.currentProgressInterval = null;
        }
      }
    } else {
      // Currently paused, play the episode
      
      
      // Widget should already be pre-loaded and ready
      
      
      if (currentWidget) {
        try {
          // Show the pre-loaded player
          const container = document.getElementById('mixcloud-player-container');
          if (container) {
            container.style.bottom = '0px';
            
          }
          
          // Try to use widget controls
          if (typeof currentWidget.play === 'function') {
            currentWidget.play();
            
            // Immediately update UI as fallback
            setTimeout(() => {
              updatePlayState(true);
              isCurrentlyPlaying = true;
              // Start progress tracking
              
              startSimpleProgressTracking();
            }, 100);
          } else {
            
            playEpisode(currentEpisode);
          }
        } catch (error) {
          
          // Fallback to reloading the player
          playEpisode(currentEpisode);
        }
      } else {
        // No widget available, reload the player
        
        playEpisode(currentEpisode);
      }
    }
  } else {
    
    // Try to load the latest episode if none is available
    if (typeof loadHeroLatest === 'function') {
      loadHeroLatest(MIXCLOUD_USERNAME);
      // Wait a bit and try again
      setTimeout(() => {
        if (currentEpisode) {
          
          handlePlayPause();
        } else {
          
        }
      }, 1000);
    } else {
      
    }
  }
};

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
          
          showPlayButtonWhenReady();
        } catch (error) {
          
        }
      } else {
        
        // Retry after a delay
        setTimeout(() => {
          if (window.Mixcloud) {
            try {
              currentWidget = window.Mixcloud.PlayerWidget(iframe);
              
              showPlayButtonWhenReady();
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
    console.log('Ensuring play button is ready...', {
      hasCurrentEpisode: !!currentEpisode,
      isCurrentlyPlaying,
      buttonElement: playPauseBtn
    });
    
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
      console.error('Failed to load Instagram posts:', error);
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
        console.warn('RSS feed not accessible, status:', response.status, 'using fallback');
        this.loadFallbackPosts();
        return;
      }
    } catch (error) {
      console.error('Error loading RSS feed:', error);
      console.error('Error details:', error.message, error.stack);
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
      const response = await fetch('custom-posts.json?v=' + Date.now());
      
      if (response.ok) {
        const data = await response.json();
        this.posts = data.posts || [];
        
        this.lastUpdate = new Date();
        this.isLoading = false;
        this.initSlider();
        this.renderPosts();
        return;
      } else {
        console.warn('Custom posts file not found, using fallback. Status:', response.status);
        this.loadFallbackPosts();
        return;
      }
    } catch (error) {
      console.error('Error loading custom posts:', error);
      console.error('Error details:', error.message, error.stack);
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
        console.warn('All image URL variations failed for:', originalUrl);
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
      console.warn(`Image failed to load (attempt ${currentIndex + 1}):`, img.src);
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
    const response = await fetch('custom-posts.json?v=' + Date.now());
    const data = await response.json();
    // Test function - no console output
  } catch (error) {
    console.error('Direct fetch error:', error);
  }
};

// Initialize Instagram posts when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Load Instagram posts
  loadInstagramPosts();
});
  
// Load Instagram posts function
async function loadInstagramPosts() {
  const container = document.getElementById('instagram-feed');
  if (!container) {
    console.error('Instagram feed container not found');
    return;
  }
  
  // Show loading state
  container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">Loading Instagram posts...</p>';
  
  try {
    console.log('Fetching Instagram posts...');
    const posts = await fetchInstagramPosts();
    console.log('Instagram posts fetched:', posts);
    renderInstagramPosts(posts);
    
    // Update indicator removed - no longer showing post count
    
  } catch (error) {
    console.error('Error loading Instagram posts:', error);
    container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">Unable to load Instagram posts</p>';
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
  
  console.log('Main content grid found - ensuring visibility');
  
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
    
    // Ensure coming-grid is visible
    const comingGrid = document.getElementById('coming-grid');
    if (comingGrid) {
      comingGrid.classList.add('mobile-revealed', 'revealed');
      comingGrid.style.setProperty('opacity', '1', 'important');
      comingGrid.style.setProperty('transform', 'translateY(0)', 'important');
      comingGrid.style.setProperty('pointer-events', 'auto', 'important');
      comingGrid.style.setProperty('visibility', 'visible', 'important');
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
  
  console.log('Main content grid visibility enforced');
}

// Call the function on mobile devices
if (window.innerWidth <= 768) {
  document.addEventListener('DOMContentLoaded', ensureMainContentVisible);
  // Also call after a short delay to ensure all content is loaded
  setTimeout(ensureMainContentVisible, 1000);
}

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
});
