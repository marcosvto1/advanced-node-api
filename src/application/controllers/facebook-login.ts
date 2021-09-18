import { Http, HttpStatus, HttpError } from '@/application/helpers'
import { FacebookAuthenticationService } from '@/data/services'
import { AccessToken } from '@/domain/models'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationService: FacebookAuthenticationService
  ) { }

  async handle (request: Http.Request): Promise<Http.Response> {
    try {
      if (request.token === '' || request.token === null || request.token === undefined) {
        return HttpStatus.badRequest(new HttpError.RequiredField('token'))
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
}
