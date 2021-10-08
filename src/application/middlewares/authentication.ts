import { Http, HttpStatus } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'
import { Authorize } from '@/domain/usecases'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }

export class AuthenticationMiddleware {
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
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
