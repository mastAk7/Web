const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-please';
const JWT_EXP = process.env.JWT_EXP || '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });
}

// helper to convert a short JWT_EXP string (eg. "7d", "12h", "3600s") to milliseconds
function jwtExpToMs(exp) {
  if (!exp) return undefined;
  const s = String(exp).trim();
  const m = s.match(/^(\d+)([smhd])?$/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  const unit = (m[2] || 's').toLowerCase();
  switch (unit) {
    case 'd': return n * 24 * 60 * 60 * 1000;
    case 'h': return n * 60 * 60 * 1000;
    case 'm': return n * 60 * 1000;
    case 's': default: return n * 1000;
  }
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: jwtExpToMs(JWT_EXP) || undefined,
};

// validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().max(100).optional(),
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
// no OTP schemas anymore

async function signup(req, res) {
  // validate input
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) {
    const messages = {};
    parse.error.errors.forEach(e => { const p = e.path.join('.') || '_'; messages[p] = e.message; });
    return res.status(400).json({ error: 'validation', messages });
  }
  const { email, password, name } = parse.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'user exists' });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  let user;
  try {
    user = await User.create({ email, passwordHash, name, emailVerified: true });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ error: 'user exists' });
    throw err;
  }
  const token = signToken({ sub: user._id });
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ ok: true, user: { id: user._id, email: user.email, name: user.name } });
}

async function login(req, res) {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'invalid input', details: parse.error.errors });
  const { email, password } = parse.data;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const token = signToken({ sub: user._id });
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ ok: true, user: { id: user._id, email: user.email, name: user.name } });
}

async function logout(req, res) {
  // clear with same options used to set the cookie
  res.clearCookie('token', { path: COOKIE_OPTIONS.path || '/', sameSite: COOKIE_OPTIONS.sameSite, secure: COOKIE_OPTIONS.secure, httpOnly: COOKIE_OPTIONS.httpOnly });
  res.json({ ok: true });
}

// OTP removed: no sendOtp/verifyOtp

async function me(req, res) {
  // return current user if authenticated via cookie
  const token = req.cookies && req.cookies.token;
  if (!token) return res.json({ ok: false });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.json({ ok: false });
    return res.json({ ok: true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    return res.json({ ok: false });
  }
}

module.exports = { signup, login, logout, signToken, me, COOKIE_OPTIONS };
