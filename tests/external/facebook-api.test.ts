import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('FacebookApiIntegrationTests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('Should return a Facebook if Token is Valid', async () => {
    const fbUser = await sut.loadUser({ token: 'EAAGdt2ksJPUBAMZCU4SpfnBoS7svrHvvBblsXIGr9ORoZCZADOa8CsKBsM9YBuFLu1ORZBRtbqwxb3PspAit5lZB32aL6jRBQahz2uuAZAjGPxget68ZCE0K7qjD6jwzrSNHkngZCVlnZAqrciBVEKpNPBvxlgnlQ8F28xSi3AGHlgS76u7M3OnNYAnxIbh5iLdelJz34JcAW8gZDZD' })

    expect(fbUser).toEqual({
      facebookId: '107921788317232',
      email: 'marcos_ejuttrh_test@tfbnw.net',
      name: 'Marcos Test'
    })
  })

  it('Should return a undefinied User if Token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'token_invalid' })

    expect(fbUser).toBeUndefined()
  })
})