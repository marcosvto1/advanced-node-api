import { Controller } from '@/application/controllers/controller'
import { Http, HttpStatus } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { FacebookAuthenticationService } from '@/domain/services'
import { AccessToken } from '@/domain/models'

export type Model = Error | {
  accessToken: string
}
export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthenticationService: FacebookAuthenticationService
  ) {
    super()
  }

  async perform (request: Http.Request): Promise<Http.Response<Model>> {
    const { token } = request
    const accessToken = await this.facebookAuthenticationService.perform({ token })
    return accessToken instanceof AccessToken ? HttpStatus.ok({ accessToken: accessToken.value }) : HttpStatus.unauthorized()
  }

  override buildValidators (request: Http.Request): Validator[] {
    return [...Builder.of({ value: request.token, field: 'token' }).required().build()]
  }
}
