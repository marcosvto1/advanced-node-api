import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { UserAccountRepository } from '@/data/contracts/repo'
import { FacebookAccount } from '@/domain/models/facebook-account'
import { TokenGenerator } from '@/data/contracts/crypto'
import { AccessToken } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: UserAccountRepository,
    private readonly crypto: TokenGenerator
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser({ token: params.token })
    if (fbData !== undefined) {
      const accountFounded = await this.userAccountRepo.load({
        email: fbData.email
      })
      const facebookAccount = new FacebookAccount(fbData, accountFounded)
      const { id } = await this.userAccountRepo.saveWithFacebook(facebookAccount)
      await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    }
    return new AuthenticationError()
  }
}
