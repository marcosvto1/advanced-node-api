import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/api/facebook'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makePgUserAccountRepo } from '@/main/factories/repos'

export const makeFacebookAuthenticationUseCase = (): FacebookAuthentication => {
  return setupFacebookAuthentication(makeFacebookApi(), makePgUserAccountRepo(), makeJwtTokenGenerator())
}