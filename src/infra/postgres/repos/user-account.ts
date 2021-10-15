import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repo'
import { PgUser } from '@/infra/postgres/entities'
import { getRepository } from 'typeorm'

type LoadParams = LoadUserAccount.Params
type LoadResult = LoadUserAccount.Result
type SaveFacebookParams = SaveFacebookAccount.Params
type SaveFacebookResult = SaveFacebookAccount.Result
export class PgUserAccountRepository implements LoadUserAccount, SaveFacebookAccount {
  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({
      email
    })

    if (pgUser !== undefined) {
      return {
        id: pgUser?.id?.toString(),
        name: pgUser?.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveFacebookParams): Promise<SaveFacebookResult> {
    const pgUserRepo = getRepository(PgUser)

    let resultId: string
    if (id === undefined) {
      const pgUser = await pgUserRepo.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      await pgUserRepo.update({ id: parseInt(id) }, { name, facebookId })
      resultId = id
    }

    return {
      id: resultId
    }
  }
}
