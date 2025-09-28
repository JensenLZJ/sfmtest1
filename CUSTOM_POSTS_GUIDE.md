# 📝 Custom Posts Management Guide

## How to Add/Edit Posts

### 1. **Edit the `custom-posts.json` file**

Open `custom-posts.json` in any text editor and modify the posts array:

```json
{
  "posts": [
    {
      "id": "1",
      "title": "Your Post Title",
      "content": "Your post description with emojis! 🎵",
      "image": "https://your-image-url.com/image.jpg",
      "link": "https://your-link.com",
      "date": "2024-12-18T10:00:00.000Z"
    }
  ]
}
```

### 2. **Post Properties Explained**

- **`id`**: Unique identifier (use numbers: 1, 2, 3, etc.)
- **`title`**: Post title (appears in bold)
- **`content`**: Post description (supports emojis!)
- **`image`**: Image URL (use any image hosting service)
- **`link`**: Where to go when clicked (optional)
- **`date`**: When the post was created (ISO format)

### 3. **Image Sources**

**Free Image Options:**
- **Unsplash**: `https://images.unsplash.com/photo-[ID]?w=400&h=300&fit=crop&crop=center`
- **Pexels**: `https://images.pexels.com/photos/[ID]/pexels-photo-[ID].jpeg?w=400&h=300&fit=crop&crop=center`
- **Your own images**: Upload to any image hosting service

### 4. **Date Format**

Use this format: `YYYY-MM-DDTHH:MM:SS.000Z`

**Examples:**
- Today: `2024-12-18T10:00:00.000Z`
- Yesterday: `2024-12-17T15:30:00.000Z`
- Last week: `2024-12-11T20:15:00.000Z`

### 5. **Quick Tips**

✅ **Keep it simple**: 2-4 posts work best  
✅ **Use emojis**: They make posts more engaging! 🎵📻🔥  
✅ **Good images**: 400x300px works perfectly  
✅ **Recent dates**: Newer posts appear first  
✅ **Test links**: Make sure your links work  

### 6. **Example Post**

```json
{
  "id": "5",
  "title": "New Music Friday!",
  "content": "🎶 Fresh tracks just dropped! Check out our latest playlist featuring the hottest new releases! 🔥",
  "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
  "link": "https://www.instagram.com/samudrafm/",
  "date": "2024-12-18T14:30:00.000Z"
}
```

## 🚀 **How to Update**

1. Edit `custom-posts.json`
2. Save the file
3. Refresh your website
4. Your new posts will appear instantly!

## 📱 **Mobile Friendly**

Your posts will automatically look great on:
- Desktop computers
- Tablets
- Mobile phones

---

**Need help?** The posts will show fallback content if there are any issues with your JSON file!

