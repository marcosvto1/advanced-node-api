import { Http, HttpError, HttpStatus } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'
import { Authorize } from '@/domain/usecases'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }

class AuthenticationMiddleware {
  constructor (
    private readonly authorize: Authorize
  ) {}

  async handle ({ authorization }: HttpRequest): Promise<Http.Response<Model>> {
    if (!this.validate({ authorization })) {
      return HttpStatus.forbiddenError()
    }
    try {
      const userId = await this.authorize({ token: authorization })
      return HttpStatus.ok({
        userId
      })
    } catch (error) {
      return HttpStatus.forbiddenError()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorization: string
  let authorize: jest.Mock

  beforeAll(() => {
    authorization = 'any_authorization_token'
    authorize = jest.fn()
    authorize.mockResolvedValue('any_user_id')
  })

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize)
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

  it('should call authorize with correct input', async () => {
    await sut.handle({ authorization })

    expect(authorize).toHaveBeenCalledWith({ token: authorization })
    expect(authorize).toHaveBeenCalledTimes(1)
  })

  it('should return 403 if authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'))

    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.FORBIDDEN,
      data: new HttpError.ForbiddenError()
    })
  })

  it('should return 200 with userId authorize success', async () => {
    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.OK,
      data: {
        userId: 'any_user_id'
      }
    })
  })
})