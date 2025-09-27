# How to Update Instagram Posts on Your Website

## Quick Method: Update JSON File

1. **Open `instagram-posts.json`** in your code editor
2. **Replace the placeholder data** with your real Instagram posts
3. **Save the file** and refresh your website

## Getting Your Instagram Post URLs

### Method 1: From Instagram Web
1. Go to your Instagram profile: https://www.instagram.com/samudrafm/
2. Click on any post you want to feature
3. Copy the URL from your browser (e.g., `https://www.instagram.com/p/ABC123/`)
4. Right-click on the post image and "Copy image address" for the image URL

### Method 2: From Instagram Mobile App
1. Open Instagram app
2. Go to your profile
3. Tap on a post
4. Tap the three dots (...) in the top right
5. Select "Copy Link"
6. For image URL, tap and hold the image, then "Copy Link"

## Updating the JSON File

Replace the content in `instagram-posts.json` with your real posts:

```json
{
  "posts": [
    {
      "id": "1",
      "media_type": "IMAGE",
      "media_url": "https://scontent-xxx.cdninstagram.com/v/your-image-url.jpg",
      "permalink": "https://www.instagram.com/p/ABC123/",
      "caption": "Your actual post caption here...",
      "timestamp": "2025-01-27T12:00:00Z",
      "username": "samudrafm"
    },
    {
      "id": "2",
      "media_type": "VIDEO", 
      "media_url": "https://scontent-xxx.cdninstagram.com/v/your-video-url.mp4",
      "permalink": "https://www.instagram.com/p/DEF456/",
      "caption": "Another post caption...",
      "timestamp": "2025-01-26T15:30:00Z",
      "username": "samudrafm"
    }
  ]
}
```

## Important Notes

- **Image URLs**: Instagram image URLs are temporary and change frequently
- **Timestamps**: Use ISO format (YYYY-MM-DDTHH:MM:SSZ)
- **Media Type**: Use "IMAGE" for photos, "VIDEO" for videos
- **Captions**: Keep them under 50 characters for best display

## Alternative: Use Instagram Embed

If you prefer, you can also use Instagram's official embed feature by replacing the Instagram section in `index.html` with:

```html
<div class="instagram-section">
  <div class="section-head">
    <div class="instagram-header">
      <div class="instagram-icon">
        <i class="fab fa-instagram"></i>
      </div>
      <h2>Latest Posts</h2>
    </div>
  </div>
  <div class="instagram-embeds">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/YOUR_POST_ID_1/" data-instgrm-version="14"></blockquote>
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/YOUR_POST_ID_2/" data-instgrm-version="14"></blockquote>
  </div>
</div>
```

And add this script before closing `</body>`:
```html
<script async src="//www.instagram.com/embed.js"></script>
```

## Testing

After updating the JSON file:
1. Save the file
2. Refresh your website at `http://localhost:8080/?bypass=1`
3. Check the browser console (F12) for any errors
4. The posts should update automatically
