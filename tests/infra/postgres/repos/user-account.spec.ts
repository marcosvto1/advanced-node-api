import { LoadUserAccountRepository } from '@/data/contracts/repo'
import { connect } from 'http2'

import { IBackup, newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, getRepository, Repository } from 'typeorm'

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({
      email: params.email
    })

    if (pgUser !== undefined) {
      return {
        id: pgUser?.id?.toString(),
        name: pgUser?.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'nome', nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    const db = newDb()
    let backup: IBackup
    let connection: any

    beforeAll(async () => {
      connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [
          PgUser
        ]
      })
      await connection.synchronize()

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
      await connection.close()
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

      expect(account).toBe(undefined)
    })
  })
})
