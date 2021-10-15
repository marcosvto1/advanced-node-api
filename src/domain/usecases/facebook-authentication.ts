import { LoadFacebookUser } from '@/domain/contracts/gateways/facebook'
import { AuthenticationError } from '@/domain/entities/errors'
import { UserAccountRepository } from '@/domain/contracts/repo'
import { FacebookAccount } from '@/domain/entities/facebook-account'
import { TokenGenerator } from '@/domain/contracts/gateways'
import { AccessToken } from '@/domain/entities'

type Setup = (facebook: LoadFacebookUser, userAccountRepo: UserAccountRepository, crypto: TokenGenerator) => FacebookAuthentication
type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepo, crypto
) => {
  return async (params) => {
    const fbData = await facebook.loadUser({ token: params.token })
    if (fbData !== undefined) {
      const accountFounded = await userAccountRepo.load({
        email: fbData.email
      })
      const facebookAccount = new FacebookAccount(fbData, accountFounded)
      const { id } = await userAccountRepo.saveWithFacebook(facebookAccount)
      const accessToken = await crypto.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
      return {
        accessToken
      }
    }
    throw new AuthenticationError()
  }
}
