# 🎯 Ayubi aka System

> A personal dashboard for tracking habits, water intake, finances, and journal entries with a clean, organized codebase and dark minimal design.

![Ayubi aka System](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🌙 **Dark Minimal Theme** - Permanent dark blue/black design
- 🇺🇸 **English Only** - Clean, focused interface
- 📱 **Fully Responsive** - Works perfectly on desktop and mobile
- 💾 **Local Storage** - All data persists locally, no external dependencies
- 🎨 **Smooth Animations** - Beautiful Framer Motion transitions
- 🔧 **Clean Architecture** - Well-organized, maintainable code

### Core Pages
- **🏠 Home** - Dashboard overview with stats and quick actions
- **📅 Routine** - Habit tracking with completion rates and progress
- **💧 Water** - Daily water intake tracking with customizable goals
- **💰 Finance** - Income/expense tracking with budgets and categories
- **📝 Journal** - Personal notes and thoughts with tags and search
- **⚙️ Settings** - App configuration, data export/import, and preferences

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

## 🏗️ Architecture

### File Structure
```
/src
  /components          # Reusable UI components
    Button.jsx         # Button component with variants
    Card.jsx           # Card components (base, stat, action)
    Navbar.jsx         # Navigation bar with mobile support
    ProgressBar.jsx    # Animated progress indicators
    HabitItem.jsx      # Habit display and management
    FinanceItem.jsx    # Financial entry display
    WaterTracker.jsx   # Water intake tracking widget
    JournalEditor.jsx  # Rich journal entry editor
  
  /pages              # Main application pages
    Home.jsx          # Dashboard with overview
    Routine.jsx       # Habit tracking page
    Water.jsx         # Water intake tracking
    Finance.jsx       # Financial management
    Journal.jsx       # Journal entries
    Settings.jsx      # App configuration
  
  /hooks              # Custom React hooks
    useLocalStorage.js # Local storage persistence
    useHabits.js      # Habit management logic
    useFinance.js     # Financial tracking logic
    useWater.js       # Water tracking logic
    useJournal.js     # Journal management logic
  
  /data               # Static data and constants
    constants.js      # App constants, colors, categories
  
  /utils              # Utility functions
    cn.js            # Class name utility
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

## 📊 Features Overview

### 🎯 Habit Tracking
- Add, edit, and delete daily habits
- Visual progress tracking with completion rates
- Default habit suggestions
- Daily reset functionality

### 💧 Water Intake
- Track daily water consumption
- Customizable daily goals (500ml - 10L)
- Quick add buttons (250ml, 500ml, 1L)
- Visual progress indicators
- Goal achievement celebrations

### 💰 Financial Management
- Track income and expenses
- Category-based organization
- Daily spending limits with alerts
- Monthly summaries and trends
- Currency support (UZS default)

### 📝 Journal System
- Rich text entries with titles and content
- Tag-based organization
- Search functionality
- Edit and delete capabilities
- Date-based sorting

### ⚙️ Settings & Data
- Export/import all data as JSON
- Customizable water goals and spending limits
- Complete data reset functionality
- Clean, minimal settings interface

## 🧠 Technical Details

### State Management
- **Local Storage**: All data persists in browser
- **Custom Hooks**: Clean separation of business logic
- **No External Dependencies**: Self-contained state management

### Performance
- **Code Splitting**: Route-based optimization
- **Optimized Animations**: Smooth Framer Motion transitions
- **Minimal Bundle**: Tree-shaking for unused code

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: WCAG AA compliant

## 📱 Mobile Support

- **Responsive Design**: Mobile-first approach
- **Touch Friendly**: Proper touch targets (44px min)
- **Mobile Navigation**: Collapsible menu for small screens
- **PWA Ready**: Can be installed as app

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

## 📄 Data Structure

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

## 🎯 Future Enhancements

- [ ] Supabase integration for cloud sync
- [ ] Advanced analytics and charts
- [ ] Habit streak tracking
- [ ] Goal setting and tracking
- [ ] Social features (sharing achievements)
- [ ] Dark/light theme toggle
- [ ] Multiple language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ayubi aka**
- GitHub: [@mrAyubkhon](https://github.com/mrAyubkhon)

---

**Built with ❤️ by Ayubi aka**

*Clean code, organized structure, minimal design.*

---

## 🚀 Live Demo

Visit the live demo: [https://mrAyubkhon.github.io/aboutme](https://mrAyubkhon.github.io/aboutme)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

![Made with React](https://img.shields.io/badge/Made%20with-React-blue)
![Made with TailwindCSS](https://img.shields.io/badge/Made%20with-TailwindCSS-38B2AC)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red)