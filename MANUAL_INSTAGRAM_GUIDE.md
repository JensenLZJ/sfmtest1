# 📝 Manual Instagram Posts Guide

## 🎯 **Your Current System (Perfect for GitHub Pages!)**

You're using a **manual Instagram posts system** that works great with GitHub Pages. No server setup needed!

## 📋 **How to Add New Posts:**

### **Step 1: Post on Instagram**
1. Create your post on Instagram
2. Publish it to your account

### **Step 2: Get the Image URL**
1. **Go to your Instagram post** (e.g., `https://www.instagram.com/p/DO0d4jRktgm/`)
2. **Right-click on the image** → **"Inspect Element"**
3. **Find the `<img>` tag** in the developer tools
4. **Copy the `src` URL** - it will look like:
   ```
   https://instagram.fkul6-4.fna.fbcdn.net/v/t51.2885-15/552514804_17962043480989085_381679216213067004_n.heic?stp=dst-jpg_e35_tt6&efg=...
   ```

### **Step 3: Get the Post Link**
1. **Copy the Instagram post URL** (e.g., `https://www.instagram.com/p/DO0d4jRktgm/`)

### **Step 4: Update `custom-posts.json`**
1. **Open `custom-posts.json`** in any text editor
2. **Add your new post** to the `posts` array:

```json
{
  "posts": [
    {
      "id": "1",
      "title": "Your Post Title",
      "content": "Your post description with emojis! 🎵",
      "image": "https://instagram.fkul6-4.fna.fbcdn.net/v/t51.2885-15/552514804_17962043480989085_381679216213067004_n.heic?stp=dst-jpg_e35_tt6&efg=...",
      "link": "https://www.instagram.com/p/DO0d4jRktgm/",
      "date": "2024-12-18T10:00:00.000Z"
    }
  ]
}
```

### **Step 5: Save & Refresh**
1. **Save the file**
2. **Refresh your website**
3. **New post appears instantly!**

## 🎨 **Post Properties Explained:**

- **`id`**: Unique identifier (use numbers: 1, 2, 3, etc.)
- **`title`**: Post title (appears in bold)
- **`content`**: Post description (supports emojis! 🎵)
- **`image`**: Real Instagram image URL (from Step 2)
- **`link`**: Instagram post URL (from Step 3)
- **`date`**: When the post was created (ISO format)

## 📅 **Date Format:**

Use this format: `YYYY-MM-DDTHH:MM:SS.000Z`

**Examples:**
- Today: `2024-12-18T10:00:00.000Z`
- Yesterday: `2024-12-17T15:30:00.000Z`
- Last week: `2024-12-11T20:15:00.000Z`

## 🎯 **Pro Tips:**

✅ **Keep it simple** - 2-4 posts work best  
✅ **Use emojis** - They make posts more engaging! 🎵📻🔥  
✅ **Real Instagram images** - Use your actual post images  
✅ **Recent dates** - Newer posts appear first  
✅ **Test links** - Make sure your links work  

## 🔄 **Quick Update Process:**

1. **Post on Instagram** → New content
2. **Get image URL** → Right-click image → Inspect → Copy `src`
3. **Get post link** → Copy the Instagram post URL
4. **Update JSON file** → Add new post
5. **Save & refresh** → New post appears!

## 📱 **Mobile Method:**

1. **Open Instagram in mobile browser**
2. **Go to your post**
3. **Long-press the image**
4. **Select "Copy image address"**
5. **Use that URL in your JSON file**

---

**This manual system works perfectly with GitHub Pages and gives you full control over your content!** 🎉

