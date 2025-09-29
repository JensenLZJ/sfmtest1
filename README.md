# 🎵 SamudraFM Radio Station Website

A modern, responsive website for SamudraFM radio station featuring live streaming, schedule management, and social media integration.

## ✨ Features

- 🎧 **Live Audio Player** - Mixcloud integration with custom controls
- 📅 **Dynamic Schedule** - Google Calendar integration for real-time events
- 📱 **Instagram Feed** - Latest posts from official Instagram account
- 📱 **Mobile Responsive** - Optimized for all devices
- 🔐 **Secure API Integration** - GitHub Repository secrets for API keys
- ⚡ **Fast Loading** - Optimized performance and caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- GitHub Repository with secrets configured

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/samudrafm-website.git
cd samudrafm-website

# Install dependencies
npm install

# Start the server
npm start
```

### Environment Setup
The application uses GitHub Repository secrets for API configuration:
- `MY_INSTAGRAM_API` - Instagram access token
- `MY_INSTAGRAM_APP_ID` - Instagram app ID
- `MY_INSTAGRAM_APP_SECRET` - Instagram app secret
- `MY_CALENDAR_API` - Google Calendar API key
- `MY_SHEET_API` - Google Sheets API key

## 📁 Project Structure

```
samudrafm-website/
├── server.js              # Main server with API endpoints
├── index.html             # Homepage
├── schedule.html          # Schedule page
├── episodes.html          # Episodes page
├── listen.html            # Listen page
├── about.html             # About page
├── contact.html           # Contact page
├── opportunities.html     # Job opportunities
├── script.js              # Frontend JavaScript
├── styles.css             # Main stylesheet
├── assets/                # Images and media
│   ├── avatar/            # Presenter avatars
│   └── brandmark/         # Logo files
└── .github/workflows/     # GitHub Actions
```

## 🔧 API Endpoints

- `GET /api/health` - Server health check
- `GET /api/instagram` - Instagram posts
- `GET /api/calendar` - Google Calendar events

## 🌐 Deployment

### GitHub Pages (Static)
- Automatic deployment on push to main branch
- Free hosting with custom domain support

### VPS/Cloud Server
- Full Node.js server with API endpoints
- Environment variables for API keys
- Production-ready with error handling

## 🛡️ Security

- ✅ No API keys in source code
- ✅ GitHub Repository secrets for production
- ✅ Content Security Policy (CSP) headers
- ✅ Secure API proxy endpoints

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly player controls
- Optimized mobile navigation
- Fast loading on mobile networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Jensen Lim Zi Jen** - SamudraFM Development Team

---

🎵 **SamudraFM** - Your study, your music.