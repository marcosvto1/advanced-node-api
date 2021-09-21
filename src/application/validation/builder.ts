import { RequiredStringValidator, Validator } from '@/application/validation'

export class ValidationBuilder {
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
