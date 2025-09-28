# SamudraFM Local Server

This setup allows you to run your SamudraFM website locally at `http://127.0.0.1:8000/` for development and testing.

## 🚀 Quick Start

### Option 1: Python Server (Recommended)
```bash
python start_server.py
```

### Option 2: Node.js Server
```bash
npm start
# or
node server.js
```

### Option 3: Windows Batch File
Double-click `start_server.bat`

## 📋 Prerequisites

### For Python Server:
- Python 3.x installed
- No additional packages required

### For Node.js Server:
- Node.js installed
- Run `npm install` first (if needed)

## 🌐 Access Your Website

Once the server starts, open your browser and go to:
- **Main site**: http://127.0.0.1:8000/
- **Request page**: http://127.0.0.1:8000/request.html

## 🔧 Features

- ✅ **CORS Headers**: For API testing
- ✅ **Proper MIME Types**: JavaScript, CSS, HTML files
- ✅ **Auto Browser Open**: Opens automatically
- ✅ **Error Handling**: 404 and 500 error pages
- ✅ **Cross-Platform**: Works on Windows, Mac, Linux

## 🐛 Debugging

With the local server running, you can:
1. **Test Google Calendar API**: No CORS issues
2. **Debug Console**: Check browser console for errors
3. **Live Reload**: Refresh browser to see changes
4. **Network Tab**: Monitor API calls in DevTools

## ⏹️ Stop Server

Press `Ctrl+C` in the terminal to stop the server.

## 📁 File Structure

```
sfmtest1/
├── start_server.py      # Python server
├── server.js            # Node.js server
├── start_server.bat     # Windows batch file
├── package.json         # Node.js dependencies
├── index.html           # Main page
├── request.html         # Request page
├── script.js            # Main JavaScript
├── styles.css           # Styles
└── images/              # Images folder
```

## 🎯 Next Steps

1. **Start the server** using one of the methods above
2. **Open http://127.0.0.1:8000/** in your browser
3. **Check the console** (F12) for Google Calendar API debugging
4. **Test the "Coming up" section** to see if calendar events load

Happy coding! 🎵📻
