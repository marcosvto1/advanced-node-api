import { LoadFacebookUserApi } from '@/domain/contracts/apis/facebook'
import { AuthenticationError } from '@/domain/entities/errors'
import { UserAccountRepository } from '@/domain/contracts/repo'
import { FacebookAccount } from '@/domain/entities/facebook-account'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { AccessToken } from '@/domain/entities'

type Setup = (facebookApi: LoadFacebookUserApi, userAccountRepo: UserAccountRepository, crypto: TokenGenerator) => FacebookAuthentication
type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepo, crypto
) => {
  return async (params) => {
    const fbData = await facebookApi.loadUser({ token: params.token })
    if (fbData !== undefined) {
      const accountFounded = await userAccountRepo.load({
        email: fbData.email
      })
      const facebookAccount = new FacebookAccount(fbData, accountFounded)
      const { id } = await userAccountRepo.saveWithFacebook(facebookAccount)
      const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return {
        accessToken
      }
    }
    throw new AuthenticationError()
  }
}
