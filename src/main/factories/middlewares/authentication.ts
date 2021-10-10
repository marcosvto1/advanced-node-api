import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const crypto = makeJwtTokenHandler()
  return new AuthenticationMiddleware(crypto.validateToken.bind(crypto))
}
