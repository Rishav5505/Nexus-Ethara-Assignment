# Nexus — Team Task Manager

A professional, full-stack collaborative task management application built with React, Node.js, and MongoDB.

## Features
- **Role-Based Authentication**: Secure Signup/Login with JWT. Admin and Member roles supported.
- **Forgot Password**: Fully functional password reset flow with secure tokens.
- **Project Management**: Create, update, and manage projects with team members.
- **Task Management**: Advanced task tracking with priority, status, and due dates.
- **Team Management**: Admins can invite/remove members and change roles.
- **System Activity Log**: Professional audit trail showing task transitions (e.g., Pending → In Progress → Done).
- **Analytics Dashboard**: Overview of workspace stats, task distribution, and team performance.
- **Premium UI**: Modern dark-themed design with glassmorphism and smooth animations.

## Tech Stack
- **Frontend**: React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS 4, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose, Passport.js.
- **Database**: MongoDB (Atlas).

## Deployment Guide

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com).
2. Connect this GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Add the following Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel application URL (update this after deploying frontend).

### Frontend (Vercel)
1. Create a new Project on [Vercel](https://vercel.com).
2. Connect this GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Add the following Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-backend.onrender.com/api`).

## Local Setup
1. Clone the repo: `git clone https://github.com/Rishav5505/Nexus-Ethara-Assignment.git`
2. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
3. Configure `.env` files based on the structure in `backend/server.js`.
4. Run development servers:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`
