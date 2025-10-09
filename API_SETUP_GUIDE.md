# 🎮 API Setup Guide - Game Statistics Dashboard

## 📋 Быстрая настройка

### 1. Создайте `.env` файл в корне проекта

Скопируйте содержимое из `env-config` файла в новый `.env` файл:

```env
VITE_STEAM_API_KEY=C21D331F3CA3B28F0A1723AA596EEF8E
VITE_FACEIT_API_KEY=2491711f-76d3-44dc-b7b5-7a9053d79114
VITE_STEAM_ID=76561199132216007
VITE_FACEIT_NICK=Ayu6i
```

### 2. Перезапустите сервер разработки

```bash
# Остановите текущий сервер (Ctrl+C)
# Затем запустите заново
npm run dev
```

## 🔧 Что было реализовано

### ✅ **Steam API Integration**
- **Profile Data**: Имя, аватар, уровень Steam
- **Recent Games**: Последние сыгранные игры
- **Owned Games**: Все игры в библиотеке
- **Playtime**: Общее время в играх

### ✅ **Faceit API Integration**
- **Player Profile**: Никнейм, страна, аватар
- **CS2 Statistics**: ELO, винрейт, K/D ratio
- **Match History**: История матчей
- **Skill Level**: Уровень игрока

### ✅ **Real-time Features**
- **Auto Refresh**: Каждые 30 секунд
- **Live Status**: Онлайн/офлайн статус
- **ELO Changes**: Изменения рейтинга в реальном времени
- **Current Game**: Текущая игра

### ✅ **UI Components**
- **Statistics Cards**: 8 карточек с реальными данными
- **Profile Display**: Steam профиль с аватаром
- **Recent Games**: Сетка последних игр
- **Match History**: Детальная история матчей
- **Win/Lose Circles**: Анимированные результаты

## 📊 Отображаемые данные

### **Steam Statistics**
- **Total Games**: Количество игр в библиотеке
- **Total Playtime**: Общее время в часах
- **Steam Level**: Уровень аккаунта Steam
- **Recent Activity**: Последние сыгранные игры

### **Faceit Statistics**
- **ELO Rating**: Текущий рейтинг Faceit
- **Win Rate**: Процент побед
- **K/D Ratio**: Соотношение убийств/смертей
- **Total Matches**: Общее количество матчей
- **Skill Level**: Уровень в Faceit

## 🚀 API Endpoints

### **Steam API**
```
GET https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/
GET https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/
GET https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/
GET https://api.steampowered.com/IPlayerService/GetSteamLevel/v0001/
```

### **Faceit API**
```
GET https://open.faceit.com/data/v4/players?nickname={nick}
GET https://open.faceit.com/data/v4/players/{player_id}/stats/cs2
GET https://open.faceit.com/data/v4/players/{player_id}/history
```

## 🔒 Безопасность

- **API Keys**: Хранятся в переменных окружения
- **CORS**: Настроен для внешних API
- **Error Handling**: Обработка ошибок API
- **Fallback**: Резервные данные при недоступности API

## 📱 Мобильная оптимизация

- **Responsive Design**: Адаптивный дизайн
- **Touch Friendly**: Удобные элементы для касания
- **Performance**: Оптимизированная загрузка
- **Offline Support**: Работа без интернета

## 🛠️ Техническая информация

### **Структура проекта**
```
src/
├── services/
│   └── realApi.js          # API сервисы
├── hooks/
│   └── useRealGameStats.js # Хук для данных
├── components/
│   ├── GameStatsReal.jsx   # Основной компонент
│   └── game-stats/         # Подкомпоненты
└── pages/
    └── GameStats.jsx       # Обновленная страница
```

### **Зависимости**
- React 18
- Framer Motion
- TailwindCSS
- Lucide React

## 🔄 Обновления

### **v1.0.0 - Real API Integration**
- ✅ Подключение реальных Steam и Faceit API
- ✅ Отображение актуальных данных
- ✅ Автоматическое обновление каждые 30 секунд
- ✅ Обработка ошибок API
- ✅ Индикатор статуса подключения

## 📞 Поддержка

При возникновении проблем:

1. **Проверьте .env файл** - убедитесь, что ключи правильные
2. **Проверьте консоль** - посмотрите на ошибки API
3. **Перезапустите сервер** - после изменения .env
4. **Проверьте интернет** - API требуют соединения

## 🎯 Результат

После настройки вы получите:
- **Реальные данные** из Steam и Faceit
- **Автоматическое обновление** статистики
- **Красивый интерфейс** с анимациями
- **Мобильную версию** для всех устройств
- **Live-режим** с реальным временем

---

**Готово к использованию! 🚀**
