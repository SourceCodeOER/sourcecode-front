/**
 * Tags
 */

export type TagState = "default" | "validated" | "pending";

export interface TagsSettingsRequest {
  tags_ids?: number[],
  categories_ids?: number[],
  state?: TagState
}

export interface Tag {
  tag_id: number,
  tag_text: string
}

export interface TagExtended extends Tag {
  category_id: number,
  isValidated: boolean,
  version: number
}

export interface SelectedTag extends Tag {
  state: 0 | 1,
  category_id: number
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
