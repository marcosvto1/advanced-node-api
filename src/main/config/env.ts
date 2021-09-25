export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '454886045787381',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '93b95d2b7007ba4d896f3120bb054d37'
  },
  app: {
    port: process.env.PORT ?? 8000
  },
  jwtSecret: process.env.JWT_SECRET ?? 'SADSADSA5546456'
}
