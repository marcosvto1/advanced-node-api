import { ErrorContext } from '@/application/errors/validation'
import { Required, RequiredString } from '@/application/validation'

describe('Required', () => {
  it('should return Error if value is null ', () => {
    const sut = new Required(null, 'any_field')

    const validate = sut.validate()

    expect(validate).toEqual(new ErrorContext.RequiredField('any_field'))
  })

  it('should return Error if value is undefined ', () => {
    const sut = new Required(undefined, 'any_field')

    const validate = sut.validate()

    expect(validate).toEqual(new ErrorContext.RequiredField('any_field'))
  })

  it('should return true if value is not Empty ', () => {
    const sut = new Required('any_value', 'any_field')

    const validate = sut.validate()

    expect(validate).toBe(undefined)
  })
})

describe('RequiredString', () => {
  it('should extends Required', () => {
    const sut = new RequiredString('')

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return Error if value is Empty ', () => {
    const sut = new RequiredString('', 'any_field')

    const validate = sut.validate()

    expect(validate).toEqual(new ErrorContext.RequiredField('any_field'))
  })

  it('should reutrn true if value is not Empty ', () => {
    const sut = new RequiredString('any_value', 'any_field')

    const validate = sut.validate()

    expect(validate).toBeUndefined()
  })
})
