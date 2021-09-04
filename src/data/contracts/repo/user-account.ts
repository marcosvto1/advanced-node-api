export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}

export interface UpdateUserAccountRepository {
  updateWithFacebook: (params: UpdateUserAccountRepository.Params) => Promise<void>
}

export type UserAccountRepository = LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateUserAccountRepository

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    facebookId: string
    name: string
    email: string
  }
}

export namespace UpdateUserAccountRepository {
  export type Params = {
    id: string
    facebookId: string
    name: string
  }
}
