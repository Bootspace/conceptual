import { User as PassportUser } from 'passport';

declare global {
    namespace Express {
        interface User {
            googleId?: string;
            email?: string;
            username?: string;
        }
    }
}

export {};