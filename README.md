# Movie Project (Cinema Booking System)

[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docs.docker.com/compose/)
[![NestJS](https://img.shields.io/badge/NestJS-Framework-red)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-Frontend-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-orange)](https://www.mysql.com/)

A full-stack cinema ticket booking application with a user-facing UI and an admin dashboard. The backend is built with NestJS + Prisma + MySQL, and the frontend is built with React + Redux + Tailwind. The project exposes Swagger API docs, supports movie/user/showtime management, and provides a booking flow.

## Features

- Browse movies, banners, details, and showtimes
- User registration, login, booking, and ticket history
- Admin dashboard for movie/user management and showtime creation
- Image upload and static file serving from /public
- Swagger API documentation at /swagger

## Tech Stack

- Frontend: React, Redux Toolkit, React Router, Tailwind CSS, Ant Design, Formik/Yup
- Backend: NestJS, Prisma (MariaDB adapter), JWT, Swagger
- Database: MySQL 8
- DevOps: Docker Compose

## Repository Structure

- Cinema-Project-Backend/: NestJS API and Prisma
- Cinema-Project-FrontEnd/: React SPA
- db-init/: SQL schema + seed data

## Quick Start with Docker Compose (recommended)

### 1) Create MySQL .env (root)

Create .env in the repository root:

```
DATABASE_NAME=db_clone_capstone_movie
DATABASE_PASSWORD=1234
```

### 2) Update backend environment

Edit Cinema-Project-Backend/.env to use the MySQL container:

```
DATABASE_URL="mysql://root:1234@mysql_db:3306/db_clone_capstone_movie?allowPublicKeyRetrieval=true"
JWT_SECRET="your-secret"
PORT=8088
```

### 3) Update frontend environment

Edit Cinema-Project-FrontEnd/.env:

```
REACT_APP_API_URL=http://localhost:8088/
REACT_APP_TOKEN_BACKEND=<admin-token>
REACT_APP_AUTHORIZATION_TOKEN=<bearer-token>
REACT_APP_THE_MOVIEDB_AUTHORIZATION_TOKEN=<tmdb-read-token>
```

Token notes:

- Quick admin token: GET http://localhost:8088/auth/create-token
- For local dev, you can reuse the same token for REACT_APP_TOKEN_BACKEND and REACT_APP_AUTHORIZATION_TOKEN
- Get the TMDB Read Access Token at https://www.themoviedb.org/ (API settings)

### 4) Run Docker

```
docker compose up --build
```

Access URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:8088
- Swagger: http://localhost:8088/swagger
- MySQL: localhost:3308 (user: root, pass: DATABASE_PASSWORD)

Stop containers:

```
docker compose down
```

Reset DB and re-run seed data:

```
docker compose down -v
```

## Local Development (without Docker)

### 1) Requirements

- Node.js 18+ (Node 20 LTS recommended)
- Yarn or npm
- MySQL 8

### 2) Create database and import data

- Create database: db_clone_capstone_movie
- Import db-init/Banner.sql

### 3) Backend

```
cd Cinema-Project-Backend
yarn install
npx prisma generate
yarn start:dev
```

### 4) Frontend

```
cd Cinema-Project-FrontEnd
yarn install
yarn build:css
yarn start
```

## Environment Variables

### Backend (Cinema-Project-Backend/.env)

- DATABASE_URL: MySQL connection string
- JWT_SECRET: JWT signing secret
- PORT: backend port (default 8088)

### Frontend (Cinema-Project-FrontEnd/.env)

- REACT_APP_API_URL: backend base URL (keep trailing slash)
- REACT_APP_TOKEN_BACKEND: admin token sent via Token header
- REACT_APP_AUTHORIZATION_TOKEN: Bearer token for Authorization header
- REACT_APP_THE_MOVIEDB_AUTHORIZATION_TOKEN: TMDB Read Access Token

Do not commit real tokens or secrets to the repository.

## API Docs

Open in browser: http://localhost:8088/swagger

## Notes and Troubleshooting

- If DB connection fails, verify DATABASE_URL and the MySQL host/port. For Docker use mysql_db:3306; for local MySQL use localhost:3306 (or your custom port).
- The MySQL container loads db-init/\*.sql only when the volume is empty. Use docker compose down -v to reset.
- Static files are served at /public (for example: http://localhost:8088/public/...).
- If images are missing in the UI, check REACT_APP_API_URL and ensure the backend is running.
