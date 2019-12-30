/**
 * Auth
 */

export interface AuthRequest {
  email: string,
  password: string
}

export interface RegisterRequest extends AuthRequest {
  fullName: string
}

export interface AuthResponse {
  token: string,
  user: {
    fullName: string,
    role: string
  }
}
