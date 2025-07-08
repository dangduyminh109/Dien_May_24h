const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user.model");
require("dotenv").config();
module.exports = (passport) => {
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).select(
                "_id name email cart avatar"
            );
            if (!user) return done(null, false);

            const customUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                cart: user.cart,
                avatar: user.avatar || "/uploads/default-image.jpg",
            };

            done(null, customUser);
        } catch (err) {
            done(err, null);
        }
    });

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
                    avatar:
                        profile.photos[0].value || "/uploads/default-image.jpg",
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
                    avatar:
                        profile.photos[0].value || "/uploads/default-image.jpg",
                });
                return done(null, newUser);
            }
        )
    );
};
