import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repo'
import { UserProfile } from '@/domain/entities'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

jest.mock('@/domain/entities/user-profile')

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

  it('should call UploadFile with correct input', async () => {
    await sut({
      id: 'any_id',
      file
    })

    expect(fileStorage.upload).toHaveBeenLastCalledWith({
      file, key: uuid
    })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('should SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenLastCalledWith(...mocked(UserProfile).mock.instances)
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.load).toHaveBeenLastCalledWith({
      id: 'any_id'
    })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should not call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })

  it('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce((id) => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))

    const result = await sut({ id: 'any_id', file })

    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })
})
