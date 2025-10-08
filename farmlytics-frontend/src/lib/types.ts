export type UserRole='FARMER'|'BUYER'

export interface User{
    firstName:string;
    lastName:string;
    email:string;
    role:UserRole;
}

export interface LocalStorageUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  role:UserRole;
  password: string;
}


export interface VerifyEmailRequest {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: LocalStorageUser;
  expiresIn: number;
}
export interface MessageResponse {
  message: string;
}
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  timestamp: string;
  instance: string;
  violations?: ValidationError[];
}
export interface ValidationError {
  field: string;
  message: string;
  rejectedValue: string;
  code: string;
}


export interface RoleStatsResponse {
  roleCounts: Record<UserRole, number>;
}
