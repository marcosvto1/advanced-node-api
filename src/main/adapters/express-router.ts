import { Controller } from '@/application/controllers/controller'
import { RequestHandler } from 'express'

// export class ExpressRouter {
//   constructor (
//     private readonly controller: Controller
//   ) {}

//   async adapt (req: Request, res: Response): Promise<void> {
//     const httpResponse = await this.controller.handle({
//       ...req.body
//     })
//     if (httpResponse.statusCode === 200) {
//       res.status(200).json(httpResponse.data)
//     } else {
//       res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
//     }
//   }
// }

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const { statusCode, data } = await controller.handle({
    ...req.body
  })
  const json = statusCode === 200 ? data : { error: data.message }
  res.status(statusCode).json(json)
}
