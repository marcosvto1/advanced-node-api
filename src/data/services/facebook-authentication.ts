import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repo'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createUserAccountRepo: CreateFacebookAccountRepository
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({
        email: fbData.email
      })

      await this.createUserAccountRepo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
