# 🏠 School System App

A full-stack web application for managing student accounts, importing student data via CSV, and registering grades. Only **admins** can access the system. Built with **React**, **TypeScript**, **Tailwind CSS** on the frontend and **Node.js**, **Express**, **Prisma**, **PostgreSQL**, and **Firebase Authentication** on the backend.

---

- 👤 Login

<img width="824" height="749" alt="Login" src="https://github.com/user-attachments/assets/a2f3e3d0-a865-44cf-b544-10d8a060cecb" />

- 🧿 Admin Student Accounts
  
  <img width="1151" height="956" alt="Screenshot 2025-11-24 at 08 16 01" src="https://github.com/user-attachments/assets/fe938d74-56a0-4173-9d0a-e2f880cdd895" />

- 👩🏻‍💻 Admin Register Grades
  
<img width="992" height="960" alt="Screenshot 2025-11-24 at 08 15 40" src="https://github.com/user-attachments/assets/4a598f24-cef2-4e38-9048-9933b32a666b" />

- 👩🏻‍🎓 Student Profile
  
  <img width="885" height="681" alt="Screenshot 2025-11-24 at 08 18 39" src="https://github.com/user-attachments/assets/fca5693a-2e45-45c5-abae-d82c918f4dc8" />

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

### 📝 Notes

- Only admin users authenticated via Firebase can access the system.

