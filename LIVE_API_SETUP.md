# 🔑 Live API Setup для Steam и Faceit

## 📋 Инструкции по настройке Live режима

### 1. **Получение Steam API ключа**

1. Перейдите на: https://steamcommunity.com/dev/apikey
2. Войдите в ваш Steam аккаунт (Ayubi)
3. Заполните форму:
   - **Domain Name**: `localhost` или ваш домен
   - **Agree to terms**: ✅
4. Нажмите "Register"
5. Скопируйте полученный API ключ

### 2. **Получение Faceit API ключа**

1. Перейдите на: https://developers.faceit.com/
2. Создайте аккаунт разработчика
3. Создайте новое приложение:
   - **Name**: "Ayubi Dashboard"
   - **Description**: "Personal gaming dashboard"
   - **Redirect URI**: `http://localhost:3001`
4. Получите API ключ из настроек приложения

### 3. **Настройка .env файла**

Создайте файл `.env` в корне проекта:

```env
# Steam API Configuration
VITE_STEAM_API_KEY=ваш_steam_api_ключ_здесь

# Faceit API Configuration  
VITE_FACEIT_API_KEY=ваш_faceit_api_ключ_здесь

# Backend Configuration
VITE_API_URL=http://localhost:8000
```

### 4. **Обновление GameStatsService**

Убедитесь, что `src/services/gameStatsService.js` правильно использует API ключи:

```javascript
class GameStatsService {
  constructor() {
    this.steamApiKey = import.meta.env.VITE_STEAM_API_KEY || '';
    this.faceitApiKey = import.meta.env.VITE_FACEIT_API_KEY || '';
    this.steamBaseUrl = 'https://api.steampowered.com';
    this.faceitBaseUrl = 'https://open.faceit.com/data/v4';
  }
}
```

### 5. **Проверка работы**

1. Перезапустите frontend сервер: `npm run dev`
2. Перейдите на Game Stats страницу
3. В настройках проверьте статус API ключей
4. Нажмите "Refresh" для загрузки реальных данных

## 🎯 Результат

После настройки API ключей:
- ✅ Steam данные будут загружаться в реальном времени
- ✅ Faceit статистика будет актуальной
- ✅ Автоматическое обновление данных
- ✅ Реальные достижения и прогресс

## 🔧 Troubleshooting

### Если API ключи не работают:
1. Проверьте правильность ключей в .env файле
2. Убедитесь, что ключи начинаются с `VITE_`
3. Перезапустите сервер после изменения .env
4. Проверьте консоль браузера на ошибки CORS

### Steam API ограничения:
- 100,000 запросов в день
- Не более 200 запросов в 5 минут
- Некоторые данные требуют публичного профиля

### Faceit API ограничения:
- 1000 запросов в час
- Требует правильные заголовки
- Некоторые данные только для premium аккаунтов
