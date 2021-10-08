
export namespace Http {
  export type Request = any
  export type Response<T = any> = { statusCode: number, data: T }
  export enum Status {
    OK=200,
    BAD_REQUEST=400,
    SERVER_ERROR=500,
    UNAUTHORIZED=401,
    FORBIDDEN=403,
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

  export class ForbiddenError extends Error {
    constructor () {
      super('Forbidden')
      this.name = 'ForbiddenError'
    }
  }
}

export namespace HttpStatus {
  export const badRequest = (error: Error): Http.Response<Error> => ({
    statusCode: Http.Status.BAD_REQUEST,
    data: error
  })

  export const ok = <T = any>(data: T): Http.Response<T> => ({
    statusCode: Http.Status.OK,
    data
  })

  export const unauthorized = (): Http.Response<Error> => ({
    statusCode: Http.Status.UNAUTHORIZED,
    data: new HttpError.Unauthorized()
  })

  export const serverError = (): Http.Response<Error> => ({
    statusCode: Http.Status.SERVER_ERROR,
    data: new HttpError.Server()
  })

  export const forbiddenError = (): Http.Response<Error> => ({
    statusCode: Http.Status.FORBIDDEN,
    data: new HttpError.ForbiddenError()
  })
}
