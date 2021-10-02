import { TokenGenerator } from '@/data/contracts/crypto'

import { sign } from 'jsonwebtoken'

type Params = TokenGenerator.Params

export class JwtTokenGenerator implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ expirationInMs, key }: Params): Promise<TokenGenerator.Result> {
    const expirationInSecondes = expirationInMs / 1000
    const token = sign({ key }, this.secret, { expiresIn: expirationInSecondes })
    return token
  }
}
