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
console.log("%cLike looking under the hood? We're interested in people like you! Come and join us: https://samudrafm.com/opportunities/", 'color: #4fa6d3;font:18px/80px "Inter", sans-serif;');

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
  console.log('Media Session API supported - enabling mobile lock screen controls');
  
  // Set up media session metadata
  function updateMediaSession(episode) {
    if (!episode) return;
    
    console.log('Updating media session for episode:', episode.name);
    
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
    console.log('Media session: Play requested from lock screen');
    if (window.currentWidget && window.currentWidget.play) {
      window.currentWidget.play();
    } else if (window.currentEpisode) {
      window.playEpisode(window.currentEpisode);
    }
  });

  navigator.mediaSession.setActionHandler('pause', () => {
    console.log('Media session: Pause requested from lock screen');
    if (window.currentWidget && window.currentWidget.pause) {
      window.currentWidget.pause();
    } else {
      window.pauseAudio();
    }
  });

  navigator.mediaSession.setActionHandler('stop', () => {
    console.log('Media session: Stop requested from lock screen');
    window.pauseAudio();
  });

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    console.log('Media session: Previous track requested from lock screen');
    // Could implement previous episode functionality
    console.log('Previous track not implemented yet');
  });

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    console.log('Media session: Next track requested from lock screen');
    // Could implement next episode functionality
    console.log('Next track not implemented yet');
  });

  // Update playback state
  function updatePlaybackState(playing) {
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    console.log('Media session playback state:', playing ? 'playing' : 'paused');
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
  
  console.log('Media Session API initialized successfully');
} else {
  console.log('Media Session API not supported on this device');
}

// Mock data (replace with your API later)
const MOCK_NOW = {
  host: 'Daf',
  show: 'Banishing the Thursday blues! Until 20:00',
  track: 'The Subway — Chappell Roan',
  progress: 42
};

const MOCK_RECENT = [
  { title: 'Down Under (feat. Colin Hay)', artist: 'Luude', time: '18:51', cover: null },
  { title: 'DAISIES', artist: 'Justin Bieber', time: '18:46', cover: null },
  { title: "Don't Get Me Wrong", artist: 'Lewis Capaldi', time: '18:40', cover: null },
  { title: 'As It Was', artist: 'Harry Styles', time: '18:36', cover: null }
];


const MOCK_COMING = [
  { title: 'Jensen', desc: 'A Wee Mystical Magical Show', time: '20:00 – 22:00', cover: null },
  { title: 'Good guy', desc: 'Throwbacks With Good guy', time: '22:00 – 00:00', cover: null }
];

// Mock data for reference (Live section removed)
// MOCK_NOW, MOCK_RECENT, MOCK_COMING kept for potential future use

// Helpers for placeholders ---------------------------------------------------
function withCover(url){
  return url ? `<div class="cover" style="background-image:url('${url}')"></div>` : `<div class="cover placeholder"></div>`;
}

// Render recent grid (if element exists)
const recentGrid = document.getElementById('recent-grid');
if (recentGrid) {
  recentGrid.innerHTML = MOCK_RECENT.map(item => `
    <article class="card" role="listitem">
      ${withCover(item.cover)}
      <div class="content">
        <p class="title">${item.title}</p>
        <p class="meta">${item.artist} · Played at ${item.time}</p>
      </div>
    </article>
  `).join('');
}

// Render coming up (if element exists)
const comingGrid = document.getElementById('coming-grid');
if (comingGrid) {
  comingGrid.innerHTML = MOCK_COMING.map(item => `
    <article class="card">
      ${withCover(item.cover)}
      <div class="content">
        <p class="title">${item.title}</p>
        <p class="meta">${item.desc}</p>
        <p class="meta">${item.time}</p>
      </div>
    </article>
  `).join('');
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
    console.error('Episodes slider element not found!');
    return;
  }
  
  if (!nextUrl && !slider.dataset.loaded) {
    slider.innerHTML = '<p class="muted">Loading episodes…</p>';
  }
  
  try {
    const url = nextUrl || `https://api.mixcloud.com/${encodeURIComponent(username)}/cloudcasts/?limit=12`;
    console.log('Fetching Mixcloud episodes from:', url);
    const res = await fetch(url, {
      cache: 'no-cache'
    });
    console.log('Mixcloud API response status:', res.status);
    if (!res.ok) throw new Error(`Failed to fetch Mixcloud: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log('Mixcloud API response data:', data);
    
    const items = (data.data || []).map(item => ({
      url: item.url,
      name: item.name,
      created: item.created_time ? new Date(item.created_time) : null,
      picture: item.pictures ? (item.pictures.extra_large || item.pictures.large || item.pictures.medium) : ''
    }));
    
    mixcloudNextUrl = data.paging && data.paging.next ? data.paging.next : null;
    console.log('Processed episodes:', items);
    
    if (!items.length) {
      console.log('No episodes found in API response, using fallback episodes');
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
    console.error('Mixcloud API error:', err);
    console.error('Error details:', err.message);
    // Use fallback episodes instead of showing error
    console.log('Using fallback episodes due to API error');
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
  console.log('Initializing episodes slider with', episodes.length, 'episodes');
  totalSlides = Math.ceil(episodes.length / episodesPerSlide);
  console.log('Total slides:', totalSlides, 'Episodes per slide:', episodesPerSlide);
  createSliderDots();
  updateSliderControls();
}

function renderEpisodesSlider() {
  const slider = document.getElementById('episodes-slider');
  if (!slider) {
    console.error('Episodes slider element not found in renderEpisodesSlider!');
    return;
  }

  console.log('Rendering episodes slider with', episodes.length, 'episodes');
  console.log('Episodes data:', episodes);

  const html = episodes.map((ep, i) => `
    <article class="card episodes-card clickable-card" data-ep-index="${i}">
      <div class="cover ${ep.picture ? '' : 'placeholder'}" ${ep.picture ? `style="background-image:url('${ep.picture}')"` : ''}></div>
      <div class="content">
        <p class="title">${ep.name}</p>
        <p class="meta">${ep.created ? ep.created.toLocaleDateString() : ''}</p>
        <a class="play-link" href="${ep.url}" target="_blank" rel="noopener">Open on Mixcloud ↗</a>
      </div>
    </article>
  `).join('');
  
  console.log('Generated HTML:', html);
  slider.innerHTML = html;
  slider.dataset.loaded = '1';
  updateSliderPosition();
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
      // Don't trigger if clicking on the Mixcloud link
      if (e.target.classList.contains('play-link')) {
        return;
      }
      playEpisode(episode);
    });
  });
}

// Load episodes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting to load episodes...');
  loadMixcloudEpisodes(MIXCLOUD_USERNAME);
  
  // Fallback: if no episodes load after 3 seconds, use fallback
  setTimeout(() => {
    const slider = document.getElementById('episodes-slider');
    if (slider && !slider.dataset.loaded) {
      console.log('No episodes loaded after 3 seconds, using fallback episodes');
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
  console.log('🎵 Playing:', episode.name);
  
  // If already playing the same episode, don't restart
  if (isCurrentlyPlaying && currentEpisode && currentEpisode.url === episode.url) {
    console.log('⏸️ Already playing this episode');
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
    console.log('🎵 Player loaded successfully');
    
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
              console.log('Mixcloud widget started playing - syncing UI');
              updatePlayState(true);
              isCurrentlyPlaying = true;
              // Start progress tracking when playing
              console.log('Starting progress tracking from play event...');
              startSimpleProgressTracking();
            });
          }
          
          if (currentWidget.events.pause) {
            currentWidget.events.pause.on(() => {
              console.log('Mixcloud widget paused - syncing UI');
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
                  console.log('Widget state mismatch detected, syncing...', {isPaused, isCurrentlyPlaying});
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
                    console.log('Periodic sync detected playing state, starting progress tracking...');
                    startSimpleProgressTracking();
                  }
                }
              } catch (error) {
                console.log('Error checking widget state:', error);
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
              console.log('Mixcloud widget ended - syncing UI');
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
              console.log('Mixcloud progress event:', progress);
              if (progress.position !== null && progress.duration !== null && progress.duration > 0) {
                const percentage = (progress.position / progress.duration) * 100;
                updateProgressBar(percentage, progress.position, progress.duration);
              }
            });
          }
            
            console.log('Sync event listeners set up successfully');
          
          // Set initial volume when widget is ready
          if (typeof currentWidget.setVolume === 'function') {
            try {
              currentWidget.setVolume(0.6); // 60% volume
              console.log('Initial volume set to 60%');
            } catch (error) {
              console.log('Error setting initial volume:', error);
            }
          }
          
          // Duration is now fetched from API in playEpisode(), no need to wait for audio
          } else {
            console.log('Widget events not available - using basic controls only');
          }
          
        } catch (error) {
          console.error('Error initializing Mixcloud widget controls:', error);
        }
      } else {
        console.error('Mixcloud API not available for controls');
      }
    }, 2000);
  };
  
  iframe.onerror = (error) => {
    console.error('Mixcloud iframe failed to load:', error);
  };
  
  playerContainer.appendChild(iframe);
  
  // Show the player container (slide up from bottom)
  const container = document.getElementById('mixcloud-player-container');
  if (container) {
    container.style.bottom = '0px';
    console.log('Showing Mixcloud player container');
  }
  
  // Update UI to show playing state
  updatePlayState(true);
  isCurrentlyPlaying = true;
  
  // Start progress tracking
  startSimpleProgressTracking();
  
  console.log('Using official Mixcloud embed code - should work perfectly!');
}

function initializeMixcloudPlayer() {
  // This function is now handled by playWithMixcloudWidget()
  // No need for separate initialization to avoid duplicate widgets
  console.log('Mixcloud player initialization handled by playWithMixcloudWidget()');
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
  const progressFill = document.getElementById('hero-progress');
  const progressHandle = document.getElementById('progress-handle');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  
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
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function pauseEpisode() {
  console.log('Pausing episode...');
  isCurrentlyPlaying = false;
  
  // Radio stream removed - using Mixcloud widget only
  
  // Pause the Mixcloud widget
  if (currentWidget) {
    try {
      if (typeof currentWidget.pause === 'function') {
        currentWidget.pause();
        console.log('Triggered pause on Mixcloud widget');
        // Don't update UI here - let the widget event handler do it
      } else {
        console.log('Widget pause method not available, updating UI manually');
        isCurrentlyPlaying = false;
        updatePlayState(false);
        hideMixcloudPlayer();
      }
    } catch (error) {
      console.error('Error pausing Mixcloud widget:', error);
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
    console.log('Not starting progress tracking - not currently playing');
    return;
  }
  
  console.log('Starting progress tracking...', {isCurrentlyPlaying, hasWidget: !!currentWidget});
  
  // Try to get progress from Mixcloud widget
  if (currentWidget && typeof currentWidget.getPosition === 'function' && typeof currentWidget.getDuration === 'function') {
    console.log('Using Mixcloud widget progress tracking');
    
    window.currentProgressInterval = setInterval(async () => {
      if (isCurrentlyPlaying && currentWidget) {
        try {
          // Handle async position and duration
          const position = await currentWidget.getPosition();
          const duration = await currentWidget.getDuration();
          
          if (position !== null && duration !== null && duration > 0) {
            const percentage = (position / duration) * 100;
            updateProgressBar(percentage, position, duration);
            console.log('Progress update:', {
              position: position, 
              duration: duration, 
              percentage: percentage.toFixed(2),
              timeRemaining: duration - position
            });
          } else {
            console.log('Invalid progress data:', {position, duration});
            // Try fallback if we can't get valid data
            startFallbackProgressTracking();
          }
        } catch (error) {
          console.log('Error getting widget progress:', error);
          // Fallback to simple tracking
          startFallbackProgressTracking();
        }
      } else {
        console.log('Progress tracking stopped - not playing or no widget');
        if (window.currentProgressInterval) {
          clearInterval(window.currentProgressInterval);
          window.currentProgressInterval = null;
        }
      }
    }, 1000);
  } else {
    console.log('Widget progress not available, using fallback tracking');
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
          console.log('Using actual Mixcloud duration:', totalDuration, 'seconds');
          // Update the progress bar with correct duration
          updateProgressBar(0, 0, totalDuration);
        }
      })
      .catch(error => {
        console.log('Could not get duration from Mixcloud, using default:', error);
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
  
  // Updating play state
  
  // On mobile, don't show the button until widget is ready
  if (isMobileDevice() && !currentWidget) {
    // Mobile: Not updating play state - widget not ready yet
    return;
  }
  
  if (isPlaying) {
    // Show pause icon (Font Awesome)
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    // Set pause icon
  } else {
    // Show play icon (Font Awesome)
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    // Set play icon
  }
  
  // Force a re-render
  playPauseBtn.style.display = 'none';
  playPauseBtn.offsetHeight; // Trigger reflow
  playPauseBtn.style.display = 'flex';
}

// Progress bar functionality
function initProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const progressHandle = document.getElementById('progress-handle');
  const progressFill = document.getElementById('hero-progress');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  
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
    
    // Restart progress tracking after seeking
    if (isCurrentlyPlaying) {
      setTimeout(() => {
        startSimpleProgressTracking();
      }, 100);
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
      
      // Restart progress tracking after dragging
      if (isCurrentlyPlaying) {
        setTimeout(() => {
          startSimpleProgressTracking();
        }, 100);
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
    
    // Seek the actual Mixcloud player
    // Use current widget instead of creating new one
    if (currentWidget && typeof currentWidget.seek === 'function') {
      try {
        const totalDuration = parseFloat(document.getElementById('total-time').textContent.replace('-', '').split(':').reduce((acc, time, i) => acc + time * Math.pow(60, 1-i), 0));
        const seekPosition = (percentage / 100) * totalDuration;
        currentWidget.seek(seekPosition);
        console.log('Seeking to:', seekPosition, 'seconds');
      } catch (error) {
        console.log('Error seeking:', error);
      }
    }
    
    // Update the progress bar immediately to show user's click
    updateProgress(percentage);
    
    console.log('Seek completed');
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
  
  let isDragging = false;
  
  volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    updateVolume(percentage);
  });
  
  volumeHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const rect = volumeBar.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
      updateVolume(percentage);
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  function updateVolume(percentage) {
    // Update visual slider
    volumeFill.style.width = percentage + '%';
    volumeHandle.style.left = percentage + '%';
    
    // Control Mixcloud widget volume
    if (currentWidget && typeof currentWidget.setVolume === 'function') {
      try {
        const volume = percentage / 100; // Convert percentage to 0-1 range
        currentWidget.setVolume(volume);
        console.log('Volume set to:', volume);
      } catch (error) {
        console.log('Error setting volume:', error);
      }
    } else {
      console.log('Widget volume control not available');
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
  
  try{
    const url = `https://api.mixcloud.com/${encodeURIComponent(username)}/cloudcasts/?limit=1`;
    console.log('Fetching hero episode from:', url);
    const res = await fetch(url, {
      cache: 'no-cache'
    });
    console.log('Hero API response status:', res.status);
    const data = await res.json();
    console.log('Hero API response data:', data);
    const ep = data.data && data.data[0];
    console.log('Hero episode:', ep);
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
    console.log('Current episode set in loadHeroLatest:', currentEpisode);
    
    // Update play button state
    updatePlayState(false);
    
    // Handle cover image - use the highest resolution available
    if (ep.pictures) {
      const imageUrl = ep.pictures.extra_large || ep.pictures.large || ep.pictures.medium || ep.pictures.small;
      if (imageUrl) {
        console.log('Setting cover image:', imageUrl);
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
    console.log('Mixcloud API error (likely CORS):', e);
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

loadHeroLatest(MIXCLOUD_USERNAME);

// Initialize player controls
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initVolumeControl();
  initPlayButton();
  initAudioDebugging();
  startAudioMonitoring();
  
  // Ensure play button is ready after a short delay
  setTimeout(() => {
    ensurePlayButtonReady();
  }, 500);
  
  // Pre-load Mixcloud player for mobile devices
  if (isMobileDevice()) {
    console.log('Mobile device detected - pre-loading Mixcloud player...');
    preloadMixcloudPlayer();
  }
  
  // Force update play button after Font Awesome loads
  setTimeout(() => {
    console.log('Font Awesome loaded:', typeof window.FontAwesome !== 'undefined');
    
    // Check if Font Awesome CSS is loaded
    const testIcon = document.createElement('i');
    testIcon.className = 'fa-solid fa-play';
    testIcon.style.position = 'absolute';
    testIcon.style.left = '-9999px';
    document.body.appendChild(testIcon);
    
    const computedStyle = window.getComputedStyle(testIcon, '::before');
    const fontFamily = computedStyle.getPropertyValue('font-family');
    console.log('Font Awesome font family:', fontFamily);
    console.log('Font Awesome CSS loaded:', fontFamily.includes('Font Awesome'));
    
    document.body.removeChild(testIcon);
    
    forceUpdatePlayButton();
  }, 1000);
});

function initAudioDebugging() {
  console.log('=== AUDIO TROUBLESHOOTING SYSTEM ===');
  
  // Check for any audio elements on the page
  const audioElements = document.querySelectorAll('audio');
  console.log('Audio elements found:', audioElements.length);
  audioElements.forEach((audio, index) => {
    console.log(`Audio ${index + 1}:`, {
      id: audio.id,
      src: audio.src || 'No src',
      currentSrc: audio.currentSrc || 'No currentSrc',
      paused: audio.paused,
      ended: audio.ended,
      readyState: audio.readyState,
      duration: audio.duration,
      currentTime: audio.currentTime,
      volume: audio.volume,
      muted: audio.muted
    });
  });
  
  // Check for video elements (they can also play audio)
  const videoElements = document.querySelectorAll('video');
  console.log('Video elements found:', videoElements.length);
  videoElements.forEach((video, index) => {
    console.log(`Video ${index + 1}:`, {
      id: video.id,
      src: video.src || 'No src',
      paused: video.paused,
      muted: video.muted,
      volume: video.volume
    });
  });
  
  // Check for iframes that might contain audio players
  const iframes = document.querySelectorAll('iframe');
  console.log('Iframes found:', iframes.length);
  iframes.forEach((iframe, index) => {
    console.log(`Iframe ${index + 1}:`, {
      id: iframe.id,
      src: iframe.src,
      allow: iframe.allow
    });
  });
  
  // Check Mixcloud widget status
  if (currentWidget) {
    console.log('Mixcloud widget status:', {
      widget: currentWidget,
      isReady: currentWidget.ready ? 'Yes' : 'No',
      isPlaying: isCurrentlyPlaying
    });
  } else {
    console.log('Mixcloud widget: Not initialized');
  }
  
  // Check current episode
  console.log('Current episode:', currentEpisode);
  
  // Check for any media session API usage
  if ('mediaSession' in navigator) {
    console.log('Media Session API available:', {
      playbackState: navigator.mediaSession.playbackState,
      metadata: navigator.mediaSession.metadata
    });
  }
  
  // Check for any Web Audio API usage
  if (window.AudioContext || window.webkitAudioContext) {
    console.log('Web Audio API available');
  }
  
  // Monitor for any audio-related events
  document.addEventListener('play', (e) => {
    console.log('🎵 PLAY event detected:', e.target);
  });
  
  document.addEventListener('pause', (e) => {
    console.log('⏸️ PAUSE event detected:', e.target);
  });
  
  document.addEventListener('ended', (e) => {
    console.log('⏹️ ENDED event detected:', e.target);
  });
  
  // Check browser audio capabilities
  console.log('Browser audio capabilities:', {
    canPlayMP3: document.createElement('audio').canPlayType('audio/mpeg'),
    canPlayOGG: document.createElement('audio').canPlayType('audio/ogg'),
    canPlayWAV: document.createElement('audio').canPlayType('audio/wav'),
    canPlayM4A: document.createElement('audio').canPlayType('audio/mp4')
  });
  
  console.log('=== END AUDIO TROUBLESHOOTING ===');
}

// Additional troubleshooting function for real-time monitoring
function startAudioMonitoring() {
  console.log('🔍 Starting real-time audio monitoring...');
  
  setInterval(() => {
    const playingElements = [];
    
    // Check all audio elements
    document.querySelectorAll('audio').forEach((audio, index) => {
      if (!audio.paused && !audio.ended && audio.currentTime > 0) {
        playingElements.push(`Audio ${index + 1} (${audio.id || 'no-id'})`);
      }
    });
    
    // Check all video elements
    document.querySelectorAll('video').forEach((video, index) => {
      if (!video.paused && !video.ended && video.currentTime > 0) {
        playingElements.push(`Video ${index + 1} (${video.id || 'no-id'})`);
      }
    });
    
    // Check iframe audio (limited detection)
    document.querySelectorAll('iframe').forEach((iframe, index) => {
      try {
        // This is limited due to cross-origin restrictions
        if (iframe.contentDocument) {
          const iframeAudio = iframe.contentDocument.querySelectorAll('audio, video');
          iframeAudio.forEach((media, mediaIndex) => {
            if (!media.paused && !media.ended && media.currentTime > 0) {
              playingElements.push(`Iframe ${index + 1} Media ${mediaIndex + 1}`);
            }
          });
        }
      } catch (e) {
        // Cross-origin iframe, can't access
      }
    });
    
    if (playingElements.length > 0) {
      console.log('🎵 Currently playing:', playingElements.join(', '));
    }
    
    // Check Mixcloud widget state
    if (currentWidget) {
      try {
        currentWidget.getPosition().then(position => {
          if (position > 0) {
            console.log('🎵 Mixcloud widget playing at position:', position);
          }
        });
      } catch (e) {
        // Widget might not be ready
      }
    }
    
  }, 5000); // Check every 5 seconds
}

// Global troubleshooting function - call from browser console
window.debugAudio = function() {
  console.log('🔧 MANUAL AUDIO TROUBLESHOOTING');
  console.log('================================');
  
  // Check current state
  console.log('Current State:', {
    isCurrentlyPlaying: isCurrentlyPlaying,
    currentEpisode: currentEpisode,
    currentWidget: currentWidget ? 'Initialized' : 'Not initialized'
  });
  
  // Check all media elements
  const allMedia = [...document.querySelectorAll('audio'), ...document.querySelectorAll('video')];
  console.log('All Media Elements:', allMedia.length);
  
  allMedia.forEach((media, index) => {
    const isPlaying = !media.paused && !media.ended && media.currentTime > 0;
    console.log(`Media ${index + 1}:`, {
      tag: media.tagName,
      id: media.id,
      src: media.src,
      isPlaying: isPlaying,
      paused: media.paused,
      ended: media.ended,
      currentTime: media.currentTime,
      duration: media.duration,
      volume: media.volume,
      muted: media.muted
    });
  });
  
  // Check iframes
  const iframes = document.querySelectorAll('iframe');
  console.log('Iframes:', iframes.length);
  iframes.forEach((iframe, index) => {
    console.log(`Iframe ${index + 1}:`, {
      id: iframe.id,
      src: iframe.src,
      visible: iframe.offsetWidth > 0 && iframe.offsetHeight > 0
    });
  });
  
  // Check Mixcloud widget specifically
  const mixcloudIframe = document.getElementById('mixcloud-iframe');
  if (mixcloudIframe) {
    console.log('Mixcloud Iframe:', {
      src: mixcloudIframe.src,
      visible: mixcloudIframe.offsetWidth > 0 && mixcloudIframe.offsetHeight > 0,
      parentVisible: mixcloudIframe.parentElement.style.opacity !== '0'
    });
  }
  
  // Check for any playing audio
  const playingAudio = allMedia.filter(media => !media.paused && !media.ended && media.currentTime > 0);
  if (playingAudio.length > 0) {
    console.log('🎵 AUDIO IS PLAYING:', playingAudio.map(media => `${media.tagName}#${media.id || 'no-id'}`));
  } else {
    console.log('🔇 NO AUDIO IS PLAYING');
  }
  
  // Test Mixcloud widget if available
  if (currentWidget) {
    console.log('Testing Mixcloud widget...');
    try {
      currentWidget.getPosition().then(position => {
        console.log('Mixcloud position:', position);
      });
      currentWidget.getDuration().then(duration => {
        console.log('Mixcloud duration:', duration);
      });
    } catch (error) {
      console.log('Mixcloud widget error:', error);
    }
  }
  
  console.log('================================');
  console.log('Troubleshooting complete!');
};

// Make it available globally
window.troubleshootAudio = window.debugAudio;

// Function to manually get and display the correct duration
window.getCorrectDuration = function() {
  if (currentWidget && typeof currentWidget.getDuration === 'function') {
    currentWidget.getDuration()
      .then(duration => {
        console.log('Current duration from Mixcloud:', duration, 'seconds');
        if (duration && duration > 0) {
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          console.log('Duration in MM:SS format:', `${minutes}:${seconds.toString().padStart(2, '0')}`);
          
          // Update the progress bar with correct duration
          updateProgressBar(0, 0, duration);
          
          // Also update the time display
          const totalTimeEl = document.getElementById('total-time');
          if (totalTimeEl) {
            totalTimeEl.textContent = '-' + formatTime(Math.floor(duration));
          }
        }
      })
      .catch(error => {
        console.log('Error getting duration:', error);
      });
  } else {
    console.log('No Mixcloud widget available or getDuration not supported');
  }
};

// Function to force set the correct duration (17:41 = 1061 seconds)
window.setCorrectDuration = function() {
  const correctDuration = 1061; // 17 minutes 41 seconds
  console.log('Setting correct duration to 17:41 (1061 seconds)');
  updateProgressBar(0, 0, correctDuration);
  
  const totalTimeEl = document.getElementById('total-time');
  if (totalTimeEl) {
    totalTimeEl.textContent = '-' + formatTime(correctDuration);
  }
};

// Function to debug and force get duration
window.debugDuration = function() {
  console.log('=== DEBUGGING DURATION ===');
  console.log('Current widget:', currentWidget);
  console.log('Widget type:', typeof currentWidget);
  console.log('Has getDuration:', currentWidget && typeof currentWidget.getDuration === 'function');
  
  if (currentWidget && typeof currentWidget.getDuration === 'function') {
    console.log('Calling getDuration...');
    currentWidget.getDuration()
      .then(duration => {
        console.log('Duration result:', duration, 'type:', typeof duration);
        if (duration && duration > 0) {
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          console.log('Formatted duration:', `${minutes}:${seconds.toString().padStart(2, '0')}`);
          
          // Force update the display
          updateProgressBar(0, 0, duration);
          const totalTimeEl = document.getElementById('total-time');
          if (totalTimeEl) {
            totalTimeEl.textContent = '-' + formatTime(Math.floor(duration));
          }
        } else {
          console.log('Duration is invalid:', duration);
        }
      })
      .catch(error => {
        console.log('Error getting duration:', error);
      });
  } else {
    console.log('Cannot get duration - widget or method not available');
  }
};

// Function to test API duration fetching
window.testAPIDuration = function() {
  if (currentEpisode && currentEpisode.url) {
    console.log('🧪 Testing API duration fetch for:', currentEpisode.url);
    fetchDurationFromAPI(currentEpisode.url);
  } else {
    console.log('❌ No current episode to test with');
  }
};

// Test function to manually trigger player
window.testPlayer = function() {
  console.log('Testing player...');
  
  // Check if we have episodes loaded
  const episodesGrid = document.getElementById('episodes-grid');
  const episodeCards = episodesGrid.querySelectorAll('.episodes-card');
  console.log('Found episode cards:', episodeCards.length);
  
  if (episodeCards.length > 0) {
    // Get the first episode
    const firstCard = episodeCards[0];
    const episode = {
      name: firstCard.querySelector('.title')?.textContent || 'Test Episode',
      url: firstCard.querySelector('.play-link')?.href || 'https://www.mixcloud.com/samudrafm/'
    };
    console.log('Testing with episode:', episode);
    playEpisode(episode);
  } else {
    console.log('No episodes found, creating test episode');
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
    console.log('Forcing play button update');
    
    // Clear any existing content and set Font Awesome play icon
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    
    console.log('Button content after update:', playPauseBtn.innerHTML);
  }
}

function initPlayButton() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (playPauseBtn) {
    // Set initial state to play
    updatePlayState(false);
    
    // Hide play button initially on mobile until widget is ready
    if (isMobileDevice()) {
      playPauseBtn.style.display = 'none';
      console.log('Play button hidden on mobile until widget is ready');
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
        console.log('Touch end on play button - handling as click, preventing click event');
        
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
        console.log('Touch end ignored - duration:', touchDuration, 'handled:', isTouchHandled);
        
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
        console.log('Click event prevented - already handled by touch');
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // On mobile devices, add extra delay to prevent double handling
      if (isMobileDevice()) {
        console.log('Mobile click detected - adding delay to prevent double handling');
        setTimeout(() => {
          isTouchHandled = false; // Reset for next interaction
        }, 300);
      }
      
      e.preventDefault();
      e.stopPropagation();
      console.log('Play button clicked!', { isMobile: isMobileDevice() }); // Debug log
      window.handlePlayPause();
    });
    
    // Handle keyboard events for accessibility
    playPauseBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        console.log('Play button keyboard activated!');
        window.handlePlayPause();
      }
    });
    
  }
  
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
    console.log('DEBUG:', message);
    // Uncomment the line below to show alerts (only for testing)
    // alert('DEBUG: ' + message);
  }
}


function showPlayButtonWhenReady() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (playPauseBtn && isMobileDevice()) {
    playPauseBtn.style.display = 'flex';
    console.log('Play button now visible - widget is ready!');
    
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
          console.log('🎵 Playing:', currentEpisode.name);
          playEpisode(currentEpisode);
          return;
        } catch (error) {
          console.log('Error parsing episode data');
        }
      }
    }
    console.log('No episode available to play');
    return;
  }
  
  // If already playing, don't do anything
  if (isCurrentlyPlaying) {
    console.log('⏸️ Already playing - Listen now button does nothing');
    return;
  }
  
  // Play the current episode
  console.log('🎵 Playing:', currentEpisode.name);
  playEpisode(currentEpisode);
};

// Make handlePlayPause globally accessible
window.handlePlayPause = function() {
  // Handle play/pause button click
  
  // Update debug panel
  
  // If no current episode, try to get the latest episode from the episodes grid
  if (!currentEpisode) {
    console.log('No current episode, trying to get from episodes grid...');
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
          console.log('Set current episode from episodes grid:', currentEpisode);
        }
      }
    }
  }
  
  if (currentEpisode) {
    if (isCurrentlyPlaying) {
      // Currently playing, pause the episode
      console.log('⏸️ Pausing episode');
      if (currentWidget) {
        try {
          if (typeof currentWidget.pause === 'function') {
            currentWidget.pause();
            console.log('Triggered pause on Mixcloud widget');
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
            console.log('Widget pause method not available, updating UI only');
            updatePlayState(false);
            isCurrentlyPlaying = false;
            // Stop progress tracking
            if (window.currentProgressInterval) {
              clearInterval(window.currentProgressInterval);
              window.currentProgressInterval = null;
            }
          }
        } catch (error) {
          console.error('Error pausing with widget:', error);
          updatePlayState(false);
          isCurrentlyPlaying = false;
          // Stop progress tracking
          if (window.currentProgressInterval) {
            clearInterval(window.currentProgressInterval);
            window.currentProgressInterval = null;
          }
        }
      } else {
        console.log('No widget available, updating UI only');
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
      console.log('▶️ Playing episode');
      
      // Widget should already be pre-loaded and ready
      console.log('Current widget status:', currentWidget ? 'Ready' : 'Not ready');
      
      if (currentWidget) {
        try {
          // Show the pre-loaded player
          const container = document.getElementById('mixcloud-player-container');
          if (container) {
            container.style.bottom = '0px';
            console.log('Showing pre-loaded Mixcloud player');
          }
          
          // Try to use widget controls
          if (typeof currentWidget.play === 'function') {
            currentWidget.play();
            console.log('Triggered play on pre-loaded Mixcloud widget');
            // Immediately update UI as fallback
            setTimeout(() => {
              updatePlayState(true);
              isCurrentlyPlaying = true;
              // Start progress tracking
              console.log('Starting progress tracking from manual play...');
              startSimpleProgressTracking();
            }, 100);
          } else {
            console.log('Widget play method not available, reloading player');
            playEpisode(currentEpisode);
          }
        } catch (error) {
          console.error('Error playing with widget:', error);
          // Fallback to reloading the player
          playEpisode(currentEpisode);
        }
      } else {
        // No widget available, reload the player
        console.log('No widget available, reloading player...');
        playEpisode(currentEpisode);
      }
    }
  } else {
    console.log('No current episode - trying to load latest episode...');
    // Try to load the latest episode if none is available
    if (typeof loadHeroLatest === 'function') {
      loadHeroLatest(MIXCLOUD_USERNAME);
      // Wait a bit and try again
      setTimeout(() => {
        if (currentEpisode) {
          console.log('Retrying play after loading episode...');
          handlePlayPause();
        } else {
          console.log('Still no episode available after loading attempt');
        }
      }, 1000);
    } else {
      console.log('loadHeroLatest function not available');
    }
  }
};

// Function to pre-load Mixcloud player for mobile devices
function preloadMixcloudPlayer() {
  console.log('Pre-loading Mixcloud player for mobile...');
  
  // Wait for episodes to be loaded first
  const checkForEpisodes = () => {
    const episodesGrid = document.getElementById('episodes-grid');
    if (episodesGrid && episodesGrid.querySelector('.episodes-card')) {
      console.log('Episodes loaded, creating pre-loaded player...');
      
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
        
        console.log('Pre-loaded episode set:', currentEpisode);
        
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
  console.log('Creating pre-loaded Mixcloud player for:', episodeUrl);
  
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
    console.log('🎵 Pre-loaded Mixcloud iframe ready');
    
    // Create widget immediately for instant play
    setTimeout(() => {
      if (window.Mixcloud) {
        try {
          currentWidget = window.Mixcloud.PlayerWidget(iframe);
          console.log('✅ Pre-loaded Mixcloud widget ready:', currentWidget);
          showPlayButtonWhenReady();
        } catch (error) {
          console.error('Error creating pre-loaded widget:', error);
        }
      } else {
        console.log('Mixcloud API not available for pre-loaded widget');
        // Retry after a delay
        setTimeout(() => {
          if (window.Mixcloud) {
            try {
              currentWidget = window.Mixcloud.PlayerWidget(iframe);
              console.log('✅ Pre-loaded Mixcloud widget ready (delayed):', currentWidget);
              showPlayButtonWhenReady();
            } catch (error) {
              console.error('Error creating pre-loaded widget (delayed):', error);
            }
          }
        }, 2000);
      }
    }, 1000);
  };
  
  iframe.onerror = (error) => {
    console.error('Pre-loaded Mixcloud iframe failed:', error);
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
            console.log('Set current episode from episodes grid in ensurePlayButtonReady:', currentEpisode);
          } else {
            console.log('Could not extract episode info from grid');
          }
        } else {
          console.log('No episode cards found in grid');
        }
      } else {
        console.log('Episodes grid not found');
      }
    } else {
      console.log('Current episode already set:', currentEpisode);
    }
  }
}

// Instagram Embeds - Auto-updating Instagram content
// No JavaScript needed - Instagram embeds handle everything automatically

/*
// Instagram Posts - Card-based layout similar to episodes
class InstagramPosts {
  constructor() {
    this.posts = [];
    this.isLoading = false;
  }

  // Initialize Instagram posts
  async init() {
    try {
      console.log('Instagram Posts: Initializing with mock data');
      await this.loadMockPosts();
    } catch (error) {
      console.error('Instagram Posts: Failed to initialize', error);
      this.loadFallbackPosts();
    }
  }

  // Load mock Instagram posts
  async loadMockPosts() {
    this.isLoading = true;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Real Instagram posts data from @samudrafm
    this.posts = [
      {
        id: '1',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/f61b58/ffffff?text=Latest+Post',
        permalink: 'https://www.instagram.com/p/DO0d4jRktgm/',
        caption: 'Latest Instagram Post',
        timestamp: new Date('2025-01-27T12:00:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '2',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/8b4c93/ffffff?text=Recent+Post',
        permalink: 'https://www.instagram.com/p/DO0d28EkkZy/',
        caption: 'Recent Instagram Post',
        timestamp: new Date('2025-01-26T15:30:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '3',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/ed1d59/ffffff?text=Instagram+Update',
        permalink: 'https://www.instagram.com/p/DO0dtQeknJA/',
        caption: 'Instagram Update',
        timestamp: new Date('2025-01-25T10:15:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '4',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=SamudraFM+Post',
        permalink: 'https://www.instagram.com/p/DO0b3e9kn0s/',
        caption: 'SamudraFM Post',
        timestamp: new Date('2025-01-24T00:30:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '5',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/333333/ffffff?text=Radio+Content',
        permalink: 'https://www.instagram.com/p/DO0bpnEEtV0/',
        caption: 'Radio Content',
        timestamp: new Date('2025-01-23T14:45:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '6',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/f61b58/ffffff?text=Behind+Scenes',
        permalink: 'https://www.instagram.com/p/DO0bcWgEnUn/',
        caption: 'Behind the Scenes',
        timestamp: new Date('2025-01-22T12:00:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '7',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/8b4c93/ffffff?text=Studio+Life',
        permalink: 'https://www.instagram.com/p/DO0aYX5kh9p/',
        caption: 'Studio Life',
        timestamp: new Date('2025-01-21T15:30:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '8',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/ed1d59/ffffff?text=Music+Show',
        permalink: 'https://www.instagram.com/p/DO0aMQlEkU9/',
        caption: 'Music Show',
        timestamp: new Date('2025-01-20T10:15:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '9',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Live+Session',
        permalink: 'https://www.instagram.com/p/DO0Z3RXkr6X/',
        caption: 'Live Session',
        timestamp: new Date('2025-01-19T00:30:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '10',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/333333/ffffff?text=Radio+Update',
        permalink: 'https://www.instagram.com/p/DO0ZXF_ki2Z/',
        caption: 'Radio Update',
        timestamp: new Date('2025-01-18T14:45:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '11',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/f61b58/ffffff?text=SamudraFM+Content',
        permalink: 'https://www.instagram.com/p/DO0Y_OIkrMM/',
        caption: 'SamudraFM Content',
        timestamp: new Date('2025-01-17T12:00:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '12',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/8b4c93/ffffff?text=Latest+Update',
        permalink: 'https://www.instagram.com/p/DO0Yw6-EnD4/',
        caption: 'Latest Update',
        timestamp: new Date('2025-01-16T15:30:00Z').toISOString(),
        username: 'samudrafm'
      },
      {
        id: '13',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x300/ed1d59/ffffff?text=Special+Post',
        permalink: 'https://www.instagram.com/p/DLpMmlBTRKf/?img_index=1',
        caption: 'Special Post',
        timestamp: new Date('2025-01-15T10:15:00Z').toISOString(),
        username: 'samudrafm'
      }
    ];
    
    this.isLoading = false;
    this.renderPosts();
  }

  // Fallback posts if API fails
  loadFallbackPosts() {
    this.posts = [
      {
        id: 'fallback1',
        media_type: 'IMAGE',
        media_url: '',
        permalink: 'https://www.instagram.com/samudrafm/',
        caption: 'Follow us on Instagram for the latest updates!',
        timestamp: new Date().toISOString(),
        username: 'samudrafm'
      }
    ];
    this.renderPosts();
  }

  // Render Instagram posts to the UI
  renderPosts() {
    const postsContainer = document.getElementById('instagram-grid');
    if (!postsContainer) {
      console.error('Instagram posts container not found!');
      return;
    }

    console.log('Rendering Instagram posts:', this.posts.length, 'posts');
    
    // Clear existing posts
    postsContainer.innerHTML = '';

    // Render each post as a card - only show 2 posts to match Coming up section height
    this.posts.slice(0, 2).forEach((post, index) => {
      const postElement = this.createPostCard(post, index);
      postsContainer.appendChild(postElement);
    });
    
    console.log('Instagram posts rendered successfully');
  }

  // Create individual post card (matching episode layout exactly)
  createPostCard(post, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card clickable-card instagram-card';
    cardDiv.onclick = () => window.open(post.permalink, '_blank');

    const timeAgo = this.getTimeAgo(post.timestamp);
    const caption = this.truncateText(post.caption, 60);
    const formattedDate = this.formatDate(post.timestamp);

    cardDiv.innerHTML = `
      <div class="cover instagram-cover" style="background-image: url('${post.media_url}'); background-size: cover; background-position: center;">
        ${!post.media_url ? '<div class="instagram-placeholder"><i class="fab fa-instagram"></i></div>' : ''}
        ${post.media_type === 'VIDEO' ? '<div class="video-overlay"><i class="fas fa-play"></i></div>' : ''}
      </div>
      <div class="content">
        <a href="${post.permalink}" class="play-link" target="_blank" rel="noopener">
          View on Instagram <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `;

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

  // Format date like the episodes (DD/MM/YYYY)
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Refresh posts
  async refresh() {
    console.log('Instagram Posts: Refreshing posts');
    await this.init();
  }
}

// Initialize Instagram posts when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Instagram posts...');
  const instagramPosts = new InstagramPosts();
  instagramPosts.init();

  // Add refresh button functionality
  const refreshButton = document.querySelector('.instagram-header');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      instagramPosts.refresh();
    });
  }
});

// Force refresh Instagram posts on page load to clear cache
window.addEventListener('load', function() {
  console.log('Page fully loaded, refreshing Instagram posts...');
  const instagramPosts = new InstagramPosts();
  instagramPosts.init();
});
*/