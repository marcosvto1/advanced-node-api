import { FacebookLoginController } from '@/application/controllers'
import { FacebookAuthenticationService } from '@/data/services'
import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { Router } from 'express'
import { env } from '@/main/config/env'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { JwtTokenGenerator } from '@/infra/crypto'

export default (router: Router): void => {
  router.post('/api/login/facebook', (req, res) => {
    res.send({ data: 'any_data' })
  })
}

const makeFacebookLoginController = (): FacebookLoginController => {
  const jwtTokenGenerator = new JwtTokenGenerator(env.jwtSecret)
  const pgUserAccountRepo = new PgUserAccountRepository()
  const axiosClient = new AxiosHttpClient()
  const facebookApi = new FacebookApi(axiosClient,
    env.facebookApi.clientId,
    env.facebookApi.clientSecret
  )
  const fbAuthService = new FacebookAuthenticationService(facebookApi, pgUserAccountRepo, jwtTokenGenerator)
  return new FacebookLoginController(fbAuthService)
}
