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
