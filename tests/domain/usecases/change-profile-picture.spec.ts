import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenrator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock<UploadFile>()
    crypto = mock<UUIDGenrator>()
    crypto.generate.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto)
  })

  fit('should call UploadFile with correct input', async () => {
    await sut({
      id: 'any_id',
      file
    })

    expect(fileStorage.upload).toHaveBeenLastCalledWith({
      file, key: uuid
    })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
