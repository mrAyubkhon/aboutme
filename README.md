# 📚 Ayubi aka System - Complete Documentation

## 🎯 Project Overview

**Ayubi aka System** - это полнофункциональный персональный дашборд для трекинга привычек, финансов, воды, мыслей и игровой статистики. Проект построен на React + FastAPI с современным дизайном и полной интеграцией backend.

## 🚀 Quick Start

### Frontend Setup
```bash
# Установка зависимостей
npm install

# Запуск development сервера
npm run dev

# Сайт будет доступен на http://localhost:3000
```

### Backend Setup
```bash
# Переход в папку backend
cd backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
python main_simple.py

# API будет доступен на http://localhost:8000
```

## 📋 Features

### 🏠 Home Dashboard
- Динамические приветствия по времени дня
- Живые часы
- Быстрые действия для всех функций
- Статистика и прогресс
- Интеграции (календарь, погода)

### 📅 Routine Tracker
- Трекинг привычек с прогресс-барами
- Предустановленные популярные привычки
- Кастомные привычки
- Статистика и аналитика
- Система streak и мотивация

### 💧 Water Tracker
- Трекинг потребления воды
- Настраиваемые цели
- История и статистика
- Уведомления о гидратации

### 💰 Finance Helper
- Учет доходов и расходов
- Категоризация трат
- Бюджеты и лимиты
- Аналитика и графики
- Экспорт данных

### 📝 Journal & Thoughts
- Личный журнал с тегами
- Поиск по записям
- Настроение и категории
- Экспорт и резервное копирование
- Интеграция с backend

### 🎮 Game Statistics
- Steam Web API интеграция
- Faceit API интеграция
- Статистика игр и достижений
- Соревновательные рейтинги
- История матчей

### 🔧 Diagnostics
- Проверка здоровья системы
- Тестирование API
- Мониторинг производительности
- Устранение неполадок

### ⚙️ Settings
- Настройки профиля
- Конфигурация API ключей
- Экспорт/импорт данных
- Тема и персонализация

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** - Основной фреймворк
- **Vite** - Build tool и dev server
- **TailwindCSS** - Стилизация
- **Framer Motion** - Анимации
- **React Router** - Навигация
- **Zustand/Context** - State management
- **Lucide React** - Иконки

### Backend Stack
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **SQLite/PostgreSQL** - Database
- **JWT** - Authentication
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
ayubi-aka-system/
├── 📱 src/
│   ├── 🧩 components/          # Reusable components
│   ├── 📄 pages/               # Page components
│   ├── 🔧 services/            # API services
│   ├── 🎣 hooks/               # Custom hooks
│   ├── 🌐 context/             # React contexts
│   ├── 📊 data/                # Constants and data
│   └── 🎨 styles/              # Global styles
├── 🔧 backend/                  # FastAPI backend
│   ├── main.py                 # Main application
│   ├── models/                 # Database models
│   ├── routes/                 # API endpoints
│   ├── schemas/                # Pydantic schemas
│   └── utils/                  # Helper utilities
├── 📚 documentation/           # All documentation
└── ⚙️ Configuration files
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build для продакшн
npm run build

# Deploy в Vercel
vercel --prod
```

### Backend (Railway/Render)
```bash
# Установка зависимостей
pip install -r requirements.txt

# Настройка переменных окружения
export DATABASE_URL=postgresql://...
export SECRET_KEY=your-secret-key

# Запуск
python main.py
```

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_STEAM_API_KEY=your-steam-api-key
VITE_FACEIT_API_KEY=your-faceit-api-key
```

### Backend (.env)
```env
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🐛 Troubleshooting

### White Screen Issues
1. Проверить консоль браузера на ошибки
2. Убедиться что все компоненты импортированы
3. Проверить маршрутизацию в App.jsx
4. Временно отключить проблемные компоненты

### Backend Connection Issues
1. Проверить что backend запущен на порту 8000
2. Проверить CORS настройки
3. Проверить переменные окружения
4. Проверить логи backend сервера

## 📊 Performance

### Optimization Features
- **Lazy loading** компонентов
- **Code splitting** по маршрутам
- **Memoization** для тяжелых вычислений
- **Error boundaries** для отлова ошибок
- **LocalStorage** для offline работы

## 🔄 Development Workflow

### Git Workflow
```bash
# Создание новой ветки
git checkout -b feature/new-feature

# Коммит изменений
git add .
git commit -m "feat: add new feature"

# Push в GitHub
git push origin feature/new-feature
```

## 🎯 Current Status

**Статус**: ✅ **ПОЛНОСТЬЮ ФУНКЦИОНАЛЬНЫЙ**

- ✅ Frontend: React + Vite + TailwindCSS
- ✅ Backend: FastAPI + SQLAlchemy + PostgreSQL
- ✅ Database: SQLite (dev) + PostgreSQL (prod)
- ✅ Authentication: JWT + bcrypt
- ✅ API Integration: Steam + Faceit
- ✅ UI/UX: Dark theme + animations
- ✅ Documentation: Complete
- ✅ Deployment: Ready

**Последнее обновление**: 8 октября 2024  
**Версия**: 1.0.0  
**Автор**: Muhammad Ayubkhon

---

**🚀 Проект готов к использованию и дальнейшей разработке!**

## 📞 Support

- **GitHub**: https://github.com/mrAyubkhon/aboutme.git
- **Frontend**: http://localhost:3000/
- **Backend**: http://localhost:8000/
- **API Docs**: http://localhost:8000/docs
