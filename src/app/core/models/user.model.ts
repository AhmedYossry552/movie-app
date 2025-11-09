// User model for authentication

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used during registration, not stored in plain text
  registeredAt: Date;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}
