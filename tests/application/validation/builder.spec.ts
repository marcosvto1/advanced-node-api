import { RequiredStringValidator, Validator } from '@/application/validation'

class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly field: string,
    private readonly validators: Validator[] = []
  ) {}

  static of (args: { value: string, field: string }): ValidationBuilder {
    return new ValidationBuilder(
      args.value, args.field
    )
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.field))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}

describe('ValidatorBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', field: 'any_name' }).required().build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })
})
