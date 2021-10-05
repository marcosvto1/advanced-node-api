import { LoadFacebookUserApi } from '@/domain/contracts/apis/facebook'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { UserAccountRepository } from '@/domain/contracts/repo'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/usecases'
jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<UserAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthentication
  let token: string

  beforeAll(() => {
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id'
    })
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any@mail.com',
      facebookId: 'any_fb_id'
    })

    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
    token = 'any_token'
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(loadFacebookUserApi, userAccountRepo, crypto)
  })

  it('should call LoadFacebookUser with correct params', async () => {
    await sut({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any@mail.com' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  // it('should create account with facebook data', async () => {
  //   await sut.perform({ token })

  //   expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
  //     name: 'any_fb_name',
  //     email: 'any@mail.com',
  //     facebookId: 'any_fb_id'
  //   })
  //   expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  // })

  // it('should not update account name', async () => {
  //   userAccountRepo.load.mockResolvedValueOnce({
  //     id: 'any_id',
  //     name: 'any_name'
  //   })

  //   await sut.perform({ token })

  //   expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
  //     id: 'any_id',
  //     name: 'any_name',
  //     facebookId: 'any_fb_id',
  //     email: 'any@mail.com'
  //   })
  //   expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  // })

  // it('should update account name', async () => {
  //   userAccountRepo.load.mockResolvedValueOnce({
  //     id: 'any_id'
  //   })

  //   await sut.perform({ token })

  //   expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
  //     id: 'any_id',
  //     name: 'any_fb_name',
  //     facebookId: 'any_fb_id',
  //     email: 'any@mail.com'
  //   })
  //   expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  // })

  it('should call SaveFacebookAccountRepository with FacebookAccount model', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any'
    }))

    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    await sut({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id', expirationInMs: AccessToken.expirationInMs })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an AccessToken on success', async () => {
    const authResult = await sut({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    loadFacebookUserApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should rethrow if UserAccountRepo.load throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if UserAccountRepo.saveWithFacebook throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save'))
  })

  it('should rethrow if crypto.generateToken throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
