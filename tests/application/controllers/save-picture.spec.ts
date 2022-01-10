import { Http, HttpError, HttpStatus } from '@/application/helpers'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }}
type Model = Error

export class SavePictureController {
  async perform ({ file }: HttpRequest): Promise<Http.Response<Model>> {
    if (file === undefined || file === null) return HttpStatus.badRequest(new HttpError.RequiredField('file'))
    if (file.buffer.length === 0) return HttpStatus.badRequest(new HttpError.RequiredField('file'))
    return HttpStatus.badRequest(new InvalidMymeTypeError(['png', 'jpeg']))
  }
}

class InvalidMymeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupoported type. Allowed types: ${allowed.join(',')}`)
    this.name = 'InvalidMymeTypeError'
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

  it('should returns 400 if file type is invalid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'invalid_type' } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpeg'])
    })
  })
})

// Verificar se tem no maxi 5mb
// Apenas aceitas jpg e png
// Deve returnar a url da image dele
