
# Student and Teacher Portal

## Project Overview

The **Student and Teacher Portal** is a web application designed for teachers and students to manage and view profiles. Teachers can create, edit, and delete student profiles, while students can only view their own profile.

The system uses **JWT** for secure authentication and authorization.

---

## Features

- **Teachers**:
  - Manage (add, edit, delete) student profiles.
  - View all student profiles.
  
- **Students**:
  - View their own profile.

- **Authentication & Authorization**:
  - JWT-based login for secure access.

---

## Technologies

- **Frontend**: Angular 16, Angular Material, Reactive Forms, Lazy Loading
- **Backend**: Express.js
- **Database**: MongoDB
- **Security**: JWT for authentication and authorization

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Student_and_Teacher_Portal.git
cd Student_and_Teacher_Portal
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
npm install
```

Create a `.env` file for environment variables (`MONGO_URI`, `JWT_SECRET`), then start the backend server:

```bash
npm start
```

### 3. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

Start the frontend server:

```bash
ng serve
```

---

## API Endpoints

- **POST /api/auth/login**: Login and receive JWT token.
- **GET /api/students**: List all students (teacher access).
- **POST /api/students**: Add new student (teacher access).
- **PUT /api/students/:id**: Update student profile (teacher access).
- **DELETE /api/students/:id**: Delete student profile (teacher access).
- **GET /api/students/:id**: View student profile (students can only view their own).

---

