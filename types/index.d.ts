export * from './auth'
export * from './category'
export * from './configuration'
export * from './exercise'
export * from './tags'
export * from './user'
export * from './historical'
export * from './checkbox'
export * from './radiobutton'

export interface CheckBoxObjectEmitted {
  title: string,
  id: number,
  state: boolean
}
