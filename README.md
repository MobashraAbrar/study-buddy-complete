# 📚 AI-Powered Study Buddy

> A full-stack intelligent study analytics platform built for SZABIST University AI Lab Final Project

![SZABIST](https://img.shields.io/badge/SZABIST-University-6366F1?style=for-the-badge)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)
![PHP](https://img.shields.io/badge/PHP-Backend-777BB4?style=for-the-badge&logo=php)
![Flask](https://img.shields.io/badge/Flask-AI%20API-000000?style=for-the-badge&logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)

---

## 👥 Team Members

| Name | Student ID | Role |
|------|-----------|------|
| Mobashra Abrar | 2312199 | Frontend (React) + PHP Backend + Integration |
| Hina | 2312177 | AI/ML Models + Flask API |
| Sumaya | 2312164 | Backend Design + Database + Documentation |

---

## 🚀 Features

- 🔐 **User Authentication** — Register and login with secure password hashing
- 📝 **Session Logger** — Log study sessions with subject, duration, break time, and time of day
- 🤖 **AI Predictions** — Get real-time focus level and productivity score predictions
- 📊 **Dashboard** — Interactive charts (Bar, Line, Pie) showing study trends
- 🎯 **Personalized Feedback** — Tips based on your AI prediction results

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Axios, Chart.js |
| Backend | PHP 8.2, MySQL, XAMPP |
| AI Service | Python Flask, scikit-learn, joblib |
| ML Models | Linear Regression + Random Forest |

---

## 📁 Project Structure

```
study-buddy-complete/
├── frontend/          ← React + Vite app
│   └── src/
│       └── App.jsx    ← All pages and components
├── backend/           ← PHP REST API
│   ├── db.php
│   ├── register.php
│   ├── login.php
│   ├── log_session.php
│   ├── sessions.php
│   └── predictions.php
└── ai/                ← Flask AI microservice
    ├── app.py
    ├── train.py
    └── models/
        ├── productivity_model.pkl
        ├── focus_model.pkl
        └── scaler.pkl
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- Python 3.10+
- XAMPP (Apache + MySQL)
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YourUsername/study-buddy-complete.git
cd study-buddy-complete
```

---

### 2️⃣ Setup AI / Flask

```bash
cd ai
pip install flask flask-cors numpy scikit-learn joblib
python train.py        # generates .pkl model files
python app.py          # starts Flask on http://localhost:5000
```

---

### 3️⃣ Setup Backend / PHP

1. Open **XAMPP** and start **Apache** and **MySQL**
2. Go to `http://localhost/phpmyadmin`
3. Create a database called `study_buddy`
4. Run this SQL:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE study_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  duration FLOAT NOT NULL,
  sessions_per_day FLOAT NOT NULL,
  break_time FLOAT NOT NULL,
  time_of_day INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE predictions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL UNIQUE,
  focus_level INT NOT NULL,
  productivity_score FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES study_sessions(id) ON DELETE CASCADE
);
```

5. Copy all files from `backend/` to `C:\xampp\htdocs\study-buddy-backend\`

---

### 4️⃣ Setup Frontend / React

```bash
cd frontend
npm install
npm run dev            # starts React on http://localhost:5173
```

---

### 5️⃣ Open the App

Go to: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/register.php` | Create new user |
| POST | `/login.php` | Login user |
| POST | `/log_session.php` | Save session + get AI prediction |
| GET | `/sessions.php?user_id=1` | Get all sessions |
| GET | `/predictions.php?user_id=1` | Get all predictions |

---

## 🤖 AI Model Details

| Model | Algorithm | Performance |
|-------|-----------|------------|
| Productivity Score | Linear Regression | MAE: 2.37, RMSE: 3.36 |
| Focus Level | Random Forest | Accuracy: 99.3% |

**Input features:** duration, time_of_day (0-3), sessions_per_day, break_time

**Output:** productivity_score (0-100), focus_level (0=Low, 1=Medium, 2=High)

---

## 📸 Screenshots

> Dashboard, Session Logger, and Landing Page screenshots here

---

## 📄 License

This project is submitted as a final project for the **Artificial Intelligence Lab** course at **SZABIST University, Karachi — Spring 2026**.

---

*Built with ❤️ by Mobashra, Hina, and Sumaya*
