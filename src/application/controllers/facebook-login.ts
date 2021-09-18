import { Http, HttpError } from '@/application/helpers'
import { FacebookAuthenticationService } from '@/data/services'
import { AccessToken } from '@/domain/models'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationService: FacebookAuthenticationService
  ) { }

  async handle (httpRequest: any): Promise<Http.Response> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return Http.badRequest(new HttpError.RequiredFieldError('token'))
      }
      const { token } = httpRequest
      const result = await this.facebookAuthenticationService.perform({ token })
      if (result instanceof AccessToken) {
        return Http.ok({ accessToken: result.value })
      } else {
        return {
          statusCode: 401,
          data: result
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          statusCode: 500,
          data: new HttpError.ServerError(error)
        }
      }

      return {
        statusCode: 500,
        data: new HttpError.ServerError()
      }
    }
  }
}
