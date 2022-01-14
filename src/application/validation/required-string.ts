import { ErrorContext } from '@/application/errors/validation'
import { Required } from '@/application/validation'

export class RequiredString extends Required {
  constructor (
    override readonly value: any,
    override readonly field?: string) {
    super(value, field)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined || this.value === '') {
      return new ErrorContext.RequiredField(this.field)
    }
  }
}
