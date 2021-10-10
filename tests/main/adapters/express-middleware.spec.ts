import { Http } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = middleware => {
  return async (req, res, next) => {
    const response = await middleware.handle({ ...req.headers })
    res.json(response).send()
  }
}

interface Middleware {
  handle: (httpRequest: any) => Promise<Http.Response>
}

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy < Middleware >
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({
      headers: {
        any: 'any'
      }
    })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock<Middleware>()
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    req = getMockReq({
      headers: {}
    })

    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
