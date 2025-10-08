// Instagram API Configuration
// Replace this with your actual Instagram Basic Display API access token
// To get an access token:
// 1. Go to https://developers.facebook.com/
// 2. Create a new app or use existing app
// 3. Add Instagram Basic Display product
// 4. Generate a long-lived access token
// 5. Replace the token below

const INSTAGRAM_CONFIG = {
  // Your Instagram Basic Display API access token
  accessToken: 'IGAAKR1FYftV5BZAFJhalA4ZAk9nUEtXbWUtdnVsd092aEZAjMXJ3b2JNZAFZAMd1V5VFRoZAmpPOV9QM3hCQ2Fua1pRVFBJMGw3S1VrZAkU4Wkk0eURZAalQwNjJvQTEtR2ViZAWxyam43TU0tVGx6RDV4ZADFmSjctN0FobWw5LU9hRnRYOAZDZD',
  
  // Instagram account username (for display purposes)
  username: 'samudrafm',
  
  // Number of posts to fetch
  postLimit: 12,
  
  // API endpoints
  endpoints: {
    userInfo: 'https://graph.instagram.com/me',
    userMedia: 'https://graph.instagram.com/{user_id}/media'
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = INSTAGRAM_CONFIG;
} else {
  window.INSTAGRAM_CONFIG = INSTAGRAM_CONFIG;
}
