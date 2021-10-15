import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/gateways/facebook'
import { makeJwtTokenHandler } from '@/main/factories/gateways'
import { makePgUserAccountRepo } from '@/main/factories/repos'

export const makeFacebookAuthenticationUseCase = (): FacebookAuthentication => {
  return setupFacebookAuthentication(makeFacebookApi(), makePgUserAccountRepo(), makeJwtTokenHandler())
}
