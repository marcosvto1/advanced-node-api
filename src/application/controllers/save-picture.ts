import { Controller } from '@/application/controllers/controller'
import { ErrorContext } from '@/application/errors/validation'
import { Http, HttpStatus } from '@/application/helpers/http'
import { ChangeProfilePicture } from '@/domain/usecases'

type FileType = { buffer: Buffer, mimeType: string }
type HttpRequest = { file: FileType, userId: string}
type Model = Error | { initials?: string, pictureUrl?: string}

export class SavePictureController extends Controller {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {
    super()
  }

  override async perform ({ file, userId }: HttpRequest): Promise<Http.Response<Model>> {
    if (file === undefined || file === null) return HttpStatus.badRequest(new ErrorContext.RequiredField('file'))
    if (file.buffer.length === 0) return HttpStatus.badRequest(new ErrorContext.RequiredField('file'))
    if (file.mimeType === undefined) return HttpStatus.badRequest(new ErrorContext.InvalidMymeTypeError(['png', 'jpeg']))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) {
      return HttpStatus.badRequest(new ErrorContext.InvalidMymeTypeError(['png', 'jpeg']))
    }
    if (file.buffer.length > 5 * 1024 * 1024) return HttpStatus.badRequest(new ErrorContext.MaxFileSizeError(5))

    const data = await this.changeProfilePicture({ id: userId, file: file.buffer })
    return HttpStatus.ok(data)
  }
}
