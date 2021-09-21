import { RequiredStringValidator, ValidationBuilder } from '@/application/validation'

describe('ValidatorBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', field: 'any_name' }).required().build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })
})
