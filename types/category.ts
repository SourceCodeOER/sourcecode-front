/**
 * Categories
 */
import {SelectedTag, TagExtended, TagState} from "~/types/tags";

export interface Category {
  id: number,
  category: string
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

export interface CategoryWithSelectedTags extends Category{
  tags: SelectedTag[]
}

export type CreateOrFindCategoryRequest = (string | { text: string, category: string })[]
