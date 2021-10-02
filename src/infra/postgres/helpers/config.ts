import { env } from '@/main/config/env'
import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: env.postgres.host,
  port: +env.postgres.port,
  username: env.postgres.username,
  database: env.postgres.database,
  password: env.postgres.password,
  entities: ['dist/infra/postgres/entities/index.js']
}
