import { RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidatorBuilder', () => {
  it('should return a RequiredString', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', field: 'any_name' }).required().build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_name')])
  })
})
