import { FacebookLoginController } from '@/application/controllers'
import { Http, HttpError } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

jest.mock('@/application/validation/required-string')

describe('FacebookLoginController', () => {
  let facebookAuthentication: MockProxy<FacebookAuthenticationService>
  let sut: FacebookLoginController
  let token: string

  beforeAll(() => {
    token = 'any_token'

    facebookAuthentication = mock()
    facebookAuthentication.perform.mockResolvedValue(new AccessToken('any_value'))
    sut = new FacebookLoginController(facebookAuthentication)
  })

  it('should return 400 if validation is fails', async () => {
    const error = new Error('validation_error')
    const RequestStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(RequiredStringValidator).mockImplementationOnce(RequestStringValidatorSpy)

    const httpResponse = await sut.handle({ token })

    expect(RequestStringValidatorSpy).toHaveBeenCalledWith('any_token', 'token')

    expect(httpResponse).toEqual({
      statusCode: Http.Status.BAD_REQUEST,
      data: error
    })
  })

  it('should return 401 if FacebookAuthService fails', async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.UNAUTHORIZED,
      data: new HttpError.Unauthorized()
    })
  })

  it('should return 200 if FacebookAuthService succeeds', async () => {
    const httpResponse = await sut.handle({ token })

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

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.SERVER_ERROR,
      data: new HttpError.Server(error)
    })
  })

  it('should calls FacebookAuthenticationService with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })
})
