export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}

export type UserAccountRepository = LoadUserAccountRepository & CreateFacebookAccountRepository

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    facebookId: string
    name: string
    email: string
  }
}
