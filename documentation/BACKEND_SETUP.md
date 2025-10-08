# 🚀 Ayubi aka System Backend Setup Guide

## 📋 Overview

This guide will help you set up the FastAPI backend for the Ayubi aka System personal dashboard. The backend provides a complete REST API for managing habits, water tracking, finances, and journal entries with JWT authentication.

## 🛠️ Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git (optional, for version control)

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── config.py              # Application configuration
├── database.py            # Database configuration and session management
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables template
├── models/               # SQLAlchemy database models
│   ├── user.py          # User model
│   ├── habit.py         # Habit and completion models
│   ├── water.py         # Water tracking models
│   ├── finance.py       # Finance models
│   └── journal.py       # Journal models
├── schemas/              # Pydantic schemas for API
│   ├── user_schema.py   # User schemas
│   ├── habit_schema.py  # Habit schemas
│   ├── water_schema.py  # Water schemas
│   ├── finance_schema.py # Finance schemas
│   └── journal_schema.py # Journal schemas
├── routes/               # API route handlers
│   ├── auth.py          # Authentication routes
│   ├── habits.py        # Habit management routes
│   ├── water.py         # Water tracking routes
│   ├── finance.py       # Finance routes
│   └── journal.py       # Journal routes
└── utils/                # Utility functions
    ├── auth.py          # Authentication utilities
    ├── helpers.py       # Helper functions
    └── logger.py        # Logging utilities
```

## 🔧 Installation & Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

### 5. Configure Environment Variables

Edit the `.env` file with your settings:

```env
# App Settings
APP_NAME=Ayubi aka System API
APP_VERSION=1.0.0
DEBUG=true

# Database (SQLite for development)
DATABASE_URL=sqlite:///./ayubi.db

# For production with PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost/ayubi_db

# Security (CHANGE THESE IN PRODUCTION!)
SECRET_KEY=your-super-secret-key-change-in-production-make-it-very-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173

# API
API_V1_PREFIX=/api/v1
```

## 🚀 Running the Backend

### Development Mode

```bash
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
# Run with Gunicorn (recommended for production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📚 API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **API Root**: http://localhost:8000/

## 🔐 Authentication

The API uses JWT (JSON Web Token) authentication. Here's how to use it:

### 1. Register a New User

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "ayubi",
    "full_name": "Ayubi User",
    "password": "securepassword123"
  }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=ayubi&password=securepassword123"
```

### 3. Use Authenticated Requests

```bash
curl -X GET "http://localhost:8000/api/v1/habits" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Database Models

### User Model
- User authentication and profile information
- Settings for water goals, reminders, etc.

### Habit Model
- Daily habits with tracking
- Streaks and completion history
- Categories and difficulty levels

### Water Entry Model
- Water intake tracking
- Daily goals and reminders
- Different drink types and amounts

### Finance Entry Model
- Income and expense tracking
- Categories and budgets
- Monthly/yearly summaries

### Journal Entry Model
- Personal journal entries
- Tags and categories
- Mood and weather tracking

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Pydantic schemas for data validation
- **Error Handling**: Comprehensive error handling and logging

## 🔄 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user info
- `PUT /me` - Update user profile
- `POST /refresh` - Refresh access token

### Habits (`/api/v1/habits`)
- `GET /` - Get user habits
- `POST /` - Create new habit
- `GET /{id}` - Get specific habit
- `PUT /{id}` - Update habit
- `DELETE /{id}` - Delete habit
- `POST /{id}/complete` - Mark habit as complete
- `DELETE /{id}/complete/{date}` - Remove completion
- `GET /stats/overview` - Get habits statistics

### Water Tracking (`/api/v1/water`)
- `GET /` - Get water entries
- `POST /` - Add water entry
- `GET /today` - Today's water stats
- `GET /history` - Water intake history
- `GET /dashboard` - Water dashboard data
- `GET /goal` - Get water goals
- `PUT /goal` - Update water goals
- `GET /recommendation` - Get water recommendations

### Finance (`/api/v1/finance`)
- `GET /entries` - Get finance entries
- `POST /entries` - Create finance entry
- `GET /entries/{id}` - Get specific entry
- `PUT /entries/{id}` - Update entry
- `DELETE /entries/{id}` - Delete entry
- `GET /categories` - Get categories
- `POST /categories` - Create category
- `GET /stats/summary` - Finance summary
- `GET /budget` - Get budgets
- `POST /budget` - Create budget

### Journal (`/api/v1/journal`)
- `GET /entries` - Get journal entries
- `POST /entries` - Create journal entry
- `GET /entries/{id}` - Get specific entry
- `PUT /entries/{id}` - Update entry
- `DELETE /entries/{id}` - Delete entry
- `POST /search` - Search entries
- `GET /stats` - Journal statistics
- `GET /dashboard` - Journal dashboard
- `GET /templates` - Get templates
- `POST /templates` - Create template

### Data Export/Import
- `GET /export/{user_id}` - Export user data
- `POST /import` - Import user data

## 🗄️ Database Setup

### SQLite (Development)

The application automatically creates SQLite database file `ayubi.db` on first run.

### PostgreSQL (Production)

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE ayubi_db;
CREATE USER ayubi_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ayubi_db TO ayubi_user;
```

3. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://ayubi_user:your_password@localhost/ayubi_db
```

## 📝 Logging

The application includes comprehensive logging:

- **Request Logging**: All HTTP requests and responses
- **Error Logging**: Detailed error information
- **User Action Logging**: Audit trail for user actions
- **Performance Logging**: Slow operation detection

Logs are stored in `logs/ayubi_system.log` and rotated daily.

## 🚀 Deployment

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t ayubi-backend .
docker run -p 8000:8000 ayubi-backend
```

### Using Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Using Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables
4. Deploy

## 🔧 Frontend Integration

The frontend is configured to work with this backend through the `src/config/api.js` file.

### Environment Variables for Frontend

Create `.env.local` in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### API Usage Example

```javascript
import { authAPI, habitsAPI } from './config/api.js';

// Login
const token = await authAPI.login('username', 'password');

// Get habits
const habits = await habitsAPI.getHabits();

// Create habit
const newHabit = await habitsAPI.createHabit({
  title: 'Drink Water',
  description: 'Stay hydrated',
  icon: '💧',
  color: 'blue'
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` in `.env`
   - Ensure database server is running
   - Verify database permissions

2. **CORS Issues**
   - Add your frontend URL to `ALLOWED_ORIGINS`
   - Check frontend `VITE_API_URL` configuration

3. **Authentication Issues**
   - Verify `SECRET_KEY` is set
   - Check token expiration time
   - Ensure proper Bearer token format

4. **Import Errors**
   - Activate virtual environment
   - Install all dependencies
   - Check Python version compatibility

### Debug Mode

Enable debug mode in `.env`:
```env
DEBUG=true
```

This will provide detailed error messages and auto-reload on code changes.

## 📞 Support

For issues and questions:

1. Check the logs in `logs/ayubi_system.log`
2. Verify environment configuration
3. Test API endpoints using Swagger UI
4. Check frontend console for errors

## 🎉 Success!

Once everything is set up, you should have:

- ✅ FastAPI backend running on http://localhost:8000
- ✅ API documentation at http://localhost:8000/docs
- ✅ Database with all tables created
- ✅ JWT authentication working
- ✅ All API endpoints functional
- ✅ Frontend integration ready

Your Ayubi aka System backend is now ready to power your personal dashboard! 🚀
