# WIMDOC – Doctor Appointment Management System
A full-stack web application built for the Modex Assessment.  
It includes:

- Public patient-facing booking portal
- Admin dashboard for doctors, slots, appointments
- Secure backend with Express + PostgreSQL
- Responsive React frontend with Vite + Tailwind

Live URLs:
- Frontend: https://wimdoc-lake.vercel.app
- Backend: https://wimdoc.onrender.com/api

---

## Tech Stack
### Frontend
- React + Vite + TypeScript
- TailwindCSS + Framer Motion
- React Router DOM
- Deployed on Vercel

### Backend
- Node.js + Express
- PostgreSQL (Railway)
- JWT Auth, Bcrypt, Helmet, Morgan
- Deployed on Render

---

## Features

### Public Portal
- View doctors list by specialization  
- View doctor profile  
- See available time slots  
- Book appointments  
- Confirm booking  
- View My Bookings  

### Admin Portal
- Login (JWT-based)  
- Dashboard overview  
- Create doctors  
- Manage doctors  
- Create & manage availability schedules  
- Manage slots  
- View & manage bookings  

---

## Database Schema (PostgreSQL)

### doctors
| id | name | specialization | created_at |

### slots
| id | doctor_id | slot_time | is_booked | created_at |

### bookings
| id | user_name | doctor_id | slot_id | created_at |

---

## API ENDPOINTS

### **Auth**
`POST /api/auth/login`  
Request:
```json
{ "username": "admin" }
