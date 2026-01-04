import dotenv from 'dotenv';
import { AppResponse } from '@/common/utils';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

export const verifyAuthToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return AppResponse(res, 401, null, 'No token provided');
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		(req as any).user = decoded;
		next();
	} catch (error) {
		return AppResponse(res, 401, null, 'Forbidden: Invalid token');
	}
};
