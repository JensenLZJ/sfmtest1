# Instagram Access Token Setup Guide

## Step 1: Get Your Access Token

You now have your App ID and App Secret. Next, you need to get an access token.

### Option A: Using Facebook Graph API Explorer (Recommended)

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app: **SamudraFM** (App ID: 1352509662973403)
3. Click "Generate Access Token"
4. Add these permissions:
   - `instagram_basic`
   - `instagram_content_publish` (if you want to post)
   - `pages_show_list`
   - `pages_read_engagement`

5. Click "Generate Access Token"
6. Copy the token (it will be a long string starting with something like `EAABwzLixnjY...`)

### Option B: Using Your App Directly

1. Go to your Facebook Developer Console
2. Navigate to your app: **SamudraFM**
3. Go to "Instagram Basic Display" → "Basic Display"
4. Click "Generate Token"
5. Follow the authorization flow
6. Copy the generated token

## Step 2: Exchange for Long-Lived Token

The token you get is short-lived (1 hour). You need to exchange it for a long-lived token (60 days).

### Using cURL (Command Line):

```bash
curl -i -X GET "https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_secret=04fa33f39a09f3d7fec8425b54ff1326
  &access_token=YOUR_SHORT_LIVED_TOKEN"
```

### Using Browser:

Visit this URL (replace `YOUR_SHORT_LIVED_TOKEN` with your actual token):
```
https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=04fa33f39a09f3d7fec8425b54ff1326&access_token=YOUR_SHORT_LIVED_TOKEN
```

## Step 3: Update Your PHP File

Once you have the long-lived token, update the `instagram-api.php` file:

```php
$INSTAGRAM_ACCESS_TOKEN = 'YOUR_LONG_LIVED_ACCESS_TOKEN';
```

## Step 4: Test the API

You can test if your token works by visiting:
```
https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=YOUR_LONG_LIVED_TOKEN
```

This should return your Instagram posts in JSON format.

## Step 5: Update Your Website

Once the token is working, your website will automatically fetch real Instagram posts instead of using the mock data.

## Important Notes:

- **Keep your App Secret secure** - never share it publicly
- **Long-lived tokens expire in 60 days** - you'll need to refresh them
- **Test in a private browser window** to avoid cached data
- **Make sure your Instagram account is connected** to your Facebook page

## Troubleshooting:

- If you get "Invalid Token" error, the token might be expired
- If you get "Insufficient Permissions" error, make sure you added all required permissions
- If you get "User Not Found" error, make sure your Instagram account is connected to your Facebook page

## Need Help?

If you encounter any issues, check:
1. Your Instagram account is connected to a Facebook page
2. Your app has the correct permissions
3. The token is not expired
4. Your Instagram account is public or you have the right permissions
