/**
 * User
 */

export type UserRole = "user" | "admin";
export type UserRoleWithGuest = UserRole | "guest";

export interface UserInfo {
  email: string,
  fullName: string,
  role: UserRole,
  id: number
}
