/**
 * SamudraFM Now Playing – cache-first now playing with smooth UI updates.
 * API: https://api.samudrafm.com/nowplaying
 *
 * Behaviour:
 * - On init: read `samudrafm_last_np` from localStorage and immediately apply to UI (if present).
 * - Then: fetch fresh data from API, update UI and cache.
 * - Refresh every 15 seconds.
 */

const NOWPLAYING_API = 'https://api.samudrafm.com/nowplaying';
const NOWPLAYING_STORAGE_KEY = 'samudrafm_last_np';

/**
 * Low-level fetch from the Now Playing API.
 * @returns {Promise<{ status: string, data: Object | null, error?: string }>}
 */
async function fetchNowPlaying() {
  try {
    const response = await fetch(NOWPLAYING_API, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('HTTP ' + response.status + ': ' + response.statusText);
    }

    const json = await response.json();

    if (!json || json.status !== 'success') {
      return {
        status: (json && json.status) || 'error',
        data: null,
        error: (json && json.message) || 'API returned non-success status',
      };
    }

    return {
      status: 'success',
      data: json.data || null,
    };
  } catch (err) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('Now Playing fetch error:', err);
    }
    return {
      status: 'error',
      data: null,
      error: err && (err.message || String(err)),
    };
  }
}

/**
 * Returns only the track data from the API.
 * @returns {Promise<Object|null>}
 */
async function getCurrentTrack() {
  const result = await fetchNowPlaying();
  return result.data;
}

/**
 * Safely read cached now playing payload from localStorage.
 * @returns {Object|null}
 */
function readCachedNowPlaying() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(NOWPLAYING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('Failed to read now playing cache:', e);
    }
  }
  return null;
}

/**
 * Persist now playing payload to localStorage.
 * @param {Object|null} payload
 */
function writeCachedNowPlaying(payload) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (!payload) {
      window.localStorage.removeItem(NOWPLAYING_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(NOWPLAYING_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('Failed to write now playing cache:', e);
    }
  }
}

/**
 * Updates the hero presenter card from API presenter object.
 * When presenter.is_live is false, shows AutoDJ; otherwise shows live presenter name, art, description and socials from presenter-data.
 * @param {Object} presenter - { is_live: boolean, name?: string, art?: string }
 */
function updateHeroPresenterFromApi(presenter) {
  var nameEl = document.getElementById('presenter-name');
  var descEl = document.getElementById('presenter-desc');
  var timeEl = document.getElementById('presenter-time');
  var avatarEl = document.getElementById('presenter-avatar');
  var socialsEl = document.querySelector('.hero-presenter-socials');
  if (!nameEl || !descEl || !timeEl || !avatarEl) return;

  if (presenter && presenter.noData === true) {
    nameEl.textContent = 'Offline';
    descEl.textContent = 'Offline';
    timeEl.textContent = 'Offline';
    avatarEl.style.backgroundImage = "url('assets/brandmark/sfmTextLogoBG1.svg')";
    if (socialsEl) {
      socialsEl.innerHTML = '<span class="hero-presenter-social-icon" aria-hidden="true"><i class="fa-brands fa-instagram" aria-hidden="true"></i></span><span class="hero-presenter-social-icon" aria-hidden="true"><i class="fab fa-facebook-f" aria-hidden="true"></i></span><a class="hero-presenter-social-icon" href="/profile" aria-label="Profile Page"><i class="fas fa-user" aria-hidden="true"></i></a>';
    }
    return;
  }

  var getData = typeof window.getPresenterData === 'function' ? window.getPresenterData : function () { return null; };

  var isLive = presenter && presenter.is_live === true;
  var data = getData('AutoDJ');
  var displayName = (data && data.name) ? data.name : 'AutoDJ';
  var description = (data && data.description) ? data.description : 'Non-stop music on samudrafm.';
  var timeLabel = (data && data.timeLabel) ? data.timeLabel : 'Streaming all day.';
  var artUrl = (data && data.art) ? data.art : 'assets/brandmark/sfmTextLogoBG1.svg';

  if (isLive && presenter.name) {
    data = getData(presenter.name) || data;
    displayName = (data && data.name) ? data.name : (presenter.name.charAt(0).toUpperCase() + presenter.name.slice(1));
    description = (data && data.description) ? data.description : 'Live on samudrafm.';
    timeLabel = (data && data.timeLabel) ? data.timeLabel : 'On air now.';
    if (presenter.art) {
      artUrl = presenter.art;
    } else if (data && data.art) {
      artUrl = data.art;
    }
  } else {
    if (presenter && presenter.art) artUrl = presenter.art;
    else if (data && data.art) artUrl = data.art;
  }

  nameEl.textContent = displayName;
  descEl.textContent = description;
  timeEl.textContent = timeLabel;
  artUrl = toRelativeAssetUrl(artUrl);
  avatarEl.style.backgroundImage = artUrl ? "url('" + artUrl.replace(/'/g, "%27") + "')" : 'none';
  avatarEl.style.backgroundColor = artUrl ? '' : 'var(--panel)';

  if (socialsEl && data) {
    var parts = [];
    if (data.instagram) {
      parts.push('<a class="hero-presenter-social-icon" href="' + escapeAttr(data.instagram) + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>');
    } else {
      parts.push('<span class="hero-presenter-social-icon" aria-hidden="true"><i class="fa-brands fa-instagram" aria-hidden="true"></i></span>');
    }
    if (data.facebook) {
      parts.push('<a class="hero-presenter-social-icon" href="' + escapeAttr(data.facebook) + '" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>');
    } else {
      parts.push('<span class="hero-presenter-social-icon" aria-hidden="true"><i class="fab fa-facebook-f" aria-hidden="true"></i></span>');
    }
    var profileHref = (data.profileUrl || '/profile');
    parts.push('<a class="hero-presenter-social-icon" href="' + escapeAttr(profileHref) + '" aria-label="Profile Page"><i class="fas fa-user" aria-hidden="true"></i></a>');
    socialsEl.innerHTML = parts.join('');
  }
}

/**
 * Prefer relative URL for same-origin asset paths so avatar works on localhost and any domain.
 */
function toRelativeAssetUrl(url) {
  if (!url || typeof url !== 'string') return '';
  var s = url.trim();
  if (!s) return '';
  try {
    if (s.indexOf('/') === 0) return s.slice(1);
    if (s.indexOf('http://') === 0 || s.indexOf('https://') === 0) {
      var a = document.createElement('a');
      a.href = s;
      var path = a.pathname || '';
      if (path.indexOf('/assets/') === 0) return path.slice(1);
      if (path.indexOf('assets/') === 0) return path;
    }
  } catch (e) {}
  return s;
}

function escapeAttr(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Keep track of the last track we actually applied to avoid flicker on identical updates.
var __lastAppliedNowPlaying = null;

function tracksAreSame(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    String(a.title || '') === String(b.title || '') &&
    String(a.artist || '') === String(b.artist || '') &&
    String(a.album_art || '') === String(b.album_art || '')
  );
}

/**
 * Apply a now playing track payload to the hero "Now Playing" UI.
 * @param {Object|null} track
 */
function applyNowPlayingToHero(track) {
  var infoEl = document.getElementById('hero-live-info');
  var cover = document.getElementById('hero-live-cover');
  var titleEl = document.getElementById('hero-live-title');
  var spotifyLink = document.getElementById('hero-live-spotify-link');
  var subtitleEl = document.querySelector('.hero-live-info .hero-live-subtitle');
  var badgeEl = document.querySelector('#hero-live-info .hero-live-badge');

  if (!infoEl || !cover || !titleEl || !subtitleEl) {
    return;
  }

  // If the incoming track is identical to what is already shown, skip updates to prevent flicker.
  if (!track && __lastAppliedNowPlaying === '__offline__') {
    return;
  }
  if (track && __lastAppliedNowPlaying && __lastAppliedNowPlaying !== '__offline__' && tracksAreSame(track, __lastAppliedNowPlaying)) {
    return;
  }

  // Let CSS handle smooth opacity transitions.
  infoEl.classList.add('hero-live-text-updating');

  // Update presenter card if presenter info is present.
  var presenter = track && track.presenter ? track.presenter : null;
  if (!track) {
    updateHeroPresenterFromApi({ noData: true });
  } else {
    updateHeroPresenterFromApi(presenter || { is_live: false });
  }

  window.setTimeout(function () {
    infoEl.classList.remove('hero-live-info-hidden');
    infoEl.setAttribute('aria-hidden', 'false');

    if (!track) {
      cover.style.backgroundImage = '';
      titleEl.textContent = 'Offline';
      subtitleEl.textContent = '';
      __lastAppliedNowPlaying = '__offline__';
      if (spotifyLink) {
        spotifyLink.style.display = 'none';
      }
      if (badgeEl) {
        badgeEl.textContent = 'Offline';
        badgeEl.classList.add('hero-live-badge--offline');
      }
    } else {
      if (track.album_art) {
        cover.style.backgroundImage = "url('" + String(track.album_art).replace(/'/g, "%27") + "')";
      }
      if (track.title) {
        titleEl.textContent = track.title;
      }
      if (track.artist) {
        subtitleEl.textContent = track.artist;
      }
      if (badgeEl) {
        badgeEl.textContent = 'LIVE';
        badgeEl.classList.remove('hero-live-badge--offline');
      }
      __lastAppliedNowPlaying = {
        title: track.title || '',
        artist: track.artist || '',
        album_art: track.album_art || '',
      };
      if (spotifyLink) {
        var songLink =
          track.link ||
          track.spotify_link ||
          track.track_url ||
          track.url ||
          track.external_url ||
          (track.external_urls && track.external_urls.spotify) ||
          '';
        spotifyLink.href = songLink || '#';
        spotifyLink.style.display = '';
        if (songLink) {
          spotifyLink.classList.remove('hero-live-spotify-link--unavailable');
        } else {
          spotifyLink.classList.add('hero-live-spotify-link--unavailable');
        }
      }
    }

    var embedEl = document.getElementById('hero-live-embed');
    if (embedEl) embedEl.classList.remove('hero-live-text-pending');

    // Allow fade-in after content swap.
    window.setTimeout(function () {
      infoEl.classList.remove('hero-live-text-updating');
    }, 50);
  }, 50);
}

/**
 * Cache-first wrapper used by the rest of the site.
 * Immediately renders from cache (if available), then refreshes from API.
 */
function updateHeroNowPlaying() {
  // 1) Cache-first: show last known track instantly if available.
  var cached = readCachedNowPlaying();
  if (cached) {
    applyNowPlayingToHero(cached);
  }

  // 2) Always fetch fresh data.
  fetchNowPlaying()
    .then(function (result) {
      var track = result && result.data ? result.data : null;
      applyNowPlayingToHero(track);
      writeCachedNowPlaying(track);
    })
    .catch(function () {
      // On error, keep whatever is currently displayed (cached UI),
      // but ensure presenter card isn't left in a broken state.
      updateHeroPresenterFromApi({ noData: true });
      var embedEl = document.getElementById('hero-live-embed');
      if (embedEl) embedEl.classList.remove('hero-live-text-pending');
    });
}

// Attach helpers globally for other scripts if needed.
if (typeof window !== 'undefined') {
  window.fetchNowPlaying = fetchNowPlaying;
  window.getCurrentTrack = getCurrentTrack;
  window.updateHeroNowPlaying = updateHeroNowPlaying;
  window.updateHeroPresenterFromApi = updateHeroPresenterFromApi;

  function initHeroNowPlaying() {
    updateHeroNowPlaying();
    // Refresh every 15 seconds.
    setInterval(updateHeroNowPlaying, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroNowPlaying);
  } else {
    initHeroNowPlaying();
  }

  window.addEventListener('load', function () {
    // Ensure we get a fresh update even if DOMContentLoaded fired from cache.
    updateHeroNowPlaying();
  });
}

// Optional CommonJS export for tooling/tests.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchNowPlaying, getCurrentTrack, NOWPLAYING_API };
}
