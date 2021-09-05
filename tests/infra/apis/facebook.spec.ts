import { FacebookApi } from '@/infra/apis'
import { HttpGetClient } from '@/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'
  let httpClient: MockProxy<HttpGetClient>
  let sut: FacebookApi

  beforeAll(() => {
    httpClient = mock()
  })

  beforeEach(() => {
    httpClient.get.mockResolvedValueOnce({
      access_token: 'any_app_token'
    })
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_crendentials'
      }
    })
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })
})
