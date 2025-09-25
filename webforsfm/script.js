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

// Audio controls (removed - Live section deleted)
// const audio = document.getElementById('radio-stream');

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
  { title: 'Tiffany Behringer', desc: 'A Wee Mystical Magical Show', time: '20:00 – 22:00', cover: null },
  { title: 'Flynn', desc: 'Throwbacks With Flynn', time: '22:00 – 00:00', cover: null }
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
const MIXCLOUD_USERNAME = 'SamudraFM';

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
const episodePlayer = document.getElementById('episode-player');

function playEpisode(episode) {
  console.log('playEpisode called with:', episode.name);
  
  // If already playing the same episode, don't restart
  if (isCurrentlyPlaying && currentEpisode && currentEpisode.url === episode.url) {
    console.log('Already playing this episode');
    return;
  }
  
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
  updateProgressBar(0, 0, 1200);
  
  // Create or update hidden iframe player
  let playerIframe = document.getElementById('hidden-player');
  if (!playerIframe) {
    playerIframe = document.createElement('iframe');
    playerIframe.id = 'hidden-player';
    playerIframe.style.display = 'none';
    playerIframe.style.position = 'fixed';
    playerIframe.style.top = '-1000px';
    playerIframe.style.left = '-1000px';
    playerIframe.style.width = '1px';
    playerIframe.style.height = '1px';
    document.body.appendChild(playerIframe);
  }
  
  // Load the Mixcloud player with autoplay
  const mixcloudUrl = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=0&autoplay=1&feed=${encodeURIComponent(episode.url)}`;
  console.log('Loading Mixcloud URL:', mixcloudUrl);
  playerIframe.src = mixcloudUrl;
  
  // Update UI to show playing state
  updatePlayState(true);
  
  // Simple progress tracking without widget API
  startSimpleProgressTracking();
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
      updateProgressBar(0, 0, 1200);
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
  
  // Stop the hidden player
  const playerIframe = document.getElementById('hidden-player');
  if (playerIframe) {
    playerIframe.src = 'about:blank';
  }
  
  // Stop progress tracking
  if (window.currentProgressInterval) {
    clearInterval(window.currentProgressInterval);
    window.currentProgressInterval = null;
  }
  
  updatePlayState(false);
}

function startSimpleProgressTracking() {
  // Simple mock progress tracking - start from current position
  const totalDuration = 1200; // 20 minutes in seconds
  
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
    
    // Update time display (mock for now)
    const totalSeconds = 1200; // 20 minutes example
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    currentTimeEl.textContent = formatTime(currentSeconds);
    totalTimeEl.textContent = '-' + formatTime(totalSeconds - currentSeconds);
  }
  
  function seekTo(percentage) {
    // Seek the actual Mixcloud player
    const playerIframe = document.getElementById('hidden-player');
    if (playerIframe && window.Mixcloud) {
      const widget = window.Mixcloud.PlayerWidget(playerIframe);
      widget.ready.then(() => {
        const totalDuration = parseFloat(document.getElementById('total-time').textContent.replace('-', '').split(':').reduce((acc, time, i) => acc + time * Math.pow(60, 1-i), 0));
        const seekPosition = (percentage / 100) * totalDuration;
        widget.seek(seekPosition);
      });
    }
    updateProgress(percentage);
    
    // Restart progress tracking after seeking
    if (isCurrentlyPlaying) {
      // Clear any existing interval
      if (window.currentProgressInterval) {
        clearInterval(window.currentProgressInterval);
        window.currentProgressInterval = null;
      }
      
      // Restart progress tracking from the new position
      setTimeout(() => {
        startSimpleProgressTracking();
      }, 100);
    }
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
    volumeFill.style.width = percentage + '%';
    volumeHandle.style.left = percentage + '%';
  }
  
  // Initialize with 80% volume
  updateVolume(80);
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
    if (!ep) return;
    
    titleEl.textContent = ep.name;
    openEl.href = ep.url;
    
    // Set current episode for play button
    currentEpisode = ep;
    
    // Update play button state
    updatePlayState(false);
    
    // Handle cover image - force show placeholder for now
    coverEl.classList.add('placeholder');
    coverEl.innerHTML = '';
    
  } catch(e){ 
    console.error('Error loading hero latest:', e);
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
          pauseEpisode();
        } else {
          // Currently paused, play the episode
          console.log('Playing episode');
          playEpisode(currentEpisode);
        }
      } else {
        console.log('No current episode');
      }
    });
  }
}