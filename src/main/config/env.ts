import * as dotenv from 'dotenv'
dotenv.config()

export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '454886045787381',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '93b95d2b7007ba4d896f3120bb054d37'
  },
  app: {
    port: process.env.PORT ?? 8000
  },
  jwtSecret: process.env.JWT_SECRET ?? 'SADSADSA5546456',
  postgres: {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 5432,
    username: process.env.DB_USERNAME ?? 'myuserdb',
    database: process.env.DB_NAME ?? 'mzbjyekm',
    password: process.env.DB_PASSWORD ?? 'myuserpassword'
  }
}
