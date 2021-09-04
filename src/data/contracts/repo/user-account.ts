export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}
export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebookAccountRepository.Params) => Promise<void>
}

export type UserAccountRepository = LoadUserAccountRepository & SaveFacebookAccountRepository

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string
    facebookId: string
    name: string
    email: string
  }
}
