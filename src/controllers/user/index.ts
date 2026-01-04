import dotenv from 'dotenv';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { AppResponse, AppError } from '@/common/utils';
import type { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { generateV4SignedPolicy } from '@/common/utils/uploader';
import bcrypt from 'bcryptjs';

dotenv.config();

export const signUpUser = catchAsync(async (req: Request, res: Response) => {
	const { email, password, username } = req.body;

	const existingUser = await UserModel.findOne({ email });
	if (existingUser) {
		throw new AppError('Email already in use', 400);
	}

	const newUser = new UserModel({ email, password, username });
	await newUser.save();

	return AppResponse(res, 201, newUser, 'User registered successfully');
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await UserModel.findOne({ email }).select('+password');
	if(!user) {
		throw new AppError('Invalid email or password', 401);
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if(!isPasswordValid) {
		return AppResponse(res, 401, null, 'Invalid  password');
	}

	const token = jwt.sign(
		{ id: user._id, email: user.email },
		process.env.JWT_SECRET!,
		{ expiresIn: '1d' }
	);

	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 24 * 60 * 60 * 1000, // 1 day
	});

	return AppResponse(res, 200, { token, user }, 'Login successful');
});

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
		{ id: user.id, email: user.email },
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

export const getProfileUploadUrl = catchAsync(async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user.id;

		const data = await generateV4SignedPolicy(`users/${userId}`, 'profile.jpg', 'image/jpeg');

		return AppResponse(res, 200, data, 'Upload URL generated successfully');
		
	} catch (error) {
		AppResponse(res, 500, null, 'Failed to generate upload URL');
	}
});
