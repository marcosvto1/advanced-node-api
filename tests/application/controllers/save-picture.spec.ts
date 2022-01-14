import { Http, HttpError, HttpStatus } from '@/application/helpers'

type FileType = { buffer: Buffer, mimeType: string }
type HttpRequest = { file: FileType}
type Model = Error | any

export class SavePictureController {
  async perform ({ file }: HttpRequest): Promise<Http.Response<Model>> {
    if (file === undefined || file === null) return HttpStatus.badRequest(new HttpError.RequiredField('file'))
    if (file.buffer.length === 0) return HttpStatus.badRequest(new HttpError.RequiredField('file'))
    if (file.mimeType === undefined) return HttpStatus.badRequest(new InvalidMymeTypeError(['png', 'jpeg']))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) {
      return HttpStatus.badRequest(new InvalidMymeTypeError(['png', 'jpeg']))
    }
    if (file.buffer.length > 5 * 1024 * 1024) return HttpStatus.badRequest(new MaxFileSizeError(5))

    return HttpStatus.ok({})
  }
}
class InvalidMymeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupoported type. Allowed types: ${allowed.join(',')}`)
    this.name = 'InvalidMymeTypeError'
  }
}
class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`File upload limit ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}

describe('SavePictureController', () => {
  let sut: SavePictureController
  // let file: { buffer: Buffer }
  let buffer: Buffer
  let mimeType: string

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
  })

  beforeEach(() => {
    sut = new SavePictureController()
  })

  it('should returns 400 if file is not provided', async () => {
    const httpResponse = await sut.perform({ file: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new HttpError.RequiredField('file')
    })
  })

  it('should returns 400 if file is not provided', async () => {
    const httpResponse = await sut.perform({ file: null as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new HttpError.RequiredField('file')
    })
  })

  it('should returns 400 if file is empty', async () => {
    const httpResponse = await sut.perform({ file: { buffer: Buffer.from(''), mimeType } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new HttpError.RequiredField('file')
    })
  })

  describe('Valid Mimetypes', () => {
    it('should returns 400 if file type is invalid', async () => {
      const httpResponse = await sut.perform({ file: { buffer, mimeType: 'invalid_type' } })

      expect(httpResponse).toEqual({
        statusCode: 400,
        data: new InvalidMymeTypeError(['png', 'jpeg'])
      })
    })

    it('should not returns 400 if file type is valid', async () => {
      const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/png' } })

      expect(httpResponse).not.toEqual({
        statusCode: 400,
        data: new InvalidMymeTypeError(['png', 'jpeg'])
      })
    })

    it('should not returns 400 if file type is valid', async () => {
      const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/jpeg' } })

      expect(httpResponse).not.toEqual({
        statusCode: 400,
        data: new InvalidMymeTypeError(['png', 'jpeg'])
      })
    })

    it('should  returns 400 if file size is bigger than 5mb', async () => {
      const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
      const httpResponse = await sut.perform({ file: { buffer: invalidBuffer, mimeType } })

      expect(httpResponse).toEqual({
        statusCode: 400,
        data: new MaxFileSizeError(5)
      })
    })
  })
})

// Verificar se tem no maxi 5mb
// Apenas aceitas jpg e png
// Deve returnar a url da image dele
