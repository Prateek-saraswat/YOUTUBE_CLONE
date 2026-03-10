# YouTube Clone - MERN Stack

A full-stack YouTube clone built with MongoDB, Express, React, Node.js, Vite, Axios, and JWT authentication.

## Features

- User registration and login with JWT authentication
- Header with search bar
- Toggleable sidebar
- Home page with video grid
- Search by video title
- Category-based video filters
- Channel creation for logged-in users
- Channel page with uploaded videos
- Upload, edit, and delete video flow
- Video player page
- Like and dislike functionality
- Comment CRUD on the video player page
- MongoDB seed script for test data

## Tech Stack

- Frontend: React, React Router, Axios, Vite, Tailwind CSS, SweetAlert2
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT

## Project Structure

```text
YOUTUBE_CLONE_PROJECT/
├─ Backend/
│  ├─ config/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ models/
│  ├─ routes/
│  ├─ seed.js
│  └─ server.js
└─ Frontend/
   ├─ src/
   │  ├─ api/
   │  ├─ components/
   │  ├─ context/
   │  └─ pages/
   └─ vite.config.js
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB instance

## Environment Variables

Create a `.env` file inside `Backend/` with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRE_TIME=7d
PORT=3000
```

## Installation

### 1. Install backend dependencies

```powershell
cd Backend
npm install
```

### 2. Install frontend dependencies

```powershell
cd ..\Frontend
npm install
```

## Run the Project

### Start backend

```powershell
cd Backend
node server.js
```

Backend runs on `http://localhost:3000`.

### Start frontend

```powershell
cd Frontend
npm run dev
```

Frontend runs on the Vite local URL shown in the terminal, usually `http://localhost:5173`.

## Seed the Database

Run this from the `Backend` folder:

```powershell
node seed.js
```

This will:

- clear existing users, channels, videos, and comments
- insert sample users
- insert sample channels
- insert sample videos
- insert sample comments
- attach sample likes/dislikes

### Seeded Login Credentials

- `john@example.com / password123`
- `jane@example.com / password123`
- `tech@example.com / password123`

## Available Frontend Scripts

Run these from `Frontend/`:

```powershell
npm run dev
npm run build
npm run preview
npm run lint
```

## Backend API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Channels

- `POST /api/channels`
- `GET /api/channels/:id`
- `PUT /api/channels/:id`
- `DELETE /api/channels/:id`

### Videos

- `POST /api/videos`
- `GET /api/videos`
- `GET /api/videos/:id`
- `PUT /api/videos/:id`
- `DELETE /api/videos/:id`
- `PUT /api/videos/:id/like`
- `PUT /api/videos/:id/dislike`

### Comments

- `POST /api/comments/:videoId`
- `GET /api/comments/:videoId`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`

## Main User Flows

### Authentication

Users can register, log in, and stay authenticated using JWT stored in local storage.

### Home Page

Users can browse videos, search by title, and filter by category.

### Channel Page

Logged-in users can create one channel, upload videos, edit videos, and delete videos from their channel page.

### Video Player Page

Users can watch videos, like/dislike videos, and add, edit, or delete comments.

## Notes

- This project uses ES Modules.
- The frontend is built with Vite, not CRA.
- The backend currently uses `node server.js` directly; no separate dev script is configured.


