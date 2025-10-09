# 🚀 Руководство по деплою Ayubi aka System

## 📋 Содержание
1. [Backend на Railway](#backend-на-railway)
2. [Frontend на Vercel](#frontend-на-vercel)
3. [Environment Variables](#environment-variables)
4. [Проверка работоспособности](#проверка)

---

## 🔧 Backend на Railway

### Шаг 1: Подготовка

1. **Зарегистрируйтесь на Railway**
   - Перейдите на https://railway.app
   - Войдите через GitHub

2. **Создайте новый проект**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий `aboutme`

### Шаг 2: Настройка Backend

1. **Настройте root directory**
   ```
   Settings → Root Directory → backend
   ```

2. **Добавьте PostgreSQL**
   - В проекте нажмите "+ New"
   - Выберите "Database" → "PostgreSQL"
   - Railway автоматически создаст DATABASE_URL

3. **Environment Variables**
   
   Перейдите в Settings → Variables и добавьте:
   
   ```bash
   # Database (автоматически создаётся Railway)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   
   # JWT Authentication
   SECRET_KEY=ваш-супер-секретный-ключ-32-символа
   JWT_SECRET_KEY=другой-секретный-ключ-для-jwt
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # App Settings
   APP_NAME=Ayubi aka System
   APP_VERSION=2.0.0
   DEBUG=False
   API_V1_PREFIX=/api/v1
   
   # CORS
   ALLOWED_ORIGINS=https://ваш-домен.vercel.app,http://localhost:5173
   ```

4. **Сгенерируйте SECRET_KEY**
   ```bash
   # Локально выполните:
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```

### Шаг 3: Деплой

1. **Railway автоматически задеплоит** после push в GitHub

2. **Проверьте логи**
   - Откройте "Deployments" → "View Logs"
   - Убедитесь что нет ошибок

3. **Получите URL**
   - Settings → Generate Domain
   - Скопируйте URL (например: `your-app.railway.app`)

4. **Проверьте health**
   ```bash
   curl https://your-app.railway.app/health
   ```

### Шаг 4: Создание таблиц и индексов

1. **Таблицы создаются автоматически** при первом запуске

2. **Добавьте индексы** (опционально, для производительности):
   - Подключитесь к PostgreSQL через Railway CLI:
   ```bash
   railway connect postgres
   ```
   - Выполните скрипт:
   ```bash
   \i migrations/add_indexes.sql
   ```

---

## 🎨 Frontend на Vercel

### Шаг 1: Подготовка

1. **Зарегистрируйтесь на Vercel**
   - Перейдите на https://vercel.com
   - Войдите через GitHub

2. **Импортируйте проект**
   - Нажмите "Add New" → "Project"
   - Выберите репозиторий `aboutme`

### Шаг 2: Настройка

1. **Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

2. **Root Directory**
   ```
   Root Directory: . (корень проекта)
   ```

3. **Environment Variables**
   
   В Settings → Environment Variables добавьте:
   
   ```bash
   VITE_API_URL=https://your-app.railway.app/api/v1
   ```

### Шаг 3: Деплой

1. **Нажмите "Deploy"**

2. **Дождитесь завершения** (обычно 1-2 минуты)

3. **Получите URL**
   - Vercel автоматически сгенерирует URL
   - Например: `your-project.vercel.app`

4. **Проверьте сайт**
   - Откройте URL в браузере
   - Проверьте что всё загружается

### Шаг 4: Обновление CORS

1. **Вернитесь в Railway** (backend)

2. **Обновите ALLOWED_ORIGINS**
   ```bash
   ALLOWED_ORIGINS=https://your-project.vercel.app,http://localhost:5173
   ```

3. **Подождите redeploy**

---

## 🔑 Environment Variables

### Backend (Railway)

| Переменная | Описание | Пример |
|-----------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `SECRET_KEY` | Секретный ключ приложения | `hex32chars...` |
| `JWT_SECRET_KEY` | Ключ для JWT токенов | `hex32chars...` |
| `JWT_ALGORITHM` | Алгоритм JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Время жизни токена | `30` |
| `ALLOWED_ORIGINS` | CORS origins | `https://app.vercel.app` |
| `DEBUG` | Debug mode | `False` |

### Frontend (Vercel)

| Переменная | Описание | Пример |
|-----------|----------|---------|
| `VITE_API_URL` | URL backend API | `https://api.railway.app/api/v1` |

---

## ✅ Проверка работоспособности

### 1. Backend Health Check

```bash
curl https://your-app.railway.app/health
```

Ответ:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "2.0.0"
}
```

### 2. API Documentation

Откройте в браузере:
```
https://your-app.railway.app/docs
```

### 3. Frontend

1. Откройте ваш Vercel URL
2. Попробуйте зарегистрироваться
3. Проверьте что данные сохраняются

### 4. Проверка подключения Frontend → Backend

Откройте DevTools (F12) → Console:
```javascript
// Проверка API
fetch('https://your-app.railway.app/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 🔄 Автоматический деплой

### Railway

✅ Автоматически деплоится при push в `main` branch

### Vercel

✅ Автоматически деплоится при push в любой branch
✅ Preview deployments для Pull Requests

---

## 🐛 Troubleshooting

### Backend не запускается

1. **Проверьте логи** в Railway → Deployments → View Logs

2. **Частые проблемы:**
   - `DATABASE_URL` не установлена → добавьте PostgreSQL
   - `SECRET_KEY` не установлена → добавьте в Variables
   - Import errors → проверьте `requirements.txt`

### Frontend не подключается к Backend

1. **Проверьте CORS:**
   ```bash
   # В Railway Variables
   ALLOWED_ORIGINS=https://ваш-домен.vercel.app
   ```

2. **Проверьте VITE_API_URL:**
   ```bash
   # В Vercel Variables
   VITE_API_URL=https://ваш-домен.railway.app/api/v1
   ```

3. **Проверьте Network tab** в DevTools

### База данных сбросилась

Railway бесплатный tier:
- ⚠️ После 500 часов/месяц проект засыпает
- ⚠️ Данные сохраняются, но нужен **paid plan** для production

**Решение:** Используйте бэкапы (`/api/v1/backup/export`)

---

## 💰 Стоимость

| Сервис | Free Tier | Paid |
|--------|-----------|------|
| **Railway** | 500 часов/месяц + 5GB storage | $5/месяц |
| **Vercel** | Unlimited | $0 (для личных проектов) |
| **Total** | **$0/месяц** | ~$5/месяц |

---

## 📚 Дополнительно

### Custom Domain (опционально)

1. **Vercel:**
   - Settings → Domains → Add
   - Добавьте ваш домен
   - Настройте DNS записи

2. **Railway:**
   - Settings → Custom Domain
   - Добавьте ваш домен
   - Настройте CNAME

### SSL Certificate

✅ Автоматически для Railway и Vercel

### Monitoring

1. **Railway:**
   - Встроенные метрики CPU/RAM
   - Логи в реальном времени

2. **Vercel:**
   - Analytics (бесплатно)
   - Web Vitals

---

## 🎉 Готово!

Ваш проект теперь в production:

- 🔐 **Backend**: `https://your-app.railway.app`
- 🎨 **Frontend**: `https://your-project.vercel.app`
- 📚 **API Docs**: `https://your-app.railway.app/docs`

**Следующие шаги:**
1. Протестируйте все функции
2. Настройте бэкапы
3. Добавьте мониторинг
4. Наслаждайтесь! 🚀

