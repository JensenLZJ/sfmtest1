# Quick Instagram Update Guide for SamudraFM

## 🚀 How to Add Your Real Instagram Posts

### Step 1: Get Your Instagram Post URLs
1. Go to [https://www.instagram.com/samudrafm/](https://www.instagram.com/samudrafm/)
2. Click on any post you want to feature
3. Copy the URL from your browser (looks like: `https://www.instagram.com/p/ABC123/`)

### Step 2: Get Post Images
1. Right-click on the post image
2. Select "Copy image address" or "Copy image URL"
3. The URL will look like: `https://scontent-xxx.cdninstagram.com/v/...`

### Step 3: Update the JSON File
1. Open `instagram-posts.json` in your code editor
2. Replace the placeholder URLs with your real ones
3. Update the captions with your actual post text

### Example Update:
```json
{
  "posts": [
    {
      "id": "1",
      "media_type": "IMAGE",
      "media_url": "https://scontent-xxx.cdninstagram.com/v/your-real-image-url.jpg",
      "permalink": "https://www.instagram.com/p/your-real-post-id/",
      "caption": "Your actual post caption from Instagram...",
      "timestamp": "2025-01-27T12:00:00Z",
      "username": "samudrafm"
    }
  ]
}
```

### Step 4: Test
1. Save the `instagram-posts.json` file
2. Refresh your website at `http://localhost:8080/?bypass=1`
3. Your real posts should now appear!

## 📱 Alternative: Use Instagram Embeds (Easier)

If you prefer, I can set up Instagram embeds instead, which automatically shows your latest posts without manual updates.

## 🎯 Current Status
- ✅ Updated with SamudraFM-themed content
- ✅ All links point to your Instagram page
- ✅ Ready for your real post URLs
- ✅ Mobile responsive design

Your website will now show more relevant content while you add your real Instagram posts!
