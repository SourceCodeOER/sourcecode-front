export interface CheckBoxObjectEmitted extends Tag {
  state: boolean,
}

export interface Tag {
  tag_id: number,
  tag_text: string
}

export interface Category {
  category_id: number,
  category_text: string
}

export type DEACTIVATED = 0
export type ACTIVE = 1

export interface SelectedTag extends Tag {
  state: DEACTIVATED | ACTIVE
  category: number
}

export type TagsCategory = {
  id: number,
  category: string,
  tags: Tag[]
}

export interface ExtendedTag extends TagsCategory {
  tags: SelectedTag[]
}

/**
 * Exercises types
 */

export type Metric = {
  votes: number,
  avg_vote: number
}

export interface TagExercise extends Tag  {
  category: Category
}

export type Exercise = {
  title: string,
  description: string,
  id: number,
  version: number,
  createdAt: string,
  updatedAt: string,
  metrics: Metric,
  tags: TagExercise[],
  url?: string|null,
  isValidated:boolean,
  file:string
}

export type MetadataResponse = {
  currentPage: number,
  totalItems: number,
  totalPages: number,
  pageSize: number
}

export type MetadataRequest = {
  page?: number,
  size?: number
}

export type SearchResponse = {
  metadata: MetadataResponse,
  data: Exercise[]
}

export type SearchCriterion = {
  title?: string,
  tags?: (number | number[])[]
}

export type SearchRequest = {
  metadata?: MetadataRequest,
  data?: SearchCriterion
}

/**
 * Historical
 */
export interface Historical {
  datetime: string,
  title?:string
  tags?: SelectedTag[]
}


/**
 * User
 */


export type UserRole = 'admin' | 'user' | 'guest'

export interface User {
  fullName:string,
  role: UserRole
}
export interface UserInfo {
  token:string,
  user: User
}
