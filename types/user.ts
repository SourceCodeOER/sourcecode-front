/**
 * Types for everything related to a User
 */
import {MetadataSearchExerciseResponse} from "~/types/exercise";

export type UserRole = "user" | "admin" | "super_admin";
export type UserRoleWithGuest = UserRole | "guest";

export interface User {
  email: string,
  fullName: string,
}

export interface UserInfo extends User {
  role: UserRole,
  id: number
}

export interface UserInfoWithSelection extends UserInfo {
  isSelected: boolean
}

export interface SearchUserRequestMetadata {
  page?: number,
  size?: number
}

export interface MetadataSearchUserResponse extends MetadataSearchExerciseResponse {
}

export interface SearchUserRequest {
  metadata?: SearchUserRequestMetadata,
  roles?: UserRole[],
  fullName?: string,
  email?: string
}

export interface SearchUserResponse {
  metadata: MetadataSearchUserResponse
  data: UserInfo[]
}

export interface PutUserRequest {
  email?: string,
  fullName?: string,
  password?: string,
  role?: UserRole,
  id?: number
}
