import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokenGenerator.Params): Promise<void> {
    // await jwsign(params.key, 'any_secret')
    const expirationInSecondes = params.expirationInMs / 1000
    jwt.sign({
      key: params.key
    },
    this.secret,
    {
      expiresIn: expirationInSecondes
    }
    )
  }
}

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  it('should call sign with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>
    const sut = new JwtTokenGenerator('any_secret')

    await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })
})
