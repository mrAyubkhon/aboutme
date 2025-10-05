# 🎯 Ayubi aka System - Clean Code Version

A personal dashboard for tracking habits, water intake, finances, and journal entries with a clean, organized codebase and dark minimal design.

## ✨ Features

- 🌙 **Dark Minimal Theme** - Permanent dark blue/black design
- 🇺🇸 **English Only** - No language switching, clean interface
- 📱 **Fully Responsive** - Works on desktop and mobile
- 💾 **Local Storage** - All data persists locally
- 🎨 **Clean Animations** - Smooth Framer Motion transitions

### Core Pages
- **Home** - Dashboard overview with stats and quick actions
- **Routine** - Habit tracking with completion rates
- **Water** - Daily water intake tracking with goals
- **Finance** - Income/expense tracking with budgets
- **Journal** - Personal notes and thoughts
- **Settings** - App configuration and data management

## 🏗️ Clean Architecture

### File Structure
```
/src
  /components          # Reusable UI components
    Button.jsx         # Button component with variants
    Card.jsx           # Card components (base, stat, action)
    Navbar.jsx         # Navigation bar
    ProgressBar.jsx    # Progress indicators
    HabitItem.jsx      # Habit display component
    FinanceItem.jsx    # Finance entry component
    WaterTracker.jsx   # Water tracking component
    JournalEditor.jsx  # Journal editing component
  
  /pages              # Main application pages
    Home.jsx          # Dashboard home page
    Routine.jsx       # Habit tracking page
    Finance.jsx       # Financial tracking page
    Journal.jsx       # Journal entries page
    Settings.jsx      # Settings page
  
  /hooks              # Custom React hooks
    useLocalStorage.js # Local storage persistence
    useHabits.js      # Habit management logic
    useFinance.js     # Finance management logic
    useWater.js       # Water tracking logic
    useJournal.js     # Journal management logic
  
  /context            # React context (if needed)
    AppContext.jsx    # Global application state
  
  /data               # Static data and constants
    constants.js      # App constants, colors, categories
  
  /utils              # Utility functions
    cn.js            # Class name utility
  
  App.jsx             # Main app component
  main.jsx           # App entry point
  index.css          # Global styles
```

### Design System

#### Color Palette
- **Background**: `#0a0a0a` (true black)
- **Cards**: `#111827` (dark navy)
- **Borders**: `#1f2937` (subtle gray)
- **Accent**: `#2563eb` (bright blue)
- **Text**: `#f9fafb` (primary), `#9ca3af` (secondary)

#### Typography
- **Font**: Inter (clean, modern)
- **Weights**: 400 (normal), 500 (medium), 700 (bold)

#### Components
- **Rounded corners**: `rounded-xl` (12px)
- **Shadows**: Subtle with hover effects
- **Transitions**: 200ms duration for smooth interactions
- **Animations**: Framer Motion for enhanced UX

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/mrAyubkhon/aboutme.git
cd aboutme

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🧠 Technical Details

### State Management
- **Local Storage**: All data persists in browser
- **Custom Hooks**: Clean separation of logic
- **No External State**: No Redux/Zustand needed for this scope

### Performance
- **Code Splitting**: React.lazy for route-based splitting
- **Optimized Images**: WebP format with fallbacks
- **Minimal Bundle**: Tree-shaking for unused code

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: WCAG AA compliant

## 📊 Data Structure

### Habits
```javascript
{
  id: string,
  name: string,
  completed: boolean,
  createdAt: string
}
```

### Water Tracking
```javascript
{
  current: number,    // ml consumed today
  goal: number,       // daily goal in ml
  lastReset: string   // date string for daily reset
}
```

### Finance
```javascript
{
  entries: [{
    id: string,
    type: 'income' | 'expense',
    amount: number,
    category: string,
    note: string,
    date: string
  }],
  dailyLimit: number,
  currency: string
}
```

### Journal
```javascript
[{
  id: string,
  title: string,
  content: string,
  tags: string[],
  createdAt: string,
  updatedAt: string
}]
```

## 🎨 Customization

### Adding New Features
1. Create component in `/components`
2. Add hook logic in `/hooks`
3. Update constants in `/data/constants.js`
4. Add route in `App.jsx`

### Styling Changes
- Colors: Update `tailwind.config.js`
- Components: Modify CSS classes in components
- Global styles: Edit `src/index.css`

## 📱 Mobile Support

- **Responsive Design**: Mobile-first approach
- **Touch Friendly**: Proper touch targets (44px min)
- **Mobile Navigation**: Collapsible menu for small screens
- **PWA Ready**: Can be installed as app

## 🔧 Development

### Code Style
- **ESLint**: Configured for React best practices
- **Prettier**: Automatic code formatting
- **Comments**: Clear documentation for complex logic
- **Naming**: Descriptive variable and function names

### Git Workflow
- **Feature Branches**: One feature per branch
- **Clean Commits**: Descriptive commit messages
- **Code Review**: Peer review for quality

## 🎯 Future Enhancements

- [ ] Supabase integration for cloud sync
- [ ] Export data functionality
- [ ] Advanced analytics and charts
- [ ] Habit streak tracking
- [ ] Goal setting and tracking
- [ ] Social features (sharing achievements)

## 📄 License

MIT License - feel free to use this project for personal or commercial use.

---

**Built with ❤️ by Ayubi aka**

*Clean code, organized structure, minimal design.*
