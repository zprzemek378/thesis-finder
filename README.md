# Thesis Finder

A comprehensive thesis management system for universities, enabling students to browse and apply for thesis topics while allowing supervisors to manage their proposals and student assignments.

## Overview

This system streamlines the thesis selection process by providing a centralized platform where students can discover available thesis topics, submit applications, and communicate with supervisors. Supervisors can create thesis proposals, manage student assignments, and track progress through an integrated messaging system.


<img width="1280" height="800" alt="login-screen- Nikodem" src="https://github.com/user-attachments/assets/4961b36a-1c30-4898-a2d4-9c11bb0e9377" />
<img width="1280" height="800" alt="registration-screen-Nikodem" src="https://github.com/user-attachments/assets/f140661b-6150-4c13-91d4-7812dc8371e8" />
<img width="1280" height="800" alt="student-request-form" src="https://github.com/user-attachments/assets/c652dcf5-270e-4d65-ae78-da09d9723f73" />
<img width="1280" height="800" alt="create-offer-for-supervisor" src="https://github.com/user-attachments/assets/22e0139c-e7de-42df-bca6-7259bc91811b" />
<img width="1280" height="832" alt="Ekran-Nikodem" src="https://github.com/user-attachments/assets/ae72b785-8e77-4849-aac4-aed950ae799f" />
<img width="1280" height="832" alt="Ekran" src="https://github.com/user-attachments/assets/cb7ac65b-e396-4f20-b4b3-18bb2551e9cd" />

## Tech Stack

**Backend:**
- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

**Frontend:**
- React with TypeScript
- Vite
- Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd thesis-finder
```

2. Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. Environment setup

Create `server/.env`:
```env
PORT=3000
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=10
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:3000
```

4. Run the application
```bash
# Backend (terminal 1)
cd server
npm run dev

# Frontend (terminal 2)
cd client
npm run dev
```

## Project Structure

```
thesis-finder/
├── server/                 # Backend API
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middlewares/   # Auth middleware
│   │   └── utils/         # JWT utilities
│   └── index.ts
├── client/                # React frontend
├── shared/                # Shared types and constants
└── README.md
```

## Core Features

**For Students:**
- Browse available thesis topics with filtering
- Submit thesis applications
- Track application status
- Direct messaging with supervisors

**For Supervisors:**
- Create and manage thesis proposals
- Review and approve/reject student applications
- Set student limits per thesis
- Communication tools

**For Administrators:**
- User management
- System oversight
- Faculty and department configuration

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user data

### Students
- `GET /students` - List all students
- `GET /students/{id}` - Get student details
- `GET /students/{id}/theses` - Get student's theses
- `GET /students/{id}/requests` - Get student's requests
- `PUT /students/{id}` - Update student data
- `DELETE /students/{id}` - Delete student

### Supervisors
- `GET /supervisors` - List all supervisors
- `GET /supervisors/{id}` - Get supervisor details
- `GET /supervisors/{id}/theses` - Get supervisor's theses
- `GET /supervisors/{id}/requests` - Get requests to supervisor
- `GET /supervisors/{id}/availability` - Get supervisor availability
- `PUT /supervisors/{id}` - Update supervisor data
- `DELETE /supervisors/{id}` - Delete supervisor

### Theses
- `GET /theses` - List theses with filters
- `GET /theses/{id}` - Get thesis details
- `GET /theses/{id}/students` - Get students assigned to thesis
- `POST /theses` - Create new thesis
- `POST /theses/{id}/students` - Assign student to thesis
- `PUT /theses/{id}` - Update thesis
- `DELETE /theses/{id}` - Delete thesis

### Requests
- `GET /requests/students/{id}` - Get student's requests
- `GET /requests/supervisors/{id}` - Get requests to supervisor
- `GET /requests/{id}/status` - Get request status
- `GET /requests/{id}/messages` - Get request messages
- `POST /requests` - Submit new request
- `PUT /requests/{id}/status` - Update request status
- `DELETE /requests/{id}` - Delete request

### Messages & Chats
- `GET /messages/request/{id}` - Get messages for request
- `POST /messages` - Send message
- `DELETE /messages/{id}` - Delete message
- `POST /chats` - Create new chat
- `GET /chats/my-conversations` - Get user's conversations
- `GET /chats/{id}/messages` - Get chat messages

## Data Models

**User** - Base user with authentication and role information
**Student** - Student profile with study details and thesis list
**Supervisor** - Supervisor profile with academic title and thesis limits
**Thesis** - Thesis proposal with description, requirements, and student assignments
**Request** - Student application for thesis with status tracking
**Message** - Communication between users for requests or general chat
**Chat** - Conversation threads between users

## System Rules

- Professors can supervise max 8 bachelor/engineering theses and 6 master's theses
- Other supervisors limited to 6 theses of each type
- Supervisors can only supervise theses in their declared fields
- Students can apply for multiple theses but can be assigned to limited number based on thesis type

## Security

- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Route-level authorization middleware
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

## Development

```bash
# Backend development
cd server
npm run dev

# Frontend development
cd client
npm run dev

# Build for production
npm run build
```



