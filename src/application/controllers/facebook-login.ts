import { Controller } from '@/application/controllers/controller'
import { Http, HttpStatus } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { FacebookAuthentication } from '@/domain/usecases'

export type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {
    super()
  }

  async perform (request: Http.Request): Promise<Http.Response<Model>> {
    try {
      const { token } = request
      const accessToken = await this.facebookAuthentication({ token })
      return HttpStatus.ok(accessToken)
    } catch (error) {
      return HttpStatus.unauthorized()
    }
  }

  override buildValidators (request: Http.Request): Validator[] {
    return [...Builder.of({ value: request.token, field: 'token' }).required().build()]
  }
}
