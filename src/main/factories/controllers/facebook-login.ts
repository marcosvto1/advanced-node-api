import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationUseCase } from '@/main/factories/usecases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationUseCase())
}
