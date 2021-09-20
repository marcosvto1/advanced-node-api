import { HttpError } from '@/application/helpers'

export class RequiredStringValidator {
  constructor (private readonly value: any, private readonly field: string) {}

  validate (): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new HttpError.RequiredField(this.field)
    }
  }
}
