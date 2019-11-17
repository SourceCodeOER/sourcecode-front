
export interface CheckBoxObjectEmitted {
  text:string,
  state:boolean,
  id: number
}

export interface Tag {
  id: number,
  text: string
}

export interface Category {
  id: number,
  category: string
}

type DEACTIVATED = 0
type ACTIVE = 1
type PENDING = 2
type INACTIVE = 3

export type SelectedTag = {
  id: number,
  text: string,
  state: DEACTIVATED | ACTIVE | PENDING | INACTIVE,
  category: number
}

export type TagsCategory = {
  id:number,
  category: string,
  tags: Tag[]
}

export interface ExtendedTag extends TagsCategory{
  tags: SelectedTag[]
}

/**
 * Exercises types
 */

export type Metric = {
  votes: number,
  avg_score: number | null
}

export type TagExercise = {
  id: number,
  text: string,
  category: string,
  category_id: number
}

export type Exercise = {
  title: string,
  description: string,
  id: number,
  version: number,
  createdAt: string,
  metrics: Metric,
  tags: TagExercise[]
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
