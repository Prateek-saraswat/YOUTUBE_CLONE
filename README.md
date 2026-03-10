# YouTube Clone (MERN Stack)

A full-stack YouTube clone built with MongoDB, Express.js, React, Node.js, Vite, Axios, and JWT authentication. The application supports user authentication, channel creation, video upload and management, category filtering, search, likes/dislikes, and full comment CRUD on the video player page.

## Overview

This project was developed as a MERN stack capstone assignment to recreate the core YouTube experience:

- browse videos on a responsive home page
- search videos by title
- filter videos by category
- register and log in with JWT-based authentication
- create a personal channel
- upload, edit, and delete videos from the channel page
- open a dedicated video player page
- like or dislike videos
- add, edit, and delete comments

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Vite
- Tailwind CSS
- React Icons
- SweetAlert2

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## Features

### Authentication

- user registration
- user login
- JWT-based protected routes
- persistent login using local storage
- header updates dynamically after login/logout

### Home Page

- YouTube-style header
- toggleable sidebar
- category filter buttons
- responsive video grid
- search by video title
- latest videos fetched from MongoDB

### Channel Page

- create a channel after login
- show channel banner, avatar, description, subscriber count, and video count
- upload videos from the channel page
- edit uploaded videos
- delete uploaded videos

### Video Player Page

- play selected video
- show title, description, and channel details
- like/dislike functionality
- comment CRUD
- suggested videos section

### Data Seeding

- sample users
- sample channels
- sample videos
- sample comments
- sample likes and dislikes

## Project Structure

```text
YOUTUBE_CLONE_PROJECT/
|-- Backend/
|   |-- config/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- seed.js
|   |-- server.js
|   `-- package.json
|-- Frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   `-- pages/
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## Prerequisites

Make sure these are installed before running the project:

- Node.js 18 or above
- npm
- MongoDB Atlas account or local MongoDB instance

## Environment Variables

Create a `.env` file inside the `Backend` folder.

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

## Running the Project

### Start the backend server

Run this from the `Backend` folder:

```powershell
node server.js
```

Backend runs on:

```text
http://localhost:3000
```

### Start the frontend server

Run this from the `Frontend` folder:

```powershell
npm run dev
```

Frontend usually runs on:

```text
http://localhost:5173
```

## Seeding the Database

To populate the database with demo data, run the seeder from the `Backend` folder:

```powershell
node seed.js
```

The seeder will:

- remove existing users, channels, videos, and comments
- add sample users
- add sample channels
- add sample videos
- add sample comments
- add sample likes/dislikes

### Demo Credentials

Use any of these test accounts after seeding:

- `john@example.com / password123`
- `jane@example.com / password123`
- `tech@example.com / password123`

## Frontend Scripts

Run these from the `Frontend` folder:

```powershell
npm run dev
npm run build
npm run preview
npm run lint
```

## API Overview

Base backend URL:

```text
http://localhost:3000/api
```

### Auth Routes

- `POST /auth/register`
- `POST /auth/login`

### Channel Routes

- `POST /channels`
- `GET /channels/:id`
- `PUT /channels/:id`
- `DELETE /channels/:id`

### Video Routes

- `POST /videos`
- `GET /videos`
- `GET /videos/:id`
- `PUT /videos/:id`
- `DELETE /videos/:id`
- `PUT /videos/:id/like`
- `PUT /videos/:id/dislike`

### Comment Routes

- `POST /comments/:videoId`
- `GET /comments/:videoId`
- `PUT /comments/:id`
- `DELETE /comments/:id`

## Main User Flow

1. Register a new account.
2. Log in using email and password.
3. Create a channel.
4. Upload a video.
5. View the uploaded video on the home page.
6. Search and filter videos by category.
7. Open a video player page.
8. Like or dislike the video.
9. Add, edit, or delete comments.
10. Edit or delete uploaded videos from the channel page.

## Validation and Behavior

- only authenticated users can create a channel
- only channel owners can upload, edit, or delete their own videos
- only authenticated users can like/dislike videos
- only authenticated users can add comments
- only comment owners can edit or delete their comments



