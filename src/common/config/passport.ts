import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { UserModel } from "@/models";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8070/api/v1/user/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await UserModel.findOne({
            googleId: profile.id
        })
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new UserModel({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0].value
        });
        await newUser.save();
        return done(null, newUser);
        
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);