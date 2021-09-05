
enum Time {
  MIN=30,
  SECOND=60,
  MILLI=1000
}

export class AccessToken {
  constructor (private readonly value: string) {}

  static get expirationInMs (): number {
    return Time.MIN * Time.SECOND * Time.MILLI
  }
}
