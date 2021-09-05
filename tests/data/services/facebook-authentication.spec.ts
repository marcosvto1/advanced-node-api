import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { TokenGenerator } from '@/data/contracts/crypto'
import { UserAccountRepository } from '@/data/contracts/repo'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'
jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<UserAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApi = mock()
    userAccountRepo = mock()
    crypto = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValueOnce({
      id: 'any_account_id'
    })

    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any@mail.com',
      facebookId: 'any_fb_id'
    })
    sut = new FacebookAuthenticationService(loadFacebookUserApi, userAccountRepo, crypto)
  })

  it('should call LoadFacebookUser with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

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
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id' })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})
