import { ChangeProfilePicture } from '@/domain/usecases'

type HttpRequest = { userId: string }

export class DeletePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}
  async call (httpRequest: HttpRequest): Promise<void> {
    await this.changeProfilePicture({ id: httpRequest.userId })
  }
}

describe('DeletePictureController', () => {
  it('should call ChangeProfilePicture with correct input', async () => {
    const changeProfilePicture = jest.fn()
    const sut = new DeletePictureController(changeProfilePicture)

    await sut.call({ userId: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})
