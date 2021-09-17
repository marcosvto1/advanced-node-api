import { makeFakeDb } from '../mocks'
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

describe('PgUserAccountRepository', () => {
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

  describe('load', () => {
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

  describe('saveWithFacebook', () => {
    it('should create an account if if is undenied', async () => {
      await sut.saveWithFacebook({ email: 'any_email', name: 'any_name', facebookId: 'any_fb_id' })

      const pgUser = await pgUserRepo.findOne({ email: 'any_email' })

      console.log(pgUser)

      expect(pgUser?.id).toBe(1)
    })

    it('should update account if id is definied', async () => {
      await pgUserRepo.save({ email: 'any_mail', name: 'any_name', facebookId: 'any_fb_id' })

      await sut.saveWithFacebook({ id: '1', email: 'new_mail', name: 'new_name', facebookId: 'new_fb_id' })

      const pgUser = await pgUserRepo.findOne({ id: 1 })

      expect(pgUser).toEqual({
        id: 1,
        email: 'any_mail',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
    })
  })
})
