/**
 * SamduraFM Now Playing – fetch metadata from the station API
 * API: https://api.samudrafm.com/api/nowplaying/1
 */

const NOWPLAYING_API = 'https://api.samudrafm.com/api/nowplaying/1';

/**
 * Fetches current now-playing metadata from the API.
 * @returns {Promise<{ status: string, data: Object | null, error?: string }>}
 */
async function fetchNowPlaying() {
  try {
    const response = await fetch(NOWPLAYING_API);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.status !== 'success') {
      return {
        status: json.status || 'error',
        data: null,
        error: json.message || 'API returned non-success status',
      };
    }

    return {
      status: 'success',
      data: json.data || null,
    };
  } catch (err) {
    console.error('Now Playing fetch error:', err);
    return {
      status: 'error',
      data: null,
      error: err.message || String(err),
    };
  }
}

/**
 * Fetches now-playing and returns only the track data (artist, title, album_art, etc.).
 * @returns {Promise<Object|null>} Track object or null on failure
 */
async function getCurrentTrack() {
  const result = await fetchNowPlaying();
  return result.data;
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
    nameEl.textContent = 'No data.';
    descEl.textContent = 'No data.';
    timeEl.textContent = 'No data.';
    avatarEl.style.backgroundImage = "url('assets/brandmark/sfmTextLogoBG1.svg')";
    if (socialsEl) {
      socialsEl.innerHTML = '<span class="hero-presenter-social-icon" aria-hidden="true"><i class="fab fa-instagram" aria-hidden="true"></i></span><span class="hero-presenter-social-icon" aria-hidden="true"><i class="fab fa-facebook-f" aria-hidden="true"></i></span><a class="hero-presenter-social-icon" href="/profile"><i class="fas fa-user" aria-hidden="true"></i><span class="sr-only">Profile Page</span></a>';
    }
    return;
  }

  var getData = typeof window.getPresenterData === 'function' ? window.getPresenterData : function () { return null; };

  var isLive = presenter && presenter.is_live === true;
  var displayName = 'AutoDJ';
  var description = 'Non-stop music on SamudraFM.';
  var timeLabel = 'Streaming all day.';
  var artUrl = 'assets/brandmark/sfmTextLogoBG1.svg';
  var data = getData('AutoDJ');

  if (isLive && presenter.name) {
    data = getData(presenter.name) || data;
    displayName = (data && data.name) ? data.name : (presenter.name.charAt(0).toUpperCase() + presenter.name.slice(1));
    description = (data && data.description) ? data.description : 'Live on SamudraFM.';
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
  avatarEl.style.backgroundImage = "url('" + (artUrl || '').replace(/'/g, "%27") + "')";

  if (socialsEl && data) {
    var parts = [];
    if (data.instagram) {
      parts.push('<a class="hero-presenter-social-icon" href="' + escapeAttr(data.instagram) + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>');
    } else {
      parts.push('<span class="hero-presenter-social-icon" aria-hidden="true"><i class="fab fa-instagram" aria-hidden="true"></i></span>');
    }
    if (data.facebook) {
      parts.push('<a class="hero-presenter-social-icon" href="' + escapeAttr(data.facebook) + '" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>');
    } else {
      parts.push('<span class="hero-presenter-social-icon" aria-hidden="true"><i class="fab fa-facebook-f" aria-hidden="true"></i></span>');
    }
    var profileHref = (data.profileUrl || '/profile');
    parts.push('<a class="hero-presenter-social-icon" href="' + escapeAttr(profileHref) + '"><i class="fas fa-user" aria-hidden="true"></i><span class="sr-only">Profile Page</span></a>');
    socialsEl.innerHTML = parts.join('');
  }
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

/**
 * Updates the hero live section with current track and presenter from API.
 */
function updateHeroNowPlaying() {
  var infoEl = document.getElementById('hero-live-info');
  var cover = document.getElementById('hero-live-cover');
  var titleEl = document.getElementById('hero-live-title');
  var spotifyLink = document.getElementById('hero-live-spotify-link');
  var subtitleEl = document.querySelector('.hero-live-info .hero-live-subtitle');

  fetchNowPlaying().then(function (result) {
    var track = result.data;
    var presenter = (result.data && result.data.presenter) || null;
    if (result.data == null) {
      updateHeroPresenterFromApi({ noData: true });
    } else {
      updateHeroPresenterFromApi(presenter || { is_live: false });
    }

    if (!infoEl || !cover || !titleEl || !subtitleEl) return;

    if (!track) {
      infoEl.classList.add('hero-live-info-hidden');
      infoEl.setAttribute('aria-hidden', 'true');
      cover.style.backgroundImage = '';
      titleEl.textContent = '';
      subtitleEl.textContent = '';
      if (spotifyLink) spotifyLink.style.display = 'none';
      return;
    }

    infoEl.classList.remove('hero-live-info-hidden');
    infoEl.setAttribute('aria-hidden', 'false');
    if (track.album_art) {
      cover.style.backgroundImage = "url('" + track.album_art.replace(/'/g, "%27") + "')";
    }
    if (track.title) {
      titleEl.textContent = track.title;
    }
    if (track.artist) {
      subtitleEl.textContent = track.artist;
    }
    if (spotifyLink) {
      var songLink = track.link || track.spotify_link || track.track_url || track.url || track.external_url || (track.external_urls && track.external_urls.spotify) || '';
      spotifyLink.href = songLink || 'https://open.spotify.com';
      spotifyLink.style.display = '';
    }
  });
}

// Export for use as module (e.g. type="module") or attach to window for classic scripts
if (typeof window !== 'undefined') {
  window.fetchNowPlaying = fetchNowPlaying;
  window.getCurrentTrack = getCurrentTrack;
  window.updateHeroNowPlaying = updateHeroNowPlaying;
  window.updateHeroPresenterFromApi = updateHeroPresenterFromApi;

  function initHeroNowPlaying() {
    updateHeroNowPlaying();
    setInterval(updateHeroNowPlaying, 30000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroNowPlaying);
  } else {
    initHeroNowPlaying();
  }
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchNowPlaying, getCurrentTrack, NOWPLAYING_API };
}
