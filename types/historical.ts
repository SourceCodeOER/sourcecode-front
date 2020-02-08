import {SelectedTag} from "~/types/tags";
import {VoteExerciseRequest} from "~/types/exercise";

/**
 * Historical types
 */
export interface Historical {
  datetime: string,
  title?: string
  tags?: SelectedTag[],
  vote?: VoteExerciseRequest
}
