import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways'

import { JwtPayload, sign, verify } from 'jsonwebtoken'

type Params = TokenGenerator.Params

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (
    private readonly secret: string
  ) {}

  async validate ({ token }: TokenValidator.Params): Promise<string> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }

  async generate ({ expirationInMs, key }: Params): Promise<TokenGenerator.Result> {
    const expirationInSecondes = expirationInMs / 1000
    const token = sign({ key }, this.secret, { expiresIn: expirationInSecondes })
    return token
  }
}
