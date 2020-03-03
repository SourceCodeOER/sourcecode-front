/**
 * types for everything related to Tags
 */

export type TagState = "DEPRECATED" | "VALIDATED" | "NOT_VALIDATED" | "PENDING";

export interface TagsSettingsRequest {
  tags_ids?: number[],
  categories_ids?: number[],
  state?: TagState,
  title?: string
}

export interface Tag {
  tag_id: number,
  tag_text: string
}

export interface TagExtended extends Tag {
  category_id: number,
  state: TagState,
  version: number
}

export interface SelectedTag extends TagExtended {
  isSelected: boolean
}

export interface TagProposal {
  text: string,
  category_id: number
}

export type TagsSettingsResponse = TagExtended[];

export interface UpdateTagCategory {
  id: number,
  category: string
}


export interface TagLabelObjectEmitted {
  title: string,
  id: number
}

export interface TagRequest {
  text: string,
  category_id: number,
  state?: TagState
}

export type CreateTagRequest = TagRequest[]
