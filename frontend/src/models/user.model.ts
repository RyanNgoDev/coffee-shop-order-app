export interface User {
    userName: string;
    password: string;
    token: string;
    expiresIn: number;
    isAdmin: boolean;
    isManager: boolean;
}