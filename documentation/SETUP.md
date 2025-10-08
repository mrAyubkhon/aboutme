# 🚀 Ayubi aka System - Complete Setup Guide

This guide will walk you through setting up and running the Ayubi aka System personal dashboard from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
  - Or install yarn: `npm install -g yarn`

## 🛠️ Installation Steps

### Step 1: Download/Clone the Project

**Option A: Direct Download**
1. Download the project files as a ZIP
2. Extract to your desired location
3. Open terminal/command prompt in the project directory

**Option B: Git Clone (if available)**
```bash
git clone <repository-url>
cd ayubi-aka-system
```

### Step 2: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

This will install all the dependencies listed in `package.json`:
- React 18.2.0
- TailwindCSS 3.3.6
- Framer Motion 10.16.16
- Recharts 2.8.0
- Lucide React 0.294.0
- And more...

### Step 3: Start the Development Server

```bash
# Using npm
npm run dev

# OR using yarn
yarn dev
```

The application will start and you should see output similar to:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 4: Open in Browser

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You should see the Ayubi aka System dashboard!

## 🎯 First Time Setup

### 1. Personalize Your Profile
- Click on **Settings** in the navigation
- Enter your name in the Profile section
- Choose your preferred theme (Light/Dark/Auto)
- Select your language (English/Uzbek/Russian)

### 2. Set Your Goals
- **Water Goal**: Set your daily water intake target (default: 3000ml)
- **Daily Budget**: Set your spending limit (default: $100,000)
- These can be adjusted anytime in Settings

### 3. Add Your First Habits
- Go to the **Routine** page
- Click "Add Habit" or choose from suggested habits:
  - Wake up early
  - Morning workout
  - Python coding
  - English practice
  - Arabic study
  - Read for 30 minutes
  - Study tickets

### 4. Start Tracking
- **Water**: Add water intake throughout the day
- **Finance**: Log expenses and income as they occur
- **Journal**: Write your thoughts and ideas
- **Habits**: Check off completed habits daily

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📱 Browser Compatibility

The application works on all modern browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🗂️ File Structure Overview

```
ayubi-aka-system/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Main application pages
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # TailwindCSS configuration
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation
```

## 💾 Data Storage

Your data is stored locally in your browser using localStorage. No external servers or databases required!

**Data Keys:**
- `ayubi_habits` - Your daily habits
- `ayubi_water` - Water intake tracking
- `ayubi_finances` - Financial transactions
- `ayubi_journal` - Journal entries
- `ayubi_settings` - Your preferences

## 🔄 Data Backup & Restore

### Export Your Data
1. Go to **Settings** → **Data Management**
2. Click **Export Data**
3. Download the JSON file to backup your data

### Import Your Data
1. Go to **Settings** → **Data Management**
2. Click **Import Data**
3. Select your previously exported JSON file
4. Refresh the page to see your restored data

## 🚀 Production Deployment

### Option 1: Static Hosting (Recommended)

**Build the project:**
```bash
npm run build
```

**Deploy to Vercel:**
```bash
npx vercel --prod
```

**Deploy to Netlify:**
1. Drag and drop the `dist` folder to Netlify
2. Your site will be live instantly!

**Deploy to GitHub Pages:**
1. Build the project
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Option 2: Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t ayubi-aka-system .
docker run -p 80:80 ayubi-aka-system
```

## 🐛 Troubleshooting

### Common Issues

**1. Port 3000 is already in use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

**2. Node modules issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. Build errors**
```bash
# Clear Vite cache
rm -rf .vite
npm run build
```

**4. Styling issues**
- Ensure TailwindCSS is properly configured
- Check if `index.css` imports TailwindCSS
- Verify `tailwind.config.js` is present

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Ensure all dependencies are installed
3. Verify Node.js version compatibility
4. Try clearing browser cache and localStorage

## 🎨 Customization

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Create custom hooks in `src/hooks/`
4. Update routing in `src/App.jsx`

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- Use TailwindCSS classes for component styling

### Data Structure
- Modify hooks in `src/hooks/useLocalStorage.js`
- Update localStorage keys as needed
- Maintain backward compatibility for existing data

## 📚 Next Steps

Once you have the application running:

1. **Explore all features** - Try each page and functionality
2. **Customize settings** - Adjust themes, languages, and goals
3. **Start tracking** - Begin logging your habits, water, and finances
4. **Set up backup** - Export your data regularly
5. **Share feedback** - Help improve the application

## 🎉 You're All Set!

Your Ayubi aka System is now ready to help you stay disciplined and balanced. Start building better habits, managing your finances, staying hydrated, and capturing your thoughts!

---

**Need help?** Check the main README.md for detailed feature documentation and usage tips.

**Happy tracking! 🚀**
