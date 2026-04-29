# 📝 BlogSpace — Full-Stack Blog Platform

A complete blog platform with user authentication, post management, and comments.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) OR local MongoDB

---

### 1. Clone & Install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

---

### 2. Configure Environment

```bash
# In /server, copy and fill in your values:
cp .env.example .env
```

Edit `/server/.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/blogdb
JWT_SECRET=your_super_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

### 3. Run Locally

```bash
# Terminal 1 — Start backend
cd server && npm run dev

# Terminal 2 — Start frontend
cd client && npm run dev
```

Frontend → http://localhost:5173  
Backend API → http://localhost:5000/api

---

## 🌐 Deployment Guide

### Backend → Render.com (Free)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, select `/server` as root dir
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables from `.env`

### Frontend → Vercel (Free)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your repo, select `/client` as root dir
3. Add env variable: `VITE_API_URL=https://your-render-url.onrender.com/api`
4. Deploy!

---

## 📁 Project Structure

```
blog-platform/
├── server/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js     # JWT middleware
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/               # REST API routes
│   │   ├── auth.js           # /api/auth
│   │   ├── posts.js          # /api/posts
│   │   └── comments.js       # /api/comments
│   └── server.js             # Express entry point
└── client/
    └── src/
        ├── contexts/AuthContext.jsx
        ├── components/        # Reusable UI
        └── pages/             # Route pages
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create post (auth) |
| PUT | `/api/posts/:id` | Update post (owner) |
| DELETE | `/api/posts/:id` | Delete post (owner) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:postId` | Get comments for post |
| POST | `/api/comments/:postId` | Add comment (auth) |
| DELETE | `/api/comments/:id` | Delete comment (owner) |
