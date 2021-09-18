
export namespace Http {
  export type Request = any
  export type Response = { statusCode: number, data: any }
  export enum Status {
    OK=200,
    BAD_REQUEST=400,
    SERVER_ERROR=500,
    UNAUTHORIZED=401,
    CREATED=201
  }
}

export namespace HttpError {
  export class Server extends Error {
    constructor (error?: Error) {
      super('Server failed. Try again soon')
      this.name = 'ServerError'
      this.stack = error?.stack
    }
  }

  export class RequiredField extends Error {
    constructor (fieldName: string) {
      super(`The field ${fieldName} token is required`)
      this.name = 'RequiredFieldError'
    }
  }

  export class Unauthorized extends Error {
    constructor () {
      super('Unauthorized')
      this.name = 'UnauthorizedError'
    }
  }
}

export namespace HttpStatus {
  export const badRequest = (error: Error): Http.Response => ({
    statusCode: Http.Status.BAD_REQUEST,
    data: error
  })

  export const ok = (data: any): Http.Response => ({
    statusCode: Http.Status.OK,
    data
  })

  export const unauthorized = (): Http.Response => ({
    statusCode: Http.Status.UNAUTHORIZED,
    data: new HttpError.Unauthorized()
  })

  export const serverError = (): Http.Response => ({
    statusCode: Http.Status.SERVER_ERROR,
    data: new HttpError.Server()
  })
}
