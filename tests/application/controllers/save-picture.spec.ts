import { SavePictureController } from '@/application/controllers'
import { ErrorContext } from '@/application/errors/validation'

describe('SavePictureController', () => {
  let sut: SavePictureController
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string}
  let changeProfilePicture: jest.Mock
  let userId: string

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    changeProfilePicture = jest.fn().mockResolvedValue({
      initials: 'any_initials',
      pictureUrl: 'any_url'
    })
    userId = 'any_user_id'
  })

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture)
  })

  it('should returns 400 if file is not provided', async () => {
    const httpResponse = await sut.perform({ file: undefined as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new ErrorContext.RequiredField('file')
    })
  })

  it('should returns 400 if file is not provided', async () => {
    const httpResponse = await sut.perform({ file: null as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new ErrorContext.RequiredField('file')
    })
  })

  it('should returns 400 if file is empty', async () => {
    const httpResponse = await sut.perform({ file: { buffer: Buffer.from(''), mimeType }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new ErrorContext.RequiredField('file')
    })
  })

  describe('Valid Mimetypes', () => {
    it('should returns 400 if file type is invalid', async () => {
      const httpResponse = await sut.perform({ file: { buffer, mimeType: 'invalid_type' }, userId })

      expect(httpResponse).toEqual({
        statusCode: 400,
        data: new ErrorContext.InvalidMymeTypeError(['png', 'jpeg'])
      })
    })

    it('should not returns 400 if file type is valid', async () => {
      const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/png' }, userId })

      expect(httpResponse).not.toEqual({
        statusCode: 400,
        data: new ErrorContext.InvalidMymeTypeError(['png', 'jpeg'])
      })
    })

    it('should not returns 400 if file type is valid', async () => {
      const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/jpeg' }, userId })

      expect(httpResponse).not.toEqual({
        statusCode: 400,
        data: new ErrorContext.InvalidMymeTypeError(['png', 'jpeg'])
      })
    })

    it('should  returns 400 if file size is bigger than 5mb', async () => {
      const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
      const httpResponse = await sut.perform({ file: { buffer: invalidBuffer, mimeType }, userId })

      expect(httpResponse).toEqual({
        statusCode: 400,
        data: new ErrorContext.MaxFileSizeError(5)
      })
    })

    it('should call ChangeProfilePicture with correct input', async () => {
      await sut.perform({ file, userId })

      expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: buffer })
      expect(changeProfilePicture).toHaveBeenCalledTimes(1)
    })

    it('should return 200 with valida data', async () => {
      const httpResponse = await sut.perform({ file, userId })

      expect(httpResponse).toEqual({
        statusCode: 200,
        data: { initials: 'any_initials', pictureUrl: 'any_url' }
      })
    })
  })
})

// Verificar se tem no maxi 5mb
// Apenas aceitas jpg e png
// Deve returnar a url da image dele
