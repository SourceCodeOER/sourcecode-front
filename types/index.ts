export interface CheckBoxObjectEmitted {
  text: string,
  state: boolean,
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

export type DEACTIVATED = 0
export type ACTIVE = 1

export type SelectedTag = {
  id: number,
  text: string,
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
  avg_score: number | null
}

export type TagExercise = {
  tag_id: number,
  tag_text: string,
  category: {
    category_id: number,
    category_text: string
  }
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
