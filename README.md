# Job Application Portal API

A RESTful API built with **Node.js, Express.js and MongoDB** that lets candidates register, log in, upload a resume, apply for jobs and track their applications.

**Live API:** `https://YOUR-APP-NAME.onrender.com` <!-- replace after deploying -->
**Postman collection:** [`postman_collection.json`](./postman_collection.json)

> The live API runs on Render's free tier, so the first request after a period of inactivity can take 30-60 seconds while the server wakes up.

## Features

- JWT-based registration and login (passwords hashed with bcrypt)
- Resume upload with Multer (PDF / DOC / DOCX, max 2MB)
- Browse, search and filter sample job listings (6 jobs are seeded automatically)
- Apply for a job (one application per job, resume required)
- View your own applications with job details
- Request validation, centralized error handling, Helmet and CORS

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime / Framework | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File uploads | Multer |
| Validation | express-validator |

## Project Structure

```
.
├── server.js                # Entry point (env check, DB connect, seed, listen)
├── src
│   ├── app.js               # Express app, middleware, routes
│   ├── config/db.js         # MongoDB connection
│   ├── models/              # User, Job, Application
│   ├── controllers/         # Route logic
│   ├── routes/              # Route definitions
│   ├── middleware/          # auth (JWT), upload (Multer), validate, error handling
│   ├── validators/          # express-validator rules
│   ├── seed/                # Sample jobs + seed script
│   └── utils/               # ApiError, asyncHandler
├── uploads/                 # Uploaded resumes (git-ignored)
├── postman_collection.json
├── .env.example
└── README.md
```

## Setup and Installation

**Prerequisites:** Node.js 18+, npm, and a MongoDB database (local or free MongoDB Atlas cluster).

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/job-application-portal.git
cd job-application-portal

# 2. Install dependencies
npm install

# 3. Create your environment file and fill in the values
cp .env.example .env

# 4. Start the server (development, auto-reload)
npm run dev
# or production mode
npm start
```

The server runs on `http://localhost:5000`. On the first start, 6 sample jobs are inserted automatically if the jobs collection is empty. You can also run `npm run seed` (add `-- --reset` to wipe and reseed jobs).

## Environment Variables

Sample `.env` file (also available as `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<db_user>:<db_password>@<cluster>.mongodb.net/job_portal?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE_MB=2
```

| Key | Description |
| --- | --- |
| `PORT` | Port the server listens on (Render sets this automatically) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs. Use a long random value |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `MAX_FILE_SIZE_MB` | Max resume size in MB |

## API Documentation

Base URL: `http://localhost:5000` (local) or the live URL above.
Protected endpoints need the header `Authorization: Bearer <token>`.
All responses share the shape `{ "success": true|false, "message": "...", "data": { ... } }`.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register a candidate |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| GET | `/api/jobs` | No | List jobs (`keyword`, `location`, `type`, `page`, `limit`) |
| GET | `/api/jobs/:id` | No | Job details |
| POST | `/api/resume` | Yes | Upload resume (form-data key `resume`) |
| GET | `/api/resume` | Yes | Current resume info |
| GET | `/api/resume/download` | Yes | Download your resume |
| POST | `/api/jobs/:id/apply` | Yes | Apply for a job |
| GET | `/api/applications` | Yes | List your applications |
| GET | `/api/applications/:id` | Yes | One of your applications |

### 1. Register

`POST /api/auth/register`

Request:
```json
{
  "name": "Test Candidate",
  "email": "candidate@example.com",
  "password": "Password@123"
}
```

Response `201`:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "66f8a1c2e4b0a1b2c3d4e5f6",
      "name": "Test Candidate",
      "email": "candidate@example.com",
      "createdAt": "2026-09-30T08:00:00.000Z",
      "updatedAt": "2026-09-30T08:00:00.000Z"
    }
  }
}
```

Errors: `400` validation failed, `409` email already registered.

### 2. Login

`POST /api/auth/login`

Request:
```json
{
  "email": "candidate@example.com",
  "password": "Password@123"
}
```

Response `200`:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "66f8a1c2e4b0a1b2c3d4e5f6",
      "name": "Test Candidate",
      "email": "candidate@example.com"
    }
  }
}
```

Errors: `400` validation failed, `401` invalid email or password.

### 3. Get Current User

`GET /api/auth/me` with the Bearer token. Response `200`:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "66f8a1c2e4b0a1b2c3d4e5f6",
      "name": "Test Candidate",
      "email": "candidate@example.com"
    }
  }
}
```

### 4. List Jobs

`GET /api/jobs?keyword=node&location=ahmedabad&page=1&limit=10`

Response `200`:
```json
{
  "success": true,
  "count": 1,
  "pagination": { "page": 1, "limit": 10, "total": 1, "pages": 1 },
  "data": {
    "jobs": [
      {
        "_id": "66f8a1c2e4b0a1b2c3d4e600",
        "title": "Node.js Developer Intern",
        "company": "Potenz Technology",
        "location": "Ahmedabad, Gujarat",
        "type": "Internship",
        "description": "Build and maintain REST APIs using Node.js and Express while learning production backend practices.",
        "requirements": ["JavaScript (ES6+)", "Node.js and Express basics", "MongoDB or SQL basics", "Git"],
        "salary": "Stipend based",
        "isActive": true
      }
    ]
  }
}
```

### 5. Get Job by ID

`GET /api/jobs/:id`. Response `200` returns `{ "success": true, "data": { "job": { ... } } }`.
Errors: `400` invalid id, `404` job not found.

### 6. Upload Resume

`POST /api/resume` with Bearer token. Body type `form-data`, key `resume` (type File): PDF, DOC or DOCX, max 2MB.

Response `201`:
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resume": {
      "filename": "66f8a1c2e4b0a1b2c3d4e5f6-1727683200000.pdf",
      "originalName": "my-resume.pdf",
      "mimeType": "application/pdf",
      "size": 154321,
      "uploadedAt": "2026-09-30T08:05:00.000Z"
    }
  }
}
```

Errors: `400` no file, wrong file type or file too large, `401` not authorized.

### 7. Apply for a Job

`POST /api/jobs/:id/apply` with Bearer token. Uploading a resume first is required.

Request (`coverLetter` is optional):
```json
{
  "coverLetter": "I am excited to apply for this role and would love to contribute."
}
```

Response `201`:
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "66f8a2d0e4b0a1b2c3d4e777",
      "user": "66f8a1c2e4b0a1b2c3d4e5f6",
      "job": {
        "_id": "66f8a1c2e4b0a1b2c3d4e600",
        "title": "Node.js Developer Intern",
        "company": "Potenz Technology",
        "location": "Ahmedabad, Gujarat",
        "type": "Internship"
      },
      "resume": { "filename": "66f8a1c2e4b0a1b2c3d4e5f6-1727683200000.pdf", "originalName": "my-resume.pdf" },
      "coverLetter": "I am excited to apply for this role and would love to contribute.",
      "status": "Applied",
      "createdAt": "2026-09-30T08:10:00.000Z"
    }
  }
}
```

Errors: `400` resume missing, `404` job not found, `409` already applied.

### 8. View My Applications

`GET /api/applications` with Bearer token. Response `200`:
```json
{
  "success": true,
  "count": 1,
  "data": {
    "applications": [
      {
        "_id": "66f8a2d0e4b0a1b2c3d4e777",
        "job": { "title": "Node.js Developer Intern", "company": "Potenz Technology", "location": "Ahmedabad, Gujarat", "type": "Internship" },
        "status": "Applied",
        "createdAt": "2026-09-30T08:10:00.000Z"
      }
    ]
  }
}
```

`GET /api/applications/:id` returns a single application in the same shape (`404` if it is not yours).

### Common error format

```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "A valid email is required" }] }
```

## Testing with Postman

1. Import `postman_collection.json` into Postman.
2. Set the collection variable `baseUrl` (local: `http://localhost:5000`, live: your Render URL).
3. Run the requests in order: Register, Login, List Jobs, Upload Resume (select a file in the request body), Apply to Job, My Applications.
4. Tokens, job IDs and emails are saved to collection variables automatically by test scripts, and each request has assertions.

## Deployment (Render)

1. Push this repository to GitHub.
2. Create a free cluster on MongoDB Atlas, add a database user, and under Network Access allow `0.0.0.0/0`.
3. On Render: New > Web Service > connect the GitHub repo.
4. Settings: Runtime `Node`, Build Command `npm install`, Start Command `npm start`, Instance type `Free`.
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`, `MAX_FILE_SIZE_MB`.
6. Deploy, then open `https://<your-service>.onrender.com/api/health` to verify.

## Notes and Limitations

- Render's free tier has an **ephemeral filesystem**: uploaded resumes are stored on local disk and are removed when the service restarts or redeploys. For production, store files in object storage such as AWS S3 or Cloudinary. Application records keep the resume file name and original name.
- Free instances sleep after inactivity, so the first request can be slow.
- Allowed resume types: PDF, DOC, DOCX.
