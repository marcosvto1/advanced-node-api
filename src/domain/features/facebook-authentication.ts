import { AuthenticationError } from '@/domain/errors'
import { AccesToken } from '@/domain/models'

export interface FacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccesToken | AuthenticationError
}
