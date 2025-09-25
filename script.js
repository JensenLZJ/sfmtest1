// SamduraFM front-end behaviors and mock data wiring

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
const MIXCLOUD_USERNAME = 'samudrafm';
const MIXCLOUD_API_KEY = 'gDVAEf3yoChF4fkXFxfXNwl3XMkZEs0g';

let mixcloudNextUrl = null;
const isHttpContext = location.protocol === 'http:' || location.protocol === 'https:';

async function loadMixcloudEpisodes(username, nextUrl) {
  if (!username) return;
  const grid = document.getElementById('episodes-grid');
  if (!grid) return;
  if (!nextUrl && !grid.dataset.loaded) {
    grid.innerHTML = '<p class="muted">Loading episodes…</p>';
  }
  try {
    const url = nextUrl || `https://api.mixcloud.com/${encodeURIComponent(username)}/cloudcasts/?limit=8`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch Mixcloud');
    const data = await res.json();
    const items = (data.data || []).map(item => ({
      url: item.url,
      name: item.name,
      created: item.created_time ? new Date(item.created_time) : null,
      picture: item.pictures ? (item.pictures.extra_large || item.pictures.large || item.pictures.medium) : ''
    }));
    mixcloudNextUrl = data.paging && data.paging.next ? data.paging.next : null;
    if (!items.length) {
      grid.innerHTML = '<p class="muted">No episodes yet.</p>';
      return;
    }
    const startIndex = grid.querySelectorAll('.episodes-card').length;
    const html = items.map((ep, i) => `
      <article class="card episodes-card clickable-card" data-ep-index="${startIndex + i}">
        <div class="cover ${ep.picture ? '' : 'placeholder'}" ${ep.picture ? `style="background-image:url('${ep.picture}')"` : ''}></div>
        <div class="content">
          <p class="title">${ep.name}</p>
          <p class="meta">${ep.created ? ep.created.toLocaleDateString() : ''}</p>
          <a class="play-link" href="${ep.url}" target="_blank" rel="noopener">Open on Mixcloud ↗</a>
        </div>
      </article>
    `).join('');
    if (!grid.dataset.loaded) {
      grid.innerHTML = html;
      grid.dataset.loaded = '1';
    } else {
      grid.insertAdjacentHTML('beforeend', html);
    }

    // attach play behavior - play directly on site (entire card clickable)
    grid.querySelectorAll('.episodes-card').forEach((card, idx) => {
      const episode = items[idx];
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on the Mixcloud link
        if (e.target.classList.contains('play-link')) {
          return;
        }
        playEpisode(episode);
      });
    });

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
    grid.innerHTML = '<p class="muted">Could not load episodes from Mixcloud right now.</p>';
  }
}

loadMixcloudEpisodes(MIXCLOUD_USERNAME);

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

// Audio player for episodes -------------------------------------------------------
let currentEpisode = null;
let isCurrentlyPlaying = false;
let currentWidget = null;

function stopCurrentPlayer() {
  console.log('Stopping current player...');
  
  // Stop widget if it exists
  if (currentWidget) {
    try {
      if (typeof currentWidget.pause === 'function') {
        currentWidget.pause();
        console.log('Paused current widget');
      }
    } catch (error) {
      console.log('Error pausing current widget:', error);
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
  
  console.log('Current player stopped');
}

// Function to fetch duration from Mixcloud API
async function fetchDurationFromAPI(episodeUrl) {
  console.log('🔍 Fetching duration from Mixcloud API for:', episodeUrl);
  
  try {
    // Extract the show path from the URL
    // Example: https://www.mixcloud.com/SamudraFM/tasty-tuesday-show-27-june-2023/
    const urlParts = episodeUrl.split('/');
    const username = urlParts[3]; // SamudraFM
    const showSlug = urlParts[4]; // tasty-tuesday-show-27-june-2023
    
    if (!username || !showSlug) {
      console.log('❌ Could not parse episode URL');
      return Promise.resolve();
    }
    
    // Construct the API URL
    const apiUrl = `https://api.mixcloud.com/${username}/${showSlug}/`;
    console.log('🔍 API URL:', apiUrl);
    
    // Fetch from Mixcloud API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.log('❌ API request failed:', response.status, response.statusText);
      return Promise.resolve();
    }
    
    const data = await response.json();
    console.log('🔍 API response:', data);
    
    // Extract duration from the response
    if (data.audio_length) {
      const duration = data.audio_length; // Duration in seconds
      console.log('✅ Got duration from API:', duration, 'seconds');
      
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      console.log('Duration in MM:SS format:', `${minutes}:${seconds.toString().padStart(2, '0')}`);
      
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
      console.log('❌ No audio_length found in API response');
    }
    
    return Promise.resolve();
    
  } catch (error) {
    console.log('❌ Error fetching duration from API:', error);
    return Promise.resolve();
  }
}

function playEpisode(episode) {
  console.log('playEpisode called with:', episode);
  console.log('Episode name:', episode.name);
  console.log('Episode URL:', episode.url);
  
  // If already playing the same episode, don't restart
  if (isCurrentlyPlaying && currentEpisode && currentEpisode.url === episode.url) {
    console.log('Already playing this episode');
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
    openEl.href = episode.url;
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
  console.log('Loading Mixcloud player for:', episode.name);
  console.log('Episode URL:', episode.url);
  
  // Stop any existing player first
  if (currentWidget) {
    try {
      if (typeof currentWidget.pause === 'function') {
        currentWidget.pause();
      }
    } catch (error) {
      console.log('Error stopping previous widget:', error);
    }
    currentWidget = null;
  }
  
  // Use Mixcloud's official embed URL that allows iframe embedding
  const playerContainer = document.getElementById('mixcloud-player');
  if (!playerContainer) {
    console.error('Mixcloud player container not found');
    return;
  }
  
  // Clear any existing content completely
  playerContainer.innerHTML = '';
  
  // Also clear any existing iframes in the container
  const existingIframes = document.querySelectorAll('#mixcloud-iframe');
  existingIframes.forEach(iframe => iframe.remove());
  
  console.log('Cleared existing players, creating new one...');
  
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
    console.log('🎵 Mixcloud iframe loaded successfully');
    console.log('Iframe src:', iframe.src);
    console.log('Window.Mixcloud available:', !!window.Mixcloud);
    
    // Try to set up widget controls after iframe loads
    setTimeout(() => {
      console.log('🔧 Setting up widget controls...');
      if (window.Mixcloud) {
        try {
          currentWidget = window.Mixcloud.PlayerWidget(iframe);
          console.log('✅ Mixcloud widget initialized for controls:', currentWidget);
          console.log('Widget methods available:', Object.keys(currentWidget || {}));
          
          // Set up event listeners for sync
          if (currentWidget && currentWidget.events) {
            console.log('Setting up sync event listeners...');
            
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
  
  console.log('Updating play state:', isPlaying); // Debug log
  
  if (isPlaying) {
    // Show pause icon (Unicode)
    playPauseBtn.innerHTML = '⏸';
    console.log('Set pause icon');
  } else {
    // Show play icon (Unicode)
    playPauseBtn.innerHTML = '▶';
    console.log('Set play icon');
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
    
    // Don't restart progress tracking immediately - let the existing tracking continue
    // The Mixcloud widget will update its position and sync naturally
    console.log('Seek completed, letting existing progress tracking continue');
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
    const res = await fetch(`https://api.mixcloud.com/${encodeURIComponent(username)}/cloudcasts/?limit=1`);
    const data = await res.json();
    const ep = data.data && data.data[0];
    if (!ep) {
      // Fallback to radio stream info
      titleEl.textContent = 'SamudraFM Live Stream';
      openEl.href = '#';
      currentEpisode = { name: 'SamudraFM Live Stream', url: '#' };
      updatePlayState(false);
      return;
    }
    
    titleEl.textContent = ep.name;
    openEl.href = ep.url;
    
    // Set current episode for play button
    currentEpisode = ep;
    
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
    console.error('Error loading hero latest:', e);
    // Fallback to radio stream info
    titleEl.textContent = 'SamudraFM Live Stream';
    openEl.href = '#';
    currentEpisode = { name: 'SamudraFM Live Stream', url: '#' };
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
    
    // Clear any existing content and set Unicode play icon
    playPauseBtn.innerHTML = '▶';
    
    console.log('Button content after update:', playPauseBtn.innerHTML);
  }
}

function initPlayButton() {
  const playPauseBtn = document.getElementById('hero-play-pause');
  if (playPauseBtn) {
    // Set initial state to play
    updatePlayState(false);
    
    playPauseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Play button clicked!'); // Debug log
      
      if (currentEpisode) {
        if (isCurrentlyPlaying) {
          // Currently playing, pause the episode
          console.log('Pausing episode');
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
          console.log('Playing episode');
          if (currentWidget) {
            try {
              // Try to use widget controls
              if (typeof currentWidget.play === 'function') {
                currentWidget.play();
                console.log('Triggered play on Mixcloud widget');
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
            playEpisode(currentEpisode);
          }
        }
      } else {
        console.log('No current episode');
      }
    });
  }
  
  // Test audio button removed - using Mixcloud only
}