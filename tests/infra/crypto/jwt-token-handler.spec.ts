import { JwtTokenHandler } from '@/infra/crypto/jwt-token-handler'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('GenerateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({
        key,
        expirationInMs
      })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    it('should return data on success', async () => {
      const generatedToken = await sut.generateToken({
        key,
        expirationInMs: 1000
      })

      expect(generatedToken).toBe(token)
    })

    it('should rethrows if jwt.sign throws', async () => {
      fakeJwt.sign.mockImplementation(() => { throw new Error('any_error') })

      const promise = sut.generateToken({
        key,
        expirationInMs: 1000
      })

      await expect(promise).rejects.toThrow(new Error('any_error'))
    })
  })

  describe('ValidateToken', () => {})
})
