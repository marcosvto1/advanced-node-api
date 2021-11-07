import { makeFakeDb } from '../mocks'
import { PgUser } from '@/infra/repos/postgres/entities'
import { PgUserProfileRepository } from '@/infra/repos/postgres/repos'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository
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
    sut = new PgUserProfileRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('savePicture', () => {
    it('should update user profile', async () => {
      const { id } = await pgUserRepo.save({
        email: 'any_email',
        initials: 'any_initials'
      })

      await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url', initials: undefined })

      const pgUser = await pgUserRepo.findOne({ id })

      expect(pgUser).toMatchObject({
        id,
        initials: null,
        pictureUrl: 'any_url'
      })
    })
  })
})
