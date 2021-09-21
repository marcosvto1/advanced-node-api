import { Validator } from '@/application/validation/validator'

export class ValidationComposite {
  constructor (
    private readonly validators: Validator[]
  ) {

  }

  validate (): Error | undefined {
    for (const validator of this.validators) {
      const validate = validator.validate()
      if (validate instanceof Error) {
        return validate
      }
    }
  }
}
