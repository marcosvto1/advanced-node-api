import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

type HttpResponse = { statusCode: number, data: any }

class ServerError extends Error {
  constructor (error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationService: FacebookAuthenticationService
  ) { }

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('the field token is required')
        }
      }
      const { token } = httpRequest
      const result = await this.facebookAuthenticationService.perform({ token })
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: result.value }
        }
      } else {
        return {
          statusCode: 401,
          data: result
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          statusCode: 500,
          data: new ServerError(error)
        }
      }

      return {
        statusCode: 500,
        data: new ServerError()
      }
    }
  }
}

describe('FacebookLoginController', () => {
  let facebookAuthentication: MockProxy<FacebookAuthenticationService>
  let sut: FacebookLoginController

  beforeAll(() => {
    facebookAuthentication = mock()
    facebookAuthentication.perform.mockResolvedValue(new AccessToken('any_value'))
    sut = new FacebookLoginController(facebookAuthentication)
  })

  it('should return 400 if tokeen is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('should return 401 if FacebookAuthService fails', async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })

  it('should return 200 if FacebookAuthService succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
  it('should return 500 if FacebookAuthService throws', async () => {
    const error = new Error('infra_error')
    facebookAuthentication.perform.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  it('should calls FacebookAuthenticationService with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })
})
