# Interview Plan

Full-stack interview prep app. Paste a job description, upload your resume as PDF, and get back an AI-generated prep report: match score, technical and behavioral questions with model answers, skill gaps, and a day-by-day study plan. You can also download a rewritten resume as PDF.

## Stack

**Backend** — Node.js, Express 5, MongoDB with Mongoose, JWT in httpOnly cookies, bcrypt, express-validator, rate limiting, Multer for uploads, pdf-parse to read resumes, Puppeteer to render resume PDFs, Nodemailer (Gmail OAuth2) for OTP emails, and the OpenAI client pointed at NVIDIA NIM (`nvidia/nemotron-3-super-120b-a12b`) with zod structured outputs.

**Frontend** — React 19, React Router 8, Vite 8, Axios, React Toastify, plain CSS with a custom dark theme (oklch tokens). State via React Context.

## Features

### Auth
- Register, then verify your email with a 6-digit OTP (expires in 10 minutes, bcrypt-hashed, resent at most once per minute)
- Login/logout; JWT is stored in an httpOnly cookie and blacklisted on logout
- Password reset via OTP; reset token cookie expires in 5 minutes and only works on the reset endpoint
- Rate limits: login 15/day, OTP resend 4/day, verification 4/day, password reset 5/day
- Protected routes on the frontend redirect to login when you have no session

### Interview plan

A plan comes from two inputs: your job description (max 500 chars) and either a PDF resume (max 3MB) or a self-description under 150 chars. Feed both to the AI and you get back a match score out of 100, technical and behavioral questions with a model answer and the reasoning behind each one, skill gaps tagged low/medium/high, and a day-by-day preparation roadmap.

You can generate 8 plans per 12 hours. Past plans show up on the home page with their scores. Open one and the questions sit in expandable cards, gaps live in a sidebar, and the roadmap runs down the middle. There is a button to have the AI rewrite your resume and hand it back as a PDF. Not magic, but saves an evening of formatting.

## Getting started

### Requirements
- Node.js 20.19+ or 22.12+ (Vite 8 will not run on older versions)
- MongoDB (local or Atlas)
- An NVIDIA NIM API key or OPENAI COMPATIBLE API KEY
- Gmail account with OAuth2 credentials for outgoing mail

### Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=long_random_string
JWT_RESET_SECRET=different_long_random_string
OPENAI_COMPATIBLE_API_KEY=your_nvidia_nim_api_key
CLIENT_ID=gmail_oauth_client_id
CLIENT_SECRET=gmail_oauth_client_secret
REFRESH_TOKEN=gmail_oauth_refresh_token
EMAIL_USER=gmail_address_that_sends_mail
REDIS_URL=your_redis_connection_string_here
ORIGIN_URL=http://localhost:5173
```

`CLIENT_ID`, `CLIENT_SECRET`, and `REFRESH_TOKEN` are Gmail OAuth2 credentials used only by Nodemailer to send OTP emails. They are not login credentials. `ORIGIN_URL` must match the frontend origin exactly, or CORS will block requests.

Run it:

```bash
npm run dev
```

Server starts on `http://localhost:3000`. If the email credentials are wrong it logs an error at boot but keeps running.

### Frontend

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_ORIGIN_URL=http://localhost:3000
```

This is only used in development. Production builds hit the same origin and rely on the rewrite rules in `vercel.json`.

```bash
npm run dev
```

Opens at `http://localhost:5173`. No Vite proxy is configured, so API requests go to `http://localhost:3000` directly during development.

### Run both

Two terminals:

```bash
cd Backend  && npm run dev
cd Frontend && npm run dev
```

## Project structure

```
Backend/
  server.js               # dotenv -> app -> connectDB -> listen(3000)
  src/
    app.js                # middleware, CORS, route mounting
    config/db.js          # mongoose.connect(MONGO_URI)
    controllers/          # auth.js, interview.js
    middlewares/          # auth, validators, multer, rate limiters
    model/                # user, otp, forget, blacklistToken, interviewReport
    routes/               # /api/auth, /api/interview
    services/ai.js        # NVIDIA NIM client + zod schema + Puppeteer PDF
    services/email.js     # Nodemailer Gmail OAuth2
    utils/utils.js        # OTP generation + email HTML templates

Frontend/
  src/
    main.jsx              # React root + ToastContainer
    App.jsx               # AuthProvider > InterviewProvider > RouterProvider
    app.routes.jsx        # all routes
    components/ui/        # AppShell, Button, Badge, Loader, Logo, ScoreMeter
    features/auth/        # AuthContext, pages, auth.api.js, Protected
    features/interview/   # InterviewContext, Home, Interview, interview.api.js
    styles/               # theme.css, components.css, toast.css
  index.html
  vite.config.js
  vercel.json             # SPA fallback + /api rewrite to Railway backend
```

## API

### Auth (`/api/auth`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/register` | — | username (min 4), email, password (min 8, upper+lower+digit+special) |
| POST | `/verify-email` | — | email + 6-digit OTP, 4/day |
| GET | `/resend-otp?email=` | — | 4/day, min 60s between resends |
| POST | `/forget-password` | — | sends reset OTP, 5/day |
| POST | `/verify-otp` | — | email + OTP, 5/day |
| POST | `/reset-password` | `resetToken` cookie | newPassword + confirmPassword |
| POST | `/login` | — | sets `token` cookie, 15/day; unverified email returns 403 and auto-sends OTP |
| GET | `/logout` | — | blacklists token, clears cookie |
| POST | `/get-me` | JWT | current user profile |

### Interview (`/api/interview`)

All four routes require the JWT cookie.

| Method | Path | Notes |
|---|---|---|
| POST | `/` | multipart: `resume` (PDF, optional, max 3MB) + `jobDescription` + `selfDescription`; returns 201 with report; 8 per 12h |
| GET | `/:interviewId` | one report (owner only) |
| GET | `/` | all reports for the user, newest first, large fields stripped |
| POST | `/resume/pdf/:interviewReportId` | AI writes resume HTML, Puppeteer returns PDF attachment |

## Deployment notes

The repo is set up for Vercel (frontend) and Railway (backend), as configured in `Frontend/vercel.json`. In production:

- Build the frontend with `cd Frontend && npm run build` and host `Frontend/dist` anywhere static
- Run the backend with `node server.js` (no start script yet; a process manager or Railway's Nixpacks will do)
- Set `ORIGIN_URL` to your deployed frontend origin, including protocol
- Cookies are `secure: true`, so production must be served over HTTPS or login will silently fail in most browsers

## Linting

```bash
cd Frontend && npm run lint
```

There is no test suite yet.

## Contributing

Fork it, branch it, open a PR. Issues work too.

## Contact

fahadabbas0965@gmail.com
