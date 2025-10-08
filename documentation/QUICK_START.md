# 🚀 Quick Start Guide

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Step 1: Clone the Repository
```bash
git clone https://github.com/mrAyubkhon/aboutme.git
cd aboutme
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Start Development Server
```bash
npm run dev
# or
yarn dev
```

### Step 4: Open in Browser
Open your browser and navigate to:
- **Local**: http://localhost:5173
- Or the URL shown in your terminal

---

## 🎯 First Time Setup

### 1. **Add Your First Habit**
- Navigate to **Routine** page
- Click "Add New Habit" button
- Enter habit name (e.g., "Morning Exercise")
- Press Enter or click Add

### 2. **Set Water Goal**
- Go to **Settings** page
- Find "Water Goal Settings"
- Enter your daily target (e.g., 3000ml)
- Click "Save Goal"

### 3. **Configure Spending Limit**
- Stay on **Settings** page
- Find "Daily Spending Limit"
- Enter your budget (e.g., 100000 UZS)
- Click "Set Limit"

### 4. **Test All Features**
- ✅ Mark a habit as complete
- 💧 Add water (250ml increments)
- 💰 Add a financial entry
- 📝 Write a journal entry

---

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start dev server (port 5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

---

## 🌐 Access Your App

### Local Development
- **URL**: http://localhost:5173
- **Hot Reload**: Changes appear instantly
- **Dev Tools**: React DevTools available

### Production Build
```bash
npm run build        # Creates dist/ folder
npm run preview      # Preview production build
```

---

## 📱 Features to Try

### 1. **Habit Tracking** 
- Add daily habits
- Mark as complete with satisfying animation
- View progress percentage
- Delete or edit habits

### 2. **Water Intake**
- Add water in 250ml increments
- Track daily progress
- See visual progress bar
- Celebrate when goal reached

### 3. **Finance Management**
- Add income entries
- Track expenses by category
- Set daily spending limits
- View monthly summary

### 4. **Journal & Thoughts**
- Create new entries with titles
- Add tags for organization
- Search through entries
- Edit or delete entries

---

## 🎨 UI Features

### Animations
- ✨ **Spring Physics**: Realistic motion
- 🎭 **3D Effects**: Depth and perspective
- 🎯 **Micro-interactions**: Hover and click effects
- 🎉 **Celebrations**: Success animations

### Sound Effects
- 🔊 Click sounds for buttons
- 💧 Water drop sounds
- ✅ Success chimes
- 🎵 Completion celebrations

### Visual Effects
- 🌊 Ripple effects on clicks
- ✨ Particle systems for achievements
- 🎨 Gradient animations
- 💫 Smooth transitions

---

## ⌨️ Keyboard Shortcuts

### Global
- **Tab** - Navigate between elements
- **Enter** - Submit forms
- **Escape** - Close modals
- **Ctrl/Cmd + S** - Save (where applicable)

### Page-Specific
- **Space** - Toggle habit (when focused)
- **Delete** - Remove item (with confirmation)
- **Ctrl/Cmd + N** - New entry (Finance/Journal)
- **Ctrl/Cmd + F** - Search (Journal)

---

## 💾 Data Management

### Your Data
- All data saved locally in browser
- No server required
- Privacy-focused design
- Works offline

### Backup & Restore
1. Go to **Settings** page
2. Click **"Export All Data"**
3. Save the JSON file
4. To restore: Click **"Import Data"** and select file

### Reset Data
1. Go to **Settings** page
2. Click **"Reset All Data"**
3. Confirm the action
4. All data will be cleared

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Try different port
npm run dev -- --port 3000
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Browser Issues
- Clear browser cache (Ctrl/Cmd + Shift + Delete)
- Try incognito/private mode
- Update to latest browser version
- Check console for errors (F12)

---

## 📚 Documentation

- **[README.md](./README.md)** - Project overview
- **[COMPLETE_SITE_DOCUMENTATION.md](./COMPLETE_SITE_DOCUMENTATION.md)** - Full documentation
- **[PHYSICS_IMPROVEMENTS.md](./PHYSICS_IMPROVEMENTS.md)** - Animation details
- **[MINI_IMPROVEMENTS.md](./MINI_IMPROVEMENTS.md)** - Component enhancements

---

## 🎉 You're Ready!

Your personal dashboard is now running! Start tracking your habits, water intake, finances, and thoughts with a beautiful, animated interface.

### Next Steps:
1. ✅ Add your daily habits
2. 💧 Set your water goal
3. 💰 Configure spending limit
4. 📝 Write your first journal entry

**Enjoy your productivity journey!** 🚀

---

<div align="center">
  
  **Questions?** Check the [documentation](./COMPLETE_SITE_DOCUMENTATION.md) or open an issue on GitHub.
  
  Made with ❤️ by Ayubi aka
  
</div>
