import { LoadFacebookUserApi } from '@/domain/contracts/apis/facebook'
import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookAuthentication } from '@/domain/features'
import { UserAccountRepository } from '@/domain/contracts/repo'
import { FacebookAccount } from '@/domain/entities/facebook-account'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { AccessToken } from '@/domain/entities'

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: UserAccountRepository,
    private readonly crypto: TokenGenerator
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser({ token: params.token })
    if (fbData !== undefined) {
      const accountFounded = await this.userAccountRepo.load({
        email: fbData.email
      })
      const facebookAccount = new FacebookAccount(fbData, accountFounded)
      const { id } = await this.userAccountRepo.saveWithFacebook(facebookAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}
