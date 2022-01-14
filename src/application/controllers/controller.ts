import { Http, HttpStatus } from '@/application/helpers'
import { ValidationComposite, Validator } from '@/application/validation'

export type Model<T = any> = Error | T
export abstract class Controller {
  abstract perform (request: Http.Request): Promise<Http.Response<Model>>

  buildValidators (request: Http.Request): Validator[] {
    return []
  }

  async handle (request: Http.Request): Promise<Http.Response<any>> {
    const error = this.validate(request)
    if (error !== undefined) {
      return HttpStatus.badRequest(error)
    }
    try {
      return await this.perform(request)
    } catch (error) {
      return HttpStatus.serverError()
    }
  }

  private validate (request: Http.Request): Error | undefined {
    const validators = this.buildValidators(request)
    return new ValidationComposite(validators).validate()
  }
}
