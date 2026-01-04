import { getProfileUploadUrl, getUsers, googleAuthCallback, loginUser, signUpUser } from '@/controllers';
import { verifyAuthToken } from '@/middlewares/auth.middleware';
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', loginUser);

router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'], session: false  })
)

router.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/',
        session: false 
    }), googleAuthCallback
)

router.get('/profile-upload-url', verifyAuthToken, getProfileUploadUrl);

router.get('/', getUsers);

export { router as userRouter };


//http://localhost:8070/api/v1/user/auth/google