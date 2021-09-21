import { Http, HttpStatus } from '@/application/helpers'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'
import { FacebookAuthenticationService } from '@/data/services'
import { AccessToken } from '@/domain/models'

export type Model = Error | {
  accessToken: string
}
export class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationService: FacebookAuthenticationService
  ) { }

  async handle (request: Http.Request): Promise<Http.Response<Model>> {
    try {
      const error = this.validate(request)
      if (error !== undefined) {
        return HttpStatus.badRequest(error)
      }
      const { token } = request
      const accessToken = await this.facebookAuthenticationService.perform({ token })
      if (accessToken instanceof AccessToken) {
        return HttpStatus.ok({ accessToken: accessToken.value })
      } else {
        return HttpStatus.unauthorized()
      }
    } catch (error) {
      if (error instanceof Error) {
        return HttpStatus.serverError()
      }
      return HttpStatus.serverError()
    }
  }

  private validate (request: Http.Request): Error | undefined {
    const validator = new ValidationComposite([
      new RequiredStringValidator(request.token, 'token')
    ])
    return validator.validate()
  }
}
