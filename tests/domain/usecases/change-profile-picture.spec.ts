import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { SaveUserPicture } from '@/domain/contracts/repo'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenrator>
  let userProfileRepo: MockProxy<SaveUserPicture>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock<UploadFile>()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock<UUIDGenrator>()
    userProfileRepo = mock()
    crypto.generate.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
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

  fit('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  fit('should SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenLastCalledWith({
      pictureUrl: 'any_url'
    })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  fit('should call SaveUserPicture with correct input when file is undefined ', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined
    })
  })
})
