/**
 * Categories
 */
import {SelectedTag, TagExtended, TagState} from "~/types/tags";

export interface Category {
  id: number,
  category: string
}

export interface CategoryExtended extends Category {
  total: number,
  total_validated: number,
  total_deprecated: number,
  total_unvalidated: number
}

export interface CategoryExtendedWithState extends CategoryExtended {
  state: boolean
}

export interface CategoryWithTagsSettings {
  state?: TagState,
  onlySelected?: number[]
}


export interface CategoryWithTags {
  id: number,
  category: string,
  tags: TagExtended[]
}

export interface CategoryWithSelectedTags extends Category {
  tags: SelectedTag[]
}

export type CreateOrFindCategoryRequest = (string | { text: string, category: string })[]
