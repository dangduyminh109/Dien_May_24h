const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user.model");
require("dotenv").config();
module.exports = (passport) => {
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) =>
        User.findById(id).then((user) => done(null, user))
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.CAllBACK_URL}/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                const existingUser = await User.findOne({
                    googleId: profile.id,
                });
                if (existingUser) return done(null, existingUser);
                const newUser = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                });
                return done(null, newUser);
            }
        )
    );

    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: `${process.env.CAllBACK_URL}/auth/facebook/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                const existingUser = await User.findOne({
                    facebookId: profile.id,
                });
                if (existingUser) return done(null, existingUser);
                const newUser = await User.create({
                    facebookId: profile.id,
                    name: profile.displayName,
                });
                return done(null, newUser);
            }
        )
    );
};
