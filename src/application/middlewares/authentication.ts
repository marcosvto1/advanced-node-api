import { Http, HttpStatus } from '@/application/helpers'
import { Middleware } from '@/application/middlewares'
import { RequiredString } from '@/application/validation'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }
export type Authorize = (params: { token: string }) => Promise<string>

export class AuthenticationMiddleware implements Middleware {
  constructor (
    private readonly authorize: Authorize
  ) {}

  async handle ({ authorization }: HttpRequest): Promise<Http.Response<Model>> {
    if (!this.validate({ authorization })) {
      return HttpStatus.forbiddenError()
    }
    try {
      const userId = await this.authorize({ token: authorization })
      return HttpStatus.ok({
        userId
      })
    } catch (error) {
      return HttpStatus.forbiddenError()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredString(authorization, 'authorization').validate()
    return error === undefined
  }
}
