import {SelectedTag} from "~/types/tags";

export interface Historical {
  datetime: string,
  title?: string
  tags?: SelectedTag[]
}
