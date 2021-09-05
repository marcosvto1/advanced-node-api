
export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<HttpGetClient.Result>
}

export namespace HttpGetClient {
  export type Params = {
    url: string
    params: any
  }

  export type Result = any
}
