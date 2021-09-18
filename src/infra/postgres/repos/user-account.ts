import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repo'
import { PgUser } from '@/infra/postgres/entities'
import { getRepository } from 'typeorm'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result

type SaveFacebookParams = SaveFacebookAccountRepository.Params
 type SaveFacebookResult = SaveFacebookAccountRepository.Result
export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({
      email: params.email
    })

    if (pgUser !== undefined) {
      return {
        id: pgUser?.id?.toString(),
        name: pgUser?.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookParams): Promise<SaveFacebookResult> {
    let id: string
    if (params.id === undefined) {
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
      id = pgUser.id.toString()
    } else {
      await this.pgUserRepo.update({ id: parseInt(params.id) }, {
        name: params.name,
        facebookId: params.facebookId
      })
      id = params.id
    }

    return {
      id
    }
  }
}
