import { FacebookLoginController } from '@/application/controllers'
import { Http, HttpError } from '@/application/helpers'
import { ValidationComposite } from '@/application/validation'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

jest.mock('@/application/validation/composite')

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

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })
    const error = new Error('validation_error')
    const RequestCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(ValidationComposite).mockImplementationOnce(RequestCompositeSpy)

    await sut.handle({ token })

    expect(RequestCompositeSpy).toHaveBeenCalledWith(validators)
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

  it('should calls FacebookAuthenticationService with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })
})
