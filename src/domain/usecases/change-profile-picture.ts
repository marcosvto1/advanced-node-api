import { UploadFile, UUIDGenrator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repo'

type Setup = (fileStorage: UploadFile, generatorUUID: UUIDGenrator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer}
export type ChangeProfilePicture = (input: Input) => Promise<void>
export const setupChangeProfilePicture: Setup = (fileStorage, generatorUUID, userProfileRepo) => async ({ id, file }) => {
  const uuid = generatorUUID.generate()
  let pictureUrl: string | undefined
  let initials: string | undefined
  if (file !== undefined) {
    pictureUrl = await fileStorage.upload({
      file,
      key: uuid
    })
  } else {
    const userProfileData = await userProfileRepo.load({
      id
    })
    if (userProfileData?.name !== undefined) {
      const name = userProfileData.name
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        initials = `${firstLetters.shift() ?? ''}${firstLetters.pop() ?? ''}`.toLocaleUpperCase()
      } else {
        initials = `${name.substr(0, 2) ?? ''}`.toLocaleUpperCase()
      }
    }
  }
  await userProfileRepo.savePicture({
    pictureUrl,
    initials
  })
}
