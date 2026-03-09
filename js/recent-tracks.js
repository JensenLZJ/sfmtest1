/**
 * Recently played tracks – fetches last 3 played songs from station API
 * API: https://api.samudrafm.com/api/recent/1
 */

var RECENT_API = 'https://api.samudrafm.com/api/recent/1';
var RECENT_LIMIT = 3;

function escapeAttr(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fetchRecentTracks() {
  return fetch(RECENT_API)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (json) {
      if (json.status !== 'success' || !Array.isArray(json.data)) return [];
      return json.data.slice(0, RECENT_LIMIT);
    })
    .catch(function (err) {
      console.error('Recent tracks fetch error:', err);
      return [];
    });
}

function renderRecentTracks(tracks) {
  var listEl = document.getElementById('recently-played-list');
  if (!listEl) return;
  if (!tracks || tracks.length === 0) {
    listEl.innerHTML = '<p class="recently-played-empty">No recent tracks to show.</p>';
    return;
  }
  var html = tracks.map(function (t) {
    var art = (t.album_art && t.album_art.replace(/'/g, "%27")) || '';
    var title = (t.title && escapeAttr(t.title)) || 'Unknown';
    var artist = (t.artist && escapeAttr(t.artist)) || '';
    var link = t.link || t.spotify_link || t.track_url || t.url || t.external_url || (t.external_urls && t.external_urls.spotify) || '';
    var isSpotify = !!link && link.indexOf('spotify') !== -1;
    var row = '<div class="recently-played-row">';
    row += '<div class="recently-played-art" style="background-image:url(\'' + art + '\')"></div>';
    row += '<div class="recently-played-info"><span class="recently-played-title">' + title + '</span>';
    if (artist) row += ' <span class="recently-played-artist">' + artist + '</span>';
    row += '</div>';
    if (isSpotify) {
      row += '<a class="recently-played-link" href="' + escapeAttr(link) + '" target="_blank" rel="noopener noreferrer" aria-label="Open Spotify track"><i class="fab fa-spotify"></i></a>';
    } else {
      // No Spotify track: show greyed Spotify icon without a link
      row += '<span class="recently-played-link recently-played-link--spotify-grey" aria-label="No Spotify link available"><i class="fab fa-spotify"></i></span>';
    }
    row += '</div>';
    return row;
  }).join('');
  listEl.innerHTML = html;
}

function updateRecentTracks() {
  fetchRecentTracks().then(renderRecentTracks);
}

function initRecentTracks() {
  updateRecentTracks();
  setInterval(updateRecentTracks, 60000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRecentTracks);
} else {
  initRecentTracks();
}
