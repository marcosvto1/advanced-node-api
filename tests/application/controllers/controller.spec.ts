import { Controller } from '@/application/controllers/controller'
import { Http, HttpError } from '@/application/helpers'
import { ValidationComposite } from '@/application/validation'

import { mocked } from 'ts-jest/utils'

jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
  result: Http.Response = {
    statusCode: Http.Status.OK,
    data: 'any_data'
  }

  async perform (request: any): Promise<Http.Response> {
    return this.result
  }
}

describe('Controller', () => {
  let sut: ControllerStub
  let token: string

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('should return 400 if validation is fails', async () => {
    const error = new Error('validation_error')
    const RequestCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(ValidationComposite).mockImplementationOnce(RequestCompositeSpy)

    const httpResponse = await sut.handle('any_value')

    expect(RequestCompositeSpy).toHaveBeenCalledWith([])

    expect(httpResponse).toEqual({
      statusCode: Http.Status.BAD_REQUEST,
      data: error
    })
  })

  it('should return 500 if perfom throws', async () => {
    const error = new Error('perform_error')

    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: Http.Status.SERVER_ERROR,
      data: new HttpError.Server(error)
    })
  })

  it('should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_valuee')

    expect(httpResponse).toEqual({
      statusCode: Http.Status.OK,
      data: 'any_data'
    })
  })
})
