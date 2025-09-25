# Google Forms & Sheets Integration Setup Guide

## 🎯 Overview
Your request page now uses a **custom UI** that submits data directly to Google Forms via their API. This approach is more reliable and gives you better control over the user experience.

## 📋 Setup Steps

### 1. Create Google Form
1. Go to [Google Forms](https://forms.google.com)
2. Create a new form with these fields:
   - **Song Title** (Short answer, Required)
   - **Artist** (Short answer, Required) 
   - **Your Name** (Short answer, Optional)
   - **Message/Dedication** (Paragraph, Optional)
   - **Contact Info** (Short answer, Optional)
3. Make sure the form is **public** (Anyone with the link can respond)
4. Copy the form ID from the URL
5. The URL will look like: `https://docs.google.com/forms/d/e/1ABC123DEF456GHI789JKL/viewform`
6. Copy the part between `/e/` and `/viewform`: `1ABC123DEF456GHI789JKL`

### 2. Create Google Sheets
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Add these column headers in row 1:
   - **A1**: Timestamp
   - **B1**: Song Title
   - **C1**: Artist
   - **D1**: Requester Name
4. Copy the spreadsheet ID from the URL
5. The URL will look like: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
6. Copy the part between `/d/` and `/edit`: `1ABC123DEF456GHI789JKL`

### 3. Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key

### 4. Get Form Entry IDs
1. Go to your Google Form and click the three dots (⋮) in the top-right
2. Select "Get pre-filled link"
3. Fill in sample data and click "Get link"
4. Copy the generated URL and look for `entry.` parameters in the URL
5. The entry IDs will look like `entry.1234567890`

### 5. Update Your Website
In `request.html`, find these lines and replace with your actual IDs:

```javascript
const GOOGLE_FORM_ID = 'YOUR_FORM_ID'; // Replace with your Google Form ID
const GOOGLE_SHEETS_ID = 'YOUR_SHEETS_ID'; // Replace with your Google Sheets ID  
const GOOGLE_SHEETS_API_KEY = 'YOUR_API_KEY'; // Replace with your Google Sheets API key
```

Then find the `submitToGoogleFormsAPI` function and replace the entry IDs:

```javascript
googleFormData.append('entry.1234567890', data.songTitle); // Replace with actual entry ID
googleFormData.append('entry.1234567891', data.artist);    // Replace with actual entry ID
googleFormData.append('entry.1234567892', data.yourName);  // Replace with actual entry ID
googleFormData.append('entry.1234567893', data.message);   // Replace with actual entry ID
googleFormData.append('entry.1234567894', data.contact);   // Replace with actual entry ID
```

### 5. Connect Form to Sheets (Optional)
To automatically save form submissions to your sheet:
1. In your Google Form, click the **Responses** tab
2. Click the **Google Sheets** icon (green square)
3. Select "Create a new spreadsheet" or "Select existing spreadsheet"
4. This will automatically save all form responses to your sheet

## 🔧 How It Works

### Form Submission
- **Custom UI**: Beautiful, responsive form that matches your brand
- **Direct API**: Submits data directly to Google Forms via their API
- **Loading States**: Shows spinner and disables button during submission
- **Error Handling**: Displays user-friendly error messages
- **Data Flow**: Custom Form → Google Forms API → Google Sheets (if connected)

### Recent Requests Display
- **Primary**: Fetches data from Google Sheets API
- **Fallback**: Shows mock data if API fails or not configured
- **Auto-refresh**: Updates every time the page loads

## 🎨 Features

### Custom Form Integration
- ✅ Beautiful custom UI that matches your brand
- ✅ Direct API submission to Google Forms
- ✅ Loading states with spinner animation
- ✅ Error handling with user-friendly messages
- ✅ Responsive design for all devices

### Google Sheets Integration  
- ✅ Real-time data fetching
- ✅ Automatic time formatting ("2 hours ago")
- ✅ Error handling with fallback data
- ✅ Shows last 5 requests

### User Experience
- ✅ Loading states with spinners
- ✅ Smooth transitions
- ✅ Mobile responsive
- ✅ Consistent with your brand

## 🚀 Testing

1. **Test Form**: Submit a request through the embedded form
2. **Check Sheets**: Verify data appears in your Google Sheet
3. **Test Fallback**: Disable JavaScript to see fallback form
4. **Test API**: Check browser console for any API errors

## 🔒 Security Notes

- API key is visible in client-side code (this is normal for public data)
- Consider restricting API key to your domain in Google Cloud Console
- Form submissions go directly to Google (secure)

## 📱 Mobile Support

- Google Form iframe is fully responsive
- Fallback form works on all devices
- Recent requests display properly on mobile

## 🎵 Ready to Use!

Once you've updated the IDs in the code, your request page will:
- Show your custom Google Form
- Display real recent requests from your sheet
- Fall back gracefully if anything fails
- Look beautiful on all devices

**Need help?** Check the browser console for any error messages!
