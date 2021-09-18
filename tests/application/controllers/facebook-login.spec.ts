
type HttpResponse = { statusCode: number, data: any }

class FacebookLoginController {
  async handle (httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('the field token is required')
    }
  }
}

describe('FacebookLoginController', () => {
  it('should return 400 if tokeen is eempty', async () => {
    const sut = new FacebookLoginController()

    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })
})
