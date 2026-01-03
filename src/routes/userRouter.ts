import { getUsers, googleAuthCallback } from '@/controllers';
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'], session: false  })
)

router.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/',
        session: false 
    }), googleAuthCallback
)

router.get('/', getUsers);

export { router as userRouter };


//http://localhost:8070/api/v1/user/auth/google