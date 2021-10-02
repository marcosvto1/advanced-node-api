import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'raja.db.elephantsql.com',
  port: 5432,
  username: 'mzbjyekm',
  database: 'mzbjyekm',
  password: 'whpRb3T_h0CSbiUS2Soa_XXvw25DelwT',
  entities: ['dist/infra/postgres/entities/index.js']
}
