import { ErrorContext } from '@/application/errors/validation'

export class Required {
  constructor (
    readonly value: any,
    readonly field?: string) {}

  validate (): Error | undefined {
    if (this.value === null || this.value === undefined) {
      return new ErrorContext.RequiredField(this.field)
    }
  }
}
