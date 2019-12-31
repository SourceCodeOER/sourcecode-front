/**
 * Exercise Single
 */
import {Tag, TagProposal} from "~/types/tags";


export type ExerciseState = "CREATED" | "PENDING" | "VALIDATED" | "NOT_VALIDATED";

export interface ExerciseMetrics {
  votes: number,
  avg_score: number
}

export interface ExerciseCategory {
  category_text: string,
  category_id: number
}

export interface ExerciseTag extends Tag {
  category: ExerciseCategory
}

export interface Exercise {
  title: string,
  description: string,
  id: number,
  version: number,
  createdAt: string,
  updatedAt: string,
  state: ExerciseState,
  file: null | string,
  url: null | string,
  metrics: ExerciseMetrics,
  tags: ExerciseTag[]
}

export interface ExerciseWithSelection extends Exercise{
  isSelected:boolean
}

/**
 * Exercise post
 */

export interface MetadataSearchExerciseRequest {
  page?: number,
  size?: number
}

export interface DataSearchExerciseRequest {
  title?: string,
  tags?: (number | number[])[],
  state?: ExerciseState,
  user_ids?: number[]
}

export interface SearchExerciseRequest {
  metadata?: MetadataSearchExerciseRequest,
  data?: DataSearchExerciseRequest
}

export interface MetadataSearchExerciseResponse {
  currentPage: number,
  totalItems: number,
  totalPages: number,
  pageSize: number
}

export interface SearchExerciseResponse {
  metadata: MetadataSearchExerciseResponse,
  data: Exercise[]
}

/**
 * Create exercise
 */

export interface PostExerciseRequest {
  title: string,
  description: string,
  tags: (number | TagProposal)[],
  url?: string | null
}

export interface PostExerciseRequestWithFile extends PostExerciseRequest {
  exerciseFile: File
}

export interface UpdateExerciseRequest extends PostExerciseRequest {
  version:number,
  removePreviousFile?:boolean
}

export interface UpdateExerciseRequestWithFile extends PostExerciseRequestWithFile {
  version:number
}

/**
 * Status
 */

export interface ExerciseStatusRequest {
  exercises: number[],
  state: ExerciseState
}

/**
 * Vote
 */

export interface VoteRequest {
  exercise_id: number,
  score: number
}


