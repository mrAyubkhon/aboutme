# 🚀 Complete Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start Guide](#quick-start-guide)
3. [API Setup](#api-setup)
4. [Game Statistics Dashboard](#game-statistics-dashboard)
5. [Backend Integration](#backend-integration)
6. [Deployment Guide](#deployment-guide)
7. [Environment Setup](#environment-setup)
8. [Bug Fixes & Improvements](#bug-fixes--improvements)
9. [Technical Documentation](#technical-documentation)

---

## 🎯 Project Overview

This is a comprehensive personal dashboard application built with React, featuring multiple modules for habit tracking, water intake, finance management, journaling, travel planning, and game statistics.

### ✨ Key Features

- **Habit Tracking**: Daily habit management with progress visualization
- **Water Intake**: Hydration tracking with goals and statistics
- **Finance Management**: Income/expense tracking with budget management
- **Journal**: Personal journaling with rich text support
- **Travel Planning**: World map integration with wishlist functionality
- **Game Statistics**: Steam and Faceit API integration for gaming stats
- **Sport Module**: Comprehensive fitness and activity tracking

### 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL/SQLite
- **APIs**: Steam API, Faceit API, Weather API
- **Deployment**: Vercel (Frontend), Railway (Backend)

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+
- Python 3.9+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mrAyubkhon/aboutme.git
cd aboutme
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Create environment file**
```bash
# Create .env file in root directory
cp env-config .env
```

5. **Start development servers**
```bash
# Frontend (Terminal 1)
npm run dev

# Backend (Terminal 2)
cd backend
python main.py
```

### Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🔧 API Setup

### Steam API Configuration

1. **Get Steam API Key**
   - Visit [Steam Web API Key](https://steamcommunity.com/dev/apikey)
   - Enter your domain (localhost for development)
   - Copy the generated key

2. **Get Steam ID**
   - Visit [Steam ID Finder](https://steamid.io/)
   - Enter your Steam profile URL
   - Copy the Steam ID64

### Faceit API Configuration

1. **Get Faceit API Key**
   - Visit [Faceit Developer Portal](https://developers.faceit.com/)
   - Create a new application
   - Generate Bearer token

2. **Configure Environment Variables**
```env
VITE_STEAM_API_KEY=your_steam_api_key_here
VITE_FACEIT_API_KEY=your_faceit_api_key_here
VITE_STEAM_ID=your_steam_id_64
VITE_FACEIT_NICK=your_faceit_nickname
```

### API Endpoints

#### Steam API
- `GetPlayerSummaries` - Player profile information
- `GetRecentlyPlayedGames` - Recent game activity
- `GetOwnedGames` - Complete game library
- `GetSteamLevel` - Steam account level

#### Faceit API
- `players?nickname` - Player profile by nickname
- `players/{id}/stats/cs2` - CS2 statistics
- `players/{id}/history` - Match history

---

## 🎮 Game Statistics Dashboard

### Features

- **Real-time Data**: Live updates from Steam and Faceit APIs
- **Statistics Display**: ELO, win rate, K/D ratio, playtime
- **Match History**: Recent matches with Win/Loss indicators
- **Profile Integration**: Steam and Faceit profile information
- **Interactive Charts**: Gaming activity trends and performance metrics

### Components

- `StatsHeader` - Page header with controls
- `LiveIndicator` - Real-time status display
- `TabsNavigation` - Sticky navigation tabs
- `StatsOverview` - Main statistics cards
- `ProfileCard` - Steam profile display
- `RecentGames` - Recent games grid
- `MatchHistory` - Match results with timestamps
- `RecentResults` - Win/Lose circles

### Data Flow

1. **API Service** (`realApi.js`) - Handles all API requests
2. **Custom Hook** (`useRealGameStats.js`) - Manages state and data
3. **Components** - Display data with animations
4. **Error Handling** - Fallback to mock data on API failures

---

## 🔧 Backend Integration

### Architecture

- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **PostgreSQL**: Production database
- **SQLite**: Development database

### Models

#### User Model
```python
class User(Base):
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    habits = relationship("Habit", back_populates="user")
    water_entries = relationship("WaterEntry", back_populates="user")
```

#### Sport Models
```python
class SportWater(Base):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    amount_ml = Column(Integer)
    timestamp = Column(DateTime)
```

### API Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

#### Habits
- `GET /habits/` - Get user habits
- `POST /habits/` - Create new habit
- `PUT /habits/{id}` - Update habit
- `DELETE /habits/{id}` - Delete habit

#### Sport
- `GET /sport/water` - Get water entries
- `POST /sport/water` - Add water entry
- `GET /sport/stats` - Get sport statistics

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Configure build settings

2. **Environment Variables**
   - Add all `VITE_` variables in Vercel dashboard
   - Set production API URLs

3. **Deploy**
   - Vercel automatically deploys on push to main branch
   - Custom domain configuration available

### Backend Deployment (Railway)

1. **Connect Repository**
   - Visit [Railway Dashboard](https://railway.app/dashboard)
   - Create new project from GitHub
   - Select backend directory

2. **Environment Variables**
   - Add database URL
   - Add API keys and secrets
   - Configure CORS settings

3. **Database**
   - Railway provides PostgreSQL instance
   - Run migrations on deployment

### Configuration Files

#### `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.railway.app/$1"
    }
  ]
}
```

#### `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python main.py",
    "healthcheckPath": "/health"
  }
}
```

---

## 🔧 Environment Setup

### Required Environment Variables

```env
# Steam API Configuration
VITE_STEAM_API_KEY=C21D331F3CA3B28F0A1723AA596EEF8E
VITE_FACEIT_API_KEY=2491711f-76d3-44dc-b7b5-7a9053d79114
VITE_STEAM_ID=76561199132216007
VITE_FACEIT_NICK=Ayu6i

# Backend Configuration
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3001,https://your-frontend-url.vercel.app

# Weather API (Optional)
VITE_WEATHER_API_KEY=your-weather-api-key
```

### Setup Instructions

1. **Create `.env` file** in project root
2. **Copy variables** from `env-config` file
3. **Update values** with your actual API keys
4. **Restart development server**
5. **Verify loading** in browser console

### Troubleshooting

- **Variables not loading**: Check file name is `.env` (with dot)
- **CORS errors**: Verify CORS_ORIGINS includes your frontend URL
- **API failures**: Check API keys are valid and active
- **Database errors**: Verify DATABASE_URL format

---

## 🐛 Bug Fixes & Improvements

### Recent Fixes

#### CORS Issues
- **Problem**: Steam and Faceit APIs blocked CORS requests
- **Solution**: Implemented CORS proxy (`api.allorigins.win`)
- **Result**: All API requests now work from browser

#### Environment Variables
- **Problem**: Variables not loading from `.env` file
- **Solution**: Added fallback values and debug logging
- **Result**: Graceful degradation with mock data

#### Progress Bars
- **Problem**: NaN values causing broken progress bars
- **Solution**: Added safe math utilities and validation
- **Result**: All progress bars display correctly

#### Modal Positioning
- **Problem**: Add Habit modal appearing in wrong position
- **Solution**: Refactored to use fixed positioning
- **Result**: Modal centers correctly on all screen sizes

### Performance Improvements

- **Lazy Loading**: Components load only when needed
- **Memoization**: Expensive calculations cached
- **API Caching**: 5-minute TTL for API responses
- **Error Boundaries**: Graceful error handling

### UI/UX Enhancements

- **Framer Motion**: Smooth animations throughout
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Consistent dark mode
- **Micro-interactions**: Hover effects and transitions

---

## 📚 Technical Documentation

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── game-stats/     # Game statistics components
│   ├── travel/         # Travel-related components
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API services
├── context/            # React context providers
├── pages/              # Page components
├── utils/              # Utility functions
└── data/               # Static data and constants

backend/
├── models/             # SQLAlchemy models
├── schemas/            # Pydantic schemas
├── routes/             # API route handlers
├── database/           # Database configuration
└── main.py             # FastAPI application
```

### Key Components

#### `ModernLogo`
- Animated logo with greeting
- Responsive design
- Particle effects

#### `PhysicsButton`
- Physics-based animations
- Multiple variants and sizes
- Sound effects (configurable)

#### `EnhancedProgressBar`
- Animated progress visualization
- Multiple variants and sizes
- Glow effects and animations

#### `MagneticCard`
- Magnetic hover effects
- Smooth animations
- Responsive design

### Custom Hooks

#### `useHabits`
- Habit management and tracking
- Local storage persistence
- Daily reset functionality

#### `useSport`
- Water and fitness tracking
- Goal management
- Statistics calculation

#### `useRealGameStats`
- Real-time game data
- API integration
- Error handling and fallbacks

### API Services

#### `realApi.js`
- Steam API integration
- Faceit API integration
- CORS proxy handling
- Error handling with fallbacks

#### `gameStatsService.js`
- Cached API responses
- Data normalization
- Utility functions

---

## 🎯 Development Guidelines

### Code Style

- **ESLint**: Configured for React best practices
- **Prettier**: Code formatting
- **TypeScript**: Type safety (where applicable)
- **Comments**: JSDoc for functions and components

### Testing

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing

### Performance

- **Bundle Analysis**: Regular bundle size monitoring
- **Lazy Loading**: Route-based code splitting
- **Caching**: API response caching
- **Optimization**: Image optimization and compression

---

## 📞 Support & Contributing

### Getting Help

1. **Check Documentation**: Review this comprehensive guide
2. **Console Logs**: Check browser console for errors
3. **API Status**: Verify API endpoints are accessible
4. **Environment**: Ensure all variables are set correctly

### Contributing

1. **Fork Repository**: Create your own fork
2. **Create Branch**: Feature branch for changes
3. **Submit PR**: Pull request with description
4. **Code Review**: Follow project guidelines

### Roadmap

- **PWA Support**: Progressive Web App features
- **Real-time Updates**: WebSocket integration
- **Mobile App**: React Native version
- **Advanced Analytics**: Detailed insights and reports
- **Social Features**: Friend comparisons and leaderboards

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Ayub Khon**

*Last updated: December 2024*
