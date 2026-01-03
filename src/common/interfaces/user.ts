export interface IUser {
	_id: string;
	googleId?: string;
	username: string;
	email: string;
	password: string;
	isDeleted: boolean;
}

export interface UserMethods {
	verifyPassword(enteredPassword: string): Promise<boolean>;
}
