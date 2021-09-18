
export namespace Http {
  export type Response = { statusCode: number, data: any }
  export const badRequest = (error: Error): Response => ({
    statusCode: 400,
    data: error
  })

  export const ok = (data: any): Response => ({
    statusCode: 200,
    data
  })
}
export namespace HttpError {
  export class ServerError extends Error {
    constructor (error?: Error) {
      super('Server failed. Try again soon')
      this.name = 'ServerError'
      this.stack = error?.stack
    }
  }

  export class RequiredFieldError extends Error {
    constructor (fieldName: string) {
      super(`The field ${fieldName} token is required`)
      this.name = 'RequiredFieldError'
    }
  }
}
