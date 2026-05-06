==================================================
        TEAM TASK MANAGER - FULL STACK APP
==================================================

PROJECT OVERVIEW
----------------
A collaborative task management application built with the 
MERN stack (MongoDB, Express, React, Node.js). 

LIVE DEPLOYMENTS
----------------
Frontend (Netlify): https://courageous-gumption-fac1c6.netlify.app
Backend (Render):   https://task-management-u5cy.onrender.com

CORE FEATURES
-------------
- User Authentication (JWT with Cross-Origin Cookies)
- Role-Based Access Control (Admin / Member)
- Project Management (Create, Update, Delete Projects)
- Task Management (Assign tasks to members, set deadlines)
- Responsive Modern UI (Vibrant Blue/White Theme)

TECH STACK
----------
- Frontend: React.js, Vite, Axios, Tailwind CSS
- Backend:  Node.js, Express.js
- Database: MongoDB (Atlas)
- Security: JWT, Bcryptjs, Cookie-Parser, CORS

INSTALLATION (LOCAL)
--------------------
1. Clone the repository
2. Backend Setup:
   - cd backend
   - npm install
   - Create .env with MONGO_URI, JWT_SECRET, and PORT
   - npm run dev
3. Frontend Setup:
   - cd frontend
   - npm install
   - npm run dev

DEPLOYMENT NOTES
----------------
- Backend is configured with "SameSite=None; Secure" cookies 
  to allow cross-origin authentication between Netlify and Render.
- Frontend includes a "_redirects" file for Netlify to handle
  Single Page Application (SPA) routing.
