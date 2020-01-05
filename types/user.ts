/**
 * User
 */

export type UserRole = "user" | "admin";
export type UserRoleWithGuest = UserRole | "guest";

export interface User {
  email: string,
  fullName: string,
}

export interface UserInfo extends User {
  role: UserRole,
  id: number
}
