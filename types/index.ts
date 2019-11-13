
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
