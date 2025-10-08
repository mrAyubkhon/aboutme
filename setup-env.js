#!/usr/bin/env node

/**
 * Environment Setup Script for Ayubi Dashboard
 * This script helps set up the .env file for live API access
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

console.log('🔑 Ayubi Dashboard - Environment Setup');
console.log('=====================================\n');

console.log('This script will help you set up your .env file for live API access.\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupEnv() {
  try {
    console.log('📋 Step 1: Steam API Configuration');
    console.log('Get your Steam API key from: https://steamcommunity.com/dev/apikey\n');
    
    const steamApiKey = await askQuestion('Enter your Steam API key (or press Enter to skip): ');
    
    console.log('\n📋 Step 2: Faceit API Configuration');
    console.log('Get your Faceit API key from: https://developers.faceit.com/\n');
    
    const faceitApiKey = await askQuestion('Enter your Faceit API key (or press Enter to skip): ');
    
    console.log('\n📋 Step 3: Backend Configuration');
    const apiUrl = await askQuestion('Enter backend API URL (default: http://localhost:8000): ');
    
    // Create .env content
    const envContent = `# Steam API Configuration
VITE_STEAM_API_KEY=${steamApiKey || 'your_steam_api_key_here'}

# Faceit API Configuration  
VITE_FACEIT_API_KEY=${faceitApiKey || 'your_faceit_api_key_here'}

# Backend Configuration
VITE_API_URL=${apiUrl || 'http://localhost:8000'}
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ .env file created successfully!');
    console.log(`📁 Location: ${envPath}`);
    
    if (steamApiKey && faceitApiKey) {
      console.log('\n🎉 Live API mode is ready!');
      console.log('Restart your development server to load the new environment variables.');
    } else {
      console.log('\n⚠️  Some API keys are missing. You can edit the .env file later.');
    }
    
    console.log('\n📖 Next steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Go to Game Stats > Settings');
    console.log('3. Test your API connections');
    console.log('4. Enjoy live data from Steam and Faceit!');
    
  } catch (error) {
    console.error('❌ Error setting up environment:', error.message);
  } finally {
    rl.close();
  }
}

setupEnv();
