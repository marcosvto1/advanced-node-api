import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSecondes = params.expirationInMs / 1000
    const token = jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSecondes })
    return token
  }
}

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })

  it('should return data on success', async () => {
    const token = await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(token).toBe('any_token')
  })
})
