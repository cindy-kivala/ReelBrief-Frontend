## ReelBrief - Creative Project Management & Freelancer Collaboration Platform


# Overview
- ReelBrief is a specialized project management platform connecting creative agencies with vetted freelance designers, copywriters, and videographers. The platform streamlines the entire creative workflow from freelancer onboarding through project delivery and payment.

- Live Demo: https://reel-brief-frontend.vercel.app
- API Base URL: https://reelbrief-api.onrender.com

# Key Features
- Authentication & RBAC
- Secure JWT-based authentication

# Role-specific dashboards and permissions
- Three distinct user roles: Agency Admin, Freelancer, Client

# Email verification and password reset

- Freelancer Vetting & Onboarding
# CV/resume upload during registration (PDF/DOCX support)

- Admin review interface for freelancer applications

- Application status tracking (Pending -> Approved -> Rejected)

- "Open to Work" availability toggle

- Skills listing with proficiency levels


# Project Management
- Availability-first workflow: confirm freelancer availability before payment

- Intelligent project matching based on skills and availability

- Sensitive project flagging for confidentiality

- Project status tracking (Submitted -> Matched -> In Progress -> Review -> Completed)

# Deliverable Management
- Version-controlled file uploads via Cloudinary

- Automatic version tracking (v1, v2, v3) with change notes

- Side-by-side version comparison interface

- Image preview optimization

# Structured Feedback System
- Structured revision requests with priority levels

- Feedback history log

# Escrow Payment System
- Admin-held escrow for client funds

- Automated payment release upon final approval

- Complete transaction audit trail

- Invoice generation and payment status tracking

# Automated Portfolio Generation
- Approved projects automatically added to freelancer portfolios

- Confidentiality controls for sensitive projects

- Public portfolio pages with shareable URLs


# Email Notification System
- 10+ automated workflows for onboarding, project lifecycle, payments

- Professional HTML templates via SendGrid

- Deadline reminders and urgency alerts

## Tech Stack
# Frontend
- React 18 - UI framework

- Vite - Build tool

- Tailwind CSS - Styling

- Axios - HTTP client

- React Router - Navigation

# Backend
- Flask - Python web framework

- PostgreSQL - Database

- SQLAlchemy - ORM

- Flask-JWT-Extended - Authentication

- Flask-CORS - Cross-origin requests

- Flasgger - API documentation

## External Services
- Cloudinary - File storage and image processing

- SendGrid - Email delivery

- Render - Backend hosting

- Vercel - Frontend hosting

# Project Structure
ReelBrief-Frontend/
├── src/
│   ├── api/                 # API clients
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── context/            # React context
│   └── hooks/              # Custom hooks

ReelBrief-Backend/
├── app/
│   ├── models/             # Database models
│   ├── resources/          # API routes
│   ├── services/           # Business logic
│   ├── schemas/            # Marshmallow schemas
│   └── utils/              # Utilities

# Quick Start
# Prerequisites
- Node.js 16+

- Python 3.9+

- PostgreSQL 15+

# Frontend Setup

# Clone the repository
- git clone git@github.com:cindy-kivala/ReelBrief-Frontend.git
- cd ReelBrief-Frontend

# Install dependencies
- npm install

# Set up environment variables
- cp .env.example .env
# Edit .env with your configuration

# Start development server
- npm run dev

# Backend Setup
# Clone the repository
- git clone git@github.com:cindy-kivala/ReelBrief-Backend.git
- cd ReelBrief-Backend

# Create virtual environment
- python -m venv venv
- source venv/bin/activate  

# Install dependencies
- pip install -r requirements.txt

# Set up environment variables
- cp .env.example .env
# Edit .env with your configuration

# Initialize database
- python init_db.py

# Start development server
- python run.py

# Environment Variables
# Frontend (.env)
# env
- VITE_API_BASE_URL=https://reelbrief-api.onrender.com
- VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
# Backend (.env)
# env
- DATABASE_URL=postgresql://user:pass@host:port/dbname
- SECRET_KEY=your_secret_key
- JWT_SECRET_KEY=your_jwt_secret
- SENDGRID_API_KEY=your_sendgrid_key
- CLOUDINARY_URL=cloudinary://key:secret@cloud_name
- FLASK_ENV=development


## Key Endpoints
# Endpoint	Method	Description	Access
- /api/auth/register	POST	User registration	Public
- /api/auth/login	POST	User login	Public
- /api/auth/me	GET	Current user profile	Authenticated
- /api/projects	GET	List projects (role-filtered)	Authenticated
- /api/projects/{id}	GET	Project details	Project members
- /api/deliverable/projects/{id}	GET	Project deliverables	Project members
- /api/escrow	GET	Escrow transactions	Admin only
- /api/wallet	GET	User wallet balance	Owner/Admin
- /api/invoices	GET	User invoices	Owner/Admin
- /api/notifications	GET	User notifications	Owner

# Authentication
- All protected endpoints require a JWT token in the Authorization header:

# Deployment
- Frontend (Vercel)
- The frontend is automatically deployed to Vercel on pushes to the main branch.
- npm run build

# Automatic deployment via Vercel-GitHub integration
- Backend (Render)
- The backend is deployed on Render with the following configuration:

- Service Type: Web Service

- Environment: Python 3

- Build Command: pip install -r requirements.txt

- Start Command: python run.py

- Auto-Deploy: Enabled on git push to main

- Production Environment Variables
- FLASK_ENV=production

- DATABASE_URL (Render PostgreSQL)

- SENDGRID_API_KEY (Production)

- CLOUDINARY_URL (Production)

- FRONTEND_URLS (CORS configuration)

# License
- This project is licensed under the MIT License


