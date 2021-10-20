export interface UUIDGenrator {
  generate: () => UUIDGenrator.Output
}

export namespace UUIDGenrator {
  export type Output = string
}
