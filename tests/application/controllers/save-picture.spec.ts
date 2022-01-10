import { Http, HttpError, HttpStatus } from '@/application/helpers'

type HttpRequest = { file: { buffer: Buffer }}
type Model = Error

export class SavePictureController {
  async perform ({ file }: HttpRequest): Promise<Http.Response<Model>> {
    return HttpStatus.badRequest(new HttpError.RequiredField('file'))
  }
}

describe('SavePictureController', () => {
  let sut: SavePictureController

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
    const httpResponse = await sut.perform({ file: { buffer: Buffer.from('') } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new HttpError.RequiredField('file')
    })
  })
})

// Verificar se tem no maxi 5mb
// Apenas aceitas jpg e png
// Deve returnar a url da image dele
