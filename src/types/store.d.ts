declare namespace Store {
  type Actions<T> = {
    type: string,
    data?: T
  }
  type Payload<T> = {
    type: string,
    payload: T
  }
  type BreadCrumb = {
    path: string,
    title: string
  }
}