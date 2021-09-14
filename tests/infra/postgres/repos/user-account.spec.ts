import { makeFakeDb } from '../mocks'
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
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
