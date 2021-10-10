import { Http } from '@/application/helpers'

export interface Middleware {
  handle: (httpRequest: any) => Promise<Http.Response>
}
