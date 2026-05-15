# <p align="center">✨ Nexus — The Ultimate Team Task Manager ✨</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

---

## 🌟 Overview
**Nexus** is a premium, high-performance collaborative task management application designed for ambitious teams. It combines a stunning **Glassmorphic UI** with robust full-stack functionality to provide a seamless project management experience.

---

## 🚀 Key Features

### 🔐 Secure Authentication
- **Role-Based Access Control (RBAC)**: Choose between **Admin** or **Member** roles during signup.
- **JWT Security**: Session-based login with secure token management.
- **Forgot Password**: Fully functional recovery flow with secure email tokens.

### 📊 Project & Task Management
- **Collaborative Workspaces**: Create projects and invite your team.
- **Advanced Task Tracking**: Manage tasks with priority levels, due dates, and status transitions.
- **Visual Kanban**: Track progress through a modern interface.

### 🛡️ Administrative Power
- **Team Oversight**: Admins can invite/remove members and manage user roles.
- **Professional Activity Log**: A complete audit trail of task status changes (e.g., `Pending` → `In Progress` → `Done`).
- **Workspace Analytics**: Real-time stats on team performance and task completion.

### 🎨 Premium Aesthetics
- **Dark Mode by Default**: Sleek, modern dark-themed design.
- **Glassmorphism**: Beautiful translucent UI elements.
- **Micro-Animations**: Smooth transitions using Framer Motion & CSS.

---

## 🛠️ Technology Stack

| Frontend | Backend | Database |
| :--- | :--- | :--- |
| React 19 & Vite | Node.js & Express | MongoDB Atlas |
| TanStack Router | Passport.js & JWT | Mongoose |
| Tailwind CSS 4 | Morgan & CORS | |

---

## 📡 Deployment Links

- **Live Frontend (Vercel)**: [View Application](https://nexus-ethara-assignment.vercel.app)
- **Backend API (Render)**: [API Endpoint](https://nexus-ethara-assignment.onrender.com/api)

---

## 📖 Deployment Guide

### 🧱 Backend (Render)
1. **Root Directory**: `backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for signing tokens.

### 🌐 Frontend (Vercel)
1. **Root Directory**: `frontend`
2. **Framework Preset**: `Vite` (or `Other`)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variable**:
   - `VITE_API_URL`: `https://nexus-ethara-assignment.onrender.com/api`

---

## 👥 User Roles Explanation

| Feature | Admin | Member |
| :--- | :---: | :---: |
| Create Projects | ✅ | ❌ |
| Manage Team | ✅ | ❌ |
| View Admin Panel | ✅ | ❌ |
| Activity Logs | ✅ | ❌ |
| Edit Assigned Tasks | ✅ | ✅ |
| View Dashboard | ✅ | ✅ |

---

## 🛠️ Local Installation

```bash
# Clone the repository
git clone https://github.com/Rishav5505/Nexus-Ethara-Assignment.git

# Setup Backend
cd backend
npm install
npm run dev

# Setup Frontend
cd frontend
npm install
npm run dev
```

---

<p align="center">Made with ❤️ for the Team Task Manager Assignment</p>
