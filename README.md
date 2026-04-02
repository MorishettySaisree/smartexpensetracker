# 💰 Smart Expense Management & Budget Tracking System

A full-stack web application built with **Java Spring Boot + MySQL + HTML/CSS/JS**
for managing personal expenses and monthly budgets.

---

## 📁 Final Project Folder Structure

```
smart-expense/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/smartexpense/
│       │   ├── SmartExpenseApplication.java
│       │   ├── config/
│       │   │   ├── CorsConfig.java
│       │   │   └── PasswordEncoderConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── BudgetController.java
│       │   │   ├── ExpenseController.java
│       │   │   ├── ProfileController.java
│       │   │   └── ReportController.java
│       │   ├── dto/
│       │   │   ├── BudgetRequest.java / BudgetResponse.java
│       │   │   ├── ChangePasswordRequest.java
│       │   │   ├── DashboardResponse.java
│       │   │   ├── ExpenseRequest.java / ExpenseResponse.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── MonthlyReportResponse.java
│       │   │   ├── RegisterRequest.java
│       │   │   ├── UpdateProfileRequest.java
│       │   │   └── UserResponse.java
│       │   ├── entity/
│       │   │   ├── Budget.java
│       │   │   ├── Expense.java
│       │   │   └── User.java
│       │   ├── exception/
│       │   │   ├── BadRequestException.java
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   └── ResourceNotFoundException.java
│       │   ├── repository/
│       │   │   ├── BudgetRepository.java
│       │   │   ├── ExpenseRepository.java
│       │   │   └── UserRepository.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       ├── BudgetService.java
│       │       ├── ExpenseService.java
│       │       ├── ProfileService.java
│       │       └── ReportService.java
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── common.js
│   │   ├── dashboard.js
│   │   ├── expense.js
│   │   ├── profile.js
│   │   └── report.js
│   ├── index.html
│   ├── register.html
│   ├── dashboard.html
│   ├── add-expense.html
│   ├── expenses.html
│   ├── report.html
│   └── profile.html
│
├── database-setup.sql
└── README.md
```

---

## ⚙️ STEP 1 — Prerequisites

Install these before running:
- Java 17+        → https://adoptium.net
- Maven 3.8+      → https://maven.apache.org
- MySQL 8.0+      → https://dev.mysql.com/downloads/
- VS Code         → with "Live Server" extension

---

## 🗄️ STEP 2 — MySQL Database Setup

Open MySQL terminal or MySQL Workbench, then run:

```sql
CREATE DATABASE IF NOT EXISTS smart_expense_db;
```

Or run the included script:
```
mysql -u root -p < database-setup.sql
```

Then update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

> Hibernate will auto-create all tables (users, expenses, budgets) on first run.

---

## 🚀 STEP 3 — Run the Backend

Open terminal in VS Code, navigate to the backend folder:

```bash
cd backend
mvn spring-boot:run
```

✅ Backend starts at: **http://localhost:8080**

You should see:
```
Started SmartExpenseApplication in 3.2 seconds
```

---

## 🌐 STEP 4 — Run the Frontend

**Option A – VS Code Live Server (Recommended)**
1. Open `frontend/` folder in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. App opens at `http://127.0.0.1:5500/index.html`

**Option B – Simple HTTP Server (Python)**
```bash
cd frontend
python -m http.server 5500
```
Then open: `http://localhost:5500/index.html`

---

## 🧪 STEP 5 — Test the APIs (Verify Backend)

Use these curl commands or Postman:

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Ravi Kumar","email":"ravi@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ravi@test.com","password":"test123"}'
```

### Add Expense
```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Lunch","amount":250,"category":"Food","date":"2025-06-10","userId":1}'
```

### Get Dashboard
```bash
curl http://localhost:8080/api/expenses/dashboard/1
```

### Set Budget
```bash
curl -X POST http://localhost:8080/api/budgets \
  -H "Content-Type: application/json" \
  -d '{"amount":15000,"month":6,"year":2025,"userId":1}'
```

### Get Monthly Report
```bash
curl "http://localhost:8080/api/reports/monthly?userId=1&month=6&year=2025"
```

---

## ✅ STEP 6 — Testing Checklist

| Feature              | Expected Result                                |
|----------------------|------------------------------------------------|
| Register             | Account created, redirects to login            |
| Login                | Session saved in localStorage, goes to dashboard |
| Add Expense          | Expense saved, success message shown           |
| View Expenses        | All expenses listed in table                   |
| Delete Expense       | Expense removed, table refreshed               |
| Set Budget           | Budget saved for current month                 |
| Dashboard Stats      | Total, today, monthly, budget left all correct |
| Budget Progress Bar  | Shows % of budget used with color coding       |
| Budget Alert         | Red banner when spending exceeds budget        |
| Monthly Report       | Pie chart, bar chart, category breakdown shown |
| Profile Edit         | Name/email updated in DB and localStorage      |
| Change Password      | Old password verified, new password saved      |
| Logout               | localStorage cleared, redirected to login      |
| Refresh protection   | Pages redirect to login if not logged in       |

---

## 🌍 STEP 7 — Deployment (College Submission)

### Easiest Option — Frontend on Netlify + Backend on Render

**Backend (Render.com):**
1. Push backend to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Build command: `mvn clean package -DskipTests`
5. Start command: `java -jar target/smart-expense-1.0.0.jar`
6. Add environment variables for DB (use Render's free MySQL or Aiven)
7. Your backend URL: `https://smart-expense.onrender.com`

**Frontend (Netlify):**
1. Update `API_BASE` in `frontend/js/common.js`:
   ```js
   const API_BASE = 'https://smart-expense.onrender.com/api';
   ```
2. Drag and drop the `frontend/` folder to https://netlify.com/drop
3. Your frontend URL: `https://your-app.netlify.app`

---

## 📂 STEP 8 — Git & GitHub Commands

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Smart Expense Management System"

# Rename branch
git branch -M main

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/smart-expense.git

# Push to GitHub
git push -u origin main
```

---

## 🎓 STEP 9 — Viva Explanation

### Project Title
**Smart Expense Management and Budget Tracking System**

### Abstract
A full-stack web application that allows users to register, log in, track personal
expenses with categories, set monthly budgets, and view detailed reports with charts.
Built using Java Spring Boot (REST API), MySQL (database), and HTML/CSS/JavaScript (frontend).

### Architecture
```
Frontend (HTML/CSS/JS)
    ↓ fetch() HTTP calls
REST API (Spring Boot Controllers)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (JPA / Spring Data)
    ↓
MySQL Database
```

### Key Features to Demonstrate
1. Register → Login → Dashboard
2. Add an expense (Food ₹500)
3. Show dashboard stats update live
4. Set a budget (₹2000) → watch progress bar
5. Add more expenses until budget is exceeded → red alert appears
6. Open Monthly Report → show pie chart, bar chart, category breakdown
7. Edit profile name → show it updates in sidebar too
8. Logout → confirm redirect to login

### Technologies Used
| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML5, CSS3, JavaScript, Chart.js   |
| Backend    | Java 17, Spring Boot 3.2, Maven     |
| Database   | MySQL 8.0, Spring Data JPA          |
| Security   | BCrypt password hashing             |
| API Style  | REST (JSON)                         |

### API Endpoints Summary
| Method | Endpoint                              | Purpose              |
|--------|---------------------------------------|----------------------|
| POST   | /api/auth/register                    | User registration    |
| POST   | /api/auth/login                       | User login           |
| POST   | /api/expenses                         | Add expense          |
| GET    | /api/expenses/user/{userId}           | Get all expenses     |
| DELETE | /api/expenses/{id}                    | Delete expense       |
| GET    | /api/expenses/dashboard/{userId}      | Dashboard data       |
| POST   | /api/budgets                          | Set/update budget    |
| GET    | /api/budgets?userId&month&year        | Get budget           |
| GET    | /api/reports/monthly?userId&month&year | Monthly report      |
| GET    | /api/profile/{userId}                 | Get profile          |
| PUT    | /api/profile/{userId}                 | Update profile       |
| PUT    | /api/profile/change-password/{userId} | Change password      |

---

## ❗ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Access denied for user 'root'@'localhost'` | Update DB password in application.properties |
| `Cannot connect to database` | Make sure MySQL is running: `net start mysql` |
| CORS error in browser | CorsConfig.java is already set to allow all origins |
| Port 8080 already in use | Kill old Java process or change `server.port=8081` |
| Frontend shows nothing | Make sure backend is running at port 8080 |
| `Table 'users' doesn't exist` | Run the backend once — Hibernate creates tables automatically |
