import { FacebookApi, AxiosHttpClient } from '@/infra/gateways'
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
    const fbUser = await sut.loadUser({ token: 'EAAGdt2ksJPUBAMnf0ZAc67bzpJCXWFWTwKKdlZAUN9u0JDqc06ZANBi0Dyz9wr68IAzIRcnZCdtBZBOvZBpa42IYE3EHf4XW9E93r46osZAOsm2WdgL4jljr2KmtBJjqK6zw5ZBBf7FI2xDD7Pwc1PhJXQ0ekaxcDaLbeEZAiub5KZAFfZCh92rQR19h8ZBhPl8GWJPLqZC8Wof7XSAZDZD' })

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
