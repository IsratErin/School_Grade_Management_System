# 🏠 School System App

A full-stack web application for managing student accounts, importing student data via CSV, and registering grades. Only **admins** can access the system. Built with **React**, **TypeScript**, **Tailwind CSS** on the frontend and **Node.js**, **Express**, **Prisma**, **PostgreSQL**, and **Firebase Authentication** on the backend.

---

## 👤 Demo

https://github.com/user-attachments/assets/ea63c85e-25fe-4c68-a8f0-d5b610b8c082




---

## Features

- **Admin Student Accounts**

  - View all students by year.
  - Hover over a student to see detailed info.
  - Edit or delete student accounts.
  - Import students via CSV (validated before saving).

- **Admin Register Grades**

  - View courses and grades by year.
  - Add new grades for students (including newly imported students).
  - Edit existing grades.

- **Backend API**
  - Fetch students, grades, and courses.
  - Import students via CSV.
  - Add, update, or delete students and grades.
  - Access restricted to authenticated **admin users**.
  - Data validation using Zod.

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Firebase Authentication, Papaparse (CSV)
- **Backend:** Node.js, Express, Prisma, PostgreSQL, Firebase Admin SDK, TDD approach using Jest
- **Validation:** Zod
- **Notifications:** react-hot-toast

---

## Setup

### 👤 Backend

1. Install dependencies:
 <pre>
 cd backend
 npm install
</pre>

2. Configure environment variables:
<pre>
DATABASE_URL=postgresql://user:password@localhost:5432/studentdb
PORT=5001
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
</pre>

3. Run Prisma migrations:

   npx prisma migrate dev

4. Start server:

   npm run dev

### 🌸 Frontend

1. Install dependencies:

<pre>
  
  cd frontend
  npm install
  
</pre>

2. Start development server:

   npm run dev

3. Access app at http://localhost:5173

4. Admin users must log in via Firebase Authentication to access the dashboard.

---

### 🔗 CSV Import

- Format: .csv with headers:

  firstName,lastName,email,personNr,year,phone,adress

- Use the Import CSV button in Admin Student Accounts.

- Validation is applied to personNr (DDMMYY-XXXX) and email formats.

### 🚀 API Endpoints

- Students

  - GET /admin/students – Get all students (admin only).

  - POST /admin/students/import – Import students via CSV (admin only).

  - PUT /admin/students/:personNr – Update a student (admin only).

  - DELETE /admin/students/:personNr – Delete a student (admin only).

- Greades

  - GET /admin/grades – Get all courses (admin only).

  - GET /admin/grades/:course/:year – Get grades for a course/year (admin only).

  - POST /admin/grades/:personNr – Add a new grade (admin only).

  - PUT /admin/grades/:gradeId – Update existing grade (admin only).

---

## 🧪 Running Tests

The backend includes comprehensive **unit tests** and **integration tests** using **Jest**.

### Test Structure

```
backend/tests/
├── unit/
│   └── validators/
│       └── validation.test.ts       # Validation logic tests
└── integration/
    └── routes/
        ├── studentRoute.integration.test.ts   # Student routes tests
        ├── students.integration.test.ts       # Admin student routes tests
        └── viewGrades.integration.test.ts     # Admin grades routes tests
```

### Run All Tests

```bash
cd backend
npm test
```

### Run Specific Test File

```bash
# Unit tests
npm test -- validation.test.ts

# Integration tests
npm test -- studentRoute.integration.test.ts
npm test -- students.integration.test.ts
npm test -- viewGrades.integration.test.ts
```

### Prerequisites for Testing

- PostgreSQL database must be running
- Environment variables configured in `.env`
- Database migrations applied (`npx prisma migrate dev`)

---

### 📝 Notes

- Only admin users authenticated via Firebase can access the system.
