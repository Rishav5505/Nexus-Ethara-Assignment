const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Check if user already exists with googleId
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }

      // 2. Check if user exists with email but no googleId
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        if (!user.avatar) user.avatar = profile.photos[0]?.value;
        await user.save();
        return done(null, user);
      }

      // 3. Create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatar: profile.photos[0]?.value,
        role: 'member' // Default role
      });
      await user.save();
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// We don't really need session serialization if we're using JWT
// but passport might expect it if we use it for auth
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
