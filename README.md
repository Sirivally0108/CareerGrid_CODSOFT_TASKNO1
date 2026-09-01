# CareerGrid

A full-stack job portal web application developed for the **CodSoft Internship – Task 1**.

CareerGrid connects job seekers with employers by allowing candidates to browse and search for jobs, apply with resumes and cover letters, track application status, and communicate with employers. Employers can post jobs, manage applications, update application statuses, and communicate with candidates.

---

## 🚀 Live Demo

👉 **[Open CareerGrid](https://careergrid-codsoft-taskno1.vercel.app)**

> The application is deployed and can be tested directly from the link above.

---

## 📌 Project Overview

CareerGrid is a full-stack job portal designed to provide a simple platform for both candidates and employers.

### Candidates can:

- Register and login securely
- Browse available jobs
- Search for jobs
- View detailed job information
- Apply for jobs
- Upload resumes
- Submit cover letters
- Track application status
- Withdraw applications
- Re-apply for jobs after withdrawal
- Message employers
- Receive email notifications for applications and status updates

### Employers can:

- Register and login securely
- Manage their employer account
- Post new jobs
- View jobs they have posted
- Manage job applications
- View candidate information
- View candidate resumes
- Read cover letters
- Message candidates
- Change application status
- Shortlist candidates
- Reject candidates
- Change application status when required

The application uses a PostgreSQL database hosted using **Supabase** and a Node.js/Express backend deployed on **Render**.

---

## ✨ Features

### 🔐 Authentication & Security

- User registration
- User login
- JWT authentication
- Password hashing using bcryptjs
- Protected routes
- Candidate and employer role-based access
- Secure application management

---

### 🏠 Home Page

- CareerGrid welcome section
- Job search functionality
- Featured job listings
- Navigation to available jobs
- Responsive layout

---

### 💼 Job Listings

- Display available job openings
- Job title
- Company name
- Location
- Salary
- Employment type
- Required skills
- Search functionality
- Responsive job cards

---

### 📄 Job Details

Each job has a dedicated details page containing:

- Job title
- Company
- Location
- Salary
- Employment type
- Job description
- Required skills
- Apply option
- Message employer option
- Application status

---

### 👨‍💼 Employer Dashboard

Employers can:

- View their dashboard
- Manage posted jobs
- Post new jobs
- View applications
- Review candidates
- View resumes
- Read cover letters
- Message candidates
- Update application status

Application statuses include:

- Applied
- Shortlisted
- Rejected

The status can be changed when required.

---

### 👨‍🎓 Candidate Dashboard

Candidates can:

- Manage their profile
- View applied jobs
- Track application status
- View application details
- Withdraw applications
- Message employers

Withdrawn applications are removed from the active application list and candidates can apply again if the job is still available.

---

### 📝 Job Application Process

Candidates can apply for jobs by submitting:

- Resume
- Cover letter

The backend validates the application and prevents duplicate active applications.

If an application is withdrawn, the candidate can apply for the same job again.

---

### 📎 Resume Upload

The application supports:

- PDF
- DOC
- DOCX

Resume files are uploaded through the backend and served through the application's upload endpoint.

File upload validation includes:

- Allowed file types
- Maximum file size
- Secure server-side processing

---

### 🔎 Search Functionality

Candidates can search for jobs using the search interface.

Search can be used to find jobs based on relevant job information such as:

- Job title
- Company
- Skills
- Location

---

### 💬 Messaging

CareerGrid provides messaging functionality between:

- Candidates and employers
- Employers and candidates

Candidates can message employers from job details.

Employers can message candidates from the applications section.

---

### 📧 Email Notifications

Email notifications are implemented for important application events.

Candidates can receive notifications when:

- An application is successfully submitted
- Application status is updated

The email service is handled by the backend.

---

### 📱 Mobile Responsiveness

The website is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

Responsive CSS is used throughout the frontend.

---

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- JavaScript
- React Router
- CSS

### Backend

- Node.js
- Express.js
- JavaScript
- REST API
- Multer

### Database

- PostgreSQL
- Supabase
- `pg` PostgreSQL client

### Authentication

- JWT
- bcryptjs

### Email

- Nodemailer

### Deployment

- Vercel – Frontend
- Render – Backend
- Supabase – PostgreSQL Database

---

## 📂 Project Structure

```text
CareerGrid/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── queries.sql
│   ├── ER_Diagram.png
│   └── README.md
│
├── .gitignore
└── README.md
