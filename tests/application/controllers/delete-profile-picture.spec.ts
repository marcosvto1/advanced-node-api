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
