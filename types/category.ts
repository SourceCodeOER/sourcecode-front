/**
 * Categories
 */
import {SelectedTag, Tag, TagState} from "~/types/tags";

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
  tags: Tag[]
}

export interface CategoryWithSelectedTags {
  id: number,
  category: string,
  tags: SelectedTag[]
}

export type CreateOrFindCategoryRequest = (string | { text: string, category: string })[]
