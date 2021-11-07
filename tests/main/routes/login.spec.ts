import { makeFakeDb } from '@/../tests/infra/repos/postgres/mocks'
import { Http, HttpError } from '@/application/helpers'
import { PgUser } from '@/infra/repos/postgres/entities'
import { app } from '@/main/config/app'
import { IBackup } from 'pg-mem'
import request from 'supertest'
import { getConnection } from 'typeorm'

describe('LoginRoutes', () => {
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
  })

  beforeEach(async () => {
    backup.restore()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('POST /login/facebook', () => {
    const loadUserSpy = jest.fn()

    jest.mock('@/infra/gateways/facebook-api', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

    it('should returns 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_mail' })
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(Http.Status.OK)
      expect(body.accessToken).toBeDefined()
    })

    it('should returns 401 with UnauthorizerdError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(Http.Status.UNAUTHORIZED)
      expect(body.error).toBe(new HttpError.Unauthorized().message)
    })
  })
})
