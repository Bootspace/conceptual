import dotenv from 'dotenv';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { AppResponse } from '@/common/utils';
import type { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

dotenv.config();

export const getUsers = catchAsync(async (req, res) => {
	const users = await UserModel.find();

	return AppResponse(res, 200, users, 'Data retrieved successfully');
});

export const googleAuthCallback = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;

	if(!user) {
		return AppResponse(res, 401, null, 'Authentication failed');
	}

	// Here you can generate a JWT token or create a session for the authenticated user
	const token = jwt.sign(
		{ id: user.googleId, email: user.email },
		process.env.JWT_SECRET!,
		{ expiresIn: '1d' }
	);

	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 24 * 60 * 60 * 1000, // 1 day
	});

	return AppResponse(res, 200, { token, user }, 'Authentication successful');
})
