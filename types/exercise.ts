/**
 * Types for everything related to an exercise
 */

/**
 * Exercise Single
 */
import {Tag, TagProposal, TagState} from "~/types/tags";
import {User} from "~/types/user";


export type ExerciseState = "DRAFT" | "PENDING" | "VALIDATED" | "NOT_VALIDATED" | "ARCHIVED";

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
  metrics?: ExerciseMetrics,
  tags: ExerciseTag[],
  vote?: number,
  creator?: User
}

export interface ExerciseWithSelection extends Exercise {
  isSelected: boolean
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
  user_ids?: number[],
  exercise_ids?: number[]
  vote?: VoteExerciseRequest
}

export interface FilterOptionsExerciseRequest {
  state?: ExerciseState[],
  tags?: TagState[]
}

export interface IncludeOptionsExerciseRequest {
  includeCreator?: boolean,
  includeMetrics?: boolean,
  includeDescription?: boolean,
  includeTags?: boolean
}

export interface VoteExerciseRequest {
  operator: "<=" | "<" | ">=" | ">",
  value: number
}

export interface OrderByExerciseRequest {
  field: "state" | "id" | "title" | "date" | "avg_score" | "vote_count",
  value: "ASC" | "DESC"
}

export interface SearchExerciseRequest {
  metadata?: MetadataSearchExerciseRequest,
  includeOptions?: IncludeOptionsExerciseRequest,
  filterOptions?: FilterOptionsExerciseRequest
  data?: DataSearchExerciseRequest,
  orderBy?: OrderByExerciseRequest[]
}

export interface ExportExerciseRequest {
  includeOptions?: IncludeOptionsExerciseRequest,
  filterOptions?: FilterOptionsExerciseRequest
  data?: DataSearchExerciseRequest,
  orderBy?: OrderByExerciseRequest[]
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
  url?: string | null,
  state?: ExerciseState
}

export interface PostExerciseRequestWithFile extends PostExerciseRequest {
  exerciseFile: File
}

export interface UpdateExerciseRequest extends PostExerciseRequest {
  version: number,
  removePreviousFile?: boolean
}

export interface UpdateExerciseRequestWithFile extends PostExerciseRequestWithFile {
  version: number
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

// For import feature that used export ( simplest version )
export interface ImportExportFormat {
  categories: { [key: string]: string; },
  exercises: {
    title: string,
    description: string,
    state: ExerciseState,
    url: null | string,
    tags: {
      text: string,
      category: number
    }[]
  }[]
}
