-- ============================================================
-- Smart Expense Management System – MySQL Setup
-- Run this in MySQL Workbench or terminal before starting backend
-- ============================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS smart_expense_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_expense_db;

-- ============================================================
-- NOTE: Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- will AUTO-CREATE all tables when you run the backend.
-- You do NOT need to manually create tables.
-- Just run this file to create the database only.
-- ============================================================

-- Optional: verify tables after running backend
-- SHOW TABLES;
-- DESCRIBE users;
-- DESCRIBE expenses;
-- DESCRIBE budgets;

-- ============================================================
-- Sample data (optional – for testing)
-- Password below = "test123" (BCrypt encoded)
-- ============================================================
-- INSERT INTO users (full_name, email, password) VALUES
--   ('Ravi Kumar', 'ravi@example.com',
--    '$2a$10$N.zmdr9zkFdFJFSLVqg0O.bGm5ooUAHxDVrJR8GQW/P3HmxA8VYXO');

-- ============================================================
-- Verify user: (login with ravi@example.com / test123)
-- ============================================================
