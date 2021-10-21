import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repo'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenrator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock<UploadFile>()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock<UUIDGenrator>()
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({
      name: 'Marcos Vinicius Tomaz'
    })
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
      pictureUrl: 'any_url',
      initials: undefined
    })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  fit('should call SaveUserPicture with correct input when file is undefined ', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'MT'
    })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  fit('should call SaveUserPicture with correct input when file is undefined ', async () => {
    userProfileRepo.load.mockResolvedValue({
      name: 'marcos vinicius tomaz'
    })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'MT'
    })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  fit('should call SaveUserPicture with correct input when file is undefined ', async () => {
    userProfileRepo.load.mockResolvedValue({
      name: 'marcos'
    })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'MA'
    })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  fit('should call SaveUserPicture with correct input when file is undefined ', async () => {
    userProfileRepo.load.mockResolvedValue({
      name: 'm'
    })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'M'
    })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  fit('should call SaveUserPicture with correct input when file is undefined ', async () => {
    userProfileRepo.load.mockResolvedValue({
      name: undefined
    })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: undefined
    })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  fit('should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.load).toHaveBeenLastCalledWith({
      id: 'any_id'
    })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  fit('should not call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })
})
