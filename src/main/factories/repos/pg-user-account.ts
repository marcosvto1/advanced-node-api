import { PgUserAccountRepository } from '@/infra/repos/postgres/repos'

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
