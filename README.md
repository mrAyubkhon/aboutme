# 🌟 Ayubi aka System

> **Персональный дашборд для отслеживания привычек, финансов, воды и многого другого**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue.svg)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Быстрый старт

```bash
# Клонировать репозиторий
git clone https://github.com/mrAyubkhon/aboutme.git
cd aboutme

# Установить зависимости
npm install

# Запустить frontend
npm run dev

# Запустить backend (в отдельном терминале)
cd backend
pip install -r requirements.txt
python main.py
```

## ✨ Основные возможности

### 📊 **Главная страница**
- Динамическое приветствие по времени дня
- Статистика привычек, воды, финансов
- Умные интеграции (календарь, погода)
- Быстрые действия

### 📅 **Отслеживание привычек**
- 20+ предустановленных привычек
- Возможность добавления собственных
- Прогресс-бары с анимациями
- Статистика выполнения

### 💧 **Трекер воды**
- Отслеживание ежедневного потребления
- Настраиваемая цель
- Красивые прогресс-бары
- Уведомления о прогрессе

### 💰 **Финансы**
- Учет доходов и расходов
- Категории трат
- Бюджетные лимиты
- Визуализация трат

### 📝 **Дневник**
- Записи мыслей и идей
- Теги для организации
- Поиск по записям
- Экспорт данных

### 🌍 **Travel Wishlist**
- 100+ стран из всех континентов кроме Африки
- Фильтрация по континентам
- Wishlist с сохранением в localStorage
- Красивые карточки с флагами

### 🎮 **Игровая статистика**
- Интеграция с Steam API
- Интеграция с Faceit API
- Статистика CS2/CS:GO
- Профили игрока

### 🔧 **Настройки**
- Экспорт/импорт данных
- Быстрая диагностика системы
- Сброс данных
- Настройки целей

## 🛠️ Технологии

### Frontend
- **React 18** - Основной фреймворк
- **Vite** - Сборщик проекта
- **TailwindCSS** - Стилизация
- **Framer Motion** - Анимации
- **React Router** - Маршрутизация
- **Lucide React** - Иконки

### Backend
- **FastAPI** - Python веб-фреймворк
- **SQLAlchemy** - ORM
- **Pydantic** - Валидация данных
- **JWT** - Аутентификация
- **SQLite/PostgreSQL** - База данных

### Интеграции
- **Steam Web API** - Игровая статистика
- **Faceit API** - Статистика турниров
- **OpenWeatherMap** - Погодные данные
- **Calendar API** - Синхронизация календаря

## 📁 Структура проекта

```
aboutme/
├── src/
│   ├── components/          # React компоненты
│   ├── pages/              # Страницы приложения
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API сервисы
│   ├── data/               # Константы и данные
│   └── utils/              # Утилиты
├── backend/                # Python FastAPI backend
├── documentation/          # Документация проекта
└── public/                 # Статические файлы
```

## 🎨 Дизайн

### Цветовая схема
- **Фон**: `#0a0a0a` (истинно черный)
- **Карточки**: `#111827` (темно-синий)
- **Акцент**: `#2563eb` (ярко-синий)
- **Текст**: `#f9fafb` (белый)

### Особенности
- 🌙 **Темная тема** - постоянная темная тема
- 🌍 **Только английский** - убрана многоязычность
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- ✨ **Плавные анимации** - Framer Motion для всех переходов

## 📊 Статистика

- **Страниц**: 8
- **Компонентов**: 20+
- **Стран в Travel**: 100+
- **Привычек**: 20+
- **Интеграций**: 4

## 🔧 Настройка API

Создайте файл `.env` в корне проекта:

```env
# Steam API Configuration
VITE_STEAM_API_KEY=your_steam_api_key

# Faceit API Configuration  
VITE_FACEIT_API_KEY=your_faceit_api_key

# Backend Configuration
VITE_API_URL=http://localhost:8000
```

## 📚 Документация

Полная документация находится в папке [`documentation/`](./documentation/):

- [🚀 Быстрый старт](./documentation/QUICK_START_BACKEND.md)
- [📖 Обзор проекта](./documentation/PROJECT_SUMMARY.md)
- [🔧 Техническая документация](./documentation/BACKEND_INTEGRATION_COMPLETE.md)
- [🎮 Настройка игровой статистики](./documentation/GAME_STATS_SETUP.md)

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👨‍💻 Автор

**Ayubi** - [@mrAyubkhon](https://github.com/mrAyubkhon)

---

⭐ **Если проект вам понравился, поставьте звездочку!**