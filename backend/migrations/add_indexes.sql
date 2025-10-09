-- Performance optimization indexes for Ayubi aka System Database
-- Run this after creating tables to improve query performance

-- Habits indexes
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_date ON habit_completions(user_id, completion_date);

-- Water (old) indexes
CREATE INDEX IF NOT EXISTS idx_water_entries_user_id ON water_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_water_entries_user_date ON water_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_water_entries_date ON water_entries(date);

-- Sport indexes
CREATE INDEX IF NOT EXISTS idx_sport_water_user_id ON sport_water(user_id);
CREATE INDEX IF NOT EXISTS idx_sport_water_user_date ON sport_water(user_id, date);
CREATE INDEX IF NOT EXISTS idx_sport_water_date ON sport_water(date);

CREATE INDEX IF NOT EXISTS idx_sport_food_user_id ON sport_food(user_id);
CREATE INDEX IF NOT EXISTS idx_sport_food_user_date ON sport_food(user_id, date);
CREATE INDEX IF NOT EXISTS idx_sport_food_date ON sport_food(date);

CREATE INDEX IF NOT EXISTS idx_sport_workout_user_id ON sport_workout(user_id);
CREATE INDEX IF NOT EXISTS idx_sport_workout_user_date ON sport_workout(user_id, date);
CREATE INDEX IF NOT EXISTS idx_sport_workout_date ON sport_workout(date);

-- Finance indexes
CREATE INDEX IF NOT EXISTS idx_finance_entries_user_id ON finance_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_entries_user_date ON finance_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_finance_entries_category ON finance_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_finance_entries_date ON finance_entries(date);
CREATE INDEX IF NOT EXISTS idx_finance_entries_type ON finance_entries(entry_type);

-- Journal indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(created_at);

-- For PostgreSQL, add full-text search index
-- CREATE INDEX IF NOT EXISTS idx_journal_content_fulltext ON journal_entries USING GIN (to_tsvector('english', content));

-- Travel indexes
CREATE INDEX IF NOT EXISTS idx_travel_wishlist_user_id ON travel_wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_wishlist_iso3 ON travel_wishlist(country_iso3);
CREATE INDEX IF NOT EXISTS idx_travel_wishlist_continent ON travel_wishlist(continent);

CREATE INDEX IF NOT EXISTS idx_travel_visited_user_id ON travel_visited(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_visited_iso3 ON travel_visited(country_iso3);
CREATE INDEX IF NOT EXISTS idx_travel_visited_date ON travel_visited(visit_date);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_habits_user_active ON habits(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_finance_entries_user_type_date ON finance_entries(user_id, entry_type, date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date_desc ON journal_entries(user_id, created_at DESC);

