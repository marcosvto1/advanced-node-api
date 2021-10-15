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
      await sut.generate({
        key,
        expirationInMs
      })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return data on success', async () => {
      const generatedToken = await sut.generate({
        key,
        expirationInMs: 1000
      })

      expect(generatedToken).toBe(token)
    })

    it('should rethrows if jwt.sign throws', async () => {
      fakeJwt.sign.mockImplementation(() => { throw new Error('any_error') })

      const promise = sut.generate({
        key,
        expirationInMs: 1000
      })

      await expect(promise).rejects.toThrow(new Error('any_error'))
    })
  })

  describe('ValidateToken', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'

      fakeJwt.verify.mockImplementation(() => ({ key }))
    })

    it('should call verify with correct params', async () => {
      await sut.validate({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    it('should return the key user to sign', async () => {
      const generateKey = await sut.validate({ token })

      expect(generateKey).toBe(key)
    })

    it('should rethrows if jwt.verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('key_error') })

      const promise = sut.validate({
        token
      })

      await expect(promise).rejects.toThrow(new Error('key_error'))
    })

    it('should throws if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null)

      const promise = sut.validate({
        token
      })

      await expect(promise).rejects.toThrow()
    })
  })
})
