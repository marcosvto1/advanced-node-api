import { Http, HttpStatus, HttpError } from '@/application/helpers'
import { FacebookAuthenticationService } from '@/data/services'
import { AccessToken } from '@/domain/models'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationService: FacebookAuthenticationService
  ) { }

  async handle (httpRequest: any): Promise<Http.Response> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return HttpStatus.badRequest(new HttpError.RequiredField('token'))
      }
      const { token } = httpRequest
      const accessToken = await this.facebookAuthenticationService.perform({ token })
      if (accessToken instanceof AccessToken) {
        return HttpStatus.ok({ accessToken: accessToken.value })
      } else {
        return HttpStatus.unauthorized()
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          statusCode: 500,
          data: new HttpError.Server(error)
        }
      }

      return {
        statusCode: 500,
        data: new HttpError.Server()
      }
    }
  }
}
