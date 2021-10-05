
enum Time {
  MIN=30,
  SECOND=60,
  MILLI=1000
}

export const AccessToken = { expirationInMs: Time.MIN * Time.SECOND * Time.MILLI }
