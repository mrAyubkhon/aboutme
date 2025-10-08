"""
Helper utilities for Ayubi aka System
"""
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional
import calendar


def get_today() -> date:
    """Get today's date"""
    return date.today()


def get_current_datetime() -> datetime:
    """Get current datetime"""
    return datetime.utcnow()


def format_date(date_obj: date, format_str: str = "%Y-%m-%d") -> str:
    """
    Format a date object to string
    
    Args:
        date_obj: Date object to format
        format_str: Format string
        
    Returns:
        str: Formatted date string
    """
    return date_obj.strftime(format_str)


def parse_date(date_str: str, format_str: str = "%Y-%m-%d") -> date:
    """
    Parse a date string to date object
    
    Args:
        date_str: Date string to parse
        format_str: Format string
        
    Returns:
        date: Parsed date object
    """
    return datetime.strptime(date_str, format_str).date()


def get_date_range(period: str = "today") -> tuple[date, date]:
    """
    Get date range for different periods
    
    Args:
        period: Period type (today, week, month, year)
        
    Returns:
        tuple: Start and end dates
    """
    today = get_today()
    
    if period == "today":
        return today, today
    elif period == "week":
        start = today - timedelta(days=today.weekday())
        end = start + timedelta(days=6)
        return start, end
    elif period == "month":
        start = today.replace(day=1)
        last_day = calendar.monthrange(today.year, today.month)[1]
        end = today.replace(day=last_day)
        return start, end
    elif period == "year":
        start = today.replace(month=1, day=1)
        end = today.replace(month=12, day=31)
        return start, end
    else:
        return today, today


def calculate_streak(dates: List[date]) -> int:
    """
    Calculate streak from a list of dates
    
    Args:
        dates: List of completion dates
        
    Returns:
        int: Current streak count
    """
    if not dates:
        return 0
    
    # Sort dates in descending order
    sorted_dates = sorted(set(dates), reverse=True)
    today = get_today()
    
    # Check if today is in the list, if not start from yesterday
    if sorted_dates[0] != today:
        today = today - timedelta(days=1)
    
    streak = 0
    current_date = today
    
    for completion_date in sorted_dates:
        if completion_date == current_date:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
    
    return streak


def calculate_completion_rate(completed: int, total: int) -> float:
    """
    Calculate completion rate percentage
    
    Args:
        completed: Number of completed items
        total: Total number of items
        
    Returns:
        float: Completion rate as percentage
    """
    if total == 0:
        return 0.0
    return round((completed / total) * 100, 2)


def format_currency(amount: float, currency: str = "USD") -> str:
    """
    Format currency amount
    
    Args:
        amount: Amount to format
        currency: Currency code
        
    Returns:
        str: Formatted currency string
    """
    if currency == "USD":
        return f"${amount:.2f}"
    elif currency == "EUR":
        return f"€{amount:.2f}"
    elif currency == "UZS":
        return f"{amount:,.0f} UZS"
    else:
        return f"{amount:.2f} {currency}"


def format_water_amount(amount: int) -> str:
    """
    Format water amount in ml
    
    Args:
        amount: Amount in milliliters
        
    Returns:
        str: Formatted water amount
    """
    if amount >= 1000:
        return f"{amount / 1000:.1f}L"
    else:
        return f"{amount}ml"


def get_water_recommendation(current_amount: int, goal: int, weather: Optional[str] = None) -> Dict[str, Any]:
    """
    Get water intake recommendation based on current progress and weather
    
    Args:
        current_amount: Current water intake in ml
        goal: Daily water goal in ml
        weather: Current weather condition
        
    Returns:
        dict: Recommendation data
    """
    percentage = (current_amount / goal) * 100 if goal > 0 else 0
    remaining = max(0, goal - current_amount)
    
    # Base recommendation
    if percentage < 25:
        message = "Start your day with a glass of water!"
        priority = "high"
    elif percentage < 50:
        message = "Keep hydrating! You're making good progress."
        priority = "medium"
    elif percentage < 75:
        message = "Great job! You're more than halfway there."
        priority = "low"
    elif percentage < 100:
        message = "Almost there! Just a bit more to reach your goal."
        priority = "low"
    else:
        message = "Excellent! You've reached your daily goal!"
        priority = "none"
    
    # Weather-based adjustments
    if weather:
        weather_lower = weather.lower()
        if "hot" in weather_lower or "sunny" in weather_lower:
            remaining = int(remaining * 1.2)  # Increase by 20%
            message += " It's hot today, so consider drinking a bit more!"
        elif "cold" in weather_lower:
            remaining = int(remaining * 0.9)  # Decrease by 10%
    
    return {
        "message": message,
        "priority": priority,
        "remaining_amount": remaining,
        "percentage": round(percentage, 1),
        "recommended_glass_size": min(250, remaining) if remaining > 0 else 250
    }


def get_habit_recommendation(completed_habits: int, total_habits: int, time_of_day: str = "morning") -> str:
    """
    Get habit completion recommendation
    
    Args:
        completed_habits: Number of completed habits
        total_habits: Total number of habits
        time_of_day: Current time of day
        
    Returns:
        str: Recommendation message
    """
    if total_habits == 0:
        return "Start building your habits today!"
    
    percentage = (completed_habits / total_habits) * 100
    
    if percentage == 100:
        return "🎉 Amazing! You've completed all your habits today!"
    elif percentage >= 75:
        return "Great progress! You're almost done with your daily habits."
    elif percentage >= 50:
        return "Good job! You're halfway through your habits."
    elif percentage >= 25:
        return "Keep going! You've made a good start."
    else:
        if time_of_day == "morning":
            return "Good morning! Time to start your daily habits."
        elif time_of_day == "afternoon":
            return "Afternoon reminder: Don't forget your habits!"
        else:
            return "Evening check: How are your habits going?"


def generate_tags_from_text(text: str, max_tags: int = 5) -> List[str]:
    """
    Generate tags from text content
    
    Args:
        text: Text content to analyze
        max_tags: Maximum number of tags to generate
        
    Returns:
        List[str]: Generated tags
    """
    # Simple keyword extraction (in a real app, you might use NLP)
    words = text.lower().split()
    
    # Filter out common words
    stop_words = {"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should"}
    
    # Extract meaningful words
    meaningful_words = [word for word in words if len(word) > 3 and word not in stop_words]
    
    # Count word frequency and return top tags
    word_count = {}
    for word in meaningful_words:
        word_count[word] = word_count.get(word, 0) + 1
    
    # Sort by frequency and return top tags
    sorted_words = sorted(word_count.items(), key=lambda x: x[1], reverse=True)
    return [word for word, count in sorted_words[:max_tags]]


def validate_password_strength(password: str) -> Dict[str, Any]:
    """
    Validate password strength
    
    Args:
        password: Password to validate
        
    Returns:
        dict: Validation result with score and feedback
    """
    score = 0
    feedback = []
    
    # Length check
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Password should be at least 8 characters long")
    
    # Uppercase check
    if any(c.isupper() for c in password):
        score += 1
    else:
        feedback.append("Password should contain at least one uppercase letter")
    
    # Lowercase check
    if any(c.islower() for c in password):
        score += 1
    else:
        feedback.append("Password should contain at least one lowercase letter")
    
    # Digit check
    if any(c.isdigit() for c in password):
        score += 1
    else:
        feedback.append("Password should contain at least one digit")
    
    # Special character check
    if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        score += 1
    else:
        feedback.append("Password should contain at least one special character")
    
    # Strength levels
    if score <= 2:
        strength = "weak"
    elif score <= 3:
        strength = "fair"
    elif score <= 4:
        strength = "good"
    else:
        strength = "strong"
    
    return {
        "score": score,
        "max_score": 5,
        "strength": strength,
        "is_valid": score >= 3,
        "feedback": feedback
    }
