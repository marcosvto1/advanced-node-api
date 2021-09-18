import { HttpError } from '@/application/errors'
import { HttpResponse } from '@/application/helpers'
import { FacebookAuthenticationService } from '@/data/services'
import { AccessToken } from '@/domain/models'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthenticationService: FacebookAuthenticationService
  ) { }

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('the field token is required')
        }
      }
      const { token } = httpRequest
      const result = await this.facebookAuthenticationService.perform({ token })
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: result.value }
        }
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
