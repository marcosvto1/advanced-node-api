import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJwtTokenHandler } from '@/main/factories/gateways'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const crypto = makeJwtTokenHandler()
  return new AuthenticationMiddleware(crypto.validate.bind(crypto))
}
