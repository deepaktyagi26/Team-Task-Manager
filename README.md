# 🚀 Team Task Manager

A high-performance, full-stack task management application designed for seamless team collaboration. Featuring a premium glassmorphism UI, robust role-based access control, and real-time profile synchronization.

![Team Task Manager Banner](https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login and signup system with password hashing.
- **👥 Role-Based Access Control (RBAC)**: 
  - `ADMIN`: Full control over projects, tasks, and users.
  - `MEMBER`: Focused task execution and status tracking.
- **📂 Project Management**: Organize work into distinct projects with descriptions and ownership.
- **✅ Task Management**: 
  - Create and assign tasks to team members.
  - Track progress with statuses: `TODO`, `IN_PROGRESS`, and `DONE`.
  - Set deadlines with due dates.
- **🎨 Premium UI/UX**: Stunning glassmorphism design with responsive layouts and smooth micro-animations.
- **🔄 Real-time Updates**: Synchronized state management ensures profile changes reflect instantly across the dashboard.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router 7
- **Styling**: Custom CSS (Glassmorphism design system)
- **Icons**: Lucide React
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **ORM**: Prisma
- **Database**: SQLite
- **Security**: JWT, bcryptjs

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "Team Task Manager"
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` folder:
     ```env
     JWT_SECRET=your_super_secret_key
     DATABASE_URL="file:./dev.db"
     ```
   - Initialize the database:
     ```bash
     npx prisma migrate dev --name init
     npx prisma generate
     ```
   - Start the backend:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the development server:
     ```bash
     npm run dev
     ```

## 📂 Project Structure

```text
Team Task Manager/
├── backend/                # Express API & Prisma Schema
│   ├── prisma/             # DB Models & Migrations
│   └── src/
│       ├── middleware/     # Auth & Error Handlers
│       ├── routes/         # API Endpoints
│       └── server.js       # Entry Point
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── context/        # Global State (Auth, Tasks)
│   │   ├── pages/          # Application Views
│   │   └── App.jsx         # Main Router
└── README.md
```

## 🛡️ License

This project is licensed under the ISC License.

---
Built with ❤️ by Antigravity
