/**
 * Hero live stream player – HLS (HTTP Live Streaming) playback and volume for #hero-live-embed
 * Used on home and all other pages that show the live player.
 */
(function() {
  var LIVE_HLS_URL = 'https://talent.samudrafm.com/hls/samudrafm.com/live.m3u8';
  var STORAGE_KEY = 'heroLivePlaying';
  var hls = null;
  var isLivePlaying = false;
  var mobileOverlayHideTimeout = null;

  function persistLiveState() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, isLivePlaying ? '1' : '0');
      }
    } catch (e) {}
  }
  function getPersistedLiveState() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        return sessionStorage.getItem(STORAGE_KEY) === '1';
      }
    } catch (e) {}
    return false;
  }

  function getAudio() { return document.getElementById('hero-live-audio'); }
  function getPlayBtn() { return document.getElementById('hero-live-play-pause'); }

  function updateLiveButton() {
    var playBtn = getPlayBtn();
    if (!playBtn) return;
    playBtn.innerHTML = isLivePlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    playBtn.setAttribute('aria-label', isLivePlaying ? 'Pause live stream' : 'Play live stream');
    if (window.matchMedia && window.matchMedia('(max-width: 1024px)').matches) {
      applyMobileOverlayBehavior();
    }
  }
  function applyMobileOverlayBehavior() {
    var overlay = document.querySelector('.hero-live-play-overlay');
    if (!overlay) return;
    if (!isLivePlaying) {
      if (mobileOverlayHideTimeout) {
        clearTimeout(mobileOverlayHideTimeout);
        mobileOverlayHideTimeout = null;
      }
      overlay.classList.remove('hero-live-play-overlay-hidden-mobile');
      return;
    }
    overlay.classList.remove('hero-live-play-overlay-hidden-mobile');
    if (mobileOverlayHideTimeout) clearTimeout(mobileOverlayHideTimeout);
    mobileOverlayHideTimeout = setTimeout(function() {
      mobileOverlayHideTimeout = null;
      overlay.classList.add('hero-live-play-overlay-hidden-mobile');
    }, 3000);
  }
  window.applyMobileOverlayBehavior = applyMobileOverlayBehavior;

  function startLiveStream(audioEl) {
    var audio = audioEl || getAudio();
    if (!audio) return;
    if (isLivePlaying) return;
    audio.muted = false;
    var volEl = document.getElementById('hero-live-volume');
    var vol = (volEl && volEl.value != null) ? Number(volEl.value) / 100 : 0.8;
    audio.volume = Math.max(0, Math.min(1, vol));
    if (typeof window.pauseMixcloudPlayer === 'function') window.pauseMixcloudPlayer();
    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      hls = new Hls({ enableWorker: true });
      hls.loadSource(LIVE_HLS_URL);
      hls.attachMedia(audio);
      audio.play().catch(function() {});
      hls.on(Hls.Events.MANIFEST_PARSED, function() { audio.play().catch(function() {}); });
      hls.on(Hls.Events.ERROR, function(ev, data) {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else {
            hls.destroy();
            hls = null;
          }
        }
      });
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = LIVE_HLS_URL;
      audio.addEventListener('loadedmetadata', function() { audio.play().catch(function() {}); }, { once: true });
      audio.play().catch(function() {});
    } else {
      console.warn('HLS not supported in this browser');
      return;
    }
    isLivePlaying = true;
    persistLiveState();
    updateLiveButton();
  }
  function stopLiveStream() {
    var audio = getAudio();
    if (!isLivePlaying) return;
    if (hls) {
      hls.destroy();
      hls = null;
    }
    if (audio) {
      audio.removeAttribute('src');
      audio.load();
    }
    isLivePlaying = false;
    persistLiveState();
    updateLiveButton();
  }
  window.pauseHeroLiveStream = stopLiveStream;

  function setHeroLiveVolume(value) {
    var audio = getAudio();
    if (!audio) return;
    var v = Math.max(0, Math.min(1, value / 100));
    audio.volume = v;
  }

  function handlePlayPauseClick(e) {
    var embed = e.currentTarget;
    var playBtn = embed.querySelector('#hero-live-play-pause');
    var audio = embed.querySelector('#hero-live-audio');
    if (!playBtn || !audio || !playBtn.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    if (isLivePlaying) {
      stopLiveStream();
    } else {
      startLiveStream(audio);
    }
  }

  function initOverlays() {
    var player = document.getElementById('hero-live-player');
    var overlay = document.querySelector('.hero-live-play-overlay');
    if (!player || !overlay) return;
    if (window.matchMedia && window.matchMedia('(min-width: 1025px)').matches) {
      var hideTimeout = null;
      function scheduleHide() {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(function() {
          hideTimeout = null;
          overlay.classList.add('hero-live-play-overlay-hidden');
        }, 5000);
      }
      function showOverlay() {
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
        overlay.classList.remove('hero-live-play-overlay-hidden');
      }
      player.addEventListener('mouseenter', function() {
        showOverlay();
        scheduleHide();
      });
      player.addEventListener('mouseleave', function() {
        scheduleHide();
      });
      scheduleHide();
    }
    if (window.matchMedia && window.matchMedia('(max-width: 1024px)').matches) {
      player.addEventListener('click', function(e) {
        if (!overlay.classList.contains('hero-live-play-overlay-hidden-mobile')) return;
        overlay.classList.remove('hero-live-play-overlay-hidden-mobile');
        if (window.applyMobileOverlayBehavior) window.applyMobileOverlayBehavior();
      });
    }
  }

  var inited = false;
  function init() {
    var embed = document.getElementById('hero-live-embed');
    if (!embed) return false;
    var audio = getAudio();
    var playBtn = getPlayBtn();
    if (!audio || !playBtn) return false;
    if (inited) return true;
    inited = true;
    embed.addEventListener('click', handlePlayPauseClick);
    var vol = document.getElementById('hero-live-volume');
    if (vol) {
      setHeroLiveVolume(vol.value);
      vol.addEventListener('input', function() { setHeroLiveVolume(vol.value); });
      vol.addEventListener('change', function() { setHeroLiveVolume(vol.value); });
    }
    updateLiveButton();
    initOverlays();
    // Restore play state when navigating between pages (e.g. home ↔ schedule)
    if (getPersistedLiveState()) {
      startLiveStream(audio);
    }
    return true;
  }

  var initAttempts = 0;
  var maxInitAttempts = 40;
  function runInit() {
    if (init()) return;
    initAttempts += 1;
    if (initAttempts < maxInitAttempts) setTimeout(runInit, 50);
  }

  function applyPersistedState() {
    if (!inited) return;
    var audio = getAudio();
    if (!audio) return;
    var wantPlaying = getPersistedLiveState();
    if (wantPlaying && !isLivePlaying) {
      startLiveStream(audio);
    } else if (!wantPlaying && isLivePlaying) {
      stopLiveStream();
    } else {
      updateLiveButton();
    }
  }

  window.addEventListener('pageshow', function(ev) {
    if (ev.persisted) applyPersistedState();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }
})();
