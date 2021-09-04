import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUser with correct params', async () => {
    const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>()
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>()

    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)

    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

    const authResult = await sut.perform({ token: 'token_invalid' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
