import type { User, UserRole } from '../types/index.js';
export interface CreateUserInput {
    username: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    mustChangePassword?: boolean;
}
export interface UpdateUserInput {
    email?: string;
    passwordHash?: string;
    role?: UserRole;
    isActive?: boolean;
    mustChangePassword?: boolean;
}
export declare function findUserById(id: string): Promise<User | undefined>;
export declare function findUserByUsername(username: string): Promise<User | undefined>;
export declare function findUserByEmail(email: string): Promise<User | undefined>;
export declare function listUsers(): Promise<User[]>;
export declare function createUser(input: CreateUserInput): Promise<User>;
export declare function updateUser(id: string, input: UpdateUserInput): Promise<User | undefined>;
/** Soft delete */
export declare function deleteUser(id: string): Promise<void>;
export declare function incrementFailedAttempts(id: string): Promise<void>;
export declare function lockUserUntil(id: string, until: Date): Promise<void>;
export declare function resetFailedAttempts(id: string): Promise<void>;
export declare function unlockUser(id: string): Promise<void>;
