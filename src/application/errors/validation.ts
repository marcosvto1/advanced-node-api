export namespace ErrorContext {
  export class RequiredField extends Error {
    constructor (fieldName: string) {
      super(`The field ${fieldName} token is required`)
      this.name = 'RequiredFieldError'
    }
  }

  export class InvalidMymeTypeError extends Error {
    constructor (allowed: string[]) {
      super(`Unsupoported type. Allowed types: ${allowed.join(',')}`)
      this.name = 'InvalidMymeTypeError'
    }
  }

  export class MaxFileSizeError extends Error {
    constructor (maxSizeInMb: number) {
      super(`File upload limit ${maxSizeInMb}MB`)
      this.name = 'MaxFileSizeError'
    }
  }
}
