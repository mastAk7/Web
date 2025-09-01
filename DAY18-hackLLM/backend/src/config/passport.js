const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

function setupPassport() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('passport: Google OAuth not configured (missing CLIENT_ID/SECRET)');
    return;
  }

  console.log('passport: configuring Google OAuth client id present');

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      let user = await User.findOne({ googleId });
      if (!user) {
        const email = profile.emails?.[0]?.value || `google-${googleId}@no-email.local`;
        user = await User.create({ googleId, email, name: profile.displayName, emailVerified: true });
      }
      done(null, user);
    } catch (err) { done(err); }
  }));

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user || null);
  });
  console.log('passport: Google strategy registered, callbackURL=', process.env.GOOGLE_CALLBACK || '/api/auth/google/callback');
}

module.exports = setupPassport;
