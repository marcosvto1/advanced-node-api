import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'

import { sign, verify } from 'jsonwebtoken'

type Params = TokenGenerator.Params

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (
    private readonly secret: string
  ) {}

  async validateToken ({ token }: TokenValidator.Params): Promise<string> {
    return verify(token, this.secret) as string
  }

  async generateToken ({ expirationInMs, key }: Params): Promise<TokenGenerator.Result> {
    const expirationInSecondes = expirationInMs / 1000
    const token = sign({ key }, this.secret, { expiresIn: expirationInSecondes })
    return token
  }
}
