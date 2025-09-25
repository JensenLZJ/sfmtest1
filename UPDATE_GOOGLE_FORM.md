# Update Your Google Form

## 🌐 Add Language Field to Google Form

You need to add a language selection field to your Google Form to match the new form on your website.

### Steps:

1. **Go to your Google Form**: [Open Form](https://docs.google.com/forms/d/e/1FAIpQLScX3OJO3z3e8hEEwaZmdkc9Kk-LeZC82Jf3gof13E9OlG0YEw/edit)

2. **Add a new question**:
   - Click the **"+"** button to add a new question
   - Select **"Multiple choice"** as the question type
   - Set the question text to: **"Language Preference"**
   - Add these options:
     - **English**
     - **Bahasa Malaysia**
   - Make it **Required**
   - Position it after "Your Name" and before "Message"

3. **Get the new entry ID**:
   - Click the three dots (⋮) → **"Get pre-filled link"**
   - Fill in sample data including the new language field
   - Click **"Get link"**
   - Copy the URL and use the entry ID extractor tool

4. **Update the code**:
   - Find the entry ID for the language field (it will look like `entry.1234567890`)
   - Replace `entry.LANGUAGE_ID` in your `request.html` file with the actual entry ID

### Current Form Structure:
1. Song Title ✅
2. Artist ✅  
3. Your Name ✅
4. **Language Preference** ← **ADD THIS**
5. Message ✅
6. Contact ✅

### After adding the field, your form will look like:
```
Song Title: [text input]
Artist: [text input]  
Your Name: [text input]
Language Preference: [English / Bahasa Malaysia] ← NEW
Message: [text area]
Contact: [text input]
```

Once you've added the field and gotten the entry ID, let me know and I'll update the code with the correct entry ID!
