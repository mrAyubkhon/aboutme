# 🌟 Ayubi aka System

A beautiful, minimalistic personal dashboard designed for discipline and balance. Track your habits, manage finances, stay hydrated, and capture your thoughts - all in one elegant interface.

![Ayubi aka System](https://img.shields.io/badge/React-18.2.0-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-cyan) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.16.16-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🏠 **Home Dashboard**
- Personalized greeting based on time of day
- Overview cards showing water intake, budget status, habits completion
- Quick action buttons for adding expenses, income, notes, and water
- Recent journal entries preview
- Motivational messages and daily quotes
- Productivity score calculation

### 🕒 **Routine Tracker**
- Add, edit, and delete daily habits
- Visual progress tracking with circular progress bars
- Habit completion streaks
- Daily reset functionality
- Pre-built habit suggestions
- Completion rate statistics

### 💧 **Water Tracker**
- Beautiful animated water wave progress display
- Quick add buttons (250ml, 500ml, 1L)
- Customizable daily water goals
- Weekly overview with historical data
- Hydration tips and achievement badges
- Automatic daily reset

### 💸 **Finance Helper**
- Add income and expense transactions
- Daily budget tracking with visual progress
- Category-based expense organization
- Interactive charts (weekly spending, category breakdown)
- Budget alerts when over limit
- Monthly financial summaries

### 💭 **Journal/Thoughts**
- Rich text journal entries with titles and tags
- Search and filter functionality
- Entry statistics and insights
- Markdown-style content support
- Edit and delete entries
- Export/import capabilities

### ⚙️ **Settings**
- Light/Dark/Auto theme switching
- Multi-language support (English, Uzbek, Russian)
- Customizable goals and limits
- Data export/import functionality
- Complete data reset option
- Profile customization

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/mrAyubkhon/aboutme.git
   cd aboutme
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see your dashboard!

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Styling**: TailwindCSS 3.3.6
- **Animations**: Framer Motion 10.16.16
- **Charts**: Recharts 2.8.0
- **Icons**: Lucide React 0.294.0
- **Date Handling**: date-fns 2.30.0
- **Routing**: React Router DOM 6.20.1

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.jsx       # Navigation bar with theme toggle
│   ├── Card.jsx         # Card components and variants
│   ├── ProgressBar.jsx  # Progress bars and circular progress
│   ├── HabitItem.jsx    # Habit tracking components
│   ├── FinanceCard.jsx  # Financial transaction components
│   └── WaterTracker.jsx # Water intake tracking
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.js # LocalStorage management hooks
│   └── useStats.js      # Statistics and insights hooks
├── pages/               # Main application pages
│   ├── Home.jsx         # Dashboard overview
│   ├── Routine.jsx      # Habit tracking page
│   ├── Water.jsx        # Water intake page
│   ├── Finance.jsx      # Financial management page
│   ├── Journal.jsx      # Journal/thoughts page
│   └── Settings.jsx     # Application settings
├── utils/               # Utility functions
│   └── cn.js           # Class name utility
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles and TailwindCSS
```

## 💾 Data Storage

The application uses **localStorage** for data persistence, ensuring your data stays with you. All data is stored locally in your browser with the following keys:

- `ayubi_habits` - Daily habits and completion status
- `ayubi_water` - Water intake data and goals
- `ayubi_finances` - Financial transactions and limits
- `ayubi_journal` - Journal entries and notes
- `ayubi_settings` - User preferences and settings

### Data Export/Import
- Export all your data as JSON from Settings
- Import previously exported data
- Complete data reset option available

## 🎨 Customization

### Themes
- **Light Mode**: Clean, minimal white interface
- **Dark Mode**: Elegant dark theme for low-light usage
- **Auto Mode**: Automatically follows system preference

### Languages
- English (default)
- O'zbekcha (Uzbek)
- Русский (Russian)

### Goals & Limits
- Customizable daily water intake goals (500ml - 10L)
- Adjustable daily spending limits
- Personal name and profile settings

## 📱 Responsive Design

The application is fully responsive and works beautifully on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🔧 Development

### Available Scripts

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

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## 🌐 Deployment

### Static Hosting (Recommended)
Deploy to any static hosting service:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions with the built files
- **Firebase Hosting**: `firebase deploy`

### Docker (Optional)
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

## 🎯 Usage Tips

### Getting Started
1. **Set your name** in Settings for personalized greetings
2. **Add some habits** to build your daily routine
3. **Set water goals** that match your lifestyle
4. **Configure daily budget** for expense tracking
5. **Start journaling** your thoughts and ideas

### Daily Workflow
1. Check your **Home dashboard** for today's overview
2. Complete your **habits** in the Routine section
3. Track **water intake** throughout the day
4. Log **expenses and income** as they occur
5. **Journal** your thoughts and reflections
6. Review your **progress** and adjust goals as needed

### Data Management
- **Export regularly** to backup your data
- Use **tags** in journal entries for better organization
- **Reset habits daily** to start fresh each day
- **Adjust goals** based on your progress and needs

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and patterns
- Add appropriate animations for new features
- Ensure responsive design for all screen sizes
- Test localStorage functionality thoroughly
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons
- **Recharts** for interactive charts

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/mrAyubkhon/aboutme/issues) page
2. Create a new issue with detailed information
3. Include screenshots for UI-related problems
4. Provide steps to reproduce any bugs

---

**Designed for discipline and balance. © Ayubi aka**

*Built with ❤️ for productivity and personal growth*
