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
  avg_vote: number | null
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
