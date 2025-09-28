// Setup script to create .env file from GitHub secrets
// Run this script to set up environment variables for local development

const fs = require('fs');

// Create .env file template
const envTemplate = `# Instagram API Configuration
# Replace these with your actual values or set them as environment variables
MY_INSTAGRAM_API=your_instagram_access_token_here
MY_INSTAGRAM_APP_ID=your_instagram_app_id_here
MY_INSTAGRAM_APP_SECRET=your_instagram_app_secret_here

# For production deployment, these will be automatically set from GitHub secrets
`;

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', envTemplate);
  console.log('✅ Created .env file template');
  console.log('📝 Please edit .env file with your actual Instagram API credentials');
} else {
  console.log('ℹ️  .env file already exists');
}

console.log('\n🚀 To use GitHub secrets in production:');
console.log('1. Set up GitHub Actions workflow');
console.log('2. Use secrets in your deployment environment');
console.log('3. The api-server.js will automatically use environment variables');
