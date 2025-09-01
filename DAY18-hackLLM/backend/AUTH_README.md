# Server
# AI service wiring
# Database (optional for now; used to persist runs)
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://thi-iiit.vercel.app/
MONGODB_URI=mongodb+srv://aryankansal15_db_user:IckSDMSivItaAy8b@cluster0.ihklsct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
AI_MODE=mock # mock | live
AI_BASE_URL=http://localhost:5001
AI_TIMEOUT_MS=15000
JWT_SECRET=important_hack
GOOGLE_CLIENT_ID=1072255037759-l2i64f20fjo57jsaq8gq1u1qti6ecppm.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK=http://localhost:4000/api/auth/google/callback
CLIENT_POST_LOGIN=https://thi-iiit.vercel.app/
Summary

This repo now contains a basic authentication implementation supporting:
- Email + password signup/login (bcrypt + JWT stored in an httpOnly cookie)
- Email OTP flow (send code via SMTP, verify and sign-in)
- Skeleton for Google OAuth (you can adapt with passport or the frontend flow)

Files added
- src/models/User.js - mongoose user model
- src/models/Otp.js - simple OTP storage with TTL
- src/controllers/auth.controller.js - signup/login/logout/otp handlers
- src/routes/auth.routes.js - mounted at /api/auth
- src/middlewares/auth.js - middleware to require auth based on cookie
- src/utils/mail.js - nodemailer wrapper for OTP email sending

Install
Run from the `backend` folder to install packages added by the auth work:

```bash
cd backend
npm install bcrypt jsonwebtoken cookie-parser nodemailer express-session passport passport-google-oauth20 express-rate-limit
```

Start the dev server (example using the project start script):

```bash
cd backend
npm run dev   # or `node server.js` / however you normally start the backend
```

(Other existing deps are already listed in `package.json`.)

Environment variables

Required for auth features:
- `JWT_SECRET` - secret for signing tokens (set to a long random string)
- `JWT_EXP` - token expiry (example: `7d`)
- `SESSION_SECRET` - secret for express-session (used for OAuth handshake)
- `MONGODB_URI` - your MongoDB connection string
- `CORS_ORIGIN` - frontend origin(s), comma-separated if multiple (used by the backend CORS config)

Optional, for OTP email sending:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - SMTP connection details
- `SMTP_FROM` - "From" header to use (e.g. "THI <no-reply@example.com>")

Optional, for Google OAuth:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - obtain from Google Cloud Console
- `GOOGLE_CALLBACK` - callback path registered with Google (defaults to `/api/auth/google/callback`)
- `CLIENT_POST_LOGIN` - frontend URL to redirect to after successful OAuth (defaults to `/`)

Security notes
- In production, use HTTPS and set cookie `secure: true` (this repo sets that automatically when NODE_ENV=production).
- Use short lifetimes for tokens where appropriate, rotate secrets, and monitor auth endpoints for abuse.

Next steps / recommended follow-ups
- Ensure your Google OAuth callback URL is registered in Google Console and matches `GOOGLE_CALLBACK`.
- Run `npm run lint` or similar static checks as you iterate.
- Add frontend login/OTP UI and OAuth redirect handling to complete the end-to-end UX.
- Consider adding a refresh token flow if you need long-lived sessions without re-login.
