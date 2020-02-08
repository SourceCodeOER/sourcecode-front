/**
 * Types for CheckBoxSelecter component
 */

export interface CheckboxObject {
  title: string,
  state: boolean
}

export interface CheckboxSelecterObjectEmitted {
  index:number,
  data: CheckboxObject
}
