import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repo'
import { UserProfile } from '@/domain/entities'

type Setup = (fileStorage: UploadFile, generatorUUID: UUIDGenrator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer}
export type ChangeProfilePicture = (input: Input) => Promise<void>
export const setupChangeProfilePicture: Setup = (fileStorage, generatorUUID, userProfileRepo) => async ({ id, file }) => {
  const uuid = generatorUUID.generate()
  const data: { pictureUrl?: string, name?: string } = {}
  let pictureUrl: string | undefined
  let name: string | undefined
  if (file !== undefined) {
    data.pictureUrl = await fileStorage.upload({
      file,
      key: uuid
    })
  } else {
    const result = await userProfileRepo.load({
      id
    })
    data.name = result.name
  }
  const userProfile = new UserProfile(id)
  userProfile.setPicture({ pictureUrl, name })

  await userProfileRepo.savePicture(userProfile)
}
