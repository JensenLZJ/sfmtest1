# Instagram API Setup for SamudraFM

This guide will help you set up real Instagram integration for your website.

## Prerequisites

1. A Facebook Developer Account
2. A Facebook App with Instagram Basic Display API enabled
3. A web server with PHP support

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App" and select "Consumer" as the app type
3. Fill in your app details:
   - App Name: SamudraFM
   - App Contact Email: your-email@example.com
   - App Purpose: Other

## Step 2: Add Instagram Basic Display Product

1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Click "Create New App" in the Instagram Basic Display section

## Step 3: Configure Instagram Basic Display ✅ COMPLETED

✅ **App ID**: 1352509662973403  
✅ **App Secret**: 04fa33f39a09f3d7fec8425b54ff1326

Your Instagram Basic Display app is already configured! Now you just need to get the access token.

**Next Step**: Follow the detailed guide in `INSTAGRAM_TOKEN_SETUP.md` to get your access token.

## Step 4: Get User Access Token

1. Go to Instagram Basic Display > Basic Display
2. Click "Generate Token"
3. Use the Instagram Basic Display API to get a long-lived access token
4. You'll need to implement the OAuth flow to get the user's permission

## Step 5: Configure Your Server

1. Update `instagram-api.php` with your credentials:
   ```php
   $INSTAGRAM_APP_ID = 'your_app_id_here';
   $INSTAGRAM_APP_SECRET = 'your_app_secret_here';
   $INSTAGRAM_REDIRECT_URI = 'https://yourdomain.com/instagram-callback.php';
   $INSTAGRAM_ACCESS_TOKEN = 'your_long_lived_access_token_here';
   ```

2. Create `instagram-callback.php` for OAuth flow:
   ```php
   <?php
   // Handle Instagram OAuth callback
   $code = $_GET['code'] ?? '';
   // Exchange code for access token
   // Store the long-lived access token
   ?>
   ```

## Step 6: Test the Integration

1. Upload your files to your web server
2. Visit your website and check if Instagram posts load
3. Check the browser console for any errors

## Current Status

The website currently uses mock data that looks like real Instagram posts. Once you complete the setup above, it will automatically switch to real Instagram posts.

## Troubleshooting

- **CORS Issues**: Make sure your server allows cross-origin requests
- **Token Expired**: Instagram tokens expire after 60 days, implement token refresh
- **Rate Limits**: Instagram has rate limits, implement caching
- **No Posts**: Check if your Instagram account has public posts

## Security Notes

- Never expose your App Secret in client-side code
- Use HTTPS for all OAuth redirects
- Implement proper error handling
- Consider caching Instagram data to reduce API calls

## Alternative: Using Instagram Embed

If the API setup is too complex, you can also use Instagram's embed feature:

```html
<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/ABC123/" data-instgrm-version="14"></blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

This approach doesn't require API setup but is less customizable.
