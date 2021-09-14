import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb & any> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })

  await connection.synchronize()

  return db
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb()
      pgUserRepo = getRepository(PgUser)
      backup = db.backup()

      await pgUserRepo.save({
        email: 'existing_email'
      })
    })

    beforeEach(async () => {
      backup.restore()
      sut = new PgUserAccountRepository()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'any_email' })
      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual(
        expect.objectContaining({
          id: '1'
        })
      )
    })

    it('should return undefinied if email not exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })
})
