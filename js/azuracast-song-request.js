/**
 * AzuraCastSongRequest – song request modal for the hero "send a request" button.
 * Uses AzuraCast station request API: search then submit by request_id.
 */
(function () {
  var STATION_ID = 1;
  var BASE = 'https://talent.samudrafm.com/api';

  async function searchSongs(stationId, query) {
    var url = BASE + '/station/' + stationId + '/requests?searchPhrase=' + encodeURIComponent(query);
    var response = await fetch(url);
    return await response.json();
  }

  async function submitRequest(stationId, requestId) {
    var url = BASE + '/station/' + stationId + '/request/' + requestId;
    var response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Request rejected by AzuraCast');
    return await response.json();
  }

  function getRequestId(item) {
    return item.request_id != null ? item.request_id : (item.id != null ? item.id : null);
  }

  function getTitle(item) {
    if (item.title) return item.title;
    if (item.track && item.track.title) return item.track.title;
    if (item.song && item.song.title) return item.song.title;
    return 'Unknown';
  }

  function getArtist(item) {
    if (item.artist) return item.artist;
    if (item.track && item.track.artist) return item.track.artist;
    if (item.song && item.song.artist) return item.song.artist;
    return '';
  }

  function normalizeResults(data) {
    var list = Array.isArray(data) ? data : (data.results || data.tracks || data.data || []);
    return list.map(function (item) {
      return {
        requestId: getRequestId(item),
        title: getTitle(item),
        artist: getArtist(item)
      };
    }).filter(function (r) { return r.requestId != null; });
  }

  function createModal() {
    var overlay = document.createElement('div');
    overlay.className = 'azuracast-request-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'azuracast-request-title');
    overlay.innerHTML =
      '<div class="azuracast-request-modal">' +
        '<div class="azuracast-request-header">' +
          '<h2 id="azuracast-request-title" class="azuracast-request-title">Be a manualDJ. Request a song.</h2>' +
          '<button type="button" class="azuracast-request-close" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="azuracast-request-body">' +
          '<input type="search" class="azuracast-request-search" placeholder="Search artist or song..." autocomplete="off" aria-label="Search songs">' +
          '<div class="azuracast-request-results"></div>' +
          '<div class="azuracast-request-status" aria-live="polite"></div>' +
        '</div>' +
      '</div>';
    return overlay;
  }

  function showToast(message, isError) {
    var existing = document.getElementById('azuracast-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'azuracast-toast';
    toast.className = 'azuracast-toast' + (isError ? ' azuracast-toast-error' : ' azuracast-toast-success');
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('azuracast-toast-hide');
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 4000);
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, a); }, ms);
    };
  }

  var inited = false;
  function init() {
    if (inited) return;
    var btn = document.querySelector('.hero-live-request');
    if (!btn) return;
    inited = true;

    var modal = createModal();
    var overlay = modal;
    var searchInput = modal.querySelector('.azuracast-request-search');
    var resultsEl = modal.querySelector('.azuracast-request-results');
    var statusEl = modal.querySelector('.azuracast-request-status');
    var closeBtn = modal.querySelector('.azuracast-request-close');

    function setStatus(msg, isError) {
      statusEl.textContent = msg || '';
      statusEl.className = 'azuracast-request-status' + (isError ? ' azuracast-request-status-error' : '');
    }

    function close() {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
      closeBtn.removeEventListener('click', close);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeydown);
    }

    function onOverlayClick(e) {
      if (e.target === overlay) close();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close();
    }

    var allSongs = [];

    function loadAllSongs() {
      setStatus('Loading songs…');
      searchSongs(STATION_ID, '')
        .then(function (data) {
          allSongs = normalizeResults(data);
          renderResults(allSongs);
          setStatus(allSongs.length ? allSongs.length + ' songs available' : 'No songs available.');
        })
        .catch(function (err) {
          setStatus('Could not load songs. Try searching above.', true);
          allSongs = [];
          resultsEl.innerHTML = '';
        });
    }

    function open() {
      if (overlay.parentNode) return;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
      searchInput.value = '';
      resultsEl.innerHTML = '';
      setStatus('');
      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', onOverlayClick);
      document.addEventListener('keydown', onKeydown);
      loadAllSongs();
      searchInput.focus();
    }

    function renderResults(items) {
      resultsEl.innerHTML = '';
      if (!items.length) {
        resultsEl.innerHTML = '<p class="azuracast-request-empty">No songs found. Try another search.</p>';
        return;
      }
      items.forEach(function (item) {
        var row = document.createElement('button');
        row.type = 'button';
        row.className = 'azuracast-request-row';
        row.innerHTML = '<span class="azuracast-request-row-title">' + escapeHtml(item.title) + '</span>' +
          (item.artist ? '<span class="azuracast-request-row-artist">' + escapeHtml(item.artist) + '</span>' : '');
        row.addEventListener('click', function () { submitSong(item); });
        resultsEl.appendChild(row);
      });
    }

    function escapeHtml(s) {
      var div = document.createElement('div');
      div.textContent = s;
      return div.innerHTML;
    }

    function submitSong(item) {
      setStatus('Sending request…');
      submitRequest(STATION_ID, item.requestId)
        .then(function () {
          close();
          showToast('Request sent! We\'ll play it soon.');
        })
        .catch(function (err) {
          close();
          showToast(err.message || 'Request failed.', true);
        });
    }

    var doSearch = debounce(function () {
      var q = (searchInput.value || '').trim();
      if (q.length < 2) {
        renderResults(allSongs);
        setStatus(allSongs.length ? allSongs.length + ' songs available' : 'No songs available.');
        return;
      }
      setStatus('Searching…');
      searchSongs(STATION_ID, q)
        .then(function (data) {
          var items = normalizeResults(data);
          renderResults(items);
          setStatus(items.length ? items.length + ' match(es)' : 'No matches.');
        })
        .catch(function (err) {
          setStatus('Search failed. Try again.', true);
          resultsEl.innerHTML = '';
        });
    }, 300);

    searchInput.addEventListener('input', doSearch);
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') e.preventDefault();
    });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      open();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
