const express = require('express');
const router = express.Router();
const { signup, login, logout, signToken, me } = require('../controllers/auth.controller');
const passport = require('passport');
const rateLimit = require('express-rate-limit');


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', (req, res) => me(req, res));

// Google OAuth
// Google OAuth
router.get('/google', (req, res, next) => {
	if (!passport._strategies || !passport._strategies.google) return res.status(503).json({ error: 'Google OAuth not configured on server' });
	return passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
	if (!passport._strategies || !passport._strategies.google) return res.status(503).json({ error: 'Google OAuth not configured on server' });
	return passport.authenticate('google', { failureRedirect: '/' })(req, res, next);
}, (req, res) => {
	// on success, sign a JWT using the shared helper and set cookie then redirect to frontend
	const token = signToken({ sub: req.user._id });
	// use COOKIE_OPTIONS exported from the auth controller to keep settings consistent
	const { COOKIE_OPTIONS } = require('../controllers/auth.controller');
	res.cookie('token', token, COOKIE_OPTIONS);
	res.redirect(process.env.CLIENT_POST_LOGIN || '/');
});

// debug status
router.get('/google/status', (req, res) => {
	const ok = !!(passport._strategies && passport._strategies.google);
	res.json({ ok, registered: ok ? true : false });
});

module.exports = router;
