import { Http, HttpError, HttpStatus } from '@/application/helpers'

type HttpRequest = { authorization: string }

class AuthenticationMiddleware {
  async handle (httpRequest: HttpRequest): Promise<Http.Response<Error>> {
    return HttpStatus.forbiddenError()
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  beforeEach(() => {
    sut = new AuthenticationMiddleware()
  })

  it('should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.FORBIDDEN,
      data: new HttpError.ForbiddenError()
    })
  })

  it('should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.FORBIDDEN,
      data: new HttpError.ForbiddenError()
    })
  })

  it('should return 403 if authorization is undefinied', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.FORBIDDEN,
      data: new HttpError.ForbiddenError()
    })
  })
})
