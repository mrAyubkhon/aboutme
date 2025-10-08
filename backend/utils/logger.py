"""
Logging utilities for Ayubi aka System
"""
import logging
import sys
from datetime import datetime
from typing import Any, Dict, Optional
from loguru import logger


def setup_logger(
    log_level: str = "INFO",
    log_file: Optional[str] = None,
    rotation: str = "1 day",
    retention: str = "30 days"
) -> None:
    """
    Setup application logger
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Log file path (optional)
        rotation: Log rotation period
        retention: Log retention period
    """
    # Remove default logger
    logger.remove()
    
    # Add console logger
    logger.add(
        sys.stdout,
        level=log_level,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        colorize=True
    )
    
    # Add file logger if specified
    if log_file:
        logger.add(
            log_file,
            level=log_level,
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
            rotation=rotation,
            retention=retention,
            compression="zip"
        )


def log_request(
    method: str,
    url: str,
    status_code: int,
    response_time: float,
    user_id: Optional[int] = None,
    **kwargs
) -> None:
    """
    Log HTTP request details
    
    Args:
        method: HTTP method
        url: Request URL
        status_code: Response status code
        response_time: Response time in seconds
        user_id: User ID (if authenticated)
        **kwargs: Additional parameters
    """
    log_data = {
        "type": "request",
        "method": method,
        "url": url,
        "status_code": status_code,
        "response_time": response_time,
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Add additional parameters
    log_data.update(kwargs)
    
    if status_code >= 400:
        logger.warning(f"HTTP {method} {url} - {status_code} - {response_time:.3f}s", extra=log_data)
    else:
        logger.info(f"HTTP {method} {url} - {status_code} - {response_time:.3f}s", extra=log_data)


def log_error(
    error: Exception,
    context: Optional[str] = None,
    user_id: Optional[int] = None,
    **kwargs
) -> None:
    """
    Log error details
    
    Args:
        error: Exception object
        context: Error context description
        user_id: User ID (if available)
        **kwargs: Additional parameters
    """
    log_data = {
        "type": "error",
        "error_type": type(error).__name__,
        "error_message": str(error),
        "context": context,
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Add additional parameters
    log_data.update(kwargs)
    
    logger.error(f"Error in {context}: {error}", extra=log_data)


def log_user_action(
    action: str,
    user_id: int,
    resource_type: Optional[str] = None,
    resource_id: Optional[int] = None,
    details: Optional[Dict[str, Any]] = None
) -> None:
    """
    Log user actions for audit trail
    
    Args:
        action: Action performed (create, read, update, delete, login, logout)
        user_id: User ID
        resource_type: Type of resource (habit, water, finance, journal)
        resource_id: Resource ID
        details: Additional details
    """
    log_data = {
        "type": "user_action",
        "action": action,
        "user_id": user_id,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "details": details or {},
        "timestamp": datetime.utcnow().isoformat()
    }
    
    logger.info(f"User {user_id} performed {action} on {resource_type} {resource_id}", extra=log_data)


def log_performance(
    operation: str,
    duration: float,
    user_id: Optional[int] = None,
    **kwargs
) -> None:
    """
    Log performance metrics
    
    Args:
        operation: Operation name
        duration: Operation duration in seconds
        user_id: User ID (if available)
        **kwargs: Additional parameters
    """
    log_data = {
        "type": "performance",
        "operation": operation,
        "duration": duration,
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Add additional parameters
    log_data.update(kwargs)
    
    if duration > 1.0:  # Log slow operations as warnings
        logger.warning(f"Slow operation: {operation} took {duration:.3f}s", extra=log_data)
    else:
        logger.info(f"Operation: {operation} took {duration:.3f}s", extra=log_data)


def log_security_event(
    event_type: str,
    user_id: Optional[int] = None,
    ip_address: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> None:
    """
    Log security-related events
    
    Args:
        event_type: Type of security event
        user_id: User ID (if available)
        ip_address: IP address
        details: Additional details
    """
    log_data = {
        "type": "security",
        "event_type": event_type,
        "user_id": user_id,
        "ip_address": ip_address,
        "details": details or {},
        "timestamp": datetime.utcnow().isoformat()
    }
    
    logger.warning(f"Security event: {event_type}", extra=log_data)


def log_business_metric(
    metric_name: str,
    value: float,
    user_id: Optional[int] = None,
    tags: Optional[Dict[str, str]] = None
) -> None:
    """
    Log business metrics
    
    Args:
        metric_name: Name of the metric
        value: Metric value
        user_id: User ID (if available)
        tags: Metric tags
    """
    log_data = {
        "type": "metric",
        "metric_name": metric_name,
        "value": value,
        "user_id": user_id,
        "tags": tags or {},
        "timestamp": datetime.utcnow().isoformat()
    }
    
    logger.info(f"Metric: {metric_name} = {value}", extra=log_data)


# Initialize logger on import
setup_logger()
