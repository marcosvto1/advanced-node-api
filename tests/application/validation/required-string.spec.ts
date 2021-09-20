import { HttpError } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'

describe('RequiredStringValidator', () => {
  it('should return Error if value is Empty ', () => {
    const sut = new RequiredStringValidator('', 'any_field')

    const validate = sut.validate()

    expect(validate).toEqual(new HttpError.RequiredField('any_field'))
  })

  it('should return Error if value is null ', () => {
    const sut = new RequiredStringValidator(null, 'any_field')

    const validate = sut.validate()

    expect(validate).toEqual(new HttpError.RequiredField('any_field'))
  })

  it('should return Error if value is undefined ', () => {
    const sut = new RequiredStringValidator(undefined, 'any_field')

    const validate = sut.validate()

    expect(validate).toEqual(new HttpError.RequiredField('any_field'))
  })

  it('should reutrn true if value is not Empty ', () => {
    const sut = new RequiredStringValidator('any+value', 'any_field')

    const validate = sut.validate()

    expect(validate).toBe(undefined)
  })
})
