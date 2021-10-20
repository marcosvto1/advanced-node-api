import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { SaveUserPicture } from '@/domain/contracts/repo'

type Setup = (fileStorage: UploadFile, generatorUUID: UUIDGenrator, saveUserPicture: SaveUserPicture) => ChangeProfilePicture
type Input = { id: string, file?: Buffer}
export type ChangeProfilePicture = (input: Input) => Promise<void>
export const setupChangeProfilePicture: Setup = (fileStorage, generatorUUID, saveUserPicture) => async ({ id, file }) => {
  const uuid = generatorUUID.generate()
  if (file !== undefined) {
    const pictureUrl = await fileStorage.upload({
      file,
      key: uuid
    })

    await saveUserPicture.savePicture({
      pictureUrl
    })
  }
}
