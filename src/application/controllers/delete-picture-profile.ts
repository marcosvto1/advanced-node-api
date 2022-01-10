import { Controller } from '@/application/controllers/controller'
import { Http, HttpStatus } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/usecases'

type HttpRequest = { userId: string }

export class DeletePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<Http.Response> {
    await this.changeProfilePicture({ id: httpRequest.userId })
    return HttpStatus.notContent()
  }
}
