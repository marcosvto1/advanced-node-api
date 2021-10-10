import { Http, HttpError } from '@/application/helpers'
import { app } from '@/main/config/app'
import { auth } from '@/main/middlewares/authentication'
import request from 'supertest'

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })

    const { status, body } = await request(app)
      .get('/fake_route')

    expect(status).toBe(Http.Status.FORBIDDEN)
    expect(body.error).toBe(new HttpError.ForbiddenError().message)
  })
})
