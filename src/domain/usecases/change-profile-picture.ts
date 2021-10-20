import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repo'

type Setup = (fileStorage: UploadFile, generatorUUID: UUIDGenrator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer}
export type ChangeProfilePicture = (input: Input) => Promise<void>
export const setupChangeProfilePicture: Setup = (fileStorage, generatorUUID, userProfileRepo) => async ({ id, file }) => {
  const uuid = generatorUUID.generate()
  let pictureUrl: string | undefined
  if (file !== undefined) {
    pictureUrl = await fileStorage.upload({
      file,
      key: uuid
    })
  } else {
    await userProfileRepo.load({
      id
    })
  }
  await userProfileRepo.savePicture({
    pictureUrl
  })
}
