import { mock } from 'jest-mock-extended'

type Setup = (fileStorage: UploadFile, generatorUUID: UUIDGenrator) => ChangeProfilePicture
type Input = { id: string, file: Buffer}
type ChangeProfilePicture = (input: Input) => Promise<void>
const setupChangeProfilePicture: Setup = (fileStorage, generatorUUID) => async ({ id, file }) => {
  const uuid = generatorUUID.generate()
  await fileStorage.upload({
    file,
    key: uuid
  })
}
export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

export interface UUIDGenrator {
  generate: () => UUIDGenrator.Output
}

namespace UUIDGenrator {
  export type Output = string
}

namespace UploadFile {
  export type Input = {
    file: Buffer
    key: string
  }
}

describe('ChangeProfilePicture', () => {
  fit('should call UploadFile with correct input', async () => {
    const uuid = 'any_unique_id'
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const crypto = mock<UUIDGenrator>()
    crypto.generate.mockReturnValue(uuid)
    const sut = setupChangeProfilePicture(fileStorage, crypto)

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
