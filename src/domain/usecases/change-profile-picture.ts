import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'

type Setup = (fileStorage: UploadFile, generatorUUID: UUIDGenrator) => ChangeProfilePicture
type Input = { id: string, file: Buffer}
export type ChangeProfilePicture = (input: Input) => Promise<void>
export const setupChangeProfilePicture: Setup = (fileStorage, generatorUUID) => async ({ id, file }) => {
  const uuid = generatorUUID.generate()
  await fileStorage.upload({
    file,
    key: uuid
  })
}
