export interface IPageableDto<T> {
  content: T[]
  currentSize: number
  hasMore: boolean
}
