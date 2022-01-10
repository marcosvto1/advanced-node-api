import { DeletePictureController } from '@/application/controllers'
import { Controller } from '@/application/controllers/controller'

describe('DeletePictureController', () => {
  let changeProfilePicture: jest.Mock
  let sut: DeletePictureController

  beforeAll(() => {
    changeProfilePicture = jest.fn()
  })

  beforeEach(() => {
    sut = new DeletePictureController(changeProfilePicture)
  })

  it('should calls ChangeProfilePicture with correct input', async () => {
    await sut.perform({ userId: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  it('should return 204', async () => {
    const httpResponse = await sut.perform({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: undefined
    })
  })

  it('should extends controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
