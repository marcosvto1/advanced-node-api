import { TokenGenerator } from '@/data/contracts/crypto'

import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSecondes = params.expirationInMs / 1000
    const token = sign({ key: params.key }, this.secret, { expiresIn: expirationInSecondes })
    return token
  }
}
