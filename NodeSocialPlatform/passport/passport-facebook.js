'use strict';

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const secret = require('../secret/secret');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: secret.facebook.CLIENT_ID,
    clientSecret: secret.facebook.CLIENT_SECRET,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true
}, (req, token, refreshToken, profile, done) => {
    User.findOne({ facebook: profile.id }, (err, user) => {
        if (err) { return done(err); }
        if (user) {
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.username = profile.displayName;
            newUser.fullname = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = `https: //graph.facebook.com/${profile.id}/picture?type=large`;
            newUser.fbTokens.push({ token: token });
            newUser.isAdmin = 0;
            newUser.save(err => {
                if (err) done(err);
                return done(null, newUser)
            });
        }
    });
}));