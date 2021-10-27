import { DeleteFile, UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repo'
import { UserProfile } from '@/domain/entities'

type Setup = (fileStorage: UploadFile & DeleteFile, generatorUUID: UUIDGenrator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer}
type Output = { pictureUrl?: string, initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>
export const setupChangeProfilePicture: Setup = (fileStorage, generatorUUID, userProfileRepo) => async ({ id, file }) => {
  const Keyuuid = generatorUUID.generate()
  const data = {
    pictureUrl: file !== undefined ? await fileStorage.upload({ file, key: Keyuuid }) : undefined,
    name: file === undefined ? (await userProfileRepo.load({ id })).name : undefined
  }
  const userProfile = new UserProfile(id)
  userProfile.setPicture(data)
  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) await fileStorage.delete({ key: Keyuuid })
    throw error
  }
  return userProfile
}
