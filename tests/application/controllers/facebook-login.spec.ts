import { FacebookLoginController } from '@/application/controllers'
import { Http, HttpError } from '@/application/helpers'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

import { mock, MockProxy } from 'jest-mock-extended'

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
      statusCode: Http.Status.BAD_REQUEST,
      data: new HttpError.RequiredField('token')
    })
  })

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new HttpError.RequiredField('token')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.BAD_REQUEST,
      data: new HttpError.RequiredField('token')
    })
  })

  it('should return 401 if FacebookAuthService fails', async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.UNAUTHORIZED,
      data: new HttpError.Unauthorized()
    })
  })

  it('should return 200 if FacebookAuthService succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.OK,
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
      statusCode: Http.Status.SERVER_ERROR,
      data: new HttpError.Server(error)
    })
  })

  it('should calls FacebookAuthenticationService with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })
})
